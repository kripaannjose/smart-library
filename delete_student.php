<?php 
session_start();
include "db_connect.php"; 

if(!isset($_SESSION['admin'])){
    header("Location: login.php");
    exit();
}

if(isset($_GET['id'])) {
    $student_id = mysqli_real_escape_string($conn, $_GET['id']);
    
    // Check if the student has any active issues before deleting
    $check = $conn->query("SELECT * FROM book_issue WHERE student_id = '$student_id' AND return_date IS NULL");
    if($check->num_rows > 0) {
        $_SESSION['error'] = "Cannot delete student with active book issues!";
    } else {
        // Perform DELETE (CRUD)
        if($conn->query("DELETE FROM student WHERE student_id = '$student_id'")) {
            // Note: The 'after_student_delete' TRIGGER in the database will automatically 
            // log this action into the audit_log table.
            $_SESSION['success'] = "Student deleted successfully!";
        } else {
            $_SESSION['error'] = "Error: " . $conn->error;
        }
    }
}

header("Location: students.php");
exit();
?>
