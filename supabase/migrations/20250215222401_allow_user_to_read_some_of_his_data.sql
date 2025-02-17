drop policy "Enable read access for admins only" on "public"."quiz_submission_answers";

drop policy "Enable delete for admins only" on "public"."quiz_submissions";

drop policy "Enable read access for admins only" on "public"."quiz_submissions";

drop policy "Enable update for admins only" on "public"."quiz_submissions";

drop policy "enable read only for authenticated users" on "public"."users_profiles";

alter table "public"."quiz_submissions" add constraint "quiz_submissions_user_fkey" FOREIGN KEY ("user") REFERENCES users_profiles(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."quiz_submissions" validate constraint "quiz_submissions_user_fkey";

create policy "Enable read for admins only"
on "public"."quiz_submission_answers"
as permissive
for select
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable user to delete their own data only and admins to delete "
on "public"."quiz_submissions"
as permissive
for delete
to authenticated
using (((( SELECT auth.uid() AS uid) = "user") OR (( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "Enable users to their data only and admin to update all data"
on "public"."quiz_submissions"
as permissive
for update
to public
using (((( SELECT auth.uid() AS uid) = "user") OR (( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "Enable users to view their own data only and Admins to view all"
on "public"."quiz_submissions"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = "user") OR (( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "Enable users to view their own data only"
on "public"."users_profiles"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



