const mysql = require('mysql2/promise');
require('dotenv').config();

async function upgrade() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  console.log("Upgrading Database Schema...");

  try {
    // 1. Add email and password for students
    await connection.execute(`ALTER TABLE student ADD COLUMN email VARCHAR(100) UNIQUE, ADD COLUMN password VARCHAR(255) DEFAULT 'student123'`);
    console.log("-> Student table altered.");
  } catch (e) { console.log("-> Student table columns already exist or skipped."); }

  // 2. Clear old triggers for consistency
  await connection.execute(`DROP TRIGGER IF EXISTS after_book_issue`);
  await connection.execute(`DROP TRIGGER IF EXISTS after_book_return`);

  // 3. Create NEW triggers
  await connection.query(`
    CREATE TRIGGER after_book_issue
    AFTER INSERT ON book_issue
    FOR EACH ROW
    BEGIN
      UPDATE book SET available_copies = available_copies - 1 WHERE book_id = NEW.book_id;
    END
  `);

  await connection.query(`
    CREATE TRIGGER after_book_return
    AFTER UPDATE ON book_issue
    FOR EACH ROW
    BEGIN
      IF OLD.status = 'Issued' AND NEW.status = 'Returned' THEN
        UPDATE book SET available_copies = available_copies + 1 WHERE book_id = NEW.book_id;
      END IF;
    END
  `);
  console.log("-> Triggers created/updated.");

  // 4. Create consolidate view
  await connection.execute(`
    CREATE OR REPLACE VIEW v_active_issues AS
    SELECT i.issue_id, s.name as student_name, b.title as book_title, i.issue_date, i.return_date, i.status, i.fine
    FROM book_issue i
    JOIN student s ON i.student_id = s.student_id
    JOIN book b ON i.book_id = b.book_id
  `);
  console.log("-> Consolidated View 'v_active_issues' ready.");

  // 5. SEED DATA (More Students and Books)
  console.log("Seeding more data...");
  
  const books = [
    ['Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', 'Fiction', 10, 10],
    ['To Kill a Mockingbird', 'Harper Lee', 'Classic', 5, 5],
    ['1984', 'George Orwell', 'Dystopian', 8, 8],
    ['The Great Gatsby', 'F. Scott Fitzgerald', 'Literature', 4, 4],
    ['The Chronicles of Narnia', 'C.S. Lewis', 'Fantasy', 12, 12],
    ['Brief History of Time', 'Stephen Hawking', 'Science', 6, 6],
    ['Eloquent JavaScript', 'Marijn Haverbeke', 'Technology', 15, 15],
    ['The Pragmatic Programmer', 'Andy Hunt', 'Technology', 10, 10],
    ['Introduction to Algorithms', 'Thomas Cormen', 'Education', 5, 5],
    ['The Alchemist', 'Paulo Coelho', 'Adventure', 10, 10]
  ];

  for (const b of books) {
    await connection.execute(`INSERT IGNORE INTO book (title, author, category, total_copies, available_copies, added_date) VALUES (?, ?, ?, ?, ?, CURDATE())`, b);
  }

  const students = [
    ['Arjun Sharma', 'Science', '9876543210', 'arjun@school.com'],
    ['Priya Patel', 'Arts', '9876543211', 'priya@school.com'],
    ['Rahul Verma', 'Commerce', '9876543212', 'rahul@school.com'],
    ['Sneha Reddy', 'Science', '9876543213', 'sneha@school.com'],
    ['Vijay Kumar', 'Engineering', '9876543214', 'vijay@school.com'],
    ['Anjali Desai', 'Arts', '9876543215', 'anjali@school.com']
  ];

  for (const s of students) {
     await connection.execute(`INSERT IGNORE INTO student (name, department, phone, email, join_date) VALUES (?, ?, ?, ?, CURDATE())`, s);
  }

  console.log("Database successfully modernized with triggers, views, and data.");
  await connection.end();
}

upgrade();
