set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.users_profiles (
    user_id,
    email,
    full_name,
    first_name,
    last_name,
    avatar_url,
    created_at,
    updated_at,
    username
  )
  values (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'first_name', 
      split_part(COALESCE(new.raw_user_meta_data->>'full_name', ''), ' ', 1)),
    COALESCE(new.raw_user_meta_data->>'last_name',
      nullif(split_part(COALESCE(new.raw_user_meta_data->>'full_name', ''), ' ', 2), '')),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    new.created_at,
    new.updated_at,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  ); 
  return new;
end;
$function$;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_role();