const db = require('../db');

exports.getBooks = async (req, res) => {
    try {
        const { search } = req.query;
        let query = "SELECT * FROM book ORDER BY book_id DESC";
        let params = [];
        
        if (search) {
            query = "SELECT * FROM book WHERE title LIKE ? OR author LIKE ? OR category LIKE ? ORDER BY book_id DESC";
            params = [`%${search}%`, `%${search}%`, `%${search}%` ];
        }
        
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addBook = async (req, res) => {
    try {
        const { title, author, category, total_copies } = req.body;
        const [result] = await db.execute(
            "INSERT INTO book (title, author, category, total_copies, available_copies, added_date) VALUES (?, ?, ?, ?, ?, NOW())",
            [title, author, category, total_copies, total_copies]
        );
        res.status(201).json({ id: result.insertId, message: "Book added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM book WHERE book_id = ?", [id]);
        res.json({ message: "Book deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
