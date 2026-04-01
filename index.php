<?php
session_start();
include "db_connect.php";

if(!isset($_SESSION['admin'])){
    header("Location: login.php");
    exit();
}

# COUNT DATA
$student_count = $conn->query("SELECT COUNT(*) AS total FROM student")->fetch_assoc()['total'];
$book_count = $conn->query("SELECT COUNT(*) AS total FROM book")->fetch_assoc()['total'];
$issued_count = $conn->query("SELECT COUNT(*) AS total FROM book_issue WHERE return_date IS NULL")->fetch_assoc()['total'];

# Latest 5 Books
$latest_books = $conn->query("SELECT title, author FROM book ORDER BY book_id DESC LIMIT 5");

$page_title = "Admin Dashboard";
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
                <h1 class="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                <p class="text-slate-400 font-medium">Welcome back, Admin 👋 | Current Date: <span class="text-blue-400"><?php echo date('D, d M Y'); ?></span></p>
            </div>
            <div class="flex items-center space-x-4">
                <div class="p-2 bg-slate-800/50 rounded-full cursor-pointer hover:bg-slate-700 transition">
                    <i data-lucide="bell" class="w-5 h-5 text-slate-300"></i>
                </div>
                <div class="flex items-center space-x-3 bg-slate-800/50 p-1.5 pr-4 rounded-full border border-slate-700">
                    <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">AD</div>
                    <span class="text-sm font-semibold">Administrator</span>
                </div>
            </div>
        </header>

        <!-- Stats Cards Area -->
        <div class="grid md:grid-cols-3 gap-6 mb-10">
            <!-- Total Students Card -->
            <div class="glass-card p-6 rounded-2xl flex items-center space-x-5">
                <div class="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <i data-lucide="users-2" class="w-8 h-8 text-blue-500"></i>
                </div>
                <div>
                    <h3 class="text-slate-400 font-medium text-sm">Total Students</h3>
                    <p class="text-3xl font-bold text-white mt-1"><?php echo $student_count; ?></p>
                </div>
            </div>

            <!-- Total Books Card -->
            <div class="glass-card p-6 rounded-2xl flex items-center space-x-5">
                <div class="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <i data-lucide="book" class="w-8 h-8 text-emerald-500"></i>
                </div>
                <div>
                    <h3 class="text-slate-400 font-medium text-sm">Total Books</h3>
                    <p class="text-3xl font-bold text-white mt-1"><?php echo $book_count; ?></p>
                </div>
            </div>

            <!-- Issued Books Card -->
            <div class="glass-card p-6 rounded-2xl flex items-center space-x-5">
                <div class="w-14 h-14 bg-rose-500/10 rounded-xl flex items-center justify-center">
                    <i data-lucide="bookmark-check" class="w-8 h-8 text-rose-500"></i>
                </div>
                <div>
                    <h3 class="text-slate-400 font-medium text-sm">Active Issues</h3>
                    <p class="text-3xl font-bold text-white mt-1"><?php echo $issued_count; ?></p>
                </div>
            </div>
        </div>

        <!-- Dashboard Widgets -->
        <div class="grid lg:grid-cols-3 gap-8">
            <!-- Latest Arrivals List -->
            <div class="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
                <div class="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="sparkles" class="w-5 h-5 text-blue-400"></i>
                        <h2 class="text-lg font-bold">Latest Arrivals</h2>
                    </div>
                </div>
                <div class="p-0">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-slate-800/30 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                                <th class="px-6 py-4">S.No</th>
                                <th class="px-6 py-4">Title</th>
                                <th class="px-6 py-4">Author</th>
                                <th class="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/50">
                            <?php 
                            $i = 1;
                            while($row = $latest_books->fetch_assoc()) { 
                            ?>
                            <tr class="hover:bg-slate-400/5 transition">
                                <td class="px-6 py-4 text-slate-400 font-medium">#<?php echo $i++; ?></td>
                                <td class="px-6 py-4 font-semibold text-slate-200"><?php echo $row['title']; ?></td>
                                <td class="px-6 py-4 text-slate-400"><?php echo $row['author']; ?></td>
                                <td class="px-6 py-4">
                                    <button class="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center space-x-1">
                                        <span>Details</span>
                                        <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                    </button>
                                </td>
                            </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Quick Actions Card -->
            <div class="glass-card p-6 rounded-2xl flex flex-col">
                <div class="flex items-center space-x-3 mb-6">
                    <i data-lucide="zap" class="w-5 h-5 text-amber-400"></i>
                    <h2 class="text-lg font-bold text-white">Quick Operations</h2>
                </div>
                <div class="grid grid-cols-1 gap-3">
                    <a href="issue_book.php" class="p-4 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-900/40 text-center font-bold flex items-center justify-center space-x-2">
                        <i data-lucide="plus-circle" class="w-5 h-5"></i>
                        <span>New Issue</span>
                    </a>
                    <a href="return_book.php" class="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-center font-bold flex items-center justify-center space-x-2 border border-slate-700">
                        <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                        <span>Return Book</span>
                    </a>
                    <a href="students.php" class="p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all text-center font-bold flex items-center justify-center space-x-2 text-slate-400">
                        <i data-lucide="user-plus" class="w-5 h-5"></i>
                        <span>Add Student</span>
                    </a>
                </div>
                <div class="mt-8 pt-8 border-t border-slate-800 text-center">
                    <p class="text-xs text-slate-500 font-medium">Smart Library Management System</p>
                    <p class="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">© 2026 Developed with ❤️</p>
                </div>
            </div>
        </div>

    </main>
</div>

<script>
    // Refresh Icons after dynamic changes if needed
    lucide.createIcons();
</script>
</body>
</html>