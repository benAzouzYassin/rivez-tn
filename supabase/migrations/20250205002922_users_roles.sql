create type "public"."user_role_types" as enum ('ADMIN', 'USER');

create table "public"."users_to_roles" (
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default gen_random_uuid(),
    "user_role" user_role_types default 'USER'::user_role_types
);


alter table "public"."users_to_roles" enable row level security;

CREATE UNIQUE INDEX users_to_roles_pkey ON public.users_to_roles USING btree (user_id);

alter table "public"."users_to_roles" add constraint "users_to_roles_pkey" PRIMARY KEY using index "users_to_roles_pkey";

alter table "public"."users_to_roles" add constraint "users_to_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users_to_roles" validate constraint "users_to_roles_user_id_fkey";

alter table "public"."users_to_roles" add constraint "users_to_roles_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users_to_roles" validate constraint "users_to_roles_user_id_fkey1";

grant delete on table "public"."users_to_roles" to "anon";

grant insert on table "public"."users_to_roles" to "anon";

grant references on table "public"."users_to_roles" to "anon";

grant select on table "public"."users_to_roles" to "anon";

grant trigger on table "public"."users_to_roles" to "anon";

grant truncate on table "public"."users_to_roles" to "anon";

grant update on table "public"."users_to_roles" to "anon";

grant delete on table "public"."users_to_roles" to "authenticated";

grant insert on table "public"."users_to_roles" to "authenticated";

grant references on table "public"."users_to_roles" to "authenticated";

grant select on table "public"."users_to_roles" to "authenticated";

grant trigger on table "public"."users_to_roles" to "authenticated";

grant truncate on table "public"."users_to_roles" to "authenticated";

grant update on table "public"."users_to_roles" to "authenticated";

grant delete on table "public"."users_to_roles" to "service_role";

grant insert on table "public"."users_to_roles" to "service_role";

grant references on table "public"."users_to_roles" to "service_role";

grant select on table "public"."users_to_roles" to "service_role";

grant trigger on table "public"."users_to_roles" to "service_role";

grant truncate on table "public"."users_to_roles" to "service_role";

grant update on table "public"."users_to_roles" to "service_role";


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
 
  insert into "public"."users_to_roles" (user_id ,"user_role")
  values (new.id, 'USER'); 
    return new;
end;
$function$
;


create trigger assign_new_user_role after insert on auth.users for each row execute function public.handle_new_user_role();