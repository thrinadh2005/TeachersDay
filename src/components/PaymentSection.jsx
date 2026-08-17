import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  Mic, 
  GraduationCap, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ShieldCheck,
  Check,
  Vote
} from 'lucide-react';
import { api } from '../utils/api';
import { PaymentModal } from './PaymentModal';
import { AcknowledgementModal } from './AcknowledgementModal';
import { fireFestiveConfetti } from '../utils/confetti';

export const PaymentSection = ({ onSubmissionCompleted, onProceedToVoting }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [showAckModal, setShowAckModal] = useState(false);
  const [completedRecord, setCompletedRecord] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Form State: Only Roll Number & Section (+ Optional Speech)
  const [rollNumber, setRollNumber] = useState('');
  const [selectedSection, setSelectedSection] = useState('CSE 3A');
  const [wantsToSpeak, setWantsToSpeak] = useState(false);
  const [speechTeacher, setSpeechTeacher] = useState('');
  const [speechTopic, setSpeechTopic] = useState('');

  // Contribution Amount
  const presetAmounts = [50, 100, 150, 200, 500];
  const [contributionAmount, setContributionAmount] = useState(50);
  const [customAmountText, setCustomAmountText] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  const currentTypedNumber = Number(customAmountText);
  const effectiveContributionAmount = isCustomAmount
    ? (isNaN(currentTypedNumber) || currentTypedNumber < 50 ? 50 : Math.floor(currentTypedNumber))
    : contributionAmount;

  // 2nd & 3rd Year CSE Sections Only
  const cse2ndYearSections = ['CSE 2A', 'CSE 2B', 'CSE 2C', 'CSE 2D'];
  const cse3rdYearSections = ['CSE 3A', 'CSE 3B', 'CSE 3C', 'CSE 3D'];

  useEffect(() => {
    api.getTeachers()
      .then(res => {
        if (res.success && res.data) {
          setTeachers(res.data);
          if (res.data.length > 0) {
            setSpeechTeacher(res.data[0].name);
          }
        }
      })
      .catch(err => console.error('Failed to load teachers:', err));
  }, []);

  const handleStartPayment = async (e) => {
    if (e) e.preventDefault();
    const cleanRoll = rollNumber.trim().toUpperCase();

    if (!cleanRoll) {
      setError('Please enter your JNTU Roll Number to proceed with payment.');
      return;
    }
    if (!selectedSection) {
      setError('Please select your CSE Section.');
      return;
    }

    setLoading(true);
    setError(null);
    setExistingSubmission(null);

    try {
      const checkRes = await api.checkRegistration(cleanRoll);
      if (checkRes.alreadyRegistered) {
        const rec = checkRes.data || checkRes.submission;
        setExistingSubmission(rec);
        setError(`Student with JNTU Roll Number "${cleanRoll}" has already contributed (${rec?.name || 'Registered'}, Receipt: ${rec?.acknowledgementNumber || rec?.ticketNumber}). Duplicate contribution is not permitted.`);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Roll check note:', err);
    }

    setLoading(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setShowPaymentModal(false);
    setLoading(true);
    setError(null);

    const cleanRoll = rollNumber.trim().toUpperCase();
    const yearDerive = selectedSection.includes('2') ? '2nd Year' : '3rd Year';

    try {
      const payload = {
        rollNumber: cleanRoll,
        name: `Student (${cleanRoll})`,
        department: 'Computer Science & Engineering (CSE)',
        year: yearDerive,
        section: selectedSection,
        interestedInSpeaking: wantsToSpeak ? 'Yes' : 'No',
        speechTeacher: wantsToSpeak ? speechTeacher : '',
        speechTopic: wantsToSpeak ? speechTopic : '',
        paymentStatus: paymentDetails.status || 'verified',
        paymentMethod: paymentDetails.paymentMethod || 'UPI_DIRECT',
        transactionId: paymentDetails.transactionId || `TXN_${Date.now()}`,
        paymentAmount: paymentDetails.amount || effectiveContributionAmount || 50,
        amount: paymentDetails.amount || effectiveContributionAmount || 50
      };

      const response = await api.submitStudentIdea(payload);
      if (!response.success) {
        if (response.isDuplicate) {
          setExistingSubmission(response.data || response.submission);
        }
        throw new Error(response.error || 'Failed to record contribution.');
      }

      setCompletedRecord(response.data);
      fireFestiveConfetti();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (onSubmissionCompleted) {
        onSubmissionCompleted(response.data);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while recording your celebration contribution.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToVoting = () => {
    const voterRoll = completedRecord?.rollNumber || rollNumber.trim().toUpperCase();
    if (onProceedToVoting) {
      onProceedToVoting(voterRoll);
    }
  };

  return (
    <section id="payment-section" className="relative py-6 sm:py-12 max-w-3xl mx-auto px-4">
      
      {/* Header Banner */}
      <div className="mb-8 text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider shadow-md">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>CSE Department Exclusive • 2nd & 3rd Years Only</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          {completedRecord ? (
            <>Payment & Contribution <span className="gradient-text-festive">Completed!</span></>
          ) : (
            <>Celebration Contribution <span className="gradient-text-gold">(₹50)</span></>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {completedRecord
            ? 'Your celebration contribution has been verified. Now proceed to vote for your favorite faculty!'
            : 'Enter your JNTU Roll Number and select your CSE Section to make your celebration contribution directly.'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-200 text-xs sm:text-sm animate-shake shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <span className="font-semibold">{error}</span>
              {existingSubmission && (
                <p className="text-xs text-rose-300/90 mt-1">
                  Receipt: <strong className="font-mono text-amber-300">{existingSubmission.acknowledgementNumber || existingSubmission.ticketNumber}</strong> • Amount: ₹{existingSubmission.payment?.amount || 50}
                </p>
              )}
            </div>
          </div>

          {existingSubmission && (
            <button
              type="button"
              onClick={() => setShowAckModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>View Official Receipt</span>
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 1: PAYMENT FORM (IF NOT COMPLETED) */}
      {/* ========================================================================= */}
      {!completedRecord ? (
        <div className="glass-card-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8 animate-fadeIn">
          
          <form onSubmit={handleStartPayment} className="space-y-7">
            
            {/* 1. JNTU Roll Number Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  1. JNTU Roll Number (Unique ID) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  e.g. 24341A0502
                </span>
              </div>

              <input
                type="text"
                required
                maxLength={20}
                placeholder="Enter JNTU Roll Number (e.g. 24341A0502)"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/90 border border-white/15 text-white placeholder-slate-500 text-base sm:text-lg font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner"
              />
            </div>

            {/* 2. New Interactive Section Selector (2nd & 3rd Year Only) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                2. Select Your CSE Section <span className="text-rose-400">*</span>
              </label>

              {/* 2nd Year Grid */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-purple-300 tracking-wider">
                    📘 2nd Year CSE
                  </span>
                  <span className="text-[10px] text-slate-400">Sections A, B, C, D</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {cse2ndYearSections.map((sec) => {
                    const isSelected = selectedSection === sec;
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setSelectedSection(sec)}
                        className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 touch-press ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white ring-2 ring-purple-400 shadow-lg shadow-purple-500/25 scale-[1.03]'
                            : 'bg-slate-900 border border-white/10 text-slate-300 hover:border-purple-400/40 hover:bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{sec}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3rd Year Grid */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                    📙 3rd Year CSE
                  </span>
                  <span className="text-[10px] text-slate-400">Sections A, B, C, D</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {cse3rdYearSections.map((sec) => {
                    const isSelected = selectedSection === sec;
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setSelectedSection(sec)}
                        className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 touch-press ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 ring-2 ring-amber-400 shadow-lg shadow-amber-500/25 scale-[1.03]'
                            : 'bg-slate-900 border border-white/10 text-slate-300 hover:border-amber-400/40 hover:bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-slate-950" />}
                        <span>{sec}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Stage Speech Interest (Optional Toggle) */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-950/80 border border-white/10 cursor-pointer hover:border-amber-400/40 transition-colors group">
                <input
                  type="checkbox"
                  checked={wantsToSpeak}
                  onChange={(e) => setWantsToSpeak(e.target.checked)}
                  className="w-5 h-5 rounded-md text-amber-500 bg-slate-900 border-white/20 focus:ring-amber-400 focus:ring-offset-slate-950 mt-0.5 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-amber-400" />
                    <span>Interested in stage speech / sharing words for faculty (Optional)</span>
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Check this box if you would like a speaking slot during the Teachers' Day ceremony.
                  </span>
                </div>
              </label>

              {wantsToSpeak && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1.5">
                      Which Teacher / Faculty would you like to speak about?
                    </label>
                    <select
                      value={speechTeacher}
                      onChange={(e) => setSpeechTeacher(e.target.value)}
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
                      What would you like to speak / tell about? (Brief Concept)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Expressing gratitude for lab guidance, sharing a memorable classroom lesson..."
                      value={speechTopic}
                      onChange={(e) => setSpeechTopic(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-400/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. Contribution Amount & Direct Payment Trigger */}
            <div className="pt-3 border-t border-white/10 space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Contribution Amount</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Official CSE Teachers' Day 2026 celebration pass & felicitation.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-amber-400 text-2xl font-display">₹{effectiveContributionAmount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setContributionAmount(amt); setIsCustomAmount(false); }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all touch-press ${
                        !isCustomAmount && contributionAmount === amt 
                          ? 'bg-purple-600 border-amber-400 text-white shadow-md' 
                          : 'bg-slate-950/80 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Payment Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 touch-press"
              >
                <CreditCard className="w-5 h-5" />
                <span>Confirm & Pay ₹{effectiveContributionAmount} Directly</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Verified Official Receipt Generated After Payment</span>
              </div>
            </div>

          </form>

        </div>
      ) : (
        /* ========================================================================= */
        /* CASE 2: PAYMENT SUCCESS & OFFICIAL RECEIPT DISPLAY */
        /* ========================================================================= */
        <div className="glass-card-glow rounded-3xl p-8 sm:p-12 border border-emerald-500/40 shadow-2xl text-center space-y-6 animate-fadeIn max-w-2xl mx-auto">
          
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/25 animate-float-soft">
            <CheckCircle2 className="w-12 h-12 text-slate-950" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest bg-emerald-400/20 text-emerald-300 px-3.5 py-1 rounded-full border border-emerald-300/30 inline-block mb-2">
              OFFICIAL CONTRIBUTION ACKNOWLEDGEMENT
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
              Payment Successful!
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto mt-2">
              Your celebration contribution of <span className="text-emerald-400 font-bold">₹{completedRecord.payment?.amount || effectiveContributionAmount || 50}.00</span> has been verified and recorded.
            </p>
          </div>

          {/* Receipt Details Box */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/10 text-left space-y-3 text-xs shadow-inner">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Acknowledgement No</span>
              <span className="text-amber-300 font-mono font-bold">{completedRecord.acknowledgementNumber || completedRecord.receiptNumber || completedRecord.ticketNumber}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">JNTU Roll Number</span>
              <span className="text-white font-mono font-bold">{completedRecord.rollNumber}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Section</span>
              <span className="text-amber-300 font-bold">{completedRecord.section}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Contribution Amount</span>
              <span className="text-emerald-400 font-black text-sm">₹{completedRecord.payment?.amount || effectiveContributionAmount || 50}.00 (PAID & VERIFIED)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Event Date & Venue</span>
              <span className="text-slate-200 font-medium">Sept 5, 2026 • CSE Quadrangle Stage</span>
            </div>
          </div>

          {/* NEXT STEP HIGHLIGHTED CTA TO VOTING */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-amber-900/30 to-purple-900/40 border border-amber-400/40 space-y-3">
            <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Next Step: Vote & Share Crazy Stories</span>
            </div>
            <p className="text-xs text-slate-300">
              Cast your confidential secret ballot votes for CSE faculty and share anonymous classroom memories!
            </p>
            <button
              onClick={handleGoToVoting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 touch-press"
            >
              <Vote className="w-5 h-5" />
              <span>Proceed to Faculty Voting & Crazy Stories (100% Anonymous)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowAckModal(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Open & Print Official Acknowledgement</span>
            </button>

            <button
              onClick={() => { setCompletedRecord(null); setRollNumber(''); }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium transition-all"
            >
              <span>Contribute for Another Roll Number</span>
            </button>
          </div>

        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          studentData={{
            name: `Student (${rollNumber.trim().toUpperCase()})`,
            rollNumber: rollNumber.trim().toUpperCase(),
            section: selectedSection,
            year: selectedSection.includes('2') ? '2nd Year' : '3rd Year'
          }}
          initialAmount={effectiveContributionAmount}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Official Acknowledgement Receipt Modal */}
      {(showAckModal && (completedRecord || existingSubmission)) && (
        <AcknowledgementModal
          submission={completedRecord || existingSubmission}
          onClose={() => setShowAckModal(false)}
        />
      )}

    </section>
  );
};
