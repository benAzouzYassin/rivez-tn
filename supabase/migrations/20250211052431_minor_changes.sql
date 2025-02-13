CREATE INDEX quizzes_category_idx ON public.quizzes USING btree (category);

CREATE INDEX quizzes_questions_quiz_idx ON public.quizzes_questions USING btree (quiz);


