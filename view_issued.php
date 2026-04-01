<?php 
session_start();
include "db_connect.php"; 

if(!isset($_SESSION['admin'])){
    header("Location: login.php");
    exit();
}

$page_title = "Active Issues";
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
                <h1 class="text-3xl font-bold text-white tracking-tight">Active Transactions</h1>
                <p class="text-slate-400 font-medium">Monitor all currently issued books and overdue items</p>
            </div>
        </header>

        <!-- Issued Table -->
        <div class="glass-card rounded-2xl overflow-hidden">
            <div class="p-0">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-slate-800/30 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                            <th class="px-6 py-4">Student</th>
                            <th class="px-6 py-4">Book Title</th>
                            <th class="px-6 py-4">Issue Date</th>
                            <th class="px-6 py-4">Days Elapsed</th>
                            <th class="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/50">
                        <?php
                        // Using the new 'active_issues_view' which internally uses JOIN
                        $result = $conn->query("SELECT * FROM active_issues_view ORDER BY issue_date DESC");

                        if($result && $result->num_rows > 0):
                            while($row = $result->fetch_assoc()):
                                $today = strtotime(date("Y-m-d"));
                                $issue_date = strtotime($row['issue_date']);
                                $diff = $today - $issue_date;
                                $days = $row['days_elapsed']; // Use pre-calculated field from the VIEW
                                
                                $is_overdue = $days > 7;
                        ?>
                        <tr class="hover:bg-slate-400/5 transition">
                            <td class="px-6 py-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-700">
                                        ID:<?php echo $row['student_id']; ?>
                                    </div>
                                    <span class="font-semibold text-slate-200"><?php echo $row['name']; ?></span>
                                </div>
                            </td>
                            <td class="px-6 py-4 font-medium text-slate-400">
                                <?php echo $row['title']; ?>
                            </td>
                            <td class="px-6 py-4 text-slate-500 text-sm">
                                <?php echo date('d M, Y', $issue_date); ?>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-sm font-bold <?php echo $is_overdue ? 'text-rose-400' : 'text-blue-400'; ?>">
                                    <?php echo $days; ?> Days
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex justify-center">
                                    <?php if($is_overdue): ?>
                                        <span class="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[10px] font-bold border border-rose-500/20 uppercase tracking-widest flex items-center space-x-1">
                                            <i data-lucide="alert-triangle" class="w-3 h-3"></i>
                                            <span>Overdue</span>
                                        </span>
                                    <?php else: ?>
                                        <span class="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold border border-emerald-500/20 uppercase tracking-widest flex items-center space-x-1">
                                            <i data-lucide="clock" class="w-3 h-3"></i>
                                            <span>On Time</span>
                                        </span>
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                        <?php 
                            endwhile;
                        else:
                        ?>
                            <tr>
                                <td colspan="5" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center">
                                        <i data-lucide="inbox" class="w-12 h-12 text-slate-700 mb-4"></i>
                                        <p class="text-slate-500 font-medium">No books are currently issued</p>
                                    </div>
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

    </main>
</div>

<script>
    lucide.createIcons();
</script>
</body>
</html>