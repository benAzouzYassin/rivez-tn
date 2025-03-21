drop policy "Enable users of viewing public data and their data" on "public"."quizzes";

drop policy "Enable user of updating his quiz questions" on "public"."quizzes_questions";

drop policy "enable user of deleting his questions" on "public"."quizzes_questions";

drop policy "enable user of inserting questions to his quizzes" on "public"."quizzes_questions";

CREATE INDEX quiz_submission_answers_question_idx ON public.quiz_submission_answers USING btree (question);

CREATE INDEX quiz_submission_answers_quiz_submission_idx ON public.quiz_submission_answers USING btree (quiz_submission);

CREATE INDEX quiz_submissions_quiz_idx ON public.quiz_submissions USING btree (quiz);

CREATE INDEX quiz_submissions_quiz_user_idx1 ON public.quiz_submissions USING btree (quiz, "user");

CREATE INDEX quiz_submissions_user_idx ON public.quiz_submissions USING btree ("user");

CREATE INDEX quizzes_author_id_idx ON public.quizzes USING btree (author_id);

CREATE INDEX quizzes_refunds_quiz_id_idx ON public.quizzes_refunds USING btree (quiz_id);

create policy "Enable users of viewing public data and their data"
on "public"."quizzes"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = author_id) OR (publishing_status = 'PUBLISHED'::publishing_status)));


create policy "Enable user of updating his quiz questions"
on "public"."quizzes_questions"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT quizzes.author_id
   FROM quizzes
  WHERE (quizzes.id = quizzes_questions.quiz))));


create policy "enable user of deleting his questions"
on "public"."quizzes_questions"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT quizzes.author_id
   FROM quizzes
  WHERE (quizzes.id = quizzes_questions.quiz))));


create policy "enable user of inserting questions to his quizzes"
on "public"."quizzes_questions"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = ( SELECT quizzes.author_id
   FROM quizzes
  WHERE (quizzes.id = quizzes_questions.quiz))));



