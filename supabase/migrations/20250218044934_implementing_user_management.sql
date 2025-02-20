drop policy "Enable users to view their own data only" on "public"."user_roles";

alter table "public"."user_profiles" add column "created_at" timestamp with time zone not null default now();

alter table "public"."user_profiles" add column "xp_points" bigint default '0'::bigint;

alter table "public"."user_roles" drop column "email";

create policy "Enable authenticated users to view data"
on "public"."user_roles"
as permissive
for select
to authenticated
using (true);



