alter table "public"."quiz_submissions" drop constraint "quiz_submissions_user_id_fkey";

alter table "public"."quiz_submissions" drop constraint "quiz_submissions_pkey";

drop index if exists "public"."quiz_submissions_pkey";

alter table "public"."quiz_submissions" alter column "user" set not null;

alter table "public"."users_profiles" add column "avatar_url" text default ''::text;

alter table "public"."users_profiles" add column "email" text default ''::text;

alter table "public"."users_profiles" add column "first_name" text default ''::text;

alter table "public"."users_profiles" add column "full_name" text default ''::text;

alter table "public"."users_profiles" add column "last_name" text default ''::text;

alter table "public"."users_profiles" add column "username" text default ''::text;

CREATE UNIQUE INDEX quiz_submissions_id_key ON public.quiz_submissions USING btree (id);

CREATE UNIQUE INDEX quiz_submissions_pkey ON public.quiz_submissions USING btree (id, "user");

alter table "public"."quiz_submissions" add constraint "quiz_submissions_pkey" PRIMARY KEY using index "quiz_submissions_pkey";

alter table "public"."quiz_submissions" add constraint "quiz_submissions_id_key" UNIQUE using index "quiz_submissions_id_key";

alter table "public"."quiz_submissions" add constraint "quiz_submissions_user_fkey" FOREIGN KEY ("user") REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."quiz_submissions" validate constraint "quiz_submissions_user_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
 
  insert into "public"."users_profiles" (user_id)
  values (new.id); 
    return new;
end;$function$
;


