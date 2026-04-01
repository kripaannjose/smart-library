const db = require('../db');

exports.issueBook = async (req, res) => {
    try {
        const { student_id, book_id } = req.body;
        const issue_date = new Date().toISOString().slice(0, 10);

        // Check availability
        const [book] = await db.execute("SELECT available_copies FROM book WHERE book_id = ?", [book_id]);
        if (book.length === 0 || book[0].available_copies <= 0) {
            return res.status(400).json({ error: "Book not available" });
        }

        // Insert issue record
        await db.execute(
            "INSERT INTO book_issue (student_id, book_id, issue_date, status) VALUES (?, ?, NOW(), 'Issued')",
            [student_id, book_id]
        );

        // Update book counter
        await db.execute("UPDATE book SET available_copies = available_copies - 1 WHERE book_id = ?", [book_id]);

        res.json({ message: "Book issued successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { issue_id } = req.body;

        // Get issue details including status
        const [issueData] = await db.execute("SELECT book_id, issue_date, status FROM book_issue WHERE issue_id = ?", [issue_id]);
        if (issueData.length === 0) return res.status(404).json({ error: "Reference record not found" });

        const { book_id, issue_date, status } = issueData[0];

        // Validation: Ensure it's not already returned
        if (status === 'Returned') {
            return res.status(400).json({ error: "Book already returned. Operation halted." });
        }

        // Calculate fine (10 per day after 7 days)
        const diffInTime = new Date().getTime() - new Date(issue_date).getTime();
        const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
        const fine = diffInDays > 7 ? (diffInDays - 7) * 10 : 0;

        // Finalize transaction: Update status, return_date and fine
        await db.execute(
            "UPDATE book_issue SET return_date = NOW(), status = 'Returned', fine = ? WHERE issue_id = ?", 
            [fine, issue_id]
        );

        // Update book counter ensuring consistency
        await db.execute("UPDATE book SET available_copies = available_copies + 1 WHERE book_id = ?", [book_id]);

        res.json({ message: "Book returned successfully!", fine });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getActiveIssues = async (req, res) => {
    try {
        const { student_id } = req.query;
        let query = `
            SELECT bi.issue_id, bi.student_id, s.name as student_name, b.title as book_title, bi.issue_date, bi.due_date, bi.return_date, bi.status, bi.fine
            FROM book_issue bi
            JOIN student s ON bi.student_id = s.student_id
            JOIN book b ON bi.book_id = b.book_id
        `;
        let params = [];

        if (student_id) {
            query += " WHERE bi.student_id = ?";
            params.push(student_id);
        }

        query += " ORDER BY bi.issue_date DESC";
        
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
