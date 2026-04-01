-- Initialize all students who lack login credentials
UPDATE student 
SET 
  email = CONCAT(LOWER(REPLACE(name, ' ', '')), '@school.com'), 
  password = 'student123'
WHERE email IS NULL OR password IS NULL;

-- Confirm we have data
SELECT student_id, name, email, password FROM student WHERE email IS NOT NULL;
