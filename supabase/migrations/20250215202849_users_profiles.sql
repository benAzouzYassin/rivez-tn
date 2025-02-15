alter table "public"."users_profiles" add column "avatar_url" text;

alter table "public"."users_profiles" add column "email" text;

alter table "public"."users_profiles" add column "full_name" text;

alter table "public"."users_profiles" add column "phone" text;

alter table "public"."users_profiles" add column "username" text;
set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.users_profiles (
    user_id,
    email,
    full_name,
    avatar_url,
    phone,
    username
  )
  values (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.phone, ''),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  ); 
  return new;
end;
$function$;

-- create the profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_role();
