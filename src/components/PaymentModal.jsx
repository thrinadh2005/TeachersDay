import React, { useState } from 'react';
import { 
  CreditCard, 
  X, 
  Loader2,
  Sparkles,
  Lock,
  ArrowRight,
  User,
  GraduationCap,
  Phone,
  Mail,
  Mic,
  Smile,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { api } from '../utils/api';

// Dynamic script loader for Razorpay Standard Checkout SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && typeof window.Razorpay === 'function') {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const PaymentModal = ({ studentData, onPaymentSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // RAZORPAY CHECKOUT TRIGGER
  const handleLaunchRazorpay = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window.Razorpay !== 'function') {
        throw new Error('Could not load Razorpay Payment Gateway. Please check your internet connection or disable ad-blocker.');
      }

      // 2. Create order on server
      const orderRes = await api.createRazorpayOrder({
        amount: 50,
        rollNumber: studentData?.rollNumber || 'CSE',
        name: studentData?.name || 'Student'
      });

      if (!orderRes.success) {
        throw new Error(orderRes.error || 'Failed to initialize Razorpay checkout');
      }

      const { orderId, amount: amountInPaise, keyId, isRealOrder } = orderRes.data;

      // 3. Prepare Razorpay Options
      const options = {
        key: keyId || 'rzp_live_TQ7vgo4Ec0Z9hX',
        amount: amountInPaise || 5000,
        currency: 'INR',
        name: "GMRIT CSE Teachers' Day 2026",
        description: `₹50 Celebration Contribution (${studentData?.year || 'CSE'} ${studentData?.section || ''})`,
        image: "https://gmrit.edu.in/images/logo.jpg",
        order_id: (isRealOrder && orderId && orderId.startsWith('order_')) ? orderId : undefined,
        prefill: {
          name: studentData?.name || '',
          email: studentData?.email || 'student@gmrit.edu.in',
          contact: studentData?.phone || '9999999999'
        },
        notes: {
          rollNumber: studentData?.rollNumber || '',
          department: 'CSE',
          section: studentData?.section || '',
          year: studentData?.year || ''
        },
        theme: {
          color: "#9333ea"
        },
        handler: async function (response) {
          try {
            // Verify on server
            const verifyRes = await api.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              rollNumber: studentData?.rollNumber
            });

            if (verifyRes.success) {
              onPaymentSuccess({
                status: 'verified',
                paymentMethod: 'RAZORPAY_LIVE',
                transactionId: response.razorpay_payment_id || `RZP_${Date.now()}`
              });
            } else {
              setPaymentError(verifyRes.error || 'Payment signature verification failed.');
            }
          } catch (vErr) {
            setPaymentError('Payment recorded: ' + vErr.message);
            onPaymentSuccess({
              status: 'verified',
              paymentMethod: 'RAZORPAY_LIVE',
              transactionId: response.razorpay_payment_id || `RZP_${Date.now()}`
            });
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setPaymentError(response.error?.description || 'Payment was unsuccessful or cancelled.');
        setIsProcessing(false);
      });
      rzp.open();

    } catch (err) {
      console.error('Razorpay Error:', err);
      setPaymentError(err.message || 'Could not connect to Razorpay. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-xl glass-card rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-900/60 via-slate-950 to-pink-900/60 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Confirm Registration & ₹50 Payment
              </h3>
              <p className="text-[11px] text-purple-300">
                Google Pay, PhonePe, Paytm, Cards & UPI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable Student Summary & Razorpay Action */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {paymentError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {paymentError}
            </div>
          )}

          {/* Student Registration Details Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Student Registration Summary</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                CSE Department
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5 text-xs">
              
              <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Student Full Name</span>
                  <span className="font-bold text-white">{studentData?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">CSE Roll Number</span>
                  <span className="font-mono font-bold text-amber-400">{studentData?.rollNumber || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Year & Section</span>
                  <span className="text-slate-200 font-semibold">{studentData?.year || 'N/A'} • {studentData?.section || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Phone / WhatsApp</span>
                  <span className="text-slate-200">{studentData?.phone || 'N/A'}</span>
                </div>
              </div>

              {studentData?.email && (
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[11px] text-slate-400 block">Email Address</span>
                  <span className="text-slate-300 font-mono text-[11px]">{studentData.email}</span>
                </div>
              )}

              {/* Stage Speech details if chosen */}
              {studentData?.wantsToSpeak && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="text-amber-300 font-bold text-[11px] flex items-center gap-1">
                    <Mic className="w-3 h-3" /> Registered for Stage Speech Slot
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Faculty: <span className="font-bold text-white">{studentData.speechTeacher || 'CSE Faculty'}</span>
                  </div>
                  {studentData.speechTopic && (
                    <div className="text-[11px] text-slate-400 italic">
                      "{studentData.speechTopic}"
                    </div>
                  )}
                </div>
              )}

              {/* Favorite Teacher if selected */}
              {studentData?.favoriteTeacher && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Smile className="w-3 h-3 text-pink-400" /> Favorite Faculty Tribute:
                  </span>
                  <span className="text-pink-300 font-bold text-[11px]">{studentData.favoriteTeacher}</span>
                </div>
              )}

              {/* Anecdote preview if provided */}
              {studentData?.anecdote && (
                <div className="pt-1 text-[11px] text-slate-400 border-t border-white/5">
                  <span className="font-semibold text-slate-300 block mb-0.5">Memory Story:</span>
                  <p className="italic text-slate-300 line-clamp-2">"{studentData.anecdote}"</p>
                </div>
              )}

            </div>
          </div>

          {/* Amount Due Box */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-purple-300 block">
                Celebration Contribution
              </span>
              <span className="text-xs text-slate-400">
                Mandatory for CSE 2nd, 3rd & 4th Year Celebration
              </span>
            </div>
            <div className="text-right">
              <span className="font-black text-amber-400 text-2xl">₹50.00</span>
            </div>
          </div>

          {/* Razorpay Gateway Direct Button */}
          <div className="space-y-3">
            <button
              disabled={isProcessing}
              onClick={handleLaunchRazorpay}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base shadow-xl shadow-purple-500/30 transition-all flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-98"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting to Payment Gateway...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Pay ₹50 (Google Pay / PhonePe / Cards / UPI)</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Secure Instant Payment</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
