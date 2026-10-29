begin;
alter table public.products add column if not exists images text[] not null default '{}', add column if not exists sizes text[] not null default '{One size}', add column if not exists colours text[] not null default '{Original}';
alter table public.store_settings add column if not exists outside_delivery_fee integer not null default 150 check(outside_delivery_fee>=0);
update public.store_settings set delivery_fee=70 where id=1;
alter table public.orders add column if not exists user_id uuid references auth.users(id), add column if not exists request_id uuid unique, add column if not exists items jsonb not null default '[]', add column if not exists delivery_fee integer not null default 0, add column if not exists delivery_zone text not null default 'dhaka', add column if not exists payment_method text not null default 'cod', add column if not exists payment_reference text not null default '', add column if not exists amount_received integer not null default 0 check(amount_received>=0);
create index if not exists orders_user_created_idx on public.orders(user_id,created_at);
insert into public.admin_members(user_id) select id from auth.users where lower(email)='rashed.du.pharmacy@gmail.com' on conflict do nothing;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;
create or replace function private.place_order(payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); rid uuid; existing public.orders; product public.products; line jsonb; lines jsonb:='[]'; subtotal integer:=0; fee integer; quantity integer; zone text; method text; fullname text; phone text; addr text; ref text; oid uuid; total integer;
begin
 if uid is null then raise exception 'Please sign in before placing your order.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
 rid:=(payload->>'request_id')::uuid;
 if rid is null then raise exception 'Missing order reference.'; end if;
 select * into existing from public.orders where request_id=rid;
 if found then
  if existing.user_id<>uid then raise exception 'Invalid order reference.'; end if;
  return jsonb_build_object('id',existing.id,'total',existing.total,'delivery_fee',existing.delivery_fee,'status',existing.status);
 end if;
 if (select count(*) from public.orders where user_id=uid and created_at>now()-interval '1 hour')>=5 then raise exception 'Too many orders. Please contact Ladyana on WhatsApp.'; end if;
 fullname:=btrim(payload->>'customer_name');phone:=regexp_replace(payload->>'phone','[ +()-]','','g');addr:=btrim(payload->>'address');zone:=payload->>'delivery_zone';method:=payload->>'payment_method';ref:=btrim(coalesce(payload->>'payment_reference',''));
 if fullname is null or length(fullname)<2 or length(fullname)>120 or phone is null or phone !~ '^(8801|01)[3-9][0-9]{8}$' or addr is null or length(addr)<10 or length(addr)>1000 then raise exception 'Enter a valid name, Bangladesh phone number and complete address.'; end if;
 if zone is null or zone not in ('dhaka','outside') or method is null or method not in ('cod','bkash') then raise exception 'Choose a valid delivery area and payment method.'; end if;
 if length(ref)>80 then raise exception 'Payment reference is too long.'; end if;
 if (zone='outside' or method='bkash') and length(ref)<5 then raise exception 'Enter your bKash transaction ID.'; end if;
 if jsonb_typeof(payload->'items') is distinct from 'array' or jsonb_array_length(payload->'items') not between 1 and 30 then raise exception 'Your bag must contain 1 to 30 items.'; end if;
 select case when zone='dhaka' then s.delivery_fee else s.outside_delivery_fee end into fee from public.store_settings s where s.id=1;
 if fee is null then raise exception 'Delivery settings are unavailable.'; end if;
 for line in select value from jsonb_array_elements(payload->'items') order by (value->>'id')::integer loop
  quantity:=(line->>'qty')::integer;
  if quantity is null or quantity not between 1 and 20 then raise exception 'Choose a quantity between 1 and 20.'; end if;
  select * into product from public.products where id=(line->>'id')::integer for update;
  if not found or not product.active or product.price<=0 then raise exception 'An item is no longer available. Please refresh your bag.'; end if;
  if product.stock<quantity then raise exception 'Not enough stock for %. Please update your bag.',product.name; end if;
  if (line->>'size') is null or not ((line->>'size')=any(product.sizes)) or (line->>'colour') is null or not ((line->>'colour')=any(product.colours)) then raise exception 'Please reselect the size and colour for %.',product.name; end if;
  if (line->>'price')::integer is distinct from product.price then raise exception 'The price of % has changed. Refresh your bag before ordering.',product.name; end if;
  update public.products set stock=stock-quantity where id=product.id;
  subtotal:=subtotal+product.price*quantity;
  lines:=lines||jsonb_build_array(jsonb_build_object('id',product.id,'name',product.name,'sku',product.sku,'price',product.price,'qty',quantity,'size',line->>'size','colour',line->>'colour'));
 end loop;
 total:=subtotal+fee;
 insert into public.orders(user_id,request_id,customer_name,phone,address,items_note,total,items,delivery_fee,delivery_zone,payment_method,payment_reference)
 values(uid,rid,fullname,phone,addr,lines::text,total,lines,fee,zone,method,ref) returning id into oid;
 return jsonb_build_object('id',oid,'total',total,'delivery_fee',fee,'status','pending');
end $$;
revoke all on function private.place_order(jsonb) from public,anon;
grant execute on function private.place_order(jsonb) to authenticated;
create or replace function public.place_order(payload jsonb) returns jsonb language sql security invoker set search_path='' as $$select private.place_order(payload);$$;
revoke all on function public.place_order(jsonb) from public,anon;
grant execute on function public.place_order(jsonb) to authenticated;
create or replace function private.restore_cancelled_stock() returns trigger language plpgsql security definer set search_path='' as $$
declare line jsonb;
begin
 if old.status='cancelled' and new.status<>'cancelled' then raise exception 'A cancelled order cannot be reopened. Create a new order.'; end if;
 if new.status='cancelled' and old.status<>'cancelled' then
  for line in select value from jsonb_array_elements(old.items) loop
   update public.products set stock=stock+(line->>'qty')::integer where id=(line->>'id')::integer;
  end loop;
 end if;
 return new;
end $$;
revoke all on function private.restore_cancelled_stock() from public,anon,authenticated;
drop trigger if exists restore_cancelled_stock on public.orders;
create trigger restore_cancelled_stock before update of status on public.orders for each row execute function private.restore_cancelled_stock();
-- Return only customer-safe columns, never internal admin notes.
create or replace function private.my_orders() returns jsonb language sql security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',o.id,'created_at',o.created_at,'items',o.items,'total',o.total,'status',o.status,'payment_status',o.payment_status,'tracking_number',o.tracking_number,'amount_received',o.amount_received) order by o.created_at desc),'[]'::jsonb) from public.orders o where auth.uid() is not null and o.user_id=auth.uid();
$$;
revoke all on function private.my_orders() from public,anon;
grant execute on function private.my_orders() to authenticated;
create or replace function public.my_orders() returns jsonb language sql security invoker set search_path='' as $$select private.my_orders();$$;
revoke all on function public.my_orders() from public,anon;
grant execute on function public.my_orders() to authenticated;
commit;
alter table public.products drop constraint products_cat_check, add constraint products_cat_check check(cat in ('Bags','Footwear','Dresses','Accessories'));
alter table public.products drop constraint products_type_check, add constraint products_type_check check(type in ('bag','shoe','clutch','jewel','dress'));
