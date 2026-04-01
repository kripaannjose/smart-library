const db = require('../db');

exports.getStudents = async (req, res) => {
    try {
        const { search } = req.query;
        let query = "SELECT * FROM student ORDER BY student_id DESC";
        let params = [];
        
        if (search) {
            query = "SELECT * FROM student WHERE name LIKE ? OR department LIKE ? OR student_id LIKE ? ORDER BY student_id DESC";
            params = [`%${search}%`, `%${search}%`, `%${search}%` ];
        }
        
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addStudent = async (req, res) => {
    try {
        const { name, department, phone, email, password } = req.body;
        // Default password if not provided
        const studentPWD = password || 'student123';
        const [result] = await db.execute(
            "INSERT INTO student (name, department, phone, email, password, join_date) VALUES (?, ?, ?, ?, ?, CURDATE())",
            [name, department, phone, email, studentPWD]
        );
        res.status(201).json({ id: result.insertId, message: "Student registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Trim inputs to handle potential copy-paste spaces
        const cleanEmail = email?.trim().toLowerCase();
        const cleanPass = password?.trim();

        const [student] = await db.execute(
            "SELECT student_id, name, department FROM student WHERE LOWER(TRIM(email)) = ? AND password = ?",
            [cleanEmail, cleanPass]
        );
        
        if (student.length > 0) {
            res.json({ success: true, user: student[0], type: 'student' });
        } else {
            res.status(401).json({ success: false, message: "Invalid student credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, phone, email, password } = req.body;
        await db.execute(
            "UPDATE student SET name = ?, department = ?, phone = ?, email = ?, password = ? WHERE student_id = ?",
            [name, department, phone, email, password, id]
        );
        res.json({ message: "Student record updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM student WHERE student_id = ?", [id]);
        res.json({ message: "Student entry removed!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
