create policy "Enable delete for admins only"
on "public"."user_profiles"
as permissive
for delete
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable users to update their own data and admins to update all "
on "public"."user_profiles"
as permissive
for update
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "Enable users to view their own data only and admin to read all"
on "public"."user_profiles"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "Enable users to view their own data only"
on "public"."user_roles"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



