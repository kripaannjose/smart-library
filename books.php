<?php 
session_start();
include "db_connect.php"; 

if(!isset($_SESSION['admin'])){
    header("Location: login.php");
    exit();
}

# ADD BOOK
if(isset($_POST['add_book'])){
    $title = mysqli_real_escape_string($conn, $_POST['title']);
    $author = mysqli_real_escape_string($conn, $_POST['author']);
    $category = mysqli_real_escape_string($conn, $_POST['category']);
    $total = (int)$_POST['total_copies'];

    $sql = "INSERT INTO book 
            (title, author, category, total_copies, available_copies, added_date) 
            VALUES 
            ('$title', '$author', '$category', '$total', '$total', NOW())";

    if($conn->query($sql)){
        $success = "Book added successfully!";
    } else {
        $error = "Error: " . $conn->error;
    }
}

# DELETE BOOK
if(isset($_GET['delete'])){
    $id = (int)$_GET['delete'];
    $sql = "DELETE FROM book WHERE book_id=$id";
    if($conn->query($sql)){
        header("Location: books.php?msg=deleted");
        exit();
    }
}

# SEARCH
$search = "";
if(isset($_GET['search'])){
    $search = mysqli_real_escape_string($conn, $_GET['search']);
    $books = $conn->query("SELECT * FROM book 
                           WHERE title LIKE '%$search%' 
                           OR author LIKE '%$search%' 
                           OR category LIKE '%$search%'
                           ORDER BY book_id DESC");
} else {
    $books = $conn->query("SELECT * FROM book ORDER BY book_id DESC");
}

if(isset($_GET['msg']) && $_GET['msg'] == 'deleted'){
    $success = "Book deleted successfully!";
}

$page_title = "Manage Library Books";
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
                <h1 class="text-3xl font-bold text-white tracking-tight">Book Catalog</h1>
                <p class="text-slate-400 font-medium">Manage your library's collection of knowledge</p>
            </div>
            <div class="flex items-center space-x-4">
                <form action="" method="GET" class="relative">
                    <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
                    <input type="text" name="search" value="<?php echo $search; ?>" placeholder="Search books..." 
                        class="bg-slate-800/50 border border-slate-700 text-sm text-white rounded-full py-2 pl-10 pr-4 outline-none focus:border-blue-500 transition-all w-64">
                </form>
                <button onclick="document.getElementById('addModal').classList.remove('hidden')" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center space-x-2 shadow-lg shadow-blue-900/40">
                    <i data-lucide="plus-circle" class="w-5 h-5"></i>
                    <span>Add New Book</span>
                </button>
            </div>
        </header>

        <?php if(isset($success)): ?>
        <div class="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-3">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            <span class="font-medium"><?php echo $success; ?></span>
        </div>
        <?php endif; ?>

        <!-- Books Table -->
        <div class="glass-card rounded-2xl overflow-hidden">
            <div class="p-0">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-slate-800/30 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                            <th class="px-6 py-4">Book Details</th>
                            <th class="px-6 py-4">Category</th>
                            <th class="px-6 py-4">Inventory</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/50">
                        <?php if($books && $books->num_rows > 0): ?>
                            <?php while($row = $books->fetch_assoc()): ?>
                            <tr class="hover:bg-slate-400/5 transition group">
                                <td class="px-6 py-4">
                                    <div class="flex items-center space-x-4">
                                        <div class="w-12 h-16 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 group-hover:border-blue-500/50 transition">
                                            <i data-lucide="book-open" class="w-6 h-6 text-slate-600 group-hover:text-blue-500 transition"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-slate-200"><?php echo $row['title']; ?></h4>
                                            <p class="text-sm text-slate-500">By <?php echo $row['author']; ?></p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs font-bold border border-slate-700">
                                        <?php echo $row['category']; ?>
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-sm font-medium">
                                        <span class="text-slate-200"><?php echo $row['available_copies']; ?></span> 
                                        <span class="text-slate-600">/ <?php echo $row['total_copies']; ?></span>
                                    </div>
                                    <!-- Progress bar -->
                                    <div class="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                        <?php 
                                        $percent = ($row['total_copies'] > 0) ? ($row['available_copies'] / $row['total_copies']) * 100 : 0;
                                        $color = $percent < 20 ? 'bg-rose-500' : ($percent < 50 ? 'bg-amber-500' : 'bg-emerald-500');
                                        ?>
                                        <div class="<?php echo $color; ?> h-full" style="width: <?php echo $percent; ?>%"></div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <?php if($row['available_copies'] > 0): ?>
                                        <span class="text-emerald-500 text-xs font-bold flex items-center space-x-1">
                                            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <span>Available</span>
                                        </span>
                                    <?php else: ?>
                                        <span class="text-rose-500 text-xs font-bold flex items-center space-x-1">
                                            <span class="w-2 h-2 bg-rose-500 rounded-full"></span>
                                            <span>Out of Stock</span>
                                        </span>
                                    <?php endif; ?>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button class="p-2 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-blue-400">
                                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                                        </button>
                                        <a href="?delete=<?php echo $row['book_id']; ?>" onclick="return confirm('Delete this book?')" class="p-2 hover:bg-rose-500/10 rounded-lg transition text-slate-400 hover:text-rose-500">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr><td colspan="5" class="px-6 py-12 text-center text-slate-500">No books found</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

    </main>
</div>

<!-- Add Book Modal -->
<div id="addModal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-6">
    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onclick="this.parentElement.classList.add('hidden')"></div>
    <div class="glass-card relative w-full max-w-lg rounded-3xl p-8 animate-fade-in shadow-2xl">
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-white">Add New Book</h2>
            <button onclick="document.getElementById('addModal').classList.add('hidden')" class="text-slate-500 hover:text-white transition">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
        </div>

        <form method="POST" class="space-y-5">
            <div>
                <label class="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Book Title</label>
                <input type="text" name="title" placeholder="e.g. Clean Code" class="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 px-4 outline-none focus:border-blue-500 transition" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Author</label>
                    <input type="text" name="author" placeholder="Robert C. Martin" class="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 px-4 outline-none focus:border-blue-500 transition" required>
                </div>
                <div>
                    <label class="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Category</label>
                    <select name="category" class="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 px-4 outline-none focus:border-blue-500 transition appearance-none" required>
                        <option value="Programming">Programming</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Science">Science</option>
                        <option value="History">History</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Total Copies</label>
                <input type="number" name="total_copies" value="1" min="1" class="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 px-4 outline-none focus:border-blue-500 transition" required>
            </div>
            <button name="add_book" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40">
                Register Book
            </button>
        </form>
    </div>
</div>

<script>
    lucide.createIcons();
</script>
</body>
</html>