-- ==========================================================
-- ADVANCED DATABASE FEATURES: CRUD, JOIN, VIEW, TRIGGER
-- ==========================================================
USE `smart_library_db`;

-- 1. Use of JOIN & VIEW
-- This VIEW joins student, book, and book_issue tables to show all active issues.
CREATE OR REPLACE VIEW `active_issues_view` AS
SELECT 
    bi.issue_id,
    bi.student_id,
    s.name,
    s.department,
    b.title,
    b.author,
    bi.issue_date,
    DATEDIFF(CURRENT_DATE(), bi.issue_date) AS days_elapsed
FROM 
    book_issue bi
JOIN 
    student s ON bi.student_id = s.student_id
JOIN 
    book b ON bi.book_id = b.book_id
WHERE 
    bi.return_date IS NULL;

-- 2. Create Audit/Activity Log Table (for trigger demonstration)
CREATE TABLE IF NOT EXISTS `audit_log` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `action_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `action_type` VARCHAR(50),
    `description` TEXT
);

-- 3. Use of TRIGGER
-- This trigger logs whenever a student is deleted.
DELIMITER //
CREATE TRIGGER `after_student_delete`
AFTER DELETE ON `student`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_log` (`action_type`, `description`)
    VALUES ('DELETE_STUDENT', CONCAT('Student ', OLD.name, ' (ID: ', OLD.student_id, ') was removed from the system.'));
END //
DELIMITER ;

-- 4. Demonstration of CRUD Operations (SELECT, INSERT, UPDATE, DELETE)

-- a. SELECT Example (already used extensively in the app)
-- SELECT * FROM active_issues_view;

-- b. INSERT Example (already used in registrations)
-- INSERT INTO `audit_log` (`action_type`, `description`) VALUES ('INIT', 'Library system enhancements applied.');

-- c. UPDATE Example (used for returning books or editing student info)
-- UPDATE student SET department = 'Computer Engineering' WHERE student_id = 1;

-- d. DELETE Example (needed for management)
-- DELETE FROM student WHERE student_id = 999; -- Just an example placeholder

-- Show verification message
INSERT INTO `audit_log` (`action_type`, `description`) VALUES ('SYSTEM', 'Advanced database features (View, Trigger, Join) successfully initialized.');
