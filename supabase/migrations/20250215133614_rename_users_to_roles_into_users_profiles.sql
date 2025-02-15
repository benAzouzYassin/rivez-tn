drop policy "enable read only for authenticated users" on "public"."users_to_roles";

drop policy "Enable delete for admins only" on "public"."quiz_submission_answers";

drop policy "Enable read access for admins only" on "public"."quiz_submission_answers";

drop policy "Enable update for admins only" on "public"."quiz_submission_answers";

drop policy "Enable delete for admins only" on "public"."quiz_submissions";

drop policy "Enable read access for admins only" on "public"."quiz_submissions";

drop policy "Enable update for admins only" on "public"."quiz_submissions";

drop policy "Enable delete for admins only" on "public"."quizzes";

drop policy "Enable insert for admins only" on "public"."quizzes";

drop policy "Enable update for admins only" on "public"."quizzes";

drop policy "Enable delete for admins only" on "public"."quizzes_categories";

drop policy "Enable insert for admins only" on "public"."quizzes_categories";

drop policy "Enable update for admins only" on "public"."quizzes_categories";

drop policy "Enable delete for admins only" on "public"."quizzes_questions";

drop policy "enable delete for admins only" on "public"."quizzes_questions";

drop policy "enable update for admins only" on "public"."quizzes_questions";

revoke delete on table "public"."users_to_roles" from "anon";

revoke insert on table "public"."users_to_roles" from "anon";

revoke references on table "public"."users_to_roles" from "anon";

revoke select on table "public"."users_to_roles" from "anon";

revoke trigger on table "public"."users_to_roles" from "anon";

revoke truncate on table "public"."users_to_roles" from "anon";

revoke update on table "public"."users_to_roles" from "anon";

revoke delete on table "public"."users_to_roles" from "authenticated";

revoke insert on table "public"."users_to_roles" from "authenticated";

revoke references on table "public"."users_to_roles" from "authenticated";

revoke select on table "public"."users_to_roles" from "authenticated";

revoke trigger on table "public"."users_to_roles" from "authenticated";

revoke truncate on table "public"."users_to_roles" from "authenticated";

revoke update on table "public"."users_to_roles" from "authenticated";

revoke delete on table "public"."users_to_roles" from "service_role";

revoke insert on table "public"."users_to_roles" from "service_role";

revoke references on table "public"."users_to_roles" from "service_role";

revoke select on table "public"."users_to_roles" from "service_role";

revoke trigger on table "public"."users_to_roles" from "service_role";

revoke truncate on table "public"."users_to_roles" from "service_role";

revoke update on table "public"."users_to_roles" from "service_role";

alter table "public"."users_to_roles" drop constraint "users_to_roles_user_id_fkey";

alter table "public"."users_to_roles" drop constraint "users_to_roles_pkey";

drop index if exists "public"."users_to_roles_pkey";

drop table "public"."users_to_roles";

create table "public"."users_profiles" (
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default gen_random_uuid(),
    "user_role" user_role_types default 'USER'::user_role_types
);


alter table "public"."users_profiles" enable row level security;

CREATE UNIQUE INDEX users_to_roles_pkey ON public.users_profiles USING btree (user_id);

alter table "public"."users_profiles" add constraint "users_to_roles_pkey" PRIMARY KEY using index "users_to_roles_pkey";

alter table "public"."users_profiles" add constraint "users_to_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users_profiles" validate constraint "users_to_roles_user_id_fkey";

grant delete on table "public"."users_profiles" to "anon";

grant insert on table "public"."users_profiles" to "anon";

grant references on table "public"."users_profiles" to "anon";

grant select on table "public"."users_profiles" to "anon";

grant trigger on table "public"."users_profiles" to "anon";

grant truncate on table "public"."users_profiles" to "anon";

grant update on table "public"."users_profiles" to "anon";

grant delete on table "public"."users_profiles" to "authenticated";

grant insert on table "public"."users_profiles" to "authenticated";

grant references on table "public"."users_profiles" to "authenticated";

grant select on table "public"."users_profiles" to "authenticated";

grant trigger on table "public"."users_profiles" to "authenticated";

grant truncate on table "public"."users_profiles" to "authenticated";

grant update on table "public"."users_profiles" to "authenticated";

grant delete on table "public"."users_profiles" to "service_role";

grant insert on table "public"."users_profiles" to "service_role";

grant references on table "public"."users_profiles" to "service_role";

grant select on table "public"."users_profiles" to "service_role";

grant trigger on table "public"."users_profiles" to "service_role";

grant truncate on table "public"."users_profiles" to "service_role";

grant update on table "public"."users_profiles" to "service_role";

create policy "enable read only for authenticated users"
on "public"."users_profiles"
as permissive
for select
to authenticated
using (true);


create policy "Enable delete for admins only"
on "public"."quiz_submission_answers"
as permissive
for delete
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable read access for admins only"
on "public"."quiz_submission_answers"
as permissive
for select
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."quiz_submission_answers"
as permissive
for update
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable delete for admins only"
on "public"."quiz_submissions"
as permissive
for delete
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable read access for admins only"
on "public"."quiz_submissions"
as permissive
for select
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."quiz_submissions"
as permissive
for update
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable delete for admins only"
on "public"."quizzes"
as permissive
for delete
to public
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable insert for admins only"
on "public"."quizzes"
as permissive
for insert
to authenticated
with check ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."quizzes"
as permissive
for update
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable delete for admins only"
on "public"."quizzes_categories"
as permissive
for delete
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable insert for admins only"
on "public"."quizzes_categories"
as permissive
for insert
to authenticated
with check ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."quizzes_categories"
as permissive
for update
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types))
with check ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable delete for admins only"
on "public"."quizzes_questions"
as permissive
for insert
to authenticated
with check ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "enable delete for admins only"
on "public"."quizzes_questions"
as permissive
for delete
to public
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "enable update for admins only"
on "public"."quizzes_questions"
as permissive
for update
to authenticated
using ((( SELECT users_profiles.user_role
   FROM users_profiles
  WHERE (users_profiles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));



