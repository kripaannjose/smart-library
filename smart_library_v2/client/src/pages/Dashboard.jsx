import React, { useEffect, useState } from 'react';
import api from '../api';
import { 
  Users2, Book, BookmarkCheck, Sparkles, Zap, PlusCircle, RefreshCw, 
  UserPlus, Bell, Search, MessageSquare, Plus, ChevronRight, 
  History, Clock, AlertTriangle, CheckCircle, CreditCard, ShieldCheck, Ticket
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isAdmin) {
          const res = await api.get('/dashboard/stats');
          setStats(res.data);
        } else {
          const res = await api.get(`/student/dashboard/${userData.student_id}`);
          setStats(res.data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, [isAdmin, userData.student_id]);

  if (loading) return <div className="p-20 text-emerald-500 font-bold animate-pulse text-xs uppercase tracking-widest">Accessing Registry...</div>;

  const getBookCover = (title) => {
    const t = title.toLowerCase();
    if (t.includes('machine learning')) return '/covers/machine_learning.png';
    if (t.includes('python')) return '/covers/python_basics.png';
    if (t.includes('database')) return '/covers/database_systems.png';
    if (t.includes('network')) return '/covers/computer_networks.png';
    if (t.includes('electronics')) return '/covers/digital_electronics.png';
    if (t.includes('operating system')) return '/covers/operating_system.png';
    if (t.includes('data structure')) return '/covers/data_structures.png';
    if (t.includes('c programming')) return '/covers/c_programming.png';
    return null;
  };

  return (
    <div className="flex-1 p-8 animate-fade-in text-slate-200">
      {/* Search Header */}
      <header className="flex items-center justify-between mb-10">
        <div>
           <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
             {isAdmin ? 'Operation Center' : 'Student Hub'}
           </h1>
           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{isAdmin ? 'Full Library Administration' : `Welcome, ${userData.name}`}</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
            <div className="text-right">
              <p className="text-xs font-black text-white uppercase tracking-tighter">{isAdmin ? 'Admin' : userData.name}</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none mt-0.5">{isAdmin ? 'Systems Root' : `${userData.department} Dept`}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-black border border-white/10 shadow-lg shadow-emerald-900/40">
              {isAdmin ? 'AD' : userData.name[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {isAdmin ? (
        <AdminView stats={stats} getBookCover={getBookCover} />
      ) : (
        <StudentView stats={stats} />
      )}
    </div>
  );
};

const AdminView = ({ stats, getBookCover }) => (
  <>
    <div className="grid grid-cols-3 gap-6 mb-10">
      <StatCard icon={Users2} color="emerald" label="Total Students" value={stats.students} growth="+2.4%" />
      <StatCard icon={Book} color="blue" label="Catalog Size" value={stats.books} status="Optimized" />
      <StatCard icon={BookmarkCheck} color="indigo" label="Active Issues" value={stats.issued} growth="+5.2%" />
    </div>

    <section className="mb-10">
      <div className="flex items-center space-x-3 mb-6">
        <Zap className="w-5 h-5 text-emerald-500" />
        <h2 className="text-lg font-bold text-white uppercase tracking-tighter">Quick System Operations</h2>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <ActionCard to="/issue" icon={PlusCircle} label="Issue Asset" sub="Quick distribution" />
        <ActionCard to="/return" icon={RefreshCw} label="Process Return" sub="Transaction closure" />
        <ActionCard to="/students" icon={UserPlus} label="New Member" sub="Identity enrollment" />
        <ActionCard to="/books" icon={Plus} label="Update Inventory" sub="Catalog expansion" />
      </div>
    </section>

    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-white uppercase tracking-tighter">Recent Arrivals</h2>
            </div>
         </div>
         <div className="grid grid-cols-4 gap-4">
            {stats.latest.map(b => (
                <div key={b.book_id} className="bg-white/5 p-4 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all text-center group">
                    <div className="aspect-[3/4] bg-slate-800 rounded-2xl mb-4 overflow-hidden shadow-xl border border-white/5 relative">
                       {getBookCover(b.title) ? (
                         <img src={getBookCover(b.title)} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       ) : (
                         <div className="w-full h-full p-4 flex items-center justify-center">
                            <p className="text-[10px] font-black uppercase text-slate-600 line-clamp-3">{b.title}</p>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h3 className="font-bold text-white text-xs truncate uppercase tracking-tighter">{b.title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{b.author}</p>
                </div>
            ))}
         </div>
      </div>
      <div>
         <div className="flex items-center space-x-2 mb-6">
            <History className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-white uppercase tracking-tighter">Live Audit Log</h2>
         </div>
         <div className="bg-white/5 rounded-3xl border border-white/5 divide-y divide-white/5">
            {stats.logs && stats.logs.length > 0 ? stats.logs.map((log, idx) => (
               <ActivityItem 
                  key={idx} 
                  icon={ChevronRight} 
                  user={log.user} 
                  action={log.action} 
                  item={log.item} 
                  time={log.time} 
               />
            )) : (
              <p className="text-center py-10 text-[10px] font-black text-slate-700 uppercase tracking-widest">No recent activity</p>
            )}
         </div>
      </div>
    </div>
  </>
);

const StudentView = ({ stats }) => (
  <div className="grid grid-cols-12 gap-8">
    <div className="col-span-12 lg:col-span-8 flex flex-col space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <StatCard icon={BookmarkCheck} color="emerald" label="Books Held" value={stats.active_count} status="On Time" />
        <StatCard icon={CreditCard} color="rose" label="Pending Fine" value={`₹ ${stats.total_fine}`} growth="Clear" />
        <StatCard icon={Ticket} color="indigo" label="Reservations" value={stats.reservations.length} status="Waitlist" />
      </div>

      <div className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white uppercase tracking-tighter">Assigned Assets (Issued)</h2>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Real-time status</span>
        </div>
        <div className="p-4">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        <th className="px-4 py-3">Book Identity</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Current Fine</th>
                        <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {stats.issued_books.map(i => (
                        <tr key={i.issue_id} className="group">
                            <td className="px-4 py-4">
                                <div className="flex flex-col">
                                    <span className="font-bold text-white uppercase tracking-tighter text-xs">{i.title}</span>
                                    <span className="text-[9px] text-slate-600 font-bold uppercase">{i.author}</span>
                                </div>
                            </td>
                            <td className="px-4 py-4 text-xs font-mono text-slate-400">
                                {new Date(i.issue_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4">
                               <span className={`text-xs font-black ${i.fine > 0 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
                                 ₹ {i.fine || 0}
                               </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${i.return_date ? 'border-slate-800 text-slate-600 bg-slate-900/50' : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'}`}>
                                    {i.return_date ? 'Returned' : 'In Possession'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
    <div className="col-span-12 lg:col-span-4 flex flex-col space-y-8">
       <div className="bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
         <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 transition-transform group-hover:rotate-0">
           <ShieldCheck className="w-48 h-48" />
         </div>
         <h3 className="text-xl font-bold text-white uppercase tracking-tighter mb-2">Reservation System</h3>
         <p className="text-xs text-slate-500 font-medium mb-6">Need a copy? Secure it now for 24h collection. Multiple reservations allowed per cycle.</p>
         <Link to="/books" className="bg-emerald-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest inline-flex items-center space-x-2">
            <span>Explore Catalog</span>
            <ChevronRight className="w-4 h-4" />
         </Link>
       </div>

       <div className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h2 className="text-lg font-bold text-white uppercase tracking-tighter">My Booking Queue</h2>
          </div>
          <div className="p-4 space-y-4">
            {stats.reservations.length > 0 ? stats.reservations.map(r => (
               <div key={r.reservation_id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group">
                 <div>
                   <p className="font-bold text-white uppercase text-[10px] tracking-tight truncate w-32">{r.title}</p>
                   <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">{r.status}</p>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/20">Pending</span>
                 </div>
               </div>
            )) : <p className="text-center py-10 text-[10px] font-black text-slate-700 uppercase tracking-widest">Queue Empty</p>}
          </div>
       </div>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, color, label, value, growth, status }) => (
  <div className="bg-surface/30 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group transition-all duration-500 hover:border-white/10">
    <div className={`absolute -right-4 -bottom-4 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700`}>
      <Icon className={`w-32 h-32 text-${color}-500`} />
    </div>
    <div className="flex items-center justify-between mb-8">
      <div className={`p-3 bg-slate-800 rounded-2xl border border-white/5`}>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
      {growth && <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">{growth}</span>}
      {status && <span className="text-[10px] font-black text-slate-600 bg-white/5 px-3 py-1 rounded-full border border-white/5">{status}</span>}
    </div>
    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
  </div>
);

const ActionCard = ({ to, icon: Icon, label, sub }) => (
  <Link to={to} className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-emerald-500 hover:border-emerald-500 group transition-all transform active:scale-[0.98] text-center flex flex-col items-center shadow-lg">
    <div className="bg-slate-800 p-4 rounded-2xl mb-4 group-hover:bg-black transition-colors">
      <Icon className="w-6 h-6 text-emerald-500 group-hover:text-emerald-500 transition-colors" />
    </div>
    <h3 className="font-bold text-white text-sm mb-1 uppercase tracking-tighter group-hover:text-black">{label}</h3>
    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest group-hover:text-black/60">{sub}</p>
  </Link>
);

const ActivityItem = ({ icon: Icon, user, action, item, time }) => (
  <div className="p-4 flex items-center justify-between group cursor-pointer hover:bg-white/5">
    <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-emerald-500/20">
            <Icon className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] text-slate-400 leading-tight">
                <span className="font-black text-white">{user}</span> {action} <span className="italic font-bold text-emerald-500">{item}</span>
            </p>
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">{time}</p>
        </div>
    </div>
  </div>
);

export default Dashboard;
