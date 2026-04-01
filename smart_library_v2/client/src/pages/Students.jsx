import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, Search, Plus, Trash2, Phone, Mail, Lock, X, CheckCircle, Edit3 } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ name: '', department: 'CSE', phone: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const depts = ['IT', 'CSE', 'MECH', 'CIVIL', 'SF'];

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/students?search=${search}`);
      setStudents(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/students/${selectedId}`, formData);
        setMsg('Profile Updated Successfully!');
      } else {
        await api.post('/students', formData);
        setMsg('Student Registered Successfully!');
      }
      setTimeout(() => { 
        setShowModal(false); 
        setMsg(''); 
        setEditMode(false);
        fetchStudents(); 
      }, 1500);
    } catch (err) { console.error(err); }
  };

  const openEdit = (s) => {
    setFormData({ name: s.name, department: s.department, phone: s.phone, email: s.email, password: s.password });
    setSelectedId(s.student_id);
    setEditMode(true);
    setShowModal(true);
  };

  const openAdd = () => {
    setFormData({ name: '', department: 'CSE', phone: '', email: '', password: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently remove this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="animate-fade-in text-slate-200 uppercase tracking-tighter">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Student Registry</h1>
          <p className="text-slate-500 font-medium font-bold uppercase text-xs tracking-widest">Engineering Division Management</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
            <input type="text" placeholder="Search Identity..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-800/20 border border-white/5 text-sm rounded-full py-2.5 pl-10 pr-4 w-64 focus:border-emerald-500/30 outline-none transition-all font-medium uppercase placeholder:text-slate-700" />
          </div>
          <button onClick={openAdd} className="bg-emerald-500 p-2.5 rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-900/20 transform active:scale-95"><Plus className="w-5 h-5 text-black" /></button>
        </div>
      </header>

      <div className="bg-surface/30 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white/5 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Student Profile</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-center">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.length > 0 ? students.map((s) => (
              <tr key={s.student_id} className="hover:bg-white/5 transition group">
                <td className="px-6 py-4"><span className="bg-slate-800 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold border border-white/5">#{s.student_id}</span></td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-emerald-500 text-sm border border-white/5">{s.name[0]?.toUpperCase()}</div>
                    <div>
                      <span className="font-bold text-slate-200 tracking-wide uppercase block">{s.name}</span>
                      <span className="text-[10px] text-slate-600 font-bold lowercase">{s.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-black text-slate-300 text-xs">{s.department}</td>
                <td className="px-6 py-4 text-slate-500 text-xs font-bold font-mono">{s.phone}</td>
                <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => openEdit(s)} className="p-2 opacity-0 group-hover:opacity-100 transition text-emerald-500 hover:bg-emerald-500/10 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s.student_id)} className="p-2 opacity-0 group-hover:opacity-100 transition text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="py-20 text-center uppercase text-slate-700 font-bold tracking-[0.2em] italic">Database Empty</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/5 relative w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{editMode ? 'Modify Student Info' : 'New Registration'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition"><X className="w-6 h-6" /></button>
            </div>
            {msg && <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-3 text-xs font-medium uppercase"><CheckCircle className="w-5 h-5" /><span>{msg}</span></div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-medium uppercase placeholder:text-slate-700 text-sm text-white" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="bg-slate-950/50 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-emerald-500 appearance-none font-medium text-sm text-white uppercase">
                    {depts.map(d => <option key={d} value={d}>{d} DEPARTMENT</option>)}
                  </select>
                  <input type="text" placeholder="Phone" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-medium text-sm text-white" />
                </div>
                <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-medium text-sm text-white lowercase placeholder:text-slate-700" />
                <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-medium text-sm text-white" />
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black py-4 rounded-2xl transition shadow-lg shadow-emerald-900/10 uppercase text-xs tracking-widest mt-4">
                {editMode ? 'Commit Changes' : 'Initialize Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Students;
