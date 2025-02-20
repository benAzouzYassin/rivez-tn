drop policy "Enable users to view their own data only and admins to view all" on "public"."users_profiles";

drop policy "Enable delete for admins only" on "public"."quiz_submission_answers";

drop policy "Enable read for admins only" on "public"."quiz_submission_answers";

drop policy "Enable update for admins only" on "public"."quiz_submission_answers";

drop policy "Enable user to delete their own data only and admins to delete " on "public"."quiz_submissions";

drop policy "Enable users to their data only and admin to update all data" on "public"."quiz_submissions";

drop policy "Enable users to view their own data only and Admins to view all" on "public"."quiz_submissions";

drop policy "Enable delete for admins only" on "public"."quizzes";

drop policy "Enable insert for admins only" on "public"."quizzes";

drop policy "Enable update for admins only" on "public"."quizzes";

drop policy "Enable delete for admins only" on "public"."quizzes_categories";

drop policy "Enable insert for admins only" on "public"."quizzes_categories";

drop policy "Enable update for admins only" on "public"."quizzes_categories";

drop policy "Enable delete for admins only" on "public"."quizzes_questions";

drop policy "enable delete for admins only" on "public"."quizzes_questions";

drop policy "enable update for admins only" on "public"."quizzes_questions";

revoke delete on table "public"."users_profiles" from "anon";

revoke insert on table "public"."users_profiles" from "anon";

revoke references on table "public"."users_profiles" from "anon";

revoke select on table "public"."users_profiles" from "anon";

revoke trigger on table "public"."users_profiles" from "anon";

revoke truncate on table "public"."users_profiles" from "anon";

revoke update on table "public"."users_profiles" from "anon";

revoke delete on table "public"."users_profiles" from "authenticated";

revoke insert on table "public"."users_profiles" from "authenticated";

revoke references on table "public"."users_profiles" from "authenticated";

revoke select on table "public"."users_profiles" from "authenticated";

revoke trigger on table "public"."users_profiles" from "authenticated";

revoke truncate on table "public"."users_profiles" from "authenticated";

revoke update on table "public"."users_profiles" from "authenticated";

revoke delete on table "public"."users_profiles" from "service_role";

revoke insert on table "public"."users_profiles" from "service_role";

revoke references on table "public"."users_profiles" from "service_role";

revoke select on table "public"."users_profiles" from "service_role";

revoke trigger on table "public"."users_profiles" from "service_role";

revoke truncate on table "public"."users_profiles" from "service_role";

revoke update on table "public"."users_profiles" from "service_role";

alter table "public"."users_profiles" drop constraint "users_to_roles_user_id_fkey";

alter table "public"."quiz_submissions" drop constraint "quiz_submissions_user_fkey";

alter table "public"."users_profiles" drop constraint "users_to_roles_pkey";

drop index if exists "public"."users_to_roles_pkey";

drop table "public"."users_profiles";

create table "public"."user_profiles" (
    "user_id" uuid not null default gen_random_uuid(),
    "avatar_url" text,
    "email" text,
    "username" text,
    "phone" text
);


alter table "public"."user_profiles" enable row level security;

create table "public"."user_roles" (
    "user_id" uuid not null default gen_random_uuid(),
    "user_role" user_role_types default 'USER'::user_role_types,
    "email" text
);


alter table "public"."user_roles" enable row level security;

CREATE UNIQUE INDEX users_roles_pkey ON public.user_profiles USING btree (user_id);

CREATE UNIQUE INDEX users_to_roles_pkey ON public.user_roles USING btree (user_id);

alter table "public"."user_profiles" add constraint "users_roles_pkey" PRIMARY KEY using index "users_roles_pkey";

alter table "public"."user_roles" add constraint "users_to_roles_pkey" PRIMARY KEY using index "users_to_roles_pkey";

alter table "public"."user_profiles" add constraint "users_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "users_roles_user_id_fkey";

alter table "public"."user_roles" add constraint "users_to_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "users_to_roles_user_id_fkey";

alter table "public"."quiz_submissions" add constraint "quiz_submissions_user_fkey" FOREIGN KEY ("user") REFERENCES user_roles(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."quiz_submissions" validate constraint "quiz_submissions_user_fkey";

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";

create policy "Enable delete for admins only"
on "public"."quiz_submission_answers"
as permissive
for delete
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable read for admins only"
on "public"."quiz_submission_answers"
as permissive
for select
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."quiz_submission_answers"
as permissive
for update
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable user to delete their own data only and admins to delete "
on "public"."quiz_submissions"
as permissive
for delete
to authenticated
using (((( SELECT auth.uid() AS uid) = "user") OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "Enable users to their data only and admin to update all data"
on "public"."quiz_submissions"
as permissive
for update
to public
using (((( SELECT auth.uid() AS uid) = "user") OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "Enable users to view their own data only and Admins to view all"
on "public"."quiz_submissions"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = "user") OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "Enable delete for admins only"
on "public"."quizzes"
as permissive
for delete
to public
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable insert for admins only"
on "public"."quizzes"
as permissive
for insert
to authenticated
with check ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."quizzes"
as permissive
for update
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable delete for admins only"
on "public"."quizzes_categories"
as permissive
for delete
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable insert for admins only"
on "public"."quizzes_categories"
as permissive
for insert
to authenticated
with check ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."quizzes_categories"
as permissive
for update
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types))
with check ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable delete for admins only"
on "public"."quizzes_questions"
as permissive
for insert
to authenticated
with check ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "enable delete for admins only"
on "public"."quizzes_questions"
as permissive
for delete
to public
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "enable update for admins only"
on "public"."quizzes_questions"
as permissive
for update
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));



