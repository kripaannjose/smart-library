# Smart Library Management System v2.0
**Full-Stack React + Node.js (Express) Edition**

This project is a modern migration of the PHP-based Smart Library system. It maintains the core logic and database schema while upgrading the frontend to React (Vite) and the backend to a Node.js REST API.

---

## 📁 Project Structure

```text
smart_library_v2/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (Sidebar, etc.)
│   │   ├── pages/          # Full page views (Dashboard, Books, etc.)
│   │   ├── App.jsx         # Routing & Main Entry
│   │   └── api.js          # Axios API configuration
│   └── ...
└── server/                 # Node.js Backend (Express)
    ├── controllers/        # Business logic for all endpoints
    ├── routes/             # API route definitions
    ├── db.js               # MySQL Connection Pool (mysql2)
    ├── index.js            # Express server initialization
    └── .env                # Database credentials
```

---

## 🚀 Setup Instructions

### 1. Database Configuration
Ensure your MySQL server is running (e.g., via XAMPP) and the `smart_library_db` database exists with the standard schema.

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 🔑 Default Credentials
- **Username:** `admin`
- **Password:** `1234`

---

## ✨ Key Features
- **Dashboard:** Real-time stats cards and latest arrivals via REST APIs.
- **RESTful Architecture:** Clear separation of concerns (MVC) on the backend.
- **Modern UI:** Glassmorphic design with Tailwind CSS and Lucide Icons.
- **Responsive:** Optimized for different viewport sizes.
- **State Management:** Integrated React hooks for dynamic data fetching.
