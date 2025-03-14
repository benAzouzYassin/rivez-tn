create type "public"."quiz_question_image_type" as enum ('normal-image', 'code-snippets', 'none');

alter table "public"."quizzes_questions" add column "display_order" bigint;

alter table "public"."quizzes_questions" add column "image_type" quiz_question_image_type default 'none'::quiz_question_image_type;


