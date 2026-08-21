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
  MapPin,
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

  const categoryIcons = {
    inspiring: <Trophy className="w-5 h-5 text-amber-500" />,
    explainer: <Lightbulb className="w-5 h-5 text-yellow-500" />,
    friendly: <Smile className="w-5 h-5 text-emerald-500" />,
    techGuru: <Cpu className="w-5 h-5 text-cyan-500" />,
    starFaculty: <Star className="w-5 h-5 text-pink-500" />
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

  const getCategoryWinners = (catId) => {
    if (!teachers || teachers.length === 0) return { winners: [], maxVotes: 0, isTie: false };
    let maxVotes = 0;
    teachers.forEach(t => {
      const v = (t.categoryVotes && t.categoryVotes[catId]) || 0;
      if (v > maxVotes) maxVotes = v;
    });

    if (maxVotes === 0) {
      return { winners: [], maxVotes: 0, isTie: false };
    }

    const winners = teachers.filter(t => ((t.categoryVotes && t.categoryVotes[catId]) || 0) === maxVotes);
    return {
      winners,
      maxVotes,
      isTie: winners.length > 1
    };
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

  // Calculate competition ranking with tie handling
  let currentRank = 1;
  const rankedTeachers = sortedByCategory.map((t, idx) => {
    const catVotes = (t.categoryVotes && t.categoryVotes[activeCategory]) || 0;
    if (idx > 0) {
      const prevVotes = (sortedByCategory[idx - 1].categoryVotes && sortedByCategory[idx - 1].categoryVotes[activeCategory]) || 0;
      if (catVotes < prevVotes) {
        currentRank = idx + 1;
      }
    }
    const isTied = sortedByCategory.some((other, oIdx) => oIdx !== idx && ((other.categoryVotes && other.categoryVotes[activeCategory]) || 0) === catVotes && catVotes > 0);
    return {
      ...t,
      rank: currentRank,
      catVotes,
      isTied
    };
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-black uppercase tracking-wider shadow-sm">
          <Code className="w-4 h-4 text-amber-500" />
          <span>CSE Department 2026 • Grand Superlative Awards</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-tight">
          {isRevealed ? (
            <>🏆 The Winners: <span className="gradient-text-gold">Faculty Award Results</span></>
          ) : (
            <>🏆 CSE Faculty Awards: <span className="gradient-text-festive">Grand Reveal Ceremony</span></>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
          {isRevealed 
            ? 'The secret ballot votes from CSE 2nd, 3rd & 4th year students (Sections A-D) are officially revealed!'
            : 'All votes cast during student registrations are held in strict confidence. Official winners across 5 award categories will be announced live on stage!'}
        </p>

        {/* Tie Rule Explainer Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-sm">
          <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Official Rule: If two or more faculty receive equal top votes, all of them will be crowned as Joint Winners!</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASE 1: SECRET BALLOT MODE ACTIVE (LOCKED UNTIL REVEALED) */}
      {/* ========================================================================= */}
      {!isRevealed && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Grand Locked Vault Banner */}
          <div className="glass-card-glow rounded-3xl p-8 sm:p-12 border-2 border-amber-400 text-center relative overflow-hidden shadow-2xl bg-white dark:bg-slate-950">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 mb-6">
              <Lock className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Secret Ballot Mode Active • Results Sealed</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display mb-3">
              Confidential Voting in Progress
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto leading-relaxed mb-6 font-medium">
              Every vote cast by CSE 2nd, 3rd & 4th Year students across all 5 superlative categories is held under strict confidential secret ballot. The grand winners (including joint winners on ties) will be crowned live on stage!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Ceremony: September 5, 2026</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Venue: CSE Seminar Hall</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                <Crown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span>5 Grand Award Superlatives (Ties Shared)</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Haven't cast your secret vote across all 5 categories?</span>
              <button
                onClick={() => {
                  if (setActiveTab) setActiveTab('vote-faculty');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black shadow-lg shadow-purple-500/25 transition-all hover:scale-105 touch-press"
              >
                <span>Vote All 5 Categories (Secret Ballot)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Award Categories Showcase Cards */}
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">The 5 Superlative Award Titles</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">All 5 categories must be voted • Ties result in joint winners</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((cat, idx) => (
                <div 
                  key={cat.id}
                  className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 hover:scale-[1.02] shadow-sm bg-white dark:bg-slate-950"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-3 border border-slate-200 dark:border-white/10 shadow-sm">
                      {categoryIcons[cat.id] || <Trophy className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">Award #{idx + 1}</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{cat.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{cat.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{teachers.length || 39} Nominees</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">🔒 Secret</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nominated Faculty Roster Preview */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{teachers.length || 39} Nominated Faculty Members</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">33 CSE Department Professors + 6 Allied Department Professors teaching 2nd, 3rd & 4th Year CSE</p>
              </div>

              <div className="w-full sm:w-64 relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredTeachers.map(teacher => (
                <div 
                  key={teacher.id}
                  className="glass-card rounded-2xl p-3 text-center border border-slate-200 dark:border-white/10 hover:border-purple-500/30 transition-all flex flex-col items-center justify-between shadow-sm bg-white dark:bg-slate-950"
                >
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-white/15 shadow-md mb-2"
                    onError={(e) => { e.target.src = '/faculty/Dr_A_V_Ramana.jpg'; }}
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{teacher.name}</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{teacher.designation}</p>
                    <span className="text-[9px] text-purple-700 dark:text-purple-300 font-semibold">{teacher.degree}</span>
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
            <div className="text-center mb-8 space-y-2">
              <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
                🎉 Official Award Winners & Joint Champions
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display">
                2026 CSE Faculty Award Champions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Official rule applied: Whenever two or more faculty receive equal highest votes, all of them are crowned Joint Winners!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, idx) => {
                const { winners, maxVotes, isTie } = getCategoryWinners(cat.id);

                if (winners.length === 0 || maxVotes === 0) {
                  return (
                    <div
                      key={cat.id}
                      className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-white/10 relative flex flex-col justify-between space-y-4 text-center bg-white dark:bg-slate-950"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-wider">
                          Award #{idx + 1}
                        </span>
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                          {categoryIcons[cat.id] || <Trophy className="w-4 h-4" />}
                        </div>
                      </div>
                      <div className="py-8 space-y-2">
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wide">
                          {cat.title}
                        </div>
                        <p className="text-xs text-slate-400">No votes recorded yet</p>
                      </div>
                    </div>
                  );
                }

                // Multiple Tied Winners (Joint Champions)
                if (isTie) {
                  return (
                    <div
                      key={cat.id}
                      className="glass-card-glow rounded-3xl p-6 border-2 border-amber-400 shadow-2xl relative flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-transform text-center bg-gradient-to-b from-amber-500/10 via-purple-500/5 to-white dark:to-slate-950"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 border border-amber-500 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                          <Crown className="w-3.5 h-3.5 text-slate-950" /> ⚡ Joint Winners ({winners.length} Tied)
                        </span>
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                          {categoryIcons[cat.id] || <Trophy className="w-4 h-4" />}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-black uppercase tracking-wide">
                          {cat.title}
                        </div>

                        {/* Co-Champions Announcement Banner */}
                        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] font-bold">
                          🎉 Tie Detected: All {winners.length} faculty are crowned Co-Winners!
                        </div>

                        {/* Tied Winners List / Avatars */}
                        <div className={`grid ${winners.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} gap-3 pt-1`}>
                          {winners.map(w => (
                            <div key={w.id} className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-400/40 shadow-sm flex flex-col items-center space-y-2">
                              <div className="relative">
                                <img
                                  src={w.avatar}
                                  alt={w.name}
                                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                                  onError={(e) => { e.target.src = '/faculty/Dr_A_V_Ramana.jpg'; }}
                                />
                                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full text-[10px] shadow">
                                  👑
                                </span>
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                                  {w.name}
                                </h4>
                                <p className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold line-clamp-1">
                                  {w.designation}
                                </p>
                                <p className="text-[9px] text-slate-500 dark:text-slate-400">
                                  {w.degree}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-400/30 flex items-center justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-bold">Equal Winning Votes:</span>
                        <span className="font-mono font-black text-amber-700 dark:text-amber-400 text-sm">
                          {maxVotes} Votes Each
                        </span>
                      </div>
                    </div>
                  );
                }

                // Single Winner Card
                const winner = winners[0];
                return (
                  <div
                    key={cat.id}
                    className="glass-card-glow rounded-3xl p-6 border-2 border-amber-400 shadow-2xl relative flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-transform text-center bg-white dark:bg-slate-950"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                      <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-500" /> Award #{idx + 1}
                      </span>
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                        {categoryIcons[cat.id] || <Trophy className="w-4 h-4" />}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wide">
                        {cat.title}
                      </div>

                      <img
                        src={winner.avatar}
                        alt={winner.name}
                        className="w-24 h-24 mx-auto rounded-2xl object-cover border-2 border-amber-400 shadow-xl shadow-amber-500/20"
                        onError={(e) => { e.target.src = '/faculty/Dr_A_V_Ramana.jpg'; }}
                      />

                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                          {winner.name}
                        </h3>
                        <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold mt-0.5">
                          {winner.designation}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                          {winner.degree}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-bold">Total Category Votes:</span>
                      <span className="font-mono font-black text-amber-700 dark:text-amber-400 text-sm">
                        {maxVotes} {maxVotes === 1 ? 'Vote' : 'Votes'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Category Leaderboard */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 space-y-6 bg-white dark:bg-slate-950">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Full Category Standings</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select an award category to view all faculty standings (Ties share equal rank)</p>
              </div>

              <div className="w-full sm:w-64 relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:outline-none focus:border-purple-500"
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
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>

            {/* Leaderboard Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="p-3.5">Rank</th>
                    <th className="p-3.5">Faculty Member</th>
                    <th className="p-3.5">Designation</th>
                    <th className="p-3.5 text-right font-black text-amber-700 dark:text-amber-400">Category Votes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {rankedTeachers.map((t) => {
                    const isTopRank = t.rank === 1 && t.catVotes > 0;

                    return (
                      <tr 
                        key={t.id} 
                        className={`transition-colors ${
                          isTopRank 
                            ? 'bg-amber-500/10 dark:bg-amber-500/15 font-semibold' 
                            : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <td className="p-3.5 font-bold font-mono text-slate-900 dark:text-white">
                          {t.rank === 1 && t.catVotes > 0 ? (
                            <span className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                              🥇 #1 {t.isTied ? '(Tie)' : ''}
                            </span>
                          ) : t.rank === 2 && t.catVotes > 0 ? (
                            <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                              🥈 #2 {t.isTied ? '(Tie)' : ''}
                            </span>
                          ) : t.rank === 3 && t.catVotes > 0 ? (
                            <span className="px-2 py-0.5 rounded-lg bg-amber-700/20 text-amber-900 dark:text-amber-400">
                              🥉 #3 {t.isTied ? '(Tie)' : ''}
                            </span>
                          ) : (
                            <span>#{t.rank} {t.isTied && t.catVotes > 0 ? '(Tie)' : ''}</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img 
                              src={t.avatar} 
                              alt={t.name} 
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-white/15" 
                              onError={(e) => { e.target.src = '/faculty/Dr_A_V_Ramana.jpg'; }}
                            />
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">{t.name}</span>
                              {isTopRank && (
                                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 shadow-sm">
                                  👑 {t.isTied ? 'Joint Winner' : 'Winner'}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-500 dark:text-slate-400">{t.designation}</td>
                        <td className="p-3.5 text-right font-mono font-black text-amber-700 dark:text-amber-400 text-sm">{t.catVotes}</td>
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
