alter table "public"."users_profiles" add column "avatar_url" text;

alter table "public"."users_profiles" add column "email" text;

alter table "public"."users_profiles" add column "full_name" text;

alter table "public"."users_profiles" add column "phone" text;

alter table "public"."users_profiles" add column "username" text;
set check_function_bodies = off;
