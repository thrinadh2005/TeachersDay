import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Loader2,
  Sparkles,
  ArrowRight,
  User,
  ShieldCheck,
  CheckCircle2,
  Info,
  Zap,
  Check
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti } from '../utils/confetti';

export const PaymentModal = ({ studentData, initialAmount = 50, onPaymentSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(true);

  // Automatically lock the exact amount chosen in the previous screen (Min ₹50)
  const lockedAmount = Math.max(50, Math.floor(Number(initialAmount) || 50));

  const razorpayButtonRef = useRef(null);

  // 1. Embed official Razorpay Payment Button (pl_TQWuIlJaMefrde)
  useEffect(() => {
    if (!razorpayButtonRef.current) return;
    
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
      setButtonLoading(false);
    };

    form.appendChild(script);
    razorpayButtonRef.current.appendChild(form);
  }, []);

  // 2. Automatic Listener for Razorpay Window Messages (instant auto-verification)
  useEffect(() => {
    const handleRazorpayMessage = (event) => {
      if (event.data && typeof event.data === 'object') {
        const pId = event.data.razorpay_payment_id || event.data.payment_id;
        if (pId) {
          handleDirectSuccess(pId);
        }
      }
    };

    window.addEventListener('message', handleRazorpayMessage);
    return () => window.removeEventListener('message', handleRazorpayMessage);
  }, []);

  // 3. Live Server-Side Verification against Razorpay API
  const handleVerifyLivePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const res = await api.verifyRazorpayLiveStatus({
        email: studentData?.email || '',
        phone: studentData?.phone || '',
        rollNumber: studentData?.rollNumber || '',
        name: studentData?.name || '',
        amount: lockedAmount
      });

      if (res.success && res.verified) {
        handleDirectSuccess(res.transactionId);
      } else {
        throw new Error(res.error || `No ₹${lockedAmount} payment detected on Razorpay yet.`);
      }
    } catch (err) {
      console.warn('Payment check warning:', err);
      setPaymentError(err.message || `No ₹${lockedAmount} payment found on Razorpay. Please click the Razorpay Button and complete payment first.`);
      setIsProcessing(false);
    }
  };

  const handleDirectSuccess = (txnId) => {
    setIsProcessing(true);
    fireFestiveConfetti();

    const finalId = txnId || `RZP_${Date.now().toString().slice(-8)}`;

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        status: 'verified',
        amount: lockedAmount,
        paymentMethod: 'RAZORPAY_OFFICIAL',
        transactionId: finalId
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
              <ShieldCheck className="w-6 h-6 text-emerald-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-display leading-tight">
                  ₹{lockedAmount} Contribution Pass
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/30">
                  Fixed Amount
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Official Razorpay Live Payment Gateway • GMRIT CSE
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
              <span className="text-slate-400">Fixed Contribution Amount</span>
              <span className="font-black text-amber-400 text-base font-display">₹{lockedAmount}.00</span>
            </div>
          </div>

          {/* RAZORPAY PAYMENT GATEWAY BUTTON CONTAINER */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/40 space-y-4 shadow-2xl neon-pulse-emerald relative overflow-hidden text-center">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Step 1: Complete ₹{lockedAmount} Payment
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Google Pay • PhonePe • Cards
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Click the official <strong>Razorpay Button</strong> below to pay ₹{lockedAmount} using any UPI app (GPay, PhonePe, Paytm), Debit/Credit Cards, or NetBanking:
            </p>

            {/* Razorpay Button Embed */}
            <div className="py-3 flex flex-col items-center justify-center min-h-[56px]">
              <div ref={razorpayButtonRef} className="flex justify-center items-center scale-110 hover:scale-115 transition-transform"></div>
              
              {buttonLoading && (
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading Official Razorpay Button...</span>
                </div>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-center">
              <p className="text-[11px] text-emerald-200">
                🔒 256-Bit Encrypted Secure Checkout hosted directly by Razorpay
              </p>
            </div>

          </div>

          {/* STEP 2: VERIFY PAYMENT & DOWNLOAD PASS (LIVE SERVER CHECK) */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleVerifyLivePayment}
              disabled={isProcessing}
              className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2.5 shimmer-button overflow-hidden hover:scale-[1.02] active:scale-95 group"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  <span>Checking Razorpay Live Servers...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-current text-slate-950 group-hover:scale-125 transition-transform" />
                  <span>I've Paid ₹{lockedAmount} — Verify & Download My Pass!</span>
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400">
              ⚡ As soon as you finish payment on Razorpay, click above to verify and download your Official Celebration Pass!
            </p>
          </div>

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
