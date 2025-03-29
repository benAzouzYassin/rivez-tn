create policy "authenticated can insert data"
on "public"."mindmap_node_explanation"
as permissive
for insert
to authenticated
with check (true);


create policy "service role can do anything"
on "public"."mindmap_node_explanation"
as permissive
for all
to service_role
using (true);


create policy "users delete their data / admin delete all"
on "public"."mindmap_node_explanation"
as permissive
for delete
to public
using (((( SELECT auth.uid() AS uid) = author_id) OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "users read their data / admin read all data"
on "public"."mindmap_node_explanation"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = author_id) OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));


create policy "users update their data / admin update all"
on "public"."mindmap_node_explanation"
as permissive
for update
to authenticated
using (((( SELECT auth.uid() AS uid) = author_id) OR (( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types)));



