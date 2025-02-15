alter table "public"."quiz_submission_answers" drop column "selected_content";

alter table "public"."quiz_submission_answers" add column "failed_attempts" bigint default '0'::bigint;

alter table "public"."quiz_submission_answers" add column "responses" jsonb default '[]'::jsonb;

alter table "public"."quiz_submission_answers" alter column "seconds_spent" drop default;

alter table "public"."quiz_submission_answers" alter column "seconds_spent" set data type numeric using "seconds_spent"::numeric;

alter table "public"."quiz_submissions" alter column "seconds_spent" drop default;

alter table "public"."quiz_submissions" alter column "seconds_spent" set data type numeric using "seconds_spent"::numeric;


