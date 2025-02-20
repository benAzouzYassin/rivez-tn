drop policy "Enable insert for authenticated users only" on "public"."quiz_submission_answers";

drop policy "Enable insert for authenticated users only" on "public"."quiz_submissions";

drop policy "Enable users to their data only and admin to update all data" on "public"."quiz_submissions";

drop policy "Enable users to update their own data and admins to update all " on "public"."user_profiles";

alter table "public"."user_profiles" add column "is_banned" boolean not null default false;

create policy "Service role can do any action"
on "public"."quiz_submission_answers"
as permissive
for all
to service_role
using (true);


create policy "Enable admin to update all data"
on "public"."quiz_submissions"
as permissive
for update
to public
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Service role can do any action"
on "public"."quiz_submissions"
as permissive
for all
to service_role
using (true);


create policy "Service-role can do any action"
on "public"."quizzes"
as permissive
for all
to service_role
using (true);


create policy "Service-role can do any action"
on "public"."quizzes_categories"
as permissive
for all
to service_role
using (true);


create policy "Service-role can do any action"
on "public"."quizzes_questions"
as permissive
for all
to service_role
using (true);


create policy "Enable all actions for service role"
on "public"."user_profiles"
as permissive
for all
to service_role
using (true);


create policy "Enable update for admins"
on "public"."user_profiles"
as permissive
for update
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Service-role can do any action"
on "public"."user_profiles"
as permissive
for all
to service_role
using (true);



