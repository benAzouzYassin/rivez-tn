
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    email,
    username,
    avatar_url,
    phone
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      COALESCE(
        new.raw_user_meta_data->>'username',' '
      )
    ),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.phone, '')
  ); 

  INSERT INTO public.user_roles (
    user_id
      )
  VALUES (
    new.id
  ); 

  RETURN new;
END;
$function$;

-- create the profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
