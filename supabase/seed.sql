BEGIN;

-- Insert more sample quizzes
INSERT INTO public.quizzes (name)
VALUES 
  ('Basic Math Quiz'),
  ('Programming Fundamentals'),
  ('World History Quiz'),
  ('Science and Nature Quiz'),
  ('Literature Quiz');

-- Insert questions for Basic Math Quiz
INSERT INTO public.quizzes_questions (question, quiz, type, content)
VALUES
  (
    'What is 2 + 2?',
    1,
    'SINGLE_CHOICE',
    '{
      "options": ["3", "4", "5"],
      "correct": [1]
    }'
  ),
  (
    'Match the mathematical operations',
    1,
    'MATCHING_PAIRS',
    '{
      "pairs": [
        ["2 × 3", "6"],
        ["5 + 7", "12"],
        ["8 ÷ 2", "4"]
      ],
      "correct": [[0,0], [1,1], [2,2]]
    }'
  ),
  (
    'What is the square root of 64?',
    1,
    'SINGLE_CHOICE',
    '{
      "options": ["6", "8", "10"],
      "correct": [1]
    }'
  );

-- Insert questions for Programming Fundamentals
INSERT INTO public.quizzes_questions (question, quiz, type, content)
VALUES
  (
    'Which are valid programming languages?',
    2,
    'MULTIPLE_CHOICE',
    '{
      "options": ["Python", "HTML", "Java", "CSS"],
      "correct": [0, 2]
    }'
  ),
  (
    'Debug this Python function:',
    2,
    'DEBUG_CODE',
    '{
      "code": "def add(a, b):\n    return a - b",
      "correct": "def add(a, b):\n    return a + b"
    }'
  ),
  (
    'Complete the code to print "Hello World"',
    2,
    'CODE_COMPLETION',
    '{
      "snippet": "print(__)",
      "hints": ["Use string syntax"],
      "correct": "\"Hello World\""
    }'
  ),
  (
    'What does HTML stand for?',
    2,
    'SINGLE_CHOICE',
    '{
      "options": ["HyperText Markup Language", "High-Level Machine Language", "Home Tool Management Language"],
      "correct": [0]
    }'
  );

-- Insert questions for World History Quiz
INSERT INTO public.quizzes_questions (question, quiz, type, content)
VALUES
  (
    'Who was the first President of the United States?',
    3,
    'SINGLE_CHOICE',
    '{
      "options": ["Thomas Jefferson", "George Washington", "Abraham Lincoln"],
      "correct": [1]
    }'
  ),
  (
    'Match the historical events to their dates',
    3,
    'MATCHING_PAIRS',
    '{
      "pairs": [
        ["World War I", "1914-1918"],
        ["Fall of the Berlin Wall", "1989"],
        ["American Civil War", "1861-1865"]
      ],
      "correct": [[0,0], [1,1], [2,2]]
    }'
  ),
  (
    'Which country was not part of the Axis Powers in WWII?',
    3,
    'SINGLE_CHOICE',
    '{
      "options": ["Germany", "Italy", "France"],
      "correct": [2]
    }'
  );

-- Insert questions for Science and Nature Quiz
INSERT INTO public.quizzes_questions (question, quiz, type, content)
VALUES
  (
    'What is the chemical symbol for water?',
    4,
    'SINGLE_CHOICE',
    '{
      "options": ["H2O", "CO2", "NaCl"],
      "correct": [0]
    }'
  ),
  (
    'Which planet is known as the Red Planet?',
    4,
    'SINGLE_CHOICE',
    '{
      "options": ["Mars", "Venus", "Jupiter"],
      "correct": [0]
    }'
  ),
  (
    'Match the animal to its classification',
    4,
    'MATCHING_PAIRS',
    '{
      "pairs": [
        ["Lion", "Mammal"],
        ["Eagle", "Bird"],
        ["Frog", "Amphibian"]
      ],
      "correct": [[0,0], [1,1], [2,2]]
    }'
  );

-- Insert questions for Literature Quiz
INSERT INTO public.quizzes_questions (question, quiz, type, content)
VALUES
  (
    'Who wrote "Pride and Prejudice"?',
    5,
    'SINGLE_CHOICE',
    '{
      "options": ["Jane Austen", "Charles Dickens", "Mark Twain"],
      "correct": [0]
    }'
  ),
  (
    'Match the book to its author',
    5,
    'MATCHING_PAIRS',
    '{
      "pairs": [
        ["1984", "George Orwell"],
        ["To Kill a Mockingbird", "Harper Lee"],
        ["The Great Gatsby", "F. Scott Fitzgerald"]
      ],
      "correct": [[0,0], [1,1], [2,2]]
    }'
  ),
  (
    'Which of these is a Shakespearean play?',
    5,
    'MULTIPLE_CHOICE',
    '{
      "options": ["Hamlet", "Macbeth", "The Odyssey"],
      "correct": [0, 1]
    }'
  );

COMMIT;