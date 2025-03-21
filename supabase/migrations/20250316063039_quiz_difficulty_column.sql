create type "public"."difficulty" as enum ('NORMAL', 'MEDIUM', 'HARD');

alter table "public"."quizzes" add column "difficulty" difficulty default 'NORMAL'::difficulty;


