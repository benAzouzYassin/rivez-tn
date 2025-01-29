alter table "public"."quizzes" alter column "name" drop default;

alter table "public"."quizzes" alter column "name" set data type text using "name"::text;


