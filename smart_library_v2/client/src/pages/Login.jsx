import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { BookCopy, User, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', formData);
      if (res.data.success) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unauthorized Access Attempt');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 blur-[120px] rounded-full"></div>
      <div className="w-full max-w-md animate-float relative z-10">
        <div className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary-500 p-4 rounded-2xl shadow-lg shadow-primary-500/20 mb-4">
              <BookCopy className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">SmartLib</h1>
            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Admin Authorization Hub</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                <input type="text" placeholder="Enter admin username" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl py-4 flex pl-12 pr-4 outline-none focus:border-primary-500 transition-all font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                <input type="password" placeholder="••••••••" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl py-4 flex pl-12 pr-4 outline-none focus:border-primary-500 transition-all font-medium" />
              </div>
            </div>
            {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs font-bold flex items-center space-x-2"><AlertCircle className="w-4 h-4" /><span>{error}</span></div>}
            <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-primary-500/10 flex items-center justify-center space-x-2 uppercase tracking-widest text-sm">
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
          <footer className="mt-8 pt-8 border-t border-white/5 text-center uppercase text-[10px] text-slate-600 font-bold tracking-widest">Smart Library v2.4.0</footer>
        </div>
      </div>
    </div>
  );
};
export default Login;
