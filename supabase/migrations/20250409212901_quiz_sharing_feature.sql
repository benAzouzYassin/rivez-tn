drop policy "Enable users to view their own data only and Admins to view all" on "public"."quiz_submissions";

drop policy "Enable users to read their data and admin all" on "public"."quiz_submission_answers";

drop policy "Enable user to delete their own data only and admins to delete " on "public"."quiz_submissions";

alter table "public"."quiz_submission_answers" drop constraint "quiz_submission_answers_user_id_fkey";

create table "public"."quizzes_shares" (
    "created_at" timestamp with time zone not null default now(),
    "quiz_id" bigint not null,
    "user_id" uuid not null
);


alter table "public"."quizzes_shares" enable row level security;

alter table "public"."quiz_submission_answers" drop column "user_id";

alter table "public"."quiz_submission_answers" add column "quiz_owner_id" uuid;

alter table "public"."quiz_submissions" add column "quiz_owner_id" uuid default gen_random_uuid();

alter table "public"."quiz_submissions" add column "user_submit_name" text;

alter table "public"."quizzes" drop column "is_featured";

CREATE UNIQUE INDEX quizzes_shares_pkey ON public.quizzes_shares USING btree (quiz_id, user_id);

alter table "public"."quizzes_shares" add constraint "quizzes_shares_pkey" PRIMARY KEY using index "quizzes_shares_pkey";

alter table "public"."quiz_submission_answers" add constraint "quiz_submission_answers_quiz_owner_id_fkey" FOREIGN KEY (quiz_owner_id) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."quiz_submission_answers" validate constraint "quiz_submission_answers_quiz_owner_id_fkey";

alter table "public"."quizzes_shares" add constraint "quizzes_shares_quiz_id_fkey" FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE not valid;

alter table "public"."quizzes_shares" validate constraint "quizzes_shares_quiz_id_fkey";

alter table "public"."quizzes_shares" add constraint "quizzes_shares_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE not valid;

alter table "public"."quizzes_shares" validate constraint "quizzes_shares_user_id_fkey";

grant delete on table "public"."quizzes_shares" to "anon";

grant insert on table "public"."quizzes_shares" to "anon";

grant references on table "public"."quizzes_shares" to "anon";

grant select on table "public"."quizzes_shares" to "anon";

grant trigger on table "public"."quizzes_shares" to "anon";

grant truncate on table "public"."quizzes_shares" to "anon";

grant update on table "public"."quizzes_shares" to "anon";

grant delete on table "public"."quizzes_shares" to "authenticated";

grant insert on table "public"."quizzes_shares" to "authenticated";

grant references on table "public"."quizzes_shares" to "authenticated";

grant select on table "public"."quizzes_shares" to "authenticated";

grant trigger on table "public"."quizzes_shares" to "authenticated";

grant truncate on table "public"."quizzes_shares" to "authenticated";

grant update on table "public"."quizzes_shares" to "authenticated";

grant delete on table "public"."quizzes_shares" to "service_role";

grant insert on table "public"."quizzes_shares" to "service_role";

grant references on table "public"."quizzes_shares" to "service_role";

grant select on table "public"."quizzes_shares" to "service_role";

grant trigger on table "public"."quizzes_shares" to "service_role";

grant truncate on table "public"."quizzes_shares" to "service_role";

grant update on table "public"."quizzes_shares" to "service_role";

create policy "Enable users to view their own data only / Admins and owners  v"
on "public"."quiz_submissions"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = "user") OR (( SELECT auth.uid() AS uid) = quiz_owner_id) OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "service role can do anything"
on "public"."quizzes_shares"
as permissive
for all
to service_role
using (true);


create policy "users can delete their data"
on "public"."quizzes_shares"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "users can insert their ids only"
on "public"."quizzes_shares"
as permissive
for insert
to authenticated
with check (( SELECT (auth.uid() = quizzes_shares.user_id)));


create policy "users can view theier data"
on "public"."quizzes_shares"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to read their data and admin all"
on "public"."quiz_submission_answers"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = quiz_owner_id) OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "Enable user to delete their own data only and admins to delete "
on "public"."quiz_submissions"
as permissive
for delete
to authenticated
using (((( SELECT auth.uid() AS uid) = "user") OR (( SELECT auth.uid() AS uid) = quiz_owner_id) OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));



