import React, { useState, useEffect } from 'react';
import { 
  Smile, 
  Quote, 
  CheckCircle2, 
  Search, 
  MessageSquare, 
  ShieldCheck 
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 text-pink-700 dark:text-pink-300 border border-pink-500/25 text-xs font-black uppercase tracking-wider shadow-sm">
          <MessageSquare className="w-3.5 h-3.5 text-pink-500" />
          <span>CSE Department • Campus Memories & Anecdotes</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-tight">
          "Crazy Things About <span className="gradient-text-festive">Faculty</span>"
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          Unforgettable classroom dialogues, hilarious lab incidents, and heartwarming memories shared by CSE students — moderated and approved by Admin.
        </p>

        {/* Action Button & Privacy Guarantee */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              fireFestiveConfetti();
              if (setActiveTab) setActiveTab('vote-faculty');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-pink-500/25 transition-all hover:scale-105 touch-press"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Submit a Crazy Story (100% Anonymous)</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-slate-900/80 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
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
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-white/15 text-xs focus:outline-none focus:border-pink-500 shadow-inner"
        />
      </div>

      {/* ANECDOTES GRID */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Loading approved faculty memories...
        </div>
      ) : filteredAnecdotes.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl p-8 border border-slate-200 dark:border-white/10 max-w-lg mx-auto space-y-4">
          <Smile className="w-12 h-12 mx-auto text-amber-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Stories Found Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Be the first to share an anonymous crazy incident, sir's memorable dialog, or lab memory!
          </p>
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('vote-faculty');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-500 transition-colors"
          >
            Submit Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnecdotes.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-white/10 hover:border-pink-500/40 transition-all flex flex-col justify-between space-y-4 hover:scale-[1.02] shadow-md group bg-white dark:bg-slate-950"
            >
              <div className="space-y-3">
                {/* Header Tag */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                  <span className="text-[11px] font-black text-pink-700 dark:text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-pink-500" />
                    <span>About: {item.teacherName || 'CSE Faculty'}</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ✓ Approved
                  </span>
                </div>

                {/* Anecdote Content */}
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  "{item.anecdote}"
                </p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">🎭 Anonymous CSE Student</span>
                <span className="text-[10px] font-mono">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Festive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
};
