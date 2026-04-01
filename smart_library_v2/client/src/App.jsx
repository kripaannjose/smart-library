import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Books from './pages/Books';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import IssuedList from './pages/IssuedList';
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';

const PrivateRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userType = localStorage.getItem('userType');
  
  if (!isAdmin && !userType) return <Navigate to="/student-login" />;

  return (
    <div className="flex bg-background min-h-screen overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-64 p-2 relative z-0">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
        <Route path="/books" element={<PrivateRoute><Books /></PrivateRoute>} />
        <Route path="/issue" element={<PrivateRoute><IssueBook /></PrivateRoute>} />
        <Route path="/return" element={<PrivateRoute><ReturnBook /></PrivateRoute>} />
        <Route path="/issued-list" element={<PrivateRoute><IssuedList /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
