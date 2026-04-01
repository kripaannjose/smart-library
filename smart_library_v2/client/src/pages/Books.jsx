import React, { useEffect, useState } from 'react';
import api from '../api';
import { Book, Search, Plus, Trash2, BookmarkCheck, X, CheckCircle, Ticket, AlertTriangle, ShieldCheck } from 'lucide-react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', category: 'Technology', total_copies: 1 });
  const [msg, setMsg] = useState('');
  
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  const fetchBooks = async () => {
    try {
      const res = await api.get(`/books?search=${search}`);
      setBooks(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', newBook);
      setMsg('Catalog Registry Updated!');
      setNewBook({ title: '', author: '', category: 'Technology', total_copies: 1 });
      setTimeout(() => { setShowModal(false); setMsg(''); fetchBooks(); }, 1500);
    } catch (err) { console.error(err); }
  };

  const handleReserve = async (bookId) => {
    try {
      const res = await api.post('/student/reserve', { student_id: userData.student_id, book_id: bookId });
      alert(res.data.message);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.error || 'Reservation Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this book from catalog?")) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) { console.error(err); }
  };

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
    <div className="animate-fade-in text-slate-200 uppercase tracking-tighter">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Library Catalog</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">{isAdmin ? 'Full Inventory Control' : 'Browse Available Assets'}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
            <input type="text" placeholder="Title/Author..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-800/20 border border-white/5 text-sm rounded-full py-2.5 pl-10 pr-4 w-64 focus:border-emerald-500/30 outline-none transition-all font-medium uppercase placeholder:text-slate-700" />
          </div>
          {isAdmin && <button onClick={() => setShowModal(true)} className="bg-emerald-500 p-2.5 rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-900/20"><Plus className="w-5 h-5 text-black" /></button>}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.length > 0 ? books.map((b) => (
          <div key={b.book_id} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-sm border border-white/5 py-1 px-3 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                {b.category}
            </div>
            
            <div className="mb-6">
                <div className="aspect-[3/4] bg-slate-800 rounded-2xl mb-6 overflow-hidden shadow-xl border border-white/5 relative flex items-center justify-center group-hover:border-emerald-500/20 transition-all">
                    {getBookCover(b.title) ? (
                      <img src={getBookCover(b.title)} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Book className="w-8 h-8 text-emerald-500/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-lg font-bold text-white line-clamp-2 uppercase tracking-tighter leading-tight">{b.title}</h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest italic">{b.author}</p>
            </div>

            <div className="flex flex-col space-y-4">
               <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                 <div>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Availability</p>
                    <p className={`text-sm font-black ${b.available_copies > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {b.available_copies} / {b.total_copies}
                    </p>
                 </div>
                 {b.available_copies > 0 ? <ShieldCheck className="w-5 h-5 text-emerald-500/40" /> : <AlertTriangle className="w-5 h-5 text-rose-500/40" />}
               </div>

               <div className="flex items-center space-x-2">
                 {!isAdmin ? (
                    <button 
                      onClick={() => handleReserve(b.book_id)}
                      disabled={b.available_copies <= 0}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${b.available_copies > 0 ? 'bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                    >
                        <Ticket className="w-4 h-4" />
                        <span>{b.available_copies > 0 ? 'Reserve Copy' : 'Stock Out'}</span>
                    </button>
                 ) : (
                    <button onClick={() => handleDelete(b.book_id)} className="w-full flex items-center justify-center space-x-2 border border-rose-500/20 hover:bg-rose-500/10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-rose-500 transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                        <span>Purge Entry</span>
                    </button>
                 )}
               </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center uppercase text-slate-700 font-black tracking-[0.2em] italic">No Assets Matching Selection</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in shadow-2xl">
          <div className="bg-slate-900 border border-white/5 relative w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Expand Catalog</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition"><X className="w-6 h-6" /></button>
            </div>
            {msg && <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-3 text-xs font-bold uppercase tracking-widest"><CheckCircle className="w-5 h-5" /><span>{msg}</span></div>}
            <form onSubmit={handleAdd} className="space-y-4">
                <input type="text" placeholder="BOOK TITLE" required value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-bold uppercase placeholder:text-slate-700 text-sm text-white" />
                <input type="text" placeholder="AUTHOR NAME" required value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-bold uppercase placeholder:text-slate-700 text-sm text-white" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={newBook.category} onChange={(e) => setNewBook({...newBook, category: e.target.value})} className="bg-slate-950/50 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-emerald-500 appearance-none font-bold uppercase text-sm text-white">
                    <option value="Technology">Technology</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                  <input type="number" placeholder="TOTAL COPIES" required value={newBook.total_copies} onChange={(e) => setNewBook({...newBook, total_copies: parseInt(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-bold text-sm text-white" />
                </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black py-4 rounded-2xl transition shadow-lg shadow-emerald-900/10 uppercase text-xs tracking-widest mt-4">
                Commit Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Books;
