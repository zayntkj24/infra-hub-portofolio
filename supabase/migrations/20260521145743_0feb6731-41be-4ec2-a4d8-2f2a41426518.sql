
alter function public.touch_updated_at() set search_path = public;

revoke execute on function public.has_role(uuid, public.app_role) from anon, authenticated, public;
