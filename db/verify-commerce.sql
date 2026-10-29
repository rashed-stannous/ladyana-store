begin;
set local role authenticated;
select set_config('request.jwt.claim.sub','ac9208fc-1777-4997-ac35-7969f83c7958',true);
do $$
declare pid integer; payload jsonb; result jsonb; again jsonb; n integer; rid uuid:=gen_random_uuid();
begin
 insert into public.products(name,cat,price,stock,active,color,tag,type,image_url) values('QA rollback-only product','Bags',100,4,true,'#000','TEST','bag','/photos/7848.jpeg') returning id into pid;
 payload:=jsonb_build_object('request_id',rid,'customer_name','QA Test','phone','01700000000','address','QA only rollback address','delivery_zone','dhaka','payment_method','cod','items',jsonb_build_array(jsonb_build_object('id',pid,'qty',2,'size','One size','colour','Original','price',1)));
 begin perform public.place_order(payload);raise exception 'TEST FAILED: accepted changed price';exception when others then if sqlerrm like 'TEST FAILED%' then raise;end if;end;
 payload:=jsonb_set(payload,'{items,0,price}','100');
 result:=public.place_order(payload);
 if (result->>'total')::integer<>270 then raise exception 'TEST FAILED: delivery total';end if;
 again:=public.place_order(payload);
 if again->>'id'<>result->>'id' then raise exception 'TEST FAILED: idempotency';end if;
 select stock into n from public.products where id=pid;if n<>2 then raise exception 'TEST FAILED: stock deduction';end if;
 payload:=jsonb_set(payload,'{request_id}',to_jsonb(gen_random_uuid()));payload:=jsonb_set(payload,'{items,0,qty}','3');
 begin perform public.place_order(payload);raise exception 'TEST FAILED: oversell';exception when others then if sqlerrm like 'TEST FAILED%' then raise;end if;end;
 payload:=jsonb_set(payload,'{items,0,qty}','1');payload:=jsonb_set(payload,'{delivery_zone}','"outside"');payload:=jsonb_set(payload,'{payment_reference}','"QA123456"');
 again:=public.place_order(payload);if (again->>'total')::integer<>250 then raise exception 'TEST FAILED: outside delivery';end if;
 if exists(select 1 from public.orders where id=(again->>'id')::uuid and payment_status<>'unpaid') then raise exception 'TEST FAILED: payment auto verified';end if;
 update public.orders set status='cancelled' where id=(result->>'id')::uuid;
 update public.orders set status='cancelled' where id=(result->>'id')::uuid;
 select stock into n from public.products where id=pid;if n<>3 then raise exception 'TEST FAILED: cancel stock restoration';end if;
 if has_function_privilege('anon','public.place_order(jsonb)','execute') then raise exception 'TEST FAILED: anonymous checkout access';end if;
 if not exists(select 1 from public.admin_members where user_id=auth.uid()) then raise exception 'TEST FAILED: owner permission';end if;
end $$;
select 'PASS: authoritative prices, delivery totals, idempotency, stock, cancellation, manual payment, owner access, anonymous restriction' as verification;
rollback;
