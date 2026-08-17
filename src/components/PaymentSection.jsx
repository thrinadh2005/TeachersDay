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
  Vote,
  Search,
  RefreshCw,
  Printer,
  Calendar,
  MapPin,
  Lock
} from 'lucide-react';
import { api } from '../utils/api';
import { PaymentModal } from './PaymentModal';
import { AcknowledgementModal } from './AcknowledgementModal';
import { fireFestiveConfetti } from '../utils/confetti';
import { cleanJntuRoll, validateJntuRoll, JNTU_ROLL_LENGTH } from '../utils/jntuValidation';

export const PaymentSection = ({ onSubmissionCompleted, onProceedToVoting }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [showAckModal, setShowAckModal] = useState(false);
  const [completedRecord, setCompletedRecord] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Form State: JNTU Roll Number & Section (+ Optional Speech)
  const [rollNumber, setRollNumber] = useState('');
  const [selectedSection, setSelectedSection] = useState('CSE 3A');
  const [wantsToSpeak, setWantsToSpeak] = useState(false);
  const [speechTeacher, setSpeechTeacher] = useState('');
  const [speechTopic, setSpeechTopic] = useState('');

  // Quick lookup state
  const [lookupRoll, setLookupRoll] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState(null);
  const [showLookupBox, setShowLookupBox] = useState(false);

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

  // Real-time JNTU Roll Validation
  const rollValidation = validateJntuRoll(rollNumber);
  const cleanRoll = rollValidation.clean;

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

    // Check if this device has already paid
    try {
      const savedRoll = localStorage.getItem('teachers_day_paid_roll');
      if (savedRoll && savedRoll.length === JNTU_ROLL_LENGTH) {
        setRollNumber(savedRoll);
        api.checkRegistration(savedRoll)
          .then(res => {
            if (res.alreadyRegistered) {
              setExistingSubmission(res.data || res.submission);
            }
          })
          .catch(e => console.warn('Saved roll check error:', e));
      }
    } catch (e) {
      console.warn('localStorage read error:', e);
    }
  }, []);

  const [checkingRoll, setCheckingRoll] = useState(false);

  // Debounced auto-check: if student types exact 10 valid characters, check if already paid
  useEffect(() => {
    if (cleanRoll.length === JNTU_ROLL_LENGTH) {
      const timer = setTimeout(async () => {
        setCheckingRoll(true);
        try {
          const res = await api.checkRegistration(cleanRoll);
          if (res.alreadyRegistered) {
            const rec = res.data || res.submission;
            setExistingSubmission(rec);
            setError(`JNTU Roll Number "${cleanRoll}" has already contributed & activated their Celebration Pass. Duplicate payments are strictly not permitted.`);
          } else {
            setExistingSubmission(null);
            setError(null);
          }
        } catch (e) {
          console.warn('Check roll error:', e);
        } finally {
          setCheckingRoll(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setExistingSubmission(null);
      if (rollNumber.length > 0 && rollNumber.length < JNTU_ROLL_LENGTH) {
        setError(null);
      }
    }
  }, [cleanRoll]);

  const handleRollChange = (e) => {
    const raw = e.target.value;
    const sanitized = cleanJntuRoll(raw).slice(0, JNTU_ROLL_LENGTH);
    setRollNumber(sanitized);
  };

  const handleStartPayment = async (e) => {
    if (e) e.preventDefault();

    if (!rollValidation.isValid) {
      setError(rollValidation.error || 'Please enter a valid 10-digit JNTU Roll Number (e.g. 24341A0502).');
      return;
    }

    if (!selectedSection) {
      setError('Please select your CSE Section (2nd or 3rd Year).');
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
        setError(`JNTU Roll Number "${cleanRoll}" has already contributed (Receipt: ${rec?.acknowledgementNumber || rec?.ticketNumber}). Duplicate contribution is not permitted.`);
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
      try {
        localStorage.setItem('teachers_day_paid_roll', cleanRoll);
        localStorage.setItem('teachers_day_paid_submission', JSON.stringify(response.data));
      } catch (e) {
        console.warn('Save localStorage error:', e);
      }
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

  const handleQuickLookup = async (e) => {
    if (e) e.preventDefault();
    const v = validateJntuRoll(lookupRoll);
    if (!v.isValid) {
      setLookupError(v.error);
      return;
    }

    setLookupLoading(true);
    setLookupError(null);

    try {
      const res = await api.checkRegistration(v.clean);
      if (res.alreadyRegistered) {
        const rec = res.data || res.submission;
        setExistingSubmission(rec);
        setRollNumber(v.clean);
        setShowLookupBox(false);
        setLookupError(null);
      } else {
        setLookupError(`No contribution record found for "${v.clean}". Please complete payment below.`);
      }
    } catch (err) {
      setLookupError('Failed to lookup record. Please check connection and try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleGoToVoting = () => {
    const voterRoll = completedRecord?.rollNumber || existingSubmission?.rollNumber || cleanRoll;
    if (onProceedToVoting) {
      onProceedToVoting(voterRoll);
    }
  };

  return (
    <section id="payment-section" className="relative py-6 sm:py-12 max-w-3xl mx-auto px-4 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="mb-6 text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider shadow-sm">
          <GraduationCap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>CSE Department Exclusive • 2nd & 3rd Years Only</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          {completedRecord || existingSubmission ? (
            <>Payment & Contribution <span className="gradient-text-festive">Completed!</span></>
          ) : (
            <>Celebration Contribution <span className="gradient-text-gold">(₹50)</span></>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
          {completedRecord || existingSubmission
            ? 'Your celebration contribution has been verified and recorded. You cannot pay again.'
            : 'Enter your 10-digit JNTU Roll Number and select your CSE Section to make your celebration contribution.'}
        </p>

        {/* Quick Lookup Toggle for Returning Students */}
        {!existingSubmission && !completedRecord && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowLookupBox(!showLookupBox)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-amber-300 border border-slate-300 dark:border-white/10 transition-colors shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Already paid? Lookup & Print your Official Receipt</span>
            </button>

            {showLookupBox && (
              <form onSubmit={handleQuickLookup} className="mt-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 shadow-xl max-w-md mx-auto space-y-3 animate-fadeIn">
                <div className="text-left">
                  <label className="block text-xs font-black text-slate-800 dark:text-amber-300 uppercase">
                    Enter JNTU Roll Number (10 Digits)
                  </label>
                  <div className="flex gap-2 mt-1.5">
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="e.g. 24341A0502"
                      value={lookupRoll}
                      onChange={(e) => setLookupRoll(cleanJntuRoll(e.target.value).slice(0, JNTU_ROLL_LENGTH))}
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:border-amber-400 border border-slate-300 dark:border-white/10"
                    />
                    <button
                      type="submit"
                      disabled={lookupLoading}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shrink-0 hover:bg-amber-300 shadow-sm transition-all"
                    >
                      {lookupLoading ? 'Checking...' : 'Find Pass'}
                    </button>
                  </div>
                </div>

                {lookupError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">{lookupError}</p>
                )}
              </form>
            )}
          </div>
        )}
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-400 text-rose-800 dark:text-rose-200 text-xs sm:text-sm animate-shake shadow-lg font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE A: ALREADY PAID - CELEBRATION PASS SCREEN */}
      {/* ========================================================================= */}
      {(completedRecord || existingSubmission) ? (
        <div className="glass-card-glow rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-2xl space-y-6 animate-scaleUp text-center bg-white dark:bg-slate-950">
          
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border-2 border-emerald-400 shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-black tracking-widest bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/40 inline-block">
              CELEBRATION PASS ACTIVE & VERIFIED
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Contribution Already Received!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto font-medium">
              Student with JNTU Roll Number <strong className="text-amber-700 dark:text-amber-300 font-mono">{(completedRecord || existingSubmission)?.rollNumber}</strong> has already contributed.
            </p>
          </div>

          {/* Pass Details Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-left text-xs space-y-2.5 shadow-inner">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-600 dark:text-slate-400 font-bold">Acknowledgement No</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-black select-all">
                {(completedRecord || existingSubmission)?.acknowledgementNumber || (completedRecord || existingSubmission)?.ticketNumber}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-600 dark:text-slate-400 font-bold">Class & Section</span>
              <span className="text-teal-800 dark:text-teal-300 font-bold">
                {(completedRecord || existingSubmission)?.year || 'CSE'} • {(completedRecord || existingSubmission)?.section}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-600 dark:text-slate-400 font-bold">Amount Paid</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm">
                ₹{(completedRecord || existingSubmission)?.amount || (completedRecord || existingSubmission)?.payment?.amount || 50}.00 (PAID)
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400 font-bold">Status</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Official Razorpay Captured & Verified
              </span>
            </div>
          </div>

          {/* Actions: View Slip & Proceed to Voting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAckModal(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border-2 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm touch-press"
            >
              <Printer className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Print / View Digital Slip</span>
            </button>

            <button
              type="button"
              onClick={handleGoToVoting}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25 touch-press"
            >
              <Vote className="w-4 h-4" />
              <span>Proceed to Secret Ballot Voting</span>
            </button>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* CASE B: ACTIVE PAYMENT & REGISTRATION FORM */
        /* ========================================================================= */
        <form onSubmit={handleStartPayment} className="glass-card-glow rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 bg-white dark:bg-slate-950">
          
          {/* STEP 1: JNTU ROLL NUMBER (10 DIGITS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-black flex items-center justify-center">1</span>
                <span>JNTU Roll Number (10 Digits)</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>

              {/* 10-Digit Character Badge */}
              <div className="text-[11px] font-mono font-bold">
                {cleanRoll.length === 0 && <span className="text-slate-400">e.g. 24341A0502</span>}
                {cleanRoll.length > 0 && cleanRoll.length < JNTU_ROLL_LENGTH && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    {cleanRoll.length}/{JNTU_ROLL_LENGTH} digits
                  </span>
                )}
                {cleanRoll.length === JNTU_ROLL_LENGTH && rollValidation.isValid && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{checkingRoll ? 'Checking...' : '✓ 10/10 Valid'}</span>
                  </span>
                )}
              </div>
            </div>

            <input
              type="text"
              required
              maxLength={10}
              placeholder="Enter 10-Digit Roll Number (e.g. 24341A0502)"
              value={rollNumber}
              onChange={handleRollChange}
              className={`w-full px-4 py-3.5 rounded-2xl text-base sm:text-lg font-mono font-bold tracking-widest uppercase focus:outline-none transition-all shadow-inner ${
                rollValidation.isValid && cleanRoll.length === JNTU_ROLL_LENGTH
                  ? 'border-2 border-emerald-500 focus:ring-2 focus:ring-emerald-400/30'
                  : 'border border-slate-300 dark:border-white/15 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30'
              }`}
            />
          </div>

          {/* STEP 2: CLASS & SECTION SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-black flex items-center justify-center">2</span>
              <span>Select CSE Class & Section</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>

            {/* 2nd Year CSE */}
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                CSE 2nd Year Sections
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cse2ndYearSections.map(sec => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedSection(sec)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all touch-press ${
                      selectedSection === sec
                        ? 'bg-amber-400 text-slate-950 border-amber-500 font-black shadow-md scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            {/* 3rd Year CSE */}
            <div className="pt-1">
              <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                CSE 3rd Year Sections
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cse3rdYearSections.map(sec => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedSection(sec)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all touch-press ${
                      selectedSection === sec
                        ? 'bg-amber-400 text-slate-950 border-amber-500 font-black shadow-md scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 3: CONTRIBUTION AMOUNT */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-black flex items-center justify-center">3</span>
                <span>Celebration Contribution Amount</span>
              </label>
              <span className="text-xs font-black text-amber-700 dark:text-amber-400">
                ₹{effectiveContributionAmount} Selected
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {presetAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setContributionAmount(amt);
                    setIsCustomAmount(false);
                    setCustomAmountText('');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-black border transition-all touch-press ${
                    !isCustomAmount && contributionAmount === amt
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.03]'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:border-emerald-400'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setIsCustomAmount(true);
                  if (!customAmountText) setCustomAmountText('100');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all touch-press ${
                  isCustomAmount
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.03]'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:border-emerald-400'
                }`}
              >
                Custom
              </button>
            </div>

            {isCustomAmount && (
              <div className="pt-1">
                <input
                  type="number"
                  min="50"
                  placeholder="Enter custom amount (Min ₹50)"
                  value={customAmountText}
                  onChange={(e) => setCustomAmountText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-mono font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>
            )}
          </div>

          {/* STEP 4: OPTIONAL STAGE SPEECH REGISTRATION */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs font-bold">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Speak on Stage for Teachers</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Share gratitude or deliver speech (Optional)</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={wantsToSpeak}
                onChange={(e) => setWantsToSpeak(e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {wantsToSpeak && (
              <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Faculty Member You Wish to Speak About:
                  </label>
                  <select
                    value={speechTeacher}
                    onChange={(e) => setSpeechTeacher(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:outline-none focus:border-pink-500"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brief Speech Topic / Message:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Expressing gratitude for Algorithms guidance..."
                    value={speechTopic}
                    onChange={(e) => setSpeechTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* GRAND PAY & GET CELEBRATION PASS BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !rollValidation.isValid || cleanRoll.length !== JNTU_ROLL_LENGTH}
              className={`w-full py-4 sm:py-5 px-8 rounded-2xl font-black text-base sm:text-lg shadow-2xl transition-all flex items-center justify-center gap-3 touch-press ${
                !rollValidation.isValid || cleanRoll.length !== JNTU_ROLL_LENGTH
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-500/30 hover:scale-[1.01]'
              }`}
            >
              <CreditCard className="w-5 h-5 text-slate-950" />
              <span>{loading ? 'Initializing Gateway...' : `Proceed to Pay ₹${effectiveContributionAmount} & Get Pass`}</span>
              <Sparkles className="w-5 h-5 text-slate-950" />
            </button>
          </div>

        </form>
      )}

      {/* MODAL 1: LIVE RAZORPAY GATEWAY MODAL */}
      {showPaymentModal && (
        <PaymentModal
          studentData={{
            rollNumber: cleanRoll,
            name: `Student (${cleanRoll})`,
            year: selectedSection.includes('2') ? '2nd Year' : '3rd Year',
            section: selectedSection
          }}
          initialAmount={effectiveContributionAmount}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* MODAL 2: PRINTABLE OFFICIAL ACKNOWLEDGEMENT SLIP */}
      {showAckModal && (completedRecord || existingSubmission) && (
        <AcknowledgementModal
          submission={completedRecord || existingSubmission}
          onClose={() => setShowAckModal(false)}
        />
      )}

    </section>
  );
};
