drop policy "Enable delete for admins only" on "public"."quizzes";

drop policy "Enable insert for admins only" on "public"."quizzes";

drop policy "Enable read access for authenticated users" on "public"."quizzes";

drop policy "Enable update for admins only" on "public"."quizzes";

drop policy "Enable delete for admins only" on "public"."quizzes_questions";

drop policy "enable delete for admins only" on "public"."quizzes_questions";

drop policy "enable update for admins only" on "public"."quizzes_questions";

alter table "public"."quizzes" add column "is_featured" boolean not null default false;

alter table "public"."quizzes_categories" add column "is_disabled" boolean default true;

alter table "public"."user_profiles" add column "credit_balance" numeric not null default '25'::numeric;

create policy "Enable admins for viewing all data"
on "public"."quizzes"
as permissive
for select
to public
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable delete for admins"
on "public"."quizzes"
as permissive
for delete
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable delete for users based on user_id"
on "public"."quizzes"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = author_id));


create policy "Enable insert for admins"
on "public"."quizzes"
as permissive
for insert
to authenticated
with check ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for admins"
on "public"."quizzes"
as permissive
for update
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable update for users based on user_id"
on "public"."quizzes"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = author_id));


create policy "Enable users of viewing public data and their data"
on "public"."quizzes"
as permissive
for select
to authenticated
using (((auth.uid() = author_id) OR (publishing_status = 'PUBLISHED'::publishing_status)));


create policy "enable insert for users"
on "public"."quizzes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable delete for admins"
on "public"."quizzes_questions"
as permissive
for insert
to authenticated
with check ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "Enable user of updating his quiz questions"
on "public"."quizzes_questions"
as permissive
for update
to authenticated
using ((auth.uid() = ( SELECT quizzes.author_id
   FROM quizzes
  WHERE (quizzes.id = quizzes_questions.quiz))));


create policy "enable delete for admins"
on "public"."quizzes_questions"
as permissive
for delete
to public
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "enable update for admins"
on "public"."quizzes_questions"
as permissive
for update
to authenticated
using ((( SELECT user_roles.user_role
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))) = 'ADMIN'::user_role_types));


create policy "enable user of deleting his questions"
on "public"."quizzes_questions"
as permissive
for delete
to authenticated
using ((auth.uid() = ( SELECT quizzes.author_id
   FROM quizzes
  WHERE (quizzes.id = quizzes_questions.quiz))));


create policy "enable user of inserting questions to his quizzes"
on "public"."quizzes_questions"
as permissive
for insert
to authenticated
with check ((auth.uid() = ( SELECT quizzes.author_id
   FROM quizzes
  WHERE (quizzes.id = quizzes_questions.quiz))));



