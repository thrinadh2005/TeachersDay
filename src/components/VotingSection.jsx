import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Search, 
  Check, 
  Star, 
  Lightbulb, 
  Smile, 
  Cpu, 
  Send, 
  ShieldCheck, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  Lock,
  UserCheck
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti, fireTrophyConfetti } from '../utils/confetti';

export const VotingSection = ({ initialRollNumber = '', setActiveTab }) => {
  const [voterRoll, setVoterRoll] = useState(initialRollNumber || '');
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('starFaculty');
  const [selectedVotes, setSelectedVotes] = useState({});
  const [teacherSearch, setTeacherSearch] = useState('');
  
  // Anonymous Story State
  const [storyTeacher, setStoryTeacher] = useState('');
  const [storyText, setStoryText] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [checkingVoterStatus, setCheckingVoterStatus] = useState(false);

  const categoryIcons = {
    inspiring: <Trophy className="w-4 h-4 text-amber-400" />,
    explainer: <Lightbulb className="w-4 h-4 text-yellow-400" />,
    friendly: <Smile className="w-4 h-4 text-emerald-400" />,
    techGuru: <Cpu className="w-4 h-4 text-cyan-400" />,
    starFaculty: <Star className="w-4 h-4 text-pink-400" />
  };

  useEffect(() => {
    if (initialRollNumber) {
      setVoterRoll(initialRollNumber.toUpperCase());
    }
  }, [initialRollNumber]);

  useEffect(() => {
    Promise.all([api.getTeachers(), api.getCategories()])
      .then(([teachRes, catRes]) => {
        if (teachRes.success && teachRes.data) {
          setTeachers(teachRes.data);
          if (teachRes.data.length > 0 && !storyTeacher) {
            setStoryTeacher(teachRes.data[0].name);
          }
        }
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
          if (catRes.data.length > 0) {
            setActiveCategory(catRes.data[0].id);
          }
        }
      })
      .catch(err => console.error('Failed to load voting data:', err));
  }, []);

  // Check if roll number has already voted (Zero choice exposure)
  useEffect(() => {
    const cleanRoll = voterRoll.trim().toUpperCase();
    if (cleanRoll.length >= 6) {
      setCheckingVoterStatus(true);
      api.getVoterHistory(cleanRoll)
        .then(res => {
          if (res.success && res.data && res.data.hasVoted) {
            setAlreadyVoted(true);
            setError(`Student with JNTU Roll Number "${cleanRoll}" has already cast their secret ballot. Each student is permitted to vote only ONCE.`);
          } else {
            setAlreadyVoted(false);
            setError(null);
          }
        })
        .catch(err => console.warn('Voter status check note:', err))
        .finally(() => setCheckingVoterStatus(false));
    } else {
      setAlreadyVoted(false);
    }
  }, [voterRoll]);

  const handleSelectVote = (teacherId) => {
    if (alreadyVoted) return;
    setSelectedVotes(prev => ({
      ...prev,
      [activeCategory]: teacherId
    }));
    setError(null);
  };

  const handleSubmitVotesAndStories = async (e) => {
    if (e) e.preventDefault();
    const cleanRoll = voterRoll.trim().toUpperCase();

    if (!cleanRoll) {
      setError('Please enter your JNTU Roll Number to cast your confidential votes.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (alreadyVoted) {
      setError(`Student with JNTU Roll Number "${cleanRoll}" has already voted. Multiple voting is strictly prohibited.`);
      return;
    }

    const voteEntries = Object.entries(selectedVotes);
    const hasVotes = voteEntries.length > 0;
    const hasStory = storyText.trim().length > 0;

    if (!hasVotes && !hasStory) {
      setError('Please select at least one faculty award vote or share a crazy faculty story.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Submit Ballot in one atomic batch
      if (hasVotes) {
        const ballotResult = await api.submitBallot(cleanRoll, selectedVotes);
        if (!ballotResult.success) {
          throw new Error(ballotResult.error || 'Failed to submit secret ballot.');
        }
      }

      // 2. Submit Anonymous Story if present
      let storyResult = null;
      if (hasStory) {
        storyResult = await api.submitAnonymousAnecdote({
          teacherName: storyTeacher || 'CSE Faculty',
          anecdote: storyText.trim(),
          rollNumber: cleanRoll,
          section: 'CSE'
        });
      }

      setAlreadyVoted(true);
      setSuccessData({
        voterRoll: cleanRoll,
        votesCount: voteEntries.length,
        hasStory: hasStory,
        storyTeacher: storyTeacher
      });

      fireFestiveConfetti();
      fireTrophyConfetti();
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      setError(err.message || 'Something went wrong while recording your votes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(t => {
    const q = teacherSearch.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.designation.toLowerCase().includes(q);
  });

  const currentCategoryObj = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <section id="voting-section" className="relative py-6 sm:py-12 max-w-4xl mx-auto px-4 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black uppercase tracking-wider shadow-md">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>CSE Department 2026 • Secret Ballot Superlative Voting</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
          {successData ? (
            <>Votes & Stories <span className="gradient-text-festive">Recorded!</span></>
          ) : (
            <>Vote Faculty & <span className="gradient-text-gold">Crazy Stories</span></>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {successData 
            ? 'Your confidential faculty award votes and anonymous memories have been securely recorded!'
            : 'Cast your confidential votes across 5 superlative categories and share 100% anonymous crazy classroom moments!'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-3 text-rose-200 text-xs sm:text-sm animate-shake shadow-lg">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 1: VOTING & STORY FORM (ACTIVE) */}
      {/* ========================================================================= */}
      {!successData ? (
        <div className="space-y-8">
          
          {/* Roll Number Voter Identity Bar */}
          <div className="glass-card-glow rounded-3xl p-5 sm:p-7 border border-white/10 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Voter Authentication</h3>
                  <p className="text-[11px] text-slate-400">Enter your JNTU Roll Number to cast your 1-vote-per-category ballot.</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shrink-0">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Secret Ballot</span>
              </div>
            </div>
            <div className="max-w-md">
              <input
                type="text"
                required
                maxLength={20}
                placeholder="Enter JNTU Roll Number (e.g. 24341A0502)"
                value={voterRoll}
                onChange={(e) => setVoterRoll(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950/90 border border-white/15 text-white placeholder-slate-500 text-sm sm:text-base font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
              />
              {checkingVoterStatus && (
                <p className="text-[11px] text-amber-400 mt-1.5 animate-pulse">Checking voter record status...</p>
              )}
            </div>
          </div>

          {/* If Roll Number Has Already Voted - Show Sealed Ballot Screen */}
          {alreadyVoted ? (
            <div className="glass-card-glow rounded-3xl p-8 sm:p-10 border border-amber-500/40 shadow-2xl text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confidential Ballot Sealed</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Vote Already Cast for {voterRoll}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  You have already submitted your secret ballot for Teachers' Day 2026. As per GMRIT CSE official regulations:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300"><strong className="text-white">Single-Vote Rule:</strong> Each JNTU Roll Number is strictly permitted to vote only once.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300"><strong className="text-white">Strict Secrecy:</strong> Your votes are 100% confidential and hidden from all other users.</span>
                </div>
              </div>

              {/* Still allow submitting crazy stories if they haven't submitted */}
              <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
                Want to share an anonymous crazy memory about faculty? You can submit it below!
              </div>
            </div>
          ) : (
            /* Category Voting Box */
            <div className="glass-card-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Select Faculty for 5 Award Superlatives</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 ml-10">Choose a faculty member for each award category below.</p>
                </div>

                <span className="text-xs text-amber-400 font-bold px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 self-start sm:self-auto">
                  Categories Voted: {Object.keys(selectedVotes).length} / {categories.length}
                </span>
              </div>

              {/* Category Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {categories.map(cat => {
                  const isSelected = activeCategory === cat.id;
                  const hasVoted = !!selectedVotes[cat.id];

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between touch-press ${
                        isSelected
                          ? 'bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-amber-500/20 border-amber-400 shadow-md scale-[1.02]'
                          : 'glass-card border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1 rounded-md bg-slate-950/60">
                          {categoryIcons[cat.id] || <Trophy className="w-3.5 h-3.5" />}
                        </div>
                        {hasVoted && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {cat.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {cat.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Category Banner */}
              {currentCategoryObj && (
                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-400/20 text-amber-300 rounded-lg">
                      {categoryIcons[currentCategoryObj.id] || <Trophy className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-[10px] text-amber-400 font-bold uppercase">Active Award Category</div>
                      <div className="text-sm font-bold text-white">{currentCategoryObj.title}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">1 vote allowed</span>
                </div>
              )}

              {/* Faculty Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search faculty name or designation..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Faculty Selection Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {filteredTeachers.map(teacher => {
                  const isSelectedForActiveCat = selectedVotes[activeCategory] === teacher.id;

                  return (
                    <div
                      key={teacher.id}
                      onClick={() => handleSelectVote(teacher.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelectedForActiveCat
                          ? 'bg-purple-600/30 border-amber-400 shadow-lg scale-[1.02]'
                          : 'glass-card border-white/5 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{teacher.name}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{teacher.designation}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelectedForActiveCat ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-white/20 hover:border-purple-400"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 100% Anonymous "Crazy Things About Faculty" Section */}
          <div className="glass-card-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-pink-400" />
                    <span>"Crazy Things About Faculty" (100% Anonymous)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Share unforgettable lab moments, hilarious classroom dialogues, or teacher tributes.</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Anonymous</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Select Faculty Member <span className="text-xs font-normal text-slate-400">(Optional)</span>
                </label>
                <select
                  value={storyTeacher}
                  onChange={(e) => setStoryTeacher(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400 transition-colors"
                >
                  <option value="All CSE Faculty Members" className="bg-slate-900 text-white">
                    🌟 All CSE Faculty Members
                  </option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.name} className="bg-slate-900 text-white">
                      {t.name} ({t.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Share Your Crazy Memory / Funny Incident</span>
                  <span className="text-[11px] font-normal text-emerald-400">Your name will never be displayed</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Share a funny lab incident, Sir's famous dialogue in Section A/B/C/D, or an unforgettable CSE lecture moment..."
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-400 transition-colors resize-none shadow-inner"
                />
              </div>
            </div>

          </div>

          {/* Grand Submit Button */}
          <div className="pt-2">
            <button
              onClick={handleSubmitVotesAndStories}
              disabled={loading || (alreadyVoted && !storyText.trim())}
              className={`w-full py-4 sm:py-5 px-8 rounded-2xl font-black text-base sm:text-lg shadow-2xl transition-all flex items-center justify-center gap-3 touch-press ${
                alreadyVoted && !storyText.trim()
                  ? 'bg-slate-800 text-slate-500 border border-white/10 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-500/30 hover:scale-[1.01]'
              }`}
            >
              {alreadyVoted ? (
                storyText.trim() ? (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{loading ? 'Submitting Story...' : 'Submit Anonymous Faculty Story'}</span>
                    <Sparkles className="w-5 h-5 text-pink-300" />
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-amber-400" />
                    <span>Secret Ballot Already Submitted for {voterRoll}</span>
                  </>
                )
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{loading ? 'Submitting Ballot...' : 'Submit Secret Votes & Anonymous Stories'}</span>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* CASE 2: SUCCESS CELEBRATION SCREEN */
        /* ========================================================================= */
        <div className="glass-card-glow rounded-3xl p-8 sm:p-12 border border-purple-500/40 shadow-2xl text-center space-y-6 max-w-2xl mx-auto animate-fadeIn">
          
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-xl shadow-purple-500/25 animate-float-soft text-white">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest bg-purple-400/20 text-purple-300 px-3.5 py-1 rounded-full border border-purple-300/30 inline-block mb-2">
              CONFIDENTIAL VOTES RECORDED
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
              Thank You, Voter ({successData.voterRoll})!
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto mt-2">
              Your secret ballot votes across <span className="text-amber-400 font-bold">{successData.votesCount} categories</span> have been securely saved.
              {successData.hasStory && ' Your anonymous classroom story has been submitted for moderation!'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/10 text-left space-y-3 text-xs shadow-inner">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">JNTU Roll Number</span>
              <span className="text-amber-300 font-mono font-bold">{successData.voterRoll}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Award Categories Voted</span>
              <span className="text-emerald-400 font-bold">{successData.votesCount} Categories</span>
            </div>
            {successData.hasStory && (
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Crazy Story Submitted</span>
                <span className="text-pink-400 font-bold">100% Anonymous (About {successData.storyTeacher})</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Award Ceremony</span>
              <span className="text-slate-200 font-medium">Grand Winner Reveal Live on Stage!</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('vote');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 hover:scale-105 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>View Award Reveal Ceremony</span>
            </button>

            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('memories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Read Crazy Stories Wall</span>
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
