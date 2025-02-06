set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
 
  insert into "public"."users_to_roles" (user_id)
  values (new.id); 
    return new;
end;$function$
;

create trigger assign_new_user_role after insert on auth.users for each row execute function public.handle_new_user_role();