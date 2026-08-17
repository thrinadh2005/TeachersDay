import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Loader2,
  Sparkles,
  User,
  ShieldCheck,
  CheckCircle2,
  Info,
  Lock,
  RefreshCw
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti } from '../utils/confetti';

export const PaymentModal = ({ studentData, initialAmount = 50, onPaymentSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(true);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

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

  // 2. Strict Live Verification against Razorpay Live Servers
  const verifyWithLiveServer = async (explicitUserClick = false) => {
    if (isProcessing) return;
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

      if (res.success && res.verified && res.transactionId) {
        // STRICT SUCCESS: Money is really captured on Razorpay!
        fireFestiveConfetti();
        setTimeout(() => {
          setIsProcessing(false);
          onPaymentSuccess({
            status: 'verified',
            amount: lockedAmount,
            paymentMethod: 'RAZORPAY_OFFICIAL',
            transactionId: res.transactionId
          });
        }, 400);
      } else {
        throw new Error(res.error || `No captured ₹${lockedAmount} payment found on Razorpay.`);
      }
    } catch (err) {
      setIsProcessing(false);
      if (explicitUserClick) {
        setPaymentError(`Payment not confirmed on Razorpay yet. Please complete the ₹${lockedAmount} payment in your UPI / Bank app first.`);
      }
    }
  };

  // 3. Auto-listener for Razorpay Window Events
  useEffect(() => {
    const handleRazorpayMessage = (event) => {
      if (event.data && typeof event.data === 'object') {
        const pId = event.data.razorpay_payment_id || event.data.payment_id;
        if (pId) {
          setPaymentInitiated(true);
          verifyWithLiveServer(false);
        }
      }
    };

    // Auto-check when student comes back to the tab
    const handleWindowFocus = () => {
      if (paymentInitiated && !isProcessing) {
        verifyWithLiveServer(false);
      }
    };

    window.addEventListener('message', handleRazorpayMessage);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('message', handleRazorpayMessage);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [paymentInitiated, isProcessing, studentData, lockedAmount]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/95 backdrop-blur-xl animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl border-2 border-emerald-400/60 shadow-2xl shadow-emerald-500/20 overflow-hidden animate-scaleUp max-h-[94vh] flex flex-col">
        
        {/* Animated Glow Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 animate-pulse"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-white/15 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-emerald-500/25 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white font-display leading-tight">
                  ₹{lockedAmount} Contribution Pass
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-400 text-slate-950 text-[10px] font-black uppercase shadow-sm">
                  Official Gateway
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-200/90 mt-0.5">
                Official Razorpay Live Checkout • GMRIT CSE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-colors border border-white/10"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto bg-slate-900/90">
          
          {paymentError && (
            <div className="p-4 rounded-2xl bg-rose-500/20 border-2 border-rose-400 text-rose-100 text-xs sm:text-sm animate-shake shadow-lg font-semibold">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            </div>
          )}

          {/* Student Details Summary Card with High Contrast */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border-2 border-slate-700/80 text-xs space-y-3 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-slate-200 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                <User className="w-4 h-4 text-purple-400" />
                JNTU Roll Number
              </span>
              <span className="font-mono font-black text-slate-950 text-sm sm:text-base bg-amber-400 px-3 py-1 rounded-lg border border-amber-300 shadow-md">
                {studentData?.rollNumber}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-slate-200 font-bold text-xs sm:text-sm">Department & Class</span>
              <span className="text-teal-200 font-bold text-xs sm:text-sm bg-teal-950/80 border border-teal-500/40 px-3 py-1 rounded-lg">
                {studentData?.year} • {studentData?.section} (CSE)
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                Contribution Pass Amount
              </span>
              <span className="font-black text-amber-300 text-xl sm:text-2xl font-mono drop-shadow-md">
                ₹{lockedAmount}.00
              </span>
            </div>
          </div>

          {/* FINAL RAZORPAY PAYMENT BUTTON (HIGH VISIBILITY BOX) */}
          <div className="p-6 rounded-3xl bg-slate-950 border-2 border-emerald-400 space-y-4 shadow-2xl text-center relative overflow-hidden">
            
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                Live Razorpay Checkout
              </span>
              <p className="text-xs sm:text-sm text-slate-100 pt-1 leading-relaxed font-medium">
                Click the official Razorpay button below to pay <strong className="text-amber-300 font-black">₹{lockedAmount}</strong>. Your Celebration Pass is strictly activated only after the payment is successfully captured by Razorpay.
              </p>
            </div>

            {/* Official Razorpay Pay Button Embed Box */}
            <div 
              onClick={() => setPaymentInitiated(true)} 
              className="py-5 px-3 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col items-center justify-center min-h-[72px] shadow-inner"
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-2 text-emerald-300 py-2">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                  <span className="text-xs sm:text-sm font-black text-emerald-300 animate-pulse">
                    Connecting to Razorpay live servers to verify real payment...
                  </span>
                </div>
              ) : (
                <>
                  <div ref={razorpayButtonRef} className="flex justify-center items-center scale-125 hover:scale-130 transition-transform"></div>
                  
                  {buttonLoading && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 font-bold">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Loading Official Razorpay Gateway...</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Auto-check / Re-verify button if student already completed on app */}
            {paymentInitiated && !isProcessing && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => verifyWithLiveServer(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black flex items-center justify-center gap-2 mx-auto transition-all shadow-lg hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Paid on Razorpay? Click to Verify & Get Pass</span>
                </button>
              </div>
            )}

            {/* Security Assurance */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-emerald-300 font-bold">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>256-Bit Encrypted Secure Checkout hosted directly by Razorpay</span>
            </div>

          </div>

          {/* Footer note */}
          <div className="text-center text-xs text-slate-300 font-semibold pt-1">
            Official GMRIT CSE Teachers' Day 2026 Celebration Portal
          </div>

        </div>

      </div>

    </div>
  );
};
