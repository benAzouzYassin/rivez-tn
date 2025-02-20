alter table "public"."user_profiles" drop constraint "users_roles_user_id_fkey";

alter table "public"."user_roles" drop constraint "users_to_roles_user_id_fkey";

alter table "public"."quiz_submissions" add column "xp_gained" numeric default '0'::numeric;

alter table "public"."user_profiles" alter column "xp_points" drop default;

alter table "public"."user_profiles" alter column "xp_points" set data type numeric using "xp_points"::numeric;

alter table "public"."user_profiles" add constraint "user_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";


