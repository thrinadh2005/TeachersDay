import React, { useState, useEffect } from 'react';
import { 
  Smile, 
  Quote, 
  CheckCircle2, 
  Search, 
  MessageSquare, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti } from '../utils/confetti';

export const FunWall = ({ setActiveTab }) => {
  const [anecdotes, setAnecdotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAnecdotes = async () => {
    try {
      setLoading(true);
      const res = await api.getAnecdotes();
      if (res.success && Array.isArray(res.data)) {
        setAnecdotes(res.data);
      }
    } catch (err) {
      console.error('Failed to load anecdotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnecdotes();
  }, []);

  const filteredAnecdotes = anecdotes.filter(a => {
    const query = search.toLowerCase();
    const anecdoteMatch = (a.anecdote || '').toLowerCase().includes(query);
    const teacherMatch = (a.teacherName || '').toLowerCase().includes(query);
    return anecdoteMatch || teacherMatch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/25 text-xs font-black uppercase tracking-wider shadow-md">
          <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
          <span>CSE Department • Campus Memories & Anecdotes</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
          "Crazy Things About <span className="gradient-text-festive">Faculty</span>"
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Unforgettable classroom dialogues, hilarious lab incidents, and heartwarming memories shared by CSE students — moderated and approved by Admin.
        </p>

        {/* Action Button & Privacy Guarantee */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              fireFestiveConfetti();
              if (setActiveTab) setActiveTab('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-pink-500/25 transition-all hover:scale-105"
          >
            <CreditCard className="w-4 h-4" />
            <span>Share a Story & Contribute Your Part (₹50)</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Confidential • Student Details Hidden</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by teacher name, classroom incident, or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-pink-500 shadow-inner"
        />
      </div>

      {/* ANECDOTES GRID */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          Loading approved faculty memories...
        </div>
      ) : filteredAnecdotes.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl p-8 max-w-lg mx-auto border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-pink-500/15 text-pink-400 flex items-center justify-center mx-auto">
            <Smile className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">No Approved Stories Yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Stories submitted by students are currently being reviewed by Admin. Share a funny memory during your registration!
            </p>
          </div>
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all"
          >
            Contribute a Story (₹50)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnecdotes.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-6 border border-white/10 hover:border-pink-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-pink-500/10 group relative"
            >
              <div>
                {/* Top: Teacher dedicated & Approved Badge */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
                      <Quote className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        About Faculty
                      </span>
                      <h4 className="text-sm font-black text-amber-300 font-display leading-tight">
                        {item.teacherName}
                      </h4>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Approved
                  </span>
                </div>

                {/* Anecdote Story Text */}
                <p className="text-sm text-slate-200 leading-relaxed italic font-normal">
                  "{item.anecdote}"
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
};
