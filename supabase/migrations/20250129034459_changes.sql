create type "public"."quiz_question_types" as enum ( 'MULTIPLE_CHOICE', 'MATCHING_PAIRS', 'DEBUG_CODE', 'CODE_COMPLETION');

drop policy "Enable read access for authenticated users" on "public"."quizzes_questions_options";

revoke delete on table "public"."quizzes_questions_options" from "anon";

revoke insert on table "public"."quizzes_questions_options" from "anon";

revoke references on table "public"."quizzes_questions_options" from "anon";

revoke select on table "public"."quizzes_questions_options" from "anon";

revoke trigger on table "public"."quizzes_questions_options" from "anon";

revoke truncate on table "public"."quizzes_questions_options" from "anon";

revoke update on table "public"."quizzes_questions_options" from "anon";

revoke delete on table "public"."quizzes_questions_options" from "authenticated";

revoke insert on table "public"."quizzes_questions_options" from "authenticated";

revoke references on table "public"."quizzes_questions_options" from "authenticated";

revoke select on table "public"."quizzes_questions_options" from "authenticated";

revoke trigger on table "public"."quizzes_questions_options" from "authenticated";

revoke truncate on table "public"."quizzes_questions_options" from "authenticated";

revoke update on table "public"."quizzes_questions_options" from "authenticated";

revoke delete on table "public"."quizzes_questions_options" from "service_role";

revoke insert on table "public"."quizzes_questions_options" from "service_role";

revoke references on table "public"."quizzes_questions_options" from "service_role";

revoke select on table "public"."quizzes_questions_options" from "service_role";

revoke trigger on table "public"."quizzes_questions_options" from "service_role";

revoke truncate on table "public"."quizzes_questions_options" from "service_role";

revoke update on table "public"."quizzes_questions_options" from "service_role";

alter table "public"."quizzes_questions_options" drop constraint "quizzes-questions-options_question_fkey";

alter table "public"."quizzes_questions_options" drop constraint "quizzes-questions-options_pkey";

drop index if exists "public"."quizzes-questions-options_pkey";

drop table "public"."quizzes_questions_options";

alter table "public"."quizzes_questions" add column "content" jsonb;

alter table "public"."quizzes_questions" add column "type" quiz_question_types;


