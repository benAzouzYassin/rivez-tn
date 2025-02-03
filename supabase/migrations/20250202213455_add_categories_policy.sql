create policy "Enable read access for authenticated users"
on "public"."categories"
as permissive
for select
to authenticated
using (true);



