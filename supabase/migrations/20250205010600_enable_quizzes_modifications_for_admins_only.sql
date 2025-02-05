create policy "Enable delete for admins only"
on "public"."quizzes"
as permissive
for delete
to public
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable insert for admins only"
on "public"."quizzes"
as permissive
for insert
to authenticated
with check ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."quizzes"
as permissive
for update
to authenticated
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable delete for admins only"
on "public"."quizzes_questions"
as permissive
for insert
to authenticated
with check ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "enable delete for admins only"
on "public"."quizzes_questions"
as permissive
for delete
to public
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "enable update for admins only"
on "public"."quizzes_questions"
as permissive
for update
to authenticated
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));



