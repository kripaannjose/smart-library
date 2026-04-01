<?php
$current_page = basename($_SERVER['PHP_SELF']);
?>
<aside class="sidebar fixed top-0 left-0 h-screen w-64 z-50 flex flex-col p-6 overflow-y-auto">
    <!-- Branding -->
    <div class="mb-10 flex items-center space-x-3 group cursor-pointer">
        <div class="bg-blue-600 p-2.5 rounded-xl group-hover:rotate-12 transition-all shadow-lg shadow-blue-900/40">
            <i data-lucide="library-big" class="w-6 h-6 text-white"></i>
        </div>
        <div>
            <span class="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">SmartLib</span>
            <p class="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Admin Panel</p>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-2">
        <a href="index.php" class="nav-link flex items-center space-x-3 px-4 py-3 rounded-xl <?php echo $current_page == 'index.php' ? 'active' : 'text-slate-400'; ?>">
            <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
            <span class="font-medium">Dashboard</span>
        </a>

        <div class="pt-4 pb-2 px-4">
            <span class="text-[10px] text-slate-600 font-bold tracking-widest uppercase">Database</span>
        </div>

        <a href="students.php" class="nav-link flex items-center space-x-3 px-4 py-3 rounded-xl <?php echo $current_page == 'students.php' ? 'active' : 'text-slate-400'; ?>">
            <i data-lucide="users" class="w-5 h-5"></i>
            <span class="font-medium">Manage Students</span>
        </a>

        <a href="books.php" class="nav-link flex items-center space-x-3 px-4 py-3 rounded-xl <?php echo $current_page == 'books.php' ? 'active' : 'text-slate-400'; ?>">
            <i data-lucide="book-copy" class="w-5 h-5"></i>
            <span class="font-medium">Manage Books</span>
        </a>

        <div class="pt-4 pb-2 px-4">
            <span class="text-[10px] text-slate-600 font-bold tracking-widest uppercase">Operations</span>
        </div>

        <a href="issue_book.php" class="nav-link flex items-center space-x-3 px-4 py-3 rounded-xl <?php echo $current_page == 'issue_book.php' ? 'active' : 'text-slate-400'; ?>">
            <i data-lucide="package-minus" class="w-5 h-5"></i>
            <span class="font-medium">Issue Book</span>
        </a>

        <a href="return_book.php" class="nav-link flex items-center space-x-3 px-4 py-3 rounded-xl <?php echo $current_page == 'return_book.php' ? 'active' : 'text-slate-400'; ?>">
            <i data-lucide="package-plus" class="w-5 h-5"></i>
            <span class="font-medium">Return Book</span>
        </a>

        <a href="view_issued.php" class="nav-link flex items-center space-x-3 px-4 py-3 rounded-xl <?php echo $current_page == 'view_issued.php' ? 'active' : 'text-slate-400'; ?>">
            <i data-lucide="clipboard-list" class="w-5 h-5"></i>
            <span class="font-medium">View Issued</span>
        </a>
    </nav>

    <!-- Profile/Logout -->
    <div class="mt-auto border-t border-slate-800 pt-6">
        <a href="logout.php" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium">
            <i data-lucide="log-out" class="w-5 h-5"></i>
            <span>Logout</span>
        </a>
    </div>
</aside>

<!-- Initialize Lucide Icons -->
<script>
    lucide.createIcons();
</script>
