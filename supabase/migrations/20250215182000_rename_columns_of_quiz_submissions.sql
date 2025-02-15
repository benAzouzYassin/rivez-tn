alter table "public"."quiz_submission_answers" drop constraint "quiz_submission_answers_question_id_fkey";

alter table "public"."quiz_submissions" drop constraint "quiz_submissions_quiz_id_fkey";

alter table "public"."quiz_submissions" drop constraint "quiz_submissions_user_id_fkey";

alter table "public"."quiz_submission_answers" drop column "question_id";

alter table "public"."quiz_submission_answers" add column "question" bigint;

alter table "public"."quiz_submissions" drop column "quiz_id";

alter table "public"."quiz_submissions" drop column "user_id";

alter table "public"."quiz_submissions" add column "quiz" bigint;

alter table "public"."quiz_submissions" add column "user" uuid default gen_random_uuid();

alter table "public"."quiz_submission_answers" add constraint "quiz_submission_answers_question_fkey" FOREIGN KEY (question) REFERENCES quizzes_questions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."quiz_submission_answers" validate constraint "quiz_submission_answers_question_fkey";

alter table "public"."quiz_submissions" add constraint "quiz_submissions_quiz_id_fkey" FOREIGN KEY (quiz) REFERENCES quizzes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."quiz_submissions" validate constraint "quiz_submissions_quiz_id_fkey";

alter table "public"."quiz_submissions" add constraint "quiz_submissions_user_id_fkey" FOREIGN KEY ("user") REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."quiz_submissions" validate constraint "quiz_submissions_user_id_fkey";


