import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Mic, 
  Smile, 
  Heart, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  IndianRupee,
  CheckCircle2,
  Users,
  Code,
  CreditCard,
  Trophy,
  Check,
  Star,
  Lightbulb,
  Cpu,
  Lock,
  Search
} from 'lucide-react';
import { api } from '../utils/api';
import { PaymentModal } from './PaymentModal';
import { fireFestiveConfetti, fireTrophyConfetti } from '../utils/confetti';

export const SubmissionForm = ({ onSubmissionCompleted }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Details & Survey, 2: Category Voting, 3: Success Screen
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Step 1: Student Information State
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: 'Computer Science & Engineering (CSE)',
    year: '3rd Year',
    section: 'Section A',
    email: '',
    phone: '',
    wantsToSpeak: false, // Optional Yes toggle
    speechTeacher: '',
    speechTopic: '',
    favoriteTeacher: '',
    anecdote: ''
  });

  // Step 2: Category Votes State (categoryId -> teacherId)
  const [selectedVotes, setSelectedVotes] = useState({});
  const [activeCategory, setActiveCategory] = useState('starFaculty');
  const [teacherSearch, setTeacherSearch] = useState('');

  // Step 3: Payment & Completion
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [completedRecord, setCompletedRecord] = useState(null);

  const years = ['2nd Year', '3rd Year', '4th Year'];
  const sections = ['Section A', 'Section B', 'Section C', 'Section D'];

  const categoryIcons = {
    inspiring: <Trophy className="w-4 h-4 text-amber-400" />,
    explainer: <Lightbulb className="w-4 h-4 text-yellow-400" />,
    friendly: <Smile className="w-4 h-4 text-emerald-400" />,
    techGuru: <Cpu className="w-4 h-4 text-cyan-400" />,
    starFaculty: <Star className="w-4 h-4 text-pink-400" />
  };

  useEffect(() => {
    Promise.all([api.getTeachers(), api.getCategories()])
      .then(([teachRes, catRes]) => {
        if (teachRes.success && teachRes.data) {
          setTeachers(teachRes.data);
          if (teachRes.data.length > 0 && !formData.speechTeacher) {
            setFormData(prev => ({ 
              ...prev, 
              speechTeacher: teachRes.data[0].name
            }));
          }
        }
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
          if (catRes.data.length > 0) {
            setActiveCategory(catRes.data[0].id);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Step 1 Validation -> Check Roll Duplicate -> Move to Step 2 (Voting)
  const handleProceedToVoting = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.rollNumber.trim()) {
      setError('Please fill in your Full Name and JNTU Roll Number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const checkRes = await api.checkRegistration(formData.rollNumber.trim());
      if (checkRes.alreadyRegistered) {
        setError(`Student with JNTU Roll Number "${formData.rollNumber.trim().toUpperCase()}" has already registered for Teachers' Day 2026. Duplication is not permitted.`);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Roll check warning:', err);
    }

    setLoading(false);
    setError(null);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Vote Selection handler in Step 2
  const handleSelectVote = (teacherId) => {
    setSelectedVotes(prev => ({
      ...prev,
      [activeCategory]: teacherId
    }));
  };

  // Step 2 -> Open Payment Modal
  const handleProceedToPayment = () => {
    setError(null);
    setShowPaymentModal(true);
  };

  // Step 3 -> Payment Success -> Record Submission & Votes -> Show Completion Screen
  const handlePaymentSuccess = async (paymentDetails) => {
    setShowPaymentModal(false);
    setLoading(true);
    setError(null);

    try {
      // 1. Submit Registration Record
      const payload = {
        name: formData.name.trim(),
        rollNumber: formData.rollNumber.trim().toUpperCase(),
        department: "Computer Science & Engineering (CSE)",
        year: formData.year,
        section: formData.section,
        email: formData.email,
        phone: formData.phone,
        interestedInSpeaking: formData.wantsToSpeak ? 'Yes' : 'No',
        speechTeacher: formData.wantsToSpeak ? formData.speechTeacher : '',
        speechTopic: formData.wantsToSpeak ? formData.speechTopic : '',
        favoriteTeacher: formData.favoriteTeacher,
        anecdote: formData.anecdote,
        paymentStatus: paymentDetails.status || 'verified',
        paymentMethod: paymentDetails.paymentMethod || 'RAZORPAY',
        transactionId: paymentDetails.transactionId || `TXN_${Date.now()}`,
        paymentAmount: paymentDetails.amount || 50,
        amount: paymentDetails.amount || 50
      };

      const response = await api.submitStudentIdea(payload);
      if (!response.success) {
        throw new Error(response.error || 'Failed to record registration.');
      }

      // 2. Submit Secret Category Votes
      const votePromises = Object.entries(selectedVotes).map(([catId, tId]) => {
        return api.voteTeacher(tId, formData.rollNumber.trim().toUpperCase(), catId)
          .catch(err => console.warn(`Vote record note: ${err.message}`));
      });
      await Promise.all(votePromises);

      // 3. Move to Step 3: Success Screen (NO PASS REQUIRED)
      setCompletedRecord({
        ...response.data,
        votesCastCount: Object.keys(selectedVotes).length
      });
      setCurrentStep(3);
      fireFestiveConfetti();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (onSubmissionCompleted) {
        onSubmissionCompleted(response.data);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while recording your registration.');
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
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Visual Stepper Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black uppercase tracking-wider mb-3 shadow-md">
          <Code className="w-4 h-4 text-amber-400" />
          <span>CSE Department Exclusive • 2nd, 3rd & 4th Years (Sections A, B, C, D)</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
          {currentStep === 1 && (
            <>Student Registration & <span className="gradient-text-festive">Celebration Info</span></>
          )}
          {currentStep === 2 && (
            <>Secret Ballot: <span className="gradient-text-gold">Vote CSE Faculty</span></>
          )}
          {currentStep === 3 && (
            <>Registration & Payment <span className="gradient-text-festive">Completed!</span></>
          )}
        </h2>

        {/* 3-Step Progress Bar (Mobile Responsive & Zero Overlap) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 max-w-xl mx-auto mt-5">
          <div className={`p-2 sm:p-3 rounded-2xl border text-center transition-all ${
            currentStep === 1 
              ? 'bg-purple-600/30 border-purple-500 text-white font-bold shadow-md' 
              : currentStep > 1 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-semibold' 
                : 'bg-slate-900/60 border-white/5 text-slate-500'
          }`}>
            <span className="text-[9px] sm:text-[10px] uppercase block font-black">Step 1</span>
            <span className="text-[11px] sm:text-xs truncate block mt-0.5">1. Details</span>
          </div>

          <div className={`p-2 sm:p-3 rounded-2xl border text-center transition-all ${
            currentStep === 2 
              ? 'bg-amber-500/30 border-amber-500 text-white font-bold shadow-md' 
              : currentStep > 2 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-semibold' 
                : 'bg-slate-900/60 border-white/5 text-slate-500'
          }`}>
            <span className="text-[9px] sm:text-[10px] uppercase block font-black">Step 2</span>
            <span className="text-[11px] sm:text-xs truncate block mt-0.5">2. Voting</span>
          </div>

          <div className={`p-2 sm:p-3 rounded-2xl border text-center transition-all ${
            currentStep === 3 
              ? 'bg-emerald-500/30 border-emerald-500 text-white font-bold shadow-md' 
              : 'bg-slate-900/60 border-white/5 text-slate-500'
          }`}>
            <span className="text-[9px] sm:text-[10px] uppercase block font-black">Step 3</span>
            <span className="text-[11px] sm:text-xs truncate block mt-0.5">3. Pay ₹50</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: STUDENT DETAILS & SURVEY */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="glass-card-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl animate-fadeIn">
          <form onSubmit={handleProceedToVoting} className="space-y-8">
            
            {/* 1. Student Information */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Student Information</h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold ml-auto">
                  CSE Department
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Student Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    JNTU Roll Number (Unique ID) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    required
                    placeholder="e.g. 24341A0502"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Year of Study <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors font-medium"
                  >
                    {years.map((yr, idx) => (
                      <option key={idx} value={yr} className="bg-slate-900 text-white">
                        {yr} (CSE)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Section <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors font-medium"
                  >
                    {sections.map((sec, idx) => (
                      <option key={idx} value={sec} className="bg-slate-900 text-white">
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@gmrit.edu.in"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. Stage Speech Interest (Optional - Yes toggle only) */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-amber-400" />
                  Stage Speech Interest <span className="text-xs font-normal text-slate-400">(Optional)</span>
                </h3>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-950/80 border border-white/10 cursor-pointer hover:border-amber-400/40 transition-colors group">
                  <input
                    type="checkbox"
                    name="wantsToSpeak"
                    checked={formData.wantsToSpeak}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-md text-amber-500 bg-slate-900 border-white/20 focus:ring-amber-400 focus:ring-offset-slate-950 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors block">
                      Yes, I am interested in speaking on stage / sharing words about a teacher during the celebration
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      Check this box if you would like a speaking slot during the Teachers' Day ceremony.
                    </span>
                  </div>
                </label>

                {formData.wantsToSpeak && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 mb-1.5">
                        Which Teacher / Faculty would you like to speak about?
                      </label>
                      <select
                        name="speechTeacher"
                        value={formData.speechTeacher}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-400/30 text-white text-sm focus:outline-none focus:border-amber-400"
                      >
                        {teachers.map(t => (
                          <option key={t.id} value={t.name} className="bg-slate-900 text-white">
                            {t.name} ({t.designation})
                          </option>
                        ))}
                        <option value="All CSE Department Faculty" className="bg-slate-900 text-white">
                          🌟 All CSE Department Faculty
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-300 mb-1.5">
                        What would you like to speak / tell about? (Brief Speech Concept)
                      </label>
                      <textarea
                        name="speechTopic"
                        rows={2}
                        placeholder="e.g. Expressing gratitude for lab guidance, sharing a memorable lesson, or a humorous classroom tribute..."
                        value={formData.speechTopic}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-400/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Favorite Teacher & Fun Memories (Optional) */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Smile className="w-4 h-4 text-pink-400" />
                  Favorite Teacher & Fun Memories <span className="text-xs font-normal text-slate-400">(Optional)</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Select Your Favorite CSE Teacher <span className="text-[11px] font-normal text-slate-400">(Optional)</span>
                  </label>
                  <select
                    name="favoriteTeacher"
                    value={formData.favoriteTeacher}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400 transition-colors"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">
                      -- Select a Favorite Teacher (Optional) --
                    </option>
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
                    <span>"Crazy Things About Teachers" (Optional Anecdote)</span>
                    <span className="text-[11px] font-normal text-slate-400">Moderated before publishing</span>
                  </label>
                  <textarea
                    name="anecdote"
                    rows={3}
                    placeholder="Share a funny lab incident, Sir's famous dialogue in Section A/B/C/D, or an unforgettable CSE lecture moment..."
                    value={formData.anecdote}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-400 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Next Button: Go to Step 2 (Voting) */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base shadow-xl shadow-purple-500/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
            >
              <span>Proceed to Faculty Secret Voting (Step 2)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: CATEGORY VOTING */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="glass-card-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">
                  Secret Ballot Active
                </span>
                <span className="text-xs text-purple-300 font-mono">
                  Voter: {formData.name} ({formData.rollNumber})
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Cast Your Confidential Faculty Votes</h3>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Details</span>
            </button>
          </div>

          {/* Category Selector Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Select Award Category:</span>
              <span className="text-xs text-amber-400 font-bold">
                Categories Voted: {Object.keys(selectedVotes).length} / {categories.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {categories.map(cat => {
                const isSelected = activeCategory === cat.id;
                const hasVoted = !!selectedVotes[cat.id];

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
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
                          <Check className="w-3 h-3" /> Done
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
          </div>

          {/* Active Category Description Banner */}
          {currentCategoryObj && (
            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-400/20 text-amber-300 rounded-lg">
                  {categoryIcons[currentCategoryObj.id] || <Trophy className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Voting Category</div>
                  <div className="text-sm font-bold text-white">{currentCategoryObj.title}</div>
                  <div className="text-[11px] text-slate-300">{currentCategoryObj.desc}</div>
                </div>
              </div>

              <div>
                {selectedVotes[currentCategoryObj.id] ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px]">
                    ✓ Choice Selected
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    Tap a teacher below
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Search Box */}
          <div className="max-w-xs relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty..."
              value={teacherSearch}
              onChange={(e) => setTeacherSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Clean Faculty Grid (Zero Captions, Zero Domains) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredTeachers.map((teacher) => {
              const isSelectedForActiveCat = selectedVotes[activeCategory] === teacher.id;

              return (
                <div
                  key={teacher.id}
                  onClick={() => handleSelectVote(teacher.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelectedForActiveCat
                      ? 'bg-purple-600/25 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                      : 'glass-card border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/15 shrink-0"
                      onError={(e) => { e.target.src = '/faculty/Dr_A_V_Ramana.jpg'; }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white leading-snug">{teacher.name}</h4>
                      <div className="text-[11px] text-purple-300">{teacher.designation}</div>
                      <div className="text-[10px] text-slate-400">{teacher.degree}</div>
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

          {/* Proceed to Payment Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              <span className="text-white font-bold">Mandatory ₹50 Celebration Contribution</span>
              <p className="text-[11px]">Proceed to secure Razorpay checkout to confirm your registration.</p>
            </div>

            <button
              onClick={handleProceedToPayment}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Confirm & Pay ₹50 (Step 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: SUCCESS CONFIRMATION (NO PASS NEEDED) */}
      {/* ========================================================================= */}
      {currentStep === 3 && completedRecord && (
        <div className="glass-card-glow rounded-3xl p-8 sm:p-12 border border-emerald-500/30 shadow-2xl text-center space-y-6 animate-fadeIn max-w-2xl mx-auto">
          
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/25">
            <CheckCircle2 className="w-12 h-12 text-slate-950" />
          </div>

          <div>
            <span className="text-xs font-black uppercase text-emerald-400 tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Registration & Payment Completed
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display mt-3">
              Thank You, {completedRecord.name}!
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto mt-2">
              Your registration and <span className="text-amber-400 font-bold">₹{completedRecord.payment?.amount || 50} contribution</span> for Teachers' Day 2026 have been successfully recorded.
            </p>
          </div>

          {/* Summary Details Card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">JNTU Roll Number</span>
              <span className="text-white font-mono font-bold">{completedRecord.rollNumber}</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Year & Section</span>
              <span className="text-white font-semibold">{completedRecord.year} • {completedRecord.section}</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Contribution Amount</span>
              <span className="text-amber-400 font-black text-sm">₹{completedRecord.payment?.amount || 50}.00 (Verified)</span>
            </div>

            {completedRecord.interestedInSpeaking === 'Yes' && (
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Stage Speech Interest</span>
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5" /> Registered ({completedRecord.speechTeacher})
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-400">Favorite Teacher Tribute</span>
              <span className="text-purple-300 font-bold">{completedRecord.favoriteTeacher}</span>
            </div>
          </div>

          {/* Thank you tribute notice */}
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 text-center">
            🎉 Your secret votes have been securely recorded. See you at the CSE Quadrangle on <span className="text-amber-300 font-bold">September 5, 2026</span>!
          </div>

          <button
            onClick={() => {
              setCurrentStep(1);
              setFormData({
                name: '',
                rollNumber: '',
                department: 'Computer Science & Engineering (CSE)',
                year: '3rd Year',
                section: 'Section A',
                email: '',
                phone: '',
                wantsToSpeak: false,
                speechTeacher: '',
                speechTopic: '',
                favoriteTeacher: teachers[0]?.name || '',
                anecdote: ''
              });
              setSelectedVotes({});
              setCompletedRecord(null);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            <span>Register Another Student</span>
          </button>

        </div>
      )}

      {/* Razorpay Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          studentData={formData}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

    </section>
  );
};
