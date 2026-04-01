const db = require('../db');

exports.getStudentDashboardStats = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Issued Books
        const [issued] = await db.execute(`
            SELECT bi.issue_id, b.title, b.author, bi.issue_date, bi.return_date, bi.status, bi.fine
            FROM book_issue bi
            JOIN book b ON bi.book_id = b.book_id
            WHERE bi.student_id = ?
            ORDER BY bi.issue_date DESC
        `, [id]);

        // 2. Summary stats
        const activeCount = issued.filter(i => !i.return_date).length;
        const totalFine = issued.reduce((acc, curr) => acc + (curr.fine || 0), 0);

        // 3. Reservations
        const [reservations] = await db.execute(`
            SELECT r.*, b.title 
            FROM reservation r 
            JOIN book b ON r.book_id = b.book_id 
            WHERE r.student_id = ?
        `, [id]);

        res.json({
            issued_books: issued,
            active_count: activeCount,
            total_fine: totalFine,
            reservations: reservations
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { student_id, book_id } = req.body;
        
        // Check if book available
        const [book] = await db.execute("SELECT available_copies FROM book WHERE book_id = ?", [book_id]);
        if (book.length === 0 || book[0].available_copies <= 0) {
            return res.status(400).json({ error: "Book currently out of stock. Cannot reserve." });
        }

        // Check if already reserved/issued by same student
        const [existing] = await db.execute("SELECT * FROM book_issue WHERE student_id = ? AND book_id = ? AND return_date IS NULL", [student_id, book_id]);
        if (existing.length > 0) return res.status(400).json({ error: "You already have an active issue for this book." });

        await db.execute(
            "INSERT INTO reservation (student_id, book_id, reservation_date, status) VALUES (?, ?, CURDATE(), 'Pending')",
            [student_id, book_id]
        );
        res.json({ message: "Book reserved successfully. Please collect from counter within 24h." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
