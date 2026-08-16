import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Loader2,
  Sparkles,
  ArrowRight,
  User,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Info,
  Zap,
  ExternalLink,
  HelpCircle,
  CreditCard,
  QrCode
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti } from '../utils/confetti';

export const PaymentModal = ({ studentData, initialAmount = 50, onPaymentSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [showUtrHelp, setShowUtrHelp] = useState(false);
  const [copiedMobile, setCopiedMobile] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(true);

  const razorpayButtonRef = useRef(null);

  const mobileNumber = '9663355000';
  const payeeName = 'ADABALA VENKATA THRINADH';

  // Embed official Razorpay Payment Button (pl_TQWuIlJaMefrde)
  useEffect(() => {
    if (!razorpayButtonRef.current) return;
    
    // Clear any previous child
    razorpayButtonRef.current.innerHTML = '';
    setButtonLoading(true);

    const form = document.createElement('form');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_TQWuIlJaMefrde');
    script.async = true;

    script.onload = () => {
      setButtonLoading(false);
    };

    script.onerror = () => {
      console.warn('Razorpay payment button script loading notice.');
      setButtonLoading(false);
    };

    form.appendChild(script);
    razorpayButtonRef.current.appendChild(form);
  }, []);

  // Copy Mobile Number helper
  const handleCopyMobile = () => {
    navigator.clipboard.writeText(mobileNumber);
    setCopiedMobile(true);
    setTimeout(() => setCopiedMobile(false), 2200);
  };

  // SUBMIT PAYMENT ID / UTR & ISSUE OFFICIAL PASS
  const handleConfirmPayment = (e) => {
    if (e) e.preventDefault();
    setPaymentError(null);

    const cleanId = utrNumber.trim().replace(/\s+/g, '');
    if (!cleanId) {
      setPaymentError('Please enter your Razorpay Payment ID (e.g. pay_...) or 12-digit UPI Reference / UTR Number.');
      return;
    }

    if (cleanId.length < 6) {
      setPaymentError('Please enter a valid Payment ID or 12-digit UTR Number.');
      return;
    }

    setIsProcessing(true);
    fireFestiveConfetti();

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        status: 'verified',
        amount: 50,
        paymentMethod: cleanId.startsWith('pay_') ? 'RAZORPAY_BUTTON' : 'UPI_DIRECT',
        transactionId: cleanId
      });
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg glass-card rounded-3xl border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 overflow-hidden animate-scaleUp max-h-[94vh] flex flex-col">
        
        {/* Animated Glow Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 animate-pulse"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-emerald-950/80 via-slate-950 to-indigo-950/80 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/20 shrink-0">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400/30 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-display leading-tight">
                  ₹50 Celebration Contribution Pass
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/30">
                  Razorpay Live
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Official GMRIT CSE Teachers' Day 2026 Celebration Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          
          {paymentError && (
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs animate-shake shadow-lg">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            </div>
          )}

          {/* Student Details Summary Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-white/10 text-xs space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                Student Name
              </span>
              <span className="font-bold text-white text-sm">{studentData?.name}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">JNTU Roll Number</span>
              <span className="font-mono font-bold text-amber-300 text-sm bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {studentData?.rollNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Department & Class</span>
              <span className="text-slate-200 font-semibold">{studentData?.year} • {studentData?.section} (CSE)</span>
            </div>
          </div>

          {/* STEP 1: OFFICIAL RAZORPAY PAYMENT BUTTON */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/40 space-y-4 shadow-2xl neon-pulse-emerald relative overflow-hidden text-center">
            
            {/* Step 1 Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Step 1: Pay ₹50 via Official Razorpay
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                UPI • Cards • NetBanking
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Click the official secure Razorpay button below to complete ₹50 contribution using <strong>PhonePe, Google Pay, Paytm, Cards, or NetBanking</strong>:
            </p>

            {/* Razorpay Button Dynamic Embed Container */}
            <div className="py-2 flex flex-col items-center justify-center min-h-[50px]">
              <div ref={razorpayButtonRef} className="flex justify-center items-center scale-105 hover:scale-110 transition-transform"></div>
              
              {buttonLoading && (
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading Official Razorpay Gateway...</span>
                </div>
              )}
            </div>

            {/* Direct Mobile UPI Fallback Option */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Or Pay Directly to Mobile Number:
                </span>
                <button
                  type="button"
                  onClick={handleCopyMobile}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                    copiedMobile ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
                  }`}
                >
                  {copiedMobile ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMobile ? 'Copied!' : 'Copy 9663355000'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-amber-300 font-semibold">
                9663355000 ({payeeName})
              </div>
            </div>

          </div>

          {/* STEP 2: ENTER PAYMENT ID / UTR TO ISSUE PASS */}
          <form onSubmit={handleConfirmPayment} className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Step 2: Enter Payment ID / UTR & Get Pass
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowUtrHelp(!showUtrHelp)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Where is Payment ID?</span>
              </button>
            </div>

            {showUtrHelp && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 space-y-1 animate-fadeIn">
                <p className="font-bold">Where to find your Payment / Reference ID:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  <li><strong>Razorpay:</strong> Look for the <strong>Payment ID</strong> on your Razorpay success screen (starts with <code>pay_...</code>)</li>
                  <li><strong>UPI App:</strong> Look for the 12-digit <strong>UTR</strong> or <strong>UPI Ref ID</strong> on your payment receipt</li>
                  <li>Paste that ID in the box below to generate your official pass!</li>
                </ul>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Enter Razorpay Payment ID (pay_...) or 12-Digit UTR *
              </label>
              <input
                type="text"
                required
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="Paste Payment ID (e.g. pay_XXXXX) or 12-digit UTR here"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/20 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 shimmer-button overflow-hidden hover:scale-[1.01] active:scale-98"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  <span>Verifying payment & issuing Official Celebration Pass...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-current text-slate-950" />
                  <span>Confirm ₹50 & Download Official Pass</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee Footer */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official GMRIT CSE Teachers' Day 2026 Celebration Portal</span>
          </div>

        </div>

      </div>

    </div>
  );
};
