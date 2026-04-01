<?php
session_start();
include "db_connect.php";

if(!isset($_SESSION['admin'])){
    header("Location: login.php");
    exit();
}

$page_title = "Manage Students";
include "includes/header.php";

$search = "";
if(isset($_GET['search'])){
    $search = $_GET['search'];
    $result = $conn->query("SELECT * FROM student WHERE name LIKE '%$search%' OR department LIKE '%$search%' OR student_id LIKE '%$search%'");
} else {
    $result = $conn->query("SELECT * FROM student ORDER BY student_id DESC");
}
?>

<div class="flex">
    <!-- Sidebar -->
    <?php include "includes/sidebar.php"; ?>

    <!-- Main Content -->
    <main class="flex-1 ml-64 p-8 animate-fade-in">
        
        <!-- Top Bar -->
        <header class="flex items-center justify-between mb-10">
            <div>
                <h1 class="text-3xl font-bold text-white tracking-tight">Student Directory</h1>
                <p class="text-slate-400 font-medium">Manage and monitor library members</p>
            </div>
            <div class="flex items-center space-x-4">
                <form action="" method="GET" class="relative">
                    <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
                    <input type="text" name="search" value="<?php echo $search; ?>" placeholder="Search students..." 
                        class="bg-slate-800/50 border border-slate-700 text-sm text-white rounded-full py-2 pl-10 pr-4 outline-none focus:border-blue-500 transition-all w-64 text-slate-300">
                </form>
                <div class="p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">
                    <i data-lucide="plus" class="w-5 h-5 text-white"></i>
                </div>
            </div>
        </header>

        <!-- Message Alerts -->
        <?php if(isset($_SESSION['success'])): ?>
            <div class="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-3">
                <i data-lucide="check-circle" class="w-5 h-5"></i>
                <span class="font-medium"><?php echo $_SESSION['success']; ?></span>
                <?php unset($_SESSION['success']); ?>
            </div>
        <?php endif; ?>
        <?php if(isset($_SESSION['error'])): ?>
            <div class="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center space-x-3">
                <i data-lucide="alert-circle" class="w-5 h-5"></i>
                <span class="font-medium"><?php echo $_SESSION['error']; ?></span>
                <?php unset($_SESSION['error']); ?>
            </div>
        <?php endif; ?>

        <!-- Students Table -->
        <div class="glass-card rounded-2xl overflow-hidden">
            <div class="p-0">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-slate-800/30 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                            <th class="px-6 py-4">Student ID</th>
                            <th class="px-6 py-4">Full Name</th>
                            <th class="px-6 py-4">Department</th>
                            <th class="px-6 py-4">Phone Number</th>
                            <th class="px-6 py-4">Registration Date</th>
                            <th class="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/50">
                        <?php if($result && $result->num_rows > 0): ?>
                            <?php while($row = $result->fetch_assoc()): ?>
                            <tr class="hover:bg-slate-400/5 transition group">
                                <td class="px-6 py-4">
                                    <span class="bg-slate-800 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold border border-slate-700">
                                        <?php echo $row['student_id']; ?>
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                                            <?php echo strtoupper(substr($row['name'], 0, 1)); ?>
                                        </div>
                                        <span class="font-semibold text-slate-200"><?php echo $row['name']; ?></span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-slate-400 font-medium"><?php echo $row['department']; ?></td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center space-x-2 text-slate-400">
                                        <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                                        <span><?php echo $row['phone']; ?></span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-slate-500 text-sm">
                                    <?php echo date('M d, Y', strtotime($row['join_date'])); ?>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button class="p-2 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-blue-400">
                                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                                        </button>
                                        <a href="delete_student.php?id=<?php echo $row['student_id']; ?>" 
                                           onclick="return confirm('Are you sure you want to delete this student?')"
                                           class="p-2 hover:bg-rose-500/10 rounded-lg transition text-slate-400 hover:text-rose-500">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="6" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center">
                                        <i data-lucide="user-minus" class="w-12 h-12 text-slate-700 mb-4"></i>
                                        <p class="text-slate-500 font-medium">No students found matching your criteria</p>
                                    </div>
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
            <!-- Pagination Placeholder -->
            <div class="p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500 font-medium">
                <div>Showing <?php echo $result ? $result->num_rows : 0; ?> students</div>
                <div class="flex space-x-2">
                    <button class="px-3 py-1 bg-slate-800 rounded border border-slate-700 opacity-50 cursor-not-allowed">Previous</button>
                    <button class="px-3 py-1 bg-slate-800 rounded border border-slate-700 opacity-50 cursor-not-allowed">Next</button>
                </div>
            </div>
        </div>

    </main>
</div>

<script>
    lucide.createIcons();
</script>
</body>
</html>