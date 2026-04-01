-- SMART LIBRARY V2.4 - DATABASE ADVANCED FEATURES
-- To run this, open phpMyAdmin -> select 'smart_library_db' -> SQL tab -> Paste and Execute

-- 1. VIEW: Consolidating student, book, and issue data
CREATE OR REPLACE VIEW v_active_issues AS
SELECT 
    i.issue_id, 
    s.name as student_name, 
    s.department,
    b.title as book_title, 
    i.issue_date, 
    i.return_date, 
    i.status, 
    i.fine
FROM book_issue i
JOIN student s ON i.student_id = s.student_id
JOIN book b ON i.book_id = b.book_id;

-- 2. TRIGGER: Decrement available_copies when a new issue record is inserted
DROP TRIGGER IF EXISTS after_book_issue;
CREATE TRIGGER after_book_issue
AFTER INSERT ON book_issue
FOR EACH ROW
BEGIN
    UPDATE book 
    SET available_copies = available_copies - 1 
    WHERE book_id = NEW.book_id;
END;

-- 3. TRIGGER: Increment available_copies when a book is returned
DROP TRIGGER IF EXISTS after_book_return;
CREATE TRIGGER after_book_return
AFTER UPDATE ON book_issue
FOR EACH ROW
BEGIN
    IF OLD.status = 'Issued' AND NEW.status = 'Returned' THEN
        UPDATE book 
        SET available_copies = available_copies + 1 
        WHERE book_id = NEW.book_id;
    END IF;
END;
