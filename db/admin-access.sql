-- Owner-controlled admin registration; customers cannot grant themselves membership.
begin;
create table public.admin_owners(user_id uuid primary key references auth.users(id) on delete restrict);
alter table public.admin_owners enable row level security;
revoke all on public.admin_owners from public,anon,authenticated;
grant select on public.admin_owners to authenticated;
create policy "Read own owner status" on public.admin_owners for select to authenticated using(user_id=(select auth.uid()));
-- Seed admin_owners separately after verifying the existing store owner.
-- Do not commit personal account identifiers to public source control.
create table public.admin_access_requests(
 user_id uuid primary key references auth.users(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','approved','rejected','revoked')),
 created_at timestamptz not null default now(),reviewed_at timestamptz,reviewed_by uuid references auth.users(id)
);
alter table public.admin_access_requests enable row level security;
revoke all on public.admin_access_requests from public,anon,authenticated;
grant select on public.admin_access_requests to authenticated;
create policy "Read own access request" on public.admin_access_requests for select to authenticated using(user_id=(select auth.uid()));
create or replace function private.request_admin_access() returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from auth.users where id=auth.uid() and email_confirmed_at is not null) then raise exception 'Confirm your email and sign in before requesting admin access.'; end if;
 if exists(select 1 from public.admin_members where user_id=auth.uid()) then raise exception 'Your account already has admin access. Open the admin login page.'; end if;
 if exists(select 1 from public.admin_access_requests where user_id=auth.uid() and status<>'pending' and reviewed_at>now()-interval '1 day') then raise exception 'Please contact the owner or wait 24 hours before requesting again.'; end if;
 insert into public.admin_access_requests(user_id) values(auth.uid()) on conflict(user_id) do update set status='pending',reviewed_at=null,reviewed_by=null;
end $$;
create or replace function private.admin_access_list() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.admin_owners where user_id=auth.uid()) then raise exception 'Only the store owner can manage staff access.'; end if;
 return jsonb_build_object('requests',(select coalesce(jsonb_agg(jsonb_build_object('user_id',r.user_id,'email',u.email) order by r.created_at),'[]'::jsonb) from public.admin_access_requests r join auth.users u on u.id=r.user_id where r.status='pending'),
 'members',(select coalesce(jsonb_agg(jsonb_build_object('user_id',m.user_id,'email',u.email,'owner',exists(select 1 from public.admin_owners o where o.user_id=m.user_id))),'[]'::jsonb) from public.admin_members m join auth.users u on u.id=m.user_id));
end $$;
create or replace function private.admin_access_decide(target_user uuid,decision text) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.admin_owners where user_id=auth.uid()) then raise exception 'Only the store owner can manage staff access.'; end if;
 if decision is null or decision not in ('approve','reject','revoke') then raise exception 'Invalid decision.'; end if;
 if exists(select 1 from public.admin_owners where user_id=target_user) then raise exception 'Owner access cannot be removed here.'; end if;
 perform 1 from public.admin_access_requests where user_id=target_user for update;
 if decision in ('approve','reject') and not exists(select 1 from public.admin_access_requests where user_id=target_user and status='pending') then raise exception 'This request is no longer pending. Refresh the list.'; end if;
 if decision='approve' then
  if not exists(select 1 from auth.users where id=target_user and email_confirmed_at is not null) then raise exception 'The staff member must confirm their email first.'; end if;
  insert into public.admin_members(user_id) values(target_user) on conflict do nothing;
 elsif decision='revoke' then delete from public.admin_members where user_id=target_user;
 end if;
 update public.admin_access_requests set status=case decision when 'approve' then 'approved' when 'reject' then 'rejected' else 'revoked' end,reviewed_at=now(),reviewed_by=auth.uid() where user_id=target_user;
end $$;
revoke all on function private.request_admin_access(),private.admin_access_list(),private.admin_access_decide(uuid,text) from public,anon;
grant execute on function private.request_admin_access(),private.admin_access_list(),private.admin_access_decide(uuid,text) to authenticated;
create or replace function public.request_admin_access() returns void language sql security invoker set search_path='' as $$select private.request_admin_access()$$;
create or replace function public.admin_access_list() returns jsonb language sql security invoker set search_path='' as $$select private.admin_access_list()$$;
create or replace function public.admin_access_decide(target_user uuid,decision text) returns void language sql security invoker set search_path='' as $$select private.admin_access_decide(target_user,decision)$$;
revoke all on function public.request_admin_access(),public.admin_access_list(),public.admin_access_decide(uuid,text) from public,anon;
grant execute on function public.request_admin_access(),public.admin_access_list(),public.admin_access_decide(uuid,text) to authenticated;
commit;
