import React, { useEffect, useState } from 'react';
import api from '../api';
import { BookUp, Users, BookOpen, ChevronDown, ArrowRightCircle, CheckCircle, AlertCircle } from 'lucide-react';

const IssueBook = () => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ student_id: '', book_id: '' });
  const [msg, setMsg] = useState({ success: '', error: '' });

  useEffect(() => {
    api.get('/students').then(res => setStudents(res.data));
    api.get('/books').then(res => setBooks(res.data.filter(b => b.available_copies > 0)));
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/issue', formData);
      setMsg({ success: res.data.message, error: '' });
      setFormData({ student_id: '', book_id: '' });
      api.get('/books').then(res => setBooks(res.data.filter(b => b.available_copies > 0)));
    } catch (err) { setMsg({ success: '', error: err.response?.data?.error || 'Issue Transaction Failed' }); }
  };

  return (
    <div className="flex-1 ml-64 p-8 animate-fade-in text-slate-200 uppercase tracking-tighter">
      <header className="flex items-center justify-between mb-10"><h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Issue Transaction</h1></header>
      <div className="max-w-2xl mx-auto"><div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-600/10 transition-all duration-700"></div>
        <div className="relative z-10"><div className="flex items-center space-x-3 mb-8"><div className="bg-blue-600/20 p-3 rounded-xl"><BookUp className="w-6 h-6 text-blue-500" /></div><div><h2 className="text-xl font-bold text-white">Create New Issue</h2><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Authorization Required</p></div></div>
        {msg.success && <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-3 text-xs font-bold uppercase tracking-widest"><CheckCircle className="w-5 h-5" /><span>{msg.success}</span></div>}
        {msg.error && <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center space-x-3 text-xs font-bold uppercase tracking-widest"><AlertCircle className="w-5 h-5" /><span>{msg.error}</span></div>}
        <form onSubmit={handleIssue} className="space-y-6">
          <div className="relative"><Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none" /><select value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 flex pl-12 pr-4 outline-none focus:border-blue-500 appearance-none font-medium uppercase text-sm"><option value="">Choose Student Member...</option>{students.map(s => <option key={s.student_id} value={s.student_id}>{s.name} (#{s.student_id})</option>)}</select></div>
          <div className="relative"><BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none" /><select value={formData.book_id} onChange={(e) => setFormData({...formData, book_id: e.target.value})} required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 flex pl-12 pr-4 outline-none focus:border-blue-500 appearance-none font-medium uppercase text-sm"><option value="">Verify Available Knowledge...</option>{books.map(b => <option key={b.book_id} value={b.book_id}>{b.title} (Qty: {b.available_copies})</option>)}</select></div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center space-x-2 transform active:scale-[0.98] uppercase text-xs tracking-[0.2em] font-bold italic"><span>Authorize Deployment</span><ArrowRightCircle className="w-6 h-6" /></button>
        </form></div></div></div>
    </div>
  );
};
export default IssueBook;
