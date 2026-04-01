import React, { useEffect, useState } from 'react';
import api from '../api';
import { 
  ClipboardList, Search, Filter, RefreshCw, 
  CheckCircle, Clock, AlertTriangle, Inbox 
} from 'lucide-react';

const IssuedList = () => {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  const fetchIssues = async () => {
    try {
      const url = isAdmin ? '/active-issues' : `/active-issues?student_id=${userData.student_id}`;
      const res = await api.get(url);
      setIssues(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleReturn = async (issueId) => {
    if (!isAdmin) return;
    try {
      const res = await api.post('/return', { issue_id: issueId });
      alert(res.data.message + (res.data.fine > 0 ? ` Fine calculated: ₹${res.data.fine}` : ''));
      fetchIssues();
    } catch (err) {
      alert(err.response?.data?.error || 'Return failed');
    }
  };

  const filteredIssues = issues.filter(i => {
    if (!isAdmin) return true; // Show all personal rows for student
    const matchesSearch = i.student_name.toLowerCase().includes(search.toLowerCase()) || 
                          i.book_title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in text-slate-200 uppercase tracking-tighter">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
            {isAdmin ? 'Issued Books Registry' : 'My Borrowing History'}
          </h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
            {isAdmin ? 'Global Transaction Monitoring' : 'Personal Asset Track'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
              <input 
                type="text" 
                placeholder="Search Student or Book..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-800/20 border border-white/5 text-sm rounded-full py-2.5 pl-10 pr-4 w-64 focus:border-emerald-500/30 outline-none transition-all font-medium uppercase placeholder:text-slate-700" 
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800/20 border border-white/5 text-xs rounded-xl py-2.5 px-4 outline-none focus:border-emerald-500/30 transition-all font-bold uppercase tracking-widest text-slate-400"
            >
              <option value="All">All Status</option>
              <option value="Issued">Issued</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        )}
      </header>

      <div className="bg-surface/30 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white/5 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] italic">
              <th className="px-6 py-4">Student Profile</th>
              <th className="px-6 py-4">Book Title</th>
              <th className="px-6 py-4">Issue Date</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Status & Fine</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredIssues.length > 0 ? filteredIssues.map((i) => {
              const isIssued = i.status === 'Issued';
              const dueDate = i.due_date ? new Date(i.due_date) : new Date(new Date(i.issue_date).getTime() + 7 * 24 * 60 * 60 * 1000);
              const isOverdue = isIssued && new Date() > dueDate;

              return (
                <tr key={i.issue_id} className="hover:bg-white/5 transition group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 text-[10px] font-black text-emerald-500">
                        {i.student_name[0]?.toUpperCase()}
                      </div>
                      <span className="font-bold text-white tracking-wide uppercase">{i.student_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase italic truncate max-w-[200px]">{i.book_title}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-bold uppercase">{new Date(i.issue_date).toLocaleDateString()}</td>
                  <td className={`px-6 py-4 text-xs font-bold ${isOverdue ? 'text-rose-500' : 'text-slate-500'}`}>{dueDate.toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                       <span className={`px-3 py-1 bg-white/5 rounded-full text-[9px] font-black border inline-block w-fit uppercase tracking-widest mb-1 ${isIssued ? (isOverdue ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5') : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'}`}>
                         {isIssued ? (isOverdue ? 'Overdue' : 'Issued') : 'Returned'}
                       </span>
                       {i.fine > 0 && <span className="text-[10px] font-black text-rose-400">Fine: ₹{i.fine}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isAdmin ? (
                      isIssued ? (
                        <button 
                          onClick={() => handleReturn(i.issue_id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all transform active:scale-95 shadow-lg shadow-emerald-900/40"
                        >
                          Return Book
                        </button>
                      ) : (
                        <span className="text-slate-700 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      )
                    ) : (
                      <span className={`text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-1 ${isIssued ? 'text-blue-500' : 'text-emerald-500'}`}>
                        {isIssued ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        <span>{isIssued ? 'In Possession' : 'Settled'}</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="6" className="py-20 text-center">
                  <Inbox className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-30" />
                  <p className="text-slate-700 font-black uppercase tracking-[0.4em] italic text-[10px]">Registry Empty or Filter Mismatch</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssuedList;
