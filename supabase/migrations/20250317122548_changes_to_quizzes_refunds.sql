alter table "public"."quizzes_refunds" drop constraint "quizzes_refunds_quiz_id_fkey";

alter table "public"."quizzes_refunds" add column "user_id" uuid;

alter table "public"."user_profiles" drop column "allowed_error_credit_refund";

alter table "public"."quizzes_refunds" add constraint "quizzes_refunds_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."quizzes_refunds" validate constraint "quizzes_refunds_user_id_fkey";

alter table "public"."quizzes_refunds" add constraint "quizzes_refunds_quiz_id_fkey" FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL not valid;

alter table "public"."quizzes_refunds" validate constraint "quizzes_refunds_quiz_id_fkey";


