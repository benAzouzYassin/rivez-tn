alter type "public"."quiz_question_types" rename to "quiz_question_types__old_version_to_be_dropped";

create type "public"."quiz_question_types" as enum ('MULTIPLE_CHOICE', 'MATCHING_PAIRS', 'DEBUG_CODE', 'CODE_COMPLETION', 'FILL_IN_THE_BLANK');

alter table "public"."quizzes_questions" alter column type type "public"."quiz_question_types" using type::text::"public"."quiz_question_types";

drop type "public"."quiz_question_types__old_version_to_be_dropped";


