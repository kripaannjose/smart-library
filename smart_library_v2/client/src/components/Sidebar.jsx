import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LibraryBig, 
  LayoutDashboard, 
  Users, 
  BookCopy, 
  PackageMinus, 
  PackagePlus, 
  ClipboardList, 
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    navigate('/student-login');
  };

  const adminMenu = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/students', icon: Users, label: 'Manage Students' },
    { to: '/books', icon: BookCopy, label: 'Manage Books' },
    { to: '/issue', icon: PackageMinus, label: 'Issue/Return' },
    { to: '/issued-list', icon: ClipboardList, label: 'Issued Books' },
  ];

  const studentMenu = [
    { to: '/', icon: LayoutDashboard, label: 'My Dashboard' },
    { to: '/books', icon: BookCopy, label: 'Browse Library' },
    { to: '/issued-list', icon: ClipboardList, label: 'My History' },
  ];

  const menuItems = isAdmin ? adminMenu : studentMenu;

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col p-4 bg-background border-r border-white/5 z-[50]">
      {/* Brand */}
      <div className="mb-10 flex items-center space-x-3 px-4 py-6">
        <div className="bg-primary-500 p-2 rounded-xl text-black">
          <BookCopy className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xl font-bold text-white tracking-tight">SmartLib</span>
          <p className="text-[10px] text-primary-500/80 font-bold uppercase tracking-widest">{isAdmin ? 'LMS v2.4.0 (Admin)' : 'Student Portal'}</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary-500 font-bold text-black shadow-lg shadow-primary-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}

        {isAdmin && (
           <>
            <div className="pt-8 pb-3 px-4">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Preferences</span>
            </div>
            <NavLink to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5"><Settings className="w-5 h-5" /><span className="text-sm font-medium">Settings</span></NavLink>
            <NavLink to="/support" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5"><HelpCircle className="w-5 h-5" /><span className="text-sm font-medium">Support</span></NavLink>
           </>
        )}
      </nav>

      <div className="mt-auto px-4 pb-4">
        <div className="bg-surface/50 p-4 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Storage Usage</p>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-2">
            <div className="bg-primary-500 h-full w-[68%]"></div>
          </div>
          <p className="text-[10px] text-primary-500 font-bold">68% of 50GB used</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full mt-4 flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
