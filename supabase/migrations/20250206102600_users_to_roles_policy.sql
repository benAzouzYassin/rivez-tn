create policy "enable read only for authenticated users"
on "public"."users_to_roles"
as permissive
for select
to authenticated
using (true);



