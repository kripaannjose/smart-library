<?php
session_start();

if(isset($_POST['login'])){
    $user = $_POST['username'];
    $pass = $_POST['password'];

    if($user == "admin" && $pass == "1234"){
        $_SESSION['admin'] = true;
        header("Location: index.php");
        exit();
    } else {
        $error = "Invalid Username or Password!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - SmartLib</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at top left, #1e293b, #0f172a);
            height: 100vh;
            overflow: hidden;
        }
        .glass-login {
            background: rgba(30, 41, 59, 0.4);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .input-focus:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
    </style>
</head>
<body class="flex items-center justify-center p-6">

    <!-- Decorative Elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

    <div class="w-full max-w-md animate-float">
        <div class="glass-login rounded-3xl p-10 relative overflow-hidden">
            
            <!-- Logo Section -->
            <div class="flex flex-col items-center mb-8">
                <div class="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-900/40 mb-4">
                    <i data-lucide="library-big" class="w-8 h-8 text-white"></i>
                </div>
                <h1 class="text-3xl font-bold text-white tracking-tight">SmartLib</h1>
                <p class="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Admin Authorization</p>
            </div>

            <!-- Login Form -->
            <form method="POST" class="space-y-6">
                <div>
                    <label class="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Username</label>
                    <div class="relative">
                        <i data-lucide="user" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"></i>
                        <input type="text" name="username" placeholder="Enter admin username" 
                            class="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all input-focus" required>
                    </div>
                </div>

                <div>
                    <label class="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Password</label>
                    <div class="relative">
                        <i data-lucide="lock" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"></i>
                        <input type="password" name="password" placeholder="Enter password" 
                            class="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all input-focus" required>
                    </div>
                </div>

                <?php if(isset($error)): ?>
                <div class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-sm flex items-center space-x-2">
                    <i data-lucide="alert-circle" class="w-4 h-4"></i>
                    <span><?php echo $error; ?></span>
                </div>
                <?php endif; ?>

                <button name="login" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40 transform active:scale-[0.98] flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <i data-lucide="arrow-right" class="w-5 h-5"></i>
                </button>
            </form>

            <!-- Footer -->
            <div class="mt-8 pt-8 border-t border-slate-800 text-center">
                <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Smart Library System v2.0
                </p>
            </div>
        </div>
        
        <p class="text-center text-slate-600 text-[11px] mt-6 uppercase tracking-[0.2em] font-medium">
            Developed with excellence by Kripa
        </p>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>