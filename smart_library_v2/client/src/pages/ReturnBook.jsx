import React, { useEffect, useState } from 'react';
import api from '../api';
import { BookDown, ClipboardList, Info, CheckSquare, CheckCircle, AlertCircle } from 'lucide-react';

const ReturnBook = () => {
  const [issues, setIssues] = useState([]);
  const [issueId, setIssueId] = useState('');
  const [msg, setMsg] = useState({ success: '', error: '' });

  const fetchIssues = async () => {
    try { const res = await api.get('/active-issues'); setIssues(res.data); } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchIssues(); }, []);

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/return', { issue_id: issueId });
      setMsg({ success: `${res.data.message} ${res.data.fine > 0 ? `Fine Collected: ₹${res.data.fine}` : 'No Fine Assessment Required'}`, error: '' });
      setIssueId('');
      fetchIssues();
    } catch (err) { setMsg({ success: '', error: err.response?.data?.error || 'Return Process Failed' }); }
  };

  return (
    <div className="flex-1 ml-64 p-8 animate-fade-in text-slate-200 uppercase tracking-tighter">
      <header className="flex items-center justify-between mb-10"><h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Return Transaction</h1></header>
      <div className="max-w-2xl mx-auto"><div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-rose-600/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-rose-600/10 transition-all duration-700"></div>
        <div className="relative z-10"><div className="flex items-center space-x-3 mb-8"><div className="bg-rose-600/20 p-3 rounded-xl text-rose-500"><BookDown className="w-6 h-6" /></div><div><h2 className="text-xl font-bold text-white uppercase tracking-tighter">Process Final Return</h2><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic tracking-[0.2em] underline decoration-blue-500">Inventory Restoration Hub</p></div></div>
        {msg.success && <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-3 text-xs font-bold uppercase tracking-widest"><CheckCircle className="w-5 h-5" /><span>{msg.success}</span></div>}
        <form onSubmit={handleReturn} className="space-y-6">
          <div className="relative"><ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none" /><select value={issueId} onChange={(e) => setIssueId(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 flex pl-12 pr-4 outline-none focus:border-blue-500 appearance-none font-medium uppercase text-sm"><option value="">Search Active Transactions...</option>{issues.map(i => <option key={i.issue_id} value={i.issue_id}>{i.name} : {i.title}</option>)}</select></div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex items-start space-x-3 backdrop-blur-md transition-all group-hover:bg-slate-950"><Info className="w-5 h-5 text-blue-500 mt-0.5" /><p className="text-[10px] text-slate-600 leading-relaxed font-bold tracking-widest uppercase">After 7 days, a fine of <span className="text-blue-400 underline italic">₹10/Day</span> will be assessed by the system automatically upon finalize.</p></div>
          <button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-900/40 transform active:scale-[0.98] flex items-center justify-center space-x-2 uppercase tracking-widest"><span>Execute Restoration</span><CheckSquare className="w-6 h-6" /></button>
        </form></div></div></div>
    </div>
  );
};
export default ReturnBook;
