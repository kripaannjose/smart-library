const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const studentController = require('../controllers/studentController');
const issueController = require('../controllers/issueController');
const dashboardController = require('../controllers/dashboardController');
const reservationController = require('../controllers/reservationController');

// Student Specific
router.get('/student/dashboard/:id', reservationController.getStudentDashboardStats);
router.post('/student/reserve', reservationController.createReservation);
router.get('/student/reservations/:id', reservationController.getStudentDashboardStats); // Included in dashboard stats for now

// Dashboard
router.get('/dashboard/stats', dashboardController.getStats);

// Books
router.get('/books', bookController.getBooks);
router.post('/books', bookController.addBook);
router.delete('/books/:id', bookController.deleteBook);

// Students
router.get('/students', studentController.getStudents);
router.post('/students', studentController.addStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);
router.post('/student-login', studentController.studentLogin);

// Transactions
router.post('/issue', issueController.issueBook);
router.post('/return', issueController.returnBook);
router.get('/active-issues', issueController.getActiveIssues);

// Basic Auth Simulation (per requirement point 4-5)
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if(username === 'admin' && password === '1234') {
        res.json({ success: true, user: { name: 'Administrator' } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

module.exports = router;
