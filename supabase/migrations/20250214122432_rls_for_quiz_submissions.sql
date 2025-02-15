create policy "Enable delete for admins only"
on "public"."quiz_submission_answers"
as permissive
for delete
to authenticated
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable insert for authenticated users only"
on "public"."quiz_submission_answers"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for admins only"
on "public"."quiz_submission_answers"
as permissive
for select
to authenticated
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."quiz_submission_answers"
as permissive
for update
to authenticated
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable delete for admins only"
on "public"."quiz_submissions"
as permissive
for delete
to authenticated
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable insert for authenticated users only"
on "public"."quiz_submissions"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for admins only"
on "public"."quiz_submissions"
as permissive
for select
to authenticated
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."quiz_submissions"
as permissive
for update
to authenticated
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));



