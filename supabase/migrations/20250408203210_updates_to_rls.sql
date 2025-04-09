drop policy "Enable read for admins only" on "public"."quiz_submission_answers";

alter table "public"."quiz_submission_answers" add column "user_id" uuid;

alter table "public"."quiz_submission_answers" add constraint "quiz_submission_answers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."quiz_submission_answers" validate constraint "quiz_submission_answers_user_id_fkey";

create policy "Enable users to read their data and admin all"
on "public"."quiz_submission_answers"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));



