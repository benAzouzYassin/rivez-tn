set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
 
  insert into "public"."users_to_roles" (user_id ,"user_role")
  values (new.id, 'ADMIN'); 
    return new;
end;
$function$
;

create policy "Enable delete for admins only"
on "public"."categories"
as permissive
for delete
to authenticated
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable insert for admins only"
on "public"."categories"
as permissive
for insert
to authenticated
with check ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins only"
on "public"."categories"
as permissive
for update
to authenticated
using ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types))
with check ((( SELECT users_to_roles.user_role
   FROM users_to_roles
  WHERE (users_to_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));



