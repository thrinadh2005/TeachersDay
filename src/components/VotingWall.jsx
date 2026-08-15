import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Search, 
  Lock, 
  Eye, 
  Star, 
  Crown,
  Medal,
  Award,
  Smile, 
  Lightbulb, 
  Cpu,
  Code,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { api } from '../utils/api';
import { fireTrophyConfetti, fireFestiveConfetti } from '../utils/confetti';

export const VotingWall = ({ setActiveTab }) => {
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('starFaculty');
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalVotesCount, setTotalVotesCount] = useState(0);

  const categoryIcons = {
    inspiring: <Trophy className="w-5 h-5 text-amber-400" />,
    explainer: <Lightbulb className="w-5 h-5 text-yellow-400" />,
    friendly: <Smile className="w-5 h-5 text-emerald-400" />,
    techGuru: <Cpu className="w-5 h-5 text-cyan-400" />,
    starFaculty: <Star className="w-5 h-5 text-pink-400" />
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [teachRes, catRes] = await Promise.all([
        api.getTeachers(),
        api.getCategories()
      ]);

      if (teachRes.success) {
        setTeachers(teachRes.data);
        setIsRevealed(teachRes.isRevealed || false);

        if (teachRes.isRevealed) {
          fireTrophyConfetti();
        }
      }

      if (catRes.success) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !activeCategory) {
          setActiveCategory(catRes.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentCategoryObj = categories.find(c => c.id === activeCategory) || categories[0];

  // If revealed, calculate category winners
  const getCategoryLeader = (catId) => {
    if (!teachers || teachers.length === 0) return null;
    const sorted = [...teachers].sort((a, b) => {
      const vA = (a.categoryVotes && a.categoryVotes[catId]) || 0;
      const vB = (b.categoryVotes && b.categoryVotes[catId]) || 0;
      return vB - vA;
    });
    return sorted[0];
  };

  const filteredTeachers = teachers.filter(t => {
    const q = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.designation.toLowerCase().includes(q);
  });

  const sortedByCategory = [...filteredTeachers].sort((a, b) => {
    if (!isRevealed) return 0;
    const vA = (a.categoryVotes && a.categoryVotes[activeCategory]) || 0;
    const vB = (b.categoryVotes && b.categoryVotes[activeCategory]) || 0;
    return vB - vA;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black uppercase tracking-wider shadow-md">
          <Code className="w-4 h-4 text-amber-400" />
          <span>CSE Department 2026 • Grand Superlative Awards</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
          {isRevealed ? (
            <>🏆 The Winners: <span className="gradient-text-gold">Faculty Award Results</span></>
          ) : (
            <>🏆 CSE Faculty Awards: <span className="gradient-text-festive">Grand Reveal Ceremony</span></>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-300">
          {isRevealed 
            ? 'The secret ballot votes from CSE 2nd, 3rd & 4th year students (Sections A-D) are officially revealed!'
            : 'All votes cast during student registrations are held in strict confidence. Official winners across 5 award categories will be announced live on stage!'}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* CASE 1: SECRET BALLOT MODE ACTIVE (LOCKED UNTIL REVEALED) */}
      {/* ========================================================================= */}
      {!isRevealed && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Grand Locked Vault Banner */}
          <div className="glass-card-glow rounded-3xl p-8 sm:p-12 border border-amber-500/40 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
            
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 mb-6">
              <Lock className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>Secret Ballot Mode Active • Results Sealed</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-3">
              Confidential Voting in Progress
            </h2>

            <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed mb-6">
              Every vote cast by CSE 2nd, 3rd & 4th Year students during registration is held under strict secret ballot. The grand winners will be crowned live on stage during the Teachers' Day Celebration ceremony!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Ceremony: September 5, 2026</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Venue: CSE Quadrangle Stage</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span>5 Grand Award Superlatives</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <span className="text-xs text-slate-400">Haven't registered or cast your secret vote yet?</span>
              <button
                onClick={() => {
                  if (setActiveTab) setActiveTab('register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
              >
                <span>Register & Vote Faculty Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Award Categories Showcase Cards */}
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">The 5 Superlative Award Titles</h3>
              <p className="text-xs text-slate-400">Categories competing for student honors</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((cat, idx) => (
                <div 
                  key={cat.id}
                  className="glass-card rounded-2xl p-5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 hover:scale-[1.02]"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center mb-3 border border-white/10">
                      {categoryIcons[cat.id] || <Trophy className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Award #{idx + 1}</span>
                    <h4 className="text-sm font-bold text-white mt-1">{cat.title}</h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{cat.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>33 Nominees</span>
                    <span className="text-amber-400 font-bold">🔒 Secret</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nominated Faculty Roster Preview */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">33 Nominated CSE Faculty Members</h3>
                <p className="text-xs text-slate-400">All present professors and assistant professors across Sections A-D</p>
              </div>

              <div className="w-full sm:w-64 relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredTeachers.map(teacher => (
                <div 
                  key={teacher.id}
                  className="glass-card rounded-2xl p-3 text-center border border-white/10 hover:border-purple-500/30 transition-all flex flex-col items-center justify-between"
                >
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/15 shadow-md mb-2"
                    onError={(e) => { e.target.src = '/faculty/Dr_A_V_Ramana.jpg'; }}
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white line-clamp-1">{teacher.name}</h5>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{teacher.designation}</p>
                    <span className="text-[9px] text-purple-300 font-medium">{teacher.degree}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 2: REVEALED GRAND RESULTS CEREMONY */}
      {/* ========================================================================= */}
      {isRevealed && (
        <div className="space-y-10 animate-fadeIn">
          
          {/* Winners Podium Section */}
          <div>
            <div className="text-center mb-8">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                🎉 Official Award Winners
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-display mt-2">
                2026 CSE Faculty Award Champions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, idx) => {
                const winner = getCategoryLeader(cat.id);
                if (!winner) return null;

                const votes = winner.categoryVotes?.[cat.id] || 0;

                return (
                  <div
                    key={cat.id}
                    className="glass-card-glow rounded-3xl p-6 border border-amber-400/40 shadow-2xl relative flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-transform text-center"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" /> Award #{idx + 1}
                      </span>
                      <div className="p-2 rounded-xl bg-slate-950/80 border border-white/10">
                        {categoryIcons[cat.id] || <Trophy className="w-4 h-4" />}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs text-amber-400 font-bold uppercase tracking-wide">
                        {cat.title}
                      </div>

                      <img
                        src={winner.avatar}
                        alt={winner.name}
                        className="w-24 h-24 mx-auto rounded-2xl object-cover border-2 border-amber-400 shadow-xl shadow-amber-500/20"
                        onError={(e) => { e.target.src = '/faculty/Dr_A_V_Ramana.jpg'; }}
                      />

                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                          {winner.name}
                        </h3>
                        <p className="text-xs text-purple-300 font-medium mt-0.5">
                          {winner.designation}
                        </p>
                        <p className="text-[11px] text-slate-400 font-normal">
                          {winner.degree}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Total Category Votes:</span>
                      <span className="font-mono font-black text-amber-400 text-sm">
                        {votes} {votes === 1 ? 'Vote' : 'Votes'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Category Leaderboard */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Full Category Standings</h3>
                <p className="text-xs text-slate-400">Select an award category to view all faculty standings</p>
              </div>

              <div className="w-full sm:w-64 relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Category Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {categories.map(cat => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`p-3 rounded-xl text-left border transition-all text-xs font-bold ${
                      isSelected
                        ? 'bg-purple-600/30 border-amber-400 text-white shadow-md'
                        : 'glass-card border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>

            {/* Leaderboard Table */}
            <div className="rounded-2xl border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-white/10">
                  <tr>
                    <th className="p-3.5">Rank</th>
                    <th className="p-3.5">Faculty Member</th>
                    <th className="p-3.5">Designation</th>
                    <th className="p-3.5 text-right font-black text-amber-400">Category Votes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sortedByCategory.map((t, idx) => {
                    const catVotes = (t.categoryVotes && t.categoryVotes[activeCategory]) || 0;

                    return (
                      <tr key={t.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-bold font-mono">
                          {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-lg object-cover border border-white/15" />
                            <span className="font-bold text-white">{t.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-400">{t.designation}</td>
                        <td className="p-3.5 text-right font-mono font-black text-amber-400 text-sm">{catVotes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </section>
  );
};
