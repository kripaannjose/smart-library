const db = require('../db');

exports.getStats = async (req, res) => {
    try {
        const [[{ total: students }]] = await db.query("SELECT COUNT(*) AS total FROM student");
        const [[{ total: books }]] = await db.query("SELECT COUNT(*) AS total FROM book");
        const [[{ total: issued }]] = await db.query("SELECT COUNT(*) AS total FROM book_issue WHERE status = 'Issued'");

        const [latest] = await db.query("SELECT book_id, title, author FROM book ORDER BY book_id DESC LIMIT 4");

        // Fetch logs (mix of issued and returned for activity feed)
        const [rawLogs] = await db.query(`
            SELECT bi.issue_date, bi.return_date, s.name as student_name, b.title as book_title, bi.status
            FROM book_issue bi
            JOIN student s ON bi.student_id = s.student_id
            JOIN book b ON bi.book_id = b.book_id
            ORDER BY COALESCE(bi.return_date, bi.issue_date) DESC
            LIMIT 10
        `);

        // Process logs into distinct events (Issue and Return)
        const logs = [];
        rawLogs.forEach(entry => {
            logs.push({
                user: entry.student_name,
                action: 'borrowed',
                item: entry.book_title,
                time: new Date(entry.issue_date).toLocaleDateString()
            });
            if (entry.status === 'Returned') {
                logs.push({
                    user: entry.student_name,
                    action: 'returned',
                    item: entry.book_title,
                    time: new Date(entry.return_date).toLocaleDateString()
                });
            }
        });

        res.json({
            students,
            books,
            issued,
            latest,
            logs: logs.sort((a,b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
