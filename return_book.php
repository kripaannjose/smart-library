<?php 
session_start();
include "db_connect.php"; 

if(!isset($_SESSION['admin'])){
    header("Location: login.php");
    exit();
}

if(isset($_POST['return'])) {
    $issue_id = mysqli_real_escape_string($conn, $_POST['issue_id']);
    $today = date("Y-m-d");

    // Get issue details
    $result = $conn->query("SELECT * FROM book_issue WHERE issue_id = '$issue_id'");
    $data = $result->fetch_assoc();

    $issue_date = $data['issue_date'];
    $book_id = $data['book_id'];

    // Calculate fine (₹10 per day after 7 days)
    $diff = strtotime($today) - strtotime($issue_date);
    $days = floor($diff / (60*60*24));
    $fine = 0;

    if($days > 7) {
        $fine = ($days - 7) * 10;
    }

    // Update return date
    $sql_update = "UPDATE book_issue SET return_date = '$today' WHERE issue_id = '$issue_id'";
    
    if($conn->query($sql_update)) {
        // Increase available copies
        $conn->query("UPDATE book SET available_copies = available_copies + 1 WHERE book_id = '$book_id'");
        $success = "Book Returned Successfully! " . ($fine > 0 ? "Fine Collected: ₹$fine" : "No fine imposed.");
    } else {
        $error = "Error: " . $conn->error;
    }
}

$page_title = "Return Book";
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
                <h1 class="text-3xl font-bold text-white tracking-tight">Return Processing</h1>
                <p class="text-slate-400 font-medium">Manage book returns and fine collections</p>
            </div>
        </header>

        <div class="max-w-2xl mx-auto">
            <div class="glass-card rounded-3xl p-8 shadow-2xl">
                <div class="flex items-center space-x-3 mb-8">
                    <div class="bg-rose-600/20 p-3 rounded-xl">
                        <i data-lucide="book-down" class="w-6 h-6 text-rose-500"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-white">Process Return</h2>
                        <p class="text-slate-500 text-sm">Select an active issue to mark as returned</p>
                    </div>
                </div>

                <?php if(isset($success)): ?>
                <div class="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-3">
                    <i data-lucide="check-circle" class="w-5 h-5"></i>
                    <span class="font-medium"><?php echo $success; ?></span>
                </div>
                <?php endif; ?>

                <form method="POST" class="space-y-6">
                    <div>
                        <label class="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Active Issues</label>
                        <div class="relative">
                            <i data-lucide="clipboard-list" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"></i>
                            <select name="issue_id" required class="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition appearance-none cursor-pointer">
                                <option value="">Select issued book...</option>
                                <?php
                                $issues = $conn->query("
                                    SELECT bi.issue_id, s.name, b.title, bi.issue_date 
                                    FROM book_issue bi
                                    JOIN student s ON bi.student_id = s.student_id
                                    JOIN book b ON bi.book_id = b.book_id
                                    WHERE bi.return_date IS NULL
                                    ORDER BY bi.issue_date DESC
                                ");

                                while($i = $issues->fetch_assoc()) {
                                    $date = date('d M', strtotime($i['issue_date']));
                                    echo "<option value='{$i['issue_id']}'>{$i['name']} : {$i['title']} (Issued: {$date})</option>";
                                }
                                ?>
                            </select>
                            <i data-lucide="chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none"></i>
                        </div>
                    </div>

                    <div class="bg-slate-900/30 border border-slate-800 rounded-2xl p-4 flex items-start space-x-3">
                        <i data-lucide="info" class="w-5 h-5 text-blue-500 mt-1"></i>
                        <p class="text-xs text-slate-500 leading-relaxed">
                            <span class="text-slate-300 font-bold block mb-1">Fine Policy</span>
                            Returns after 7 days will incur a fine of <span class="text-blue-400 font-bold">₹10 per day</span>. The system will automatically calculate the amount upon submission.
                        </p>
                    </div>

                    <div class="pt-4">
                        <button type="submit" name="return" class="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-900/40 transform active:scale-[0.98] flex items-center justify-center space-x-2">
                            <span>Finalize Return</span>
                            <i data-lucide="check-square" class="w-6 h-6"></i>
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