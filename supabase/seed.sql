BEGIN;
INSERT INTO public.quizzes_categories (name, description, image) VALUES
('JavaScript Fundamentals', 'Core concepts of JavaScript programming language', 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png'),
('Python Basics', 'Essential Python programming concepts', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg'),
('Data Structures', 'Common data structures in programming', 'https://example.com/data-structures.png');

INSERT INTO public.quizzes (name, category, image) VALUES
('JavaScript Variables & Types', 1, 'https://dev.files.softyeducation.com/api/website_courses_icons_react_js-1337a72a-dcae-45fa-967e-64998bce5198.png'),
('Python Lists & Tuples', 2, 'https://dev.files.softyeducation.com/api/website_courses_icons_ui_ux_design-2183deff-765c-4c54-9182-70f37147d6d5.png'),
('Common Data Structures', 3, 'https://dev.files.softyeducation.com/api/website_courses_icons_software_testing-87c8888b-7fe3-4455-90a0-cc11bd03836f.png');

INSERT INTO public.quizzes_questions (question, quiz, type, content) VALUES
('What is the output of: typeof null', 
 1, 
 'MULTIPLE_CHOICE',
 '{
      "correct": ["object"],
      "options": ["object", "null", "undefined", "number"]
  }'
),
('Which of these is not a primitive type in JavaScript?',
 1,
 'MULTIPLE_CHOICE',
 '{
      "correct": ["array"],
      "options": ["array", "string", "number", "boolean"]
  }'
);

-- Python Quiz Questions (MULTIPLE_CHOICE)
INSERT INTO public.quizzes_questions (question, quiz, type, content) VALUES
('Which of the following are valid ways to create a list in Python?',
 2,
 'MULTIPLE_CHOICE',
 '{
      "correct": ["list()", "[]", "[].copy()"],
      "options": ["list()", "[]", "list.new()", "[].copy()"]
  }'
),
('Which of these operations are valid for both lists and tuples?',
 2,
 'MULTIPLE_CHOICE',
 '{
      "correct": ["len()", "index()", "count()"],
      "options": ["len()", "index()", "append()", "count()"]
  }'
);

INSERT INTO public.quizzes_questions (question, quiz, type, content) VALUES
('Match the data structure with its best use case:',
 3,
 'MATCHING_PAIRS',
 '{
      "leftSideOptions": [
        "Hash Table",
        "Binary Search Tree",
        "Stack",
        "Queue"
      ],
      "rightSideOptions": [
        "Fast key-value lookups",
        "Ordered data with fast search",
        "LIFO order processing",
        "FIFO order processing"
      ],
      "correct": [
        ["Hash Table", "Fast key-value lookups"],
        ["Binary Search Tree", "Ordered data with fast search"],
        ["Stack", "LIFO order processing"],
        ["Queue", "FIFO order processing"]
      ]
  }'
),
('Match the Big O notation with the correct description:',
 3,
 'MATCHING_PAIRS',
 '{
      "leftSideOptions": [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n²)"
      ],
      "rightSideOptions": [
        "Constant time complexity",
        "Linear time complexity",
        "Logarithmic time complexity",
        "Quadratic time complexity"
      ],
      "correct": [
        ["O(1)", "Constant time complexity"],
        ["O(n)", "Linear time complexity"],
        ["O(log n)", "Logarithmic time complexity"],
        ["O(n²)", "Quadratic time complexity"]
      ]
  }'
);

INSERT INTO public.quizzes_questions (question, quiz, type, content) VALUES
('What is the result of 0.1 + 0.2 === 0.3 in JavaScript?',
 1,
 'MULTIPLE_CHOICE',
 '{
      "correct": ["false"],
      "options": ["false", "true", "undefined", "NaN"]
  }'
);

INSERT INTO public.quizzes_questions (question, quiz, type, content) VALUES
('Which of these are valid Python string methods?',
 2,
 'MULTIPLE_CHOICE',
 '{
      "correct": ["upper()", "lower()", "capitalize()"],
      "options": ["upper()", "lower()", "capitalize()", "uppercase()"]
  }'
);

INSERT INTO public.quizzes_questions (question, quiz, type, content) VALUES
('Match the data structure with its characteristics:',
 3,
 'MATCHING_PAIRS',
 '{
      "leftSideOptions": [
        "Linked List",
        "Array",
        "Heap",
        "Graph"
      ],
      "rightSideOptions": [
        "Dynamic size with O(1) insertion",
        "Fixed size with O(1) access",
        "Priority-based operations",
        "Network-like relationships"
      ],
      "correct": [
        ["Linked List", "Dynamic size with O(1) insertion"],
        ["Array", "Fixed size with O(1) access"],
        ["Heap", "Priority-based operations"],
        ["Graph", "Network-like relationships"]
      ]
  }'
);
COMMIT;