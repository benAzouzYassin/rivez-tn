alter table "public"."quiz_submissions" drop constraint "quiz_submissions_user_fkey";

drop function if exists "public"."handle_new_user_role"();

alter table "public"."quizzes" add constraint "quizzes_author_id_fkey1" FOREIGN KEY (author_id) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."quizzes" validate constraint "quizzes_author_id_fkey1";

alter table "public"."quiz_submissions" add constraint "quiz_submissions_user_fkey" FOREIGN KEY ("user") REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."quiz_submissions" validate constraint "quiz_submissions_user_fkey";


