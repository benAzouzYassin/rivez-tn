drop policy "Enable users to view their own data only" on "public"."users_profiles";

create policy "Enable users to view their own data only and admins to view all"
on "public"."users_profiles"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT users_profiles_1.user_role
   FROM users_profiles users_profiles_1
  WHERE (users_profiles_1.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));



