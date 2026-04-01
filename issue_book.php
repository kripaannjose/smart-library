<?php 
session_start();
include "db_connect.php"; 

if(!isset($_SESSION['admin'])){
    header("Location: login.php");
    exit();
}

if(isset($_POST['issue'])) {
    $student_id = mysqli_real_escape_string($conn, $_POST['student_id']);
    $book_id = mysqli_real_escape_string($conn, $_POST['book_id']);
    $issue_date = date("Y-m-d");

    // Insert into book_issue table
    $sql = "INSERT INTO book_issue (student_id, book_id, issue_date, return_date)
            VALUES ('$student_id', '$book_id', '$issue_date', NULL)";
    
    if($conn->query($sql)) {
        // Reduce available copies
        $conn->query("UPDATE book SET available_copies = available_copies - 1 WHERE book_id = '$book_id'");
        $success = "Book Issued Successfully!";
    } else {
        $error = "Error: " . $conn->error;
    }
}

$page_title = "Issue New Book";
include "includes/header.php";
?>

<div class="flex">
    <!-- Sidebar -->
    <?php include "includes/sidebar.php"; ?>

    <!-- Main Content -->
    <main class="flex-1 ml-64 p-8 animate-fade-in">
        
        <!-- Top Bar -->
        <header class="flex items-center justify-between mb-10">
            <div>
                <h1 class="text-3xl font-bold text-white tracking-tight">Issue Transaction</h1>
                <p class="text-slate-400 font-medium">Lend books to students with ease</p>
            </div>
        </header>

        <div class="max-w-2xl mx-auto">
            <div class="glass-card rounded-3xl p-8 shadow-2xl">
                <div class="flex items-center space-x-3 mb-8">
                    <div class="bg-blue-600/20 p-3 rounded-xl">
                        <i data-lucide="book-up" class="w-6 h-6 text-blue-500"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-white">Create New Issue</h2>
                        <p class="text-slate-500 text-sm">Please select a student and a book to continue</p>
                    </div>
                </div>

                <?php if(isset($success)): ?>
                <div class="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-3">
                    <i data-lucide="check-circle" class="w-5 h-5"></i>
                    <span class="font-medium"><?php echo $success; ?></span>
                </div>
                <?php endif; ?>

                <?php if(isset($error)): ?>
                <div class="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center space-x-3">
                    <i data-lucide="alert-circle" class="w-5 h-5"></i>
                    <span class="font-medium"><?php echo $error; ?></span>
                </div>
                <?php endif; ?>

                <form method="POST" class="space-y-6">
                    <div>
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Select Student</label>
                        <div class="relative">
                            <i data-lucide="users" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"></i>
                            <select name="student_id" required class="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition appearance-none cursor-pointer">
                                <option value="">Choose a member...</option>
                                <?php
                                $students = $conn->query("SELECT * FROM student ORDER BY name ASC");
                                while($s = $students->fetch_assoc()) {
                                    echo "<option value='{$s['student_id']}'>{$s['name']} (#{$s['student_id']})</option>";
                                }
                                ?>
                            </select>
                            <i data-lucide="chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none"></i>
                        </div>
                    </div>

                    <div>
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Select Book</label>
                        <div class="relative">
                            <i data-lucide="book-open" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"></i>
                            <select name="book_id" required class="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition appearance-none cursor-pointer">
                                <option value="">Choose an available book...</option>
                                <?php
                                $books = $conn->query("SELECT * FROM book WHERE available_copies > 0 ORDER BY title ASC");
                                while($b = $books->fetch_assoc()) {
                                    echo "<option value='{$b['book_id']}'>{$b['title']} (Available: {$b['available_copies']})</option>";
                                }
                                ?>
                            </select>
                            <i data-lucide="chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none"></i>
                        </div>
                    </div>

                    <div class="pt-4">
                        <button type="submit" name="issue" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 transform active:scale-[0.98] flex items-center justify-center space-x-2">
                            <span>Confirm Issue</span>
                            <i data-lucide="arrow-right-circle" class="w-6 h-6"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </main>
</div>

<script>
    lucide.createIcons();
</script>
</body>
</html>