begin;
select set_config('ladyana.test_owner',(select user_id::text from public.admin_owners limit 1),true);
select set_config('ladyana.test_customer',(select id::text from auth.users where email_confirmed_at is not null and id not in(select user_id from public.admin_members) limit 1),true);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('ladyana.test_customer'),true);
do $$ begin
 if exists(select 1 from public.admin_members) then raise exception 'FAIL: customer sees admin membership'; end if;
 if has_table_privilege('authenticated','public.admin_members','insert') then raise exception 'FAIL: direct privilege escalation'; end if;
 begin perform public.admin_access_list();raise exception 'FAIL: customer lists staff'; exception when raise_exception then if sqlerrm like 'FAIL:%' then raise;end if;end;
 begin perform public.admin_access_decide(auth.uid(),'approve');raise exception 'FAIL: self approval'; exception when raise_exception then if sqlerrm like 'FAIL:%' then raise;end if;end;
 perform public.request_admin_access();
 if exists(select 1 from public.admin_members where user_id=auth.uid()) then raise exception 'FAIL: request grants membership';end if;
 if not exists(select 1 from public.admin_access_requests where user_id=auth.uid() and status='pending') then raise exception 'FAIL: missing pending request';end if;
 if exists(select 1 from public.orders) then raise exception 'FAIL: customer reads admin orders';end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('ladyana.test_owner'),true);
select public.admin_access_decide(current_setting('ladyana.test_customer')::uuid,'approve');
select set_config('request.jwt.claim.sub',current_setting('ladyana.test_customer'),true);
do $$ begin
 if not exists(select 1 from public.admin_members where user_id=auth.uid()) then raise exception 'FAIL: owner approval did not work';end if;
 begin perform public.admin_access_list();raise exception 'FAIL: staff can manage owner permissions'; exception when raise_exception then if sqlerrm like 'FAIL:%' then raise;end if;end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('ladyana.test_owner'),true);
do $$ begin
 begin perform public.admin_access_decide(auth.uid(),'revoke');raise exception 'FAIL: owner removed'; exception when raise_exception then if sqlerrm like 'FAIL:%' then raise;end if;end;
end $$;
select public.admin_access_decide(current_setting('ladyana.test_customer')::uuid,'revoke');
select set_config('request.jwt.claim.sub',current_setting('ladyana.test_customer'),true);
do $$ begin
 if exists(select 1 from public.admin_members where user_id=auth.uid()) then raise exception 'FAIL: revoked user still admin';end if;
 if has_function_privilege('anon','public.request_admin_access()','execute') or has_function_privilege('anon','public.admin_access_decide(uuid,text)','execute') then raise exception 'FAIL: anonymous access';end if;
end $$;
rollback;
select 'PASS: customer isolation, self-approval denied, owner approval, staff restriction, owner protection, immediate revocation, anonymous restriction. All test changes rolled back.' as verification;
