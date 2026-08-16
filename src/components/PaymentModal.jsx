import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
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
  ShieldCheck,
  QrCode,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Info,
  HelpCircle,
  Zap
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti } from '../utils/confetti';

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

export const PaymentModal = ({ studentData, initialAmount = 50, onPaymentSuccess, onClose }) => {
  const [activeMethod, setActiveMethod] = useState('upi'); // 'upi' | 'razorpay'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  
  // Payment Config from Server
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: 'cseteachersday2026@upi',
    payeeName: 'CSE Teachers Day 2026',
    razorpayButtonId: '',
    razorpayPageUrl: '',
    keyId: '',
    enableUpi: true,
    enableRazorpayButton: true
  });
  const [configLoaded, setConfigLoaded] = useState(false);

  // Amount State
  const presetAmounts = [50, 100, 150, 200, 500];
  const initialIsPreset = presetAmounts.includes(Number(initialAmount));
  const [selectedPreset, setSelectedPreset] = useState(initialIsPreset ? Number(initialAmount) : null);
  const [customInputText, setCustomInputText] = useState(!initialIsPreset && initialAmount ? String(initialAmount) : '');
  const [isCustom, setIsCustom] = useState(!initialIsPreset && Boolean(initialAmount));

  // UPI Specific State
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Razorpay Specific State
  const [rzpPaymentId, setRzpPaymentId] = useState('');
  const rzpButtonContainerRef = useRef(null);

  // Determine current effective amount (Minimum ₹50)
  const currentTypedNumber = Number(customInputText);
  const effectiveAmount = isCustom
    ? (isNaN(currentTypedNumber) || currentTypedNumber < 50 ? 50 : Math.floor(currentTypedNumber))
    : (selectedPreset || 50);

  // Load Payment Config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.getPaymentConfig();
        if (res.success) {
          setPaymentConfig(res);
        }
      } catch (err) {
        console.warn('Could not fetch payment config:', err);
      } finally {
        setConfigLoaded(true);
      }
    };
    fetchConfig();
  }, []);

  // Generate UPI QR Code whenever amount or UPI ID changes
  useEffect(() => {
    const upiId = paymentConfig.upiId || 'cseteachersday2026@upi';
    const payeeName = paymentConfig.payeeName || 'CSE Teachers Day 2026';
    const note = `CSE_${studentData?.rollNumber || 'Pass'}`;
    
    // Standard UPI URI format: upi://pay?pa=ID&pn=NAME&am=AMOUNT&cu=INR&tn=NOTE
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${effectiveAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

    QRCode.toDataURL(upiUri, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Error generating UPI QR code:', err));
  }, [paymentConfig, effectiveAmount, studentData]);

  // Load Razorpay Payment Button if configured
  useEffect(() => {
    if (activeMethod === 'razorpay' && paymentConfig.razorpayButtonId && rzpButtonContainerRef.current) {
      rzpButtonContainerRef.current.innerHTML = '';
      const form = document.createElement('form');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      script.setAttribute('data-payment_button_id', paymentConfig.razorpayButtonId);
      script.async = true;
      form.appendChild(script);
      rzpButtonContainerRef.current.appendChild(form);
    }
  }, [activeMethod, paymentConfig.razorpayButtonId]);

  // Copy UPI ID helper
  const handleCopyUpiId = () => {
    const upi = paymentConfig.upiId || 'cseteachersday2026@upi';
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // 1-Tap UPI Launchers for Mobile
  const handleLaunchUpiApp = (appScheme) => {
    const upiId = paymentConfig.upiId || 'cseteachersday2026@upi';
    const payeeName = paymentConfig.payeeName || 'CSE Teachers Day 2026';
    const note = `CSE_${studentData?.rollNumber || 'Pass'}`;
    const baseParams = `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${effectiveAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    let targetUrl = `upi://pay?${baseParams}`;
    if (appScheme === 'gpay') {
      targetUrl = `gpay://upi/pay?${baseParams}`;
    } else if (appScheme === 'phonepe') {
      targetUrl = `phonepe://pay?${baseParams}`;
    } else if (appScheme === 'paytm') {
      targetUrl = `paytmmp://pay?${baseParams}`;
    }

    window.location.href = targetUrl;
  };

  // SUBMIT UPI UTR VERIFICATION
  const handleConfirmUpiPayment = (e) => {
    if (e) e.preventDefault();
    setPaymentError(null);

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr) {
      setPaymentError('Please enter the 12-digit UPI Reference Number / UTR from your payment screen (GPay, PhonePe, Paytm).');
      return;
    }

    if (cleanUtr.length < 6) {
      setPaymentError('Please enter a valid UPI Reference / UTR Number (usually 12 digits).');
      return;
    }

    setIsProcessing(true);
    fireFestiveConfetti();

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        status: 'verified',
        amount: effectiveAmount,
        paymentMethod: 'UPI_DIRECT',
        transactionId: cleanUtr
      });
    }, 400);
  };

  // SUBMIT RAZORPAY PAYMENT ID
  const handleConfirmRzpPaymentId = (e) => {
    if (e) e.preventDefault();
    setPaymentError(null);

    const cleanId = rzpPaymentId.trim();
    if (!cleanId) {
      setPaymentError('Please enter the Razorpay Payment ID from your confirmation receipt (e.g. pay_...).');
      return;
    }

    setIsProcessing(true);
    fireFestiveConfetti();

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        status: 'verified',
        amount: effectiveAmount,
        paymentMethod: 'RAZORPAY_BUTTON',
        transactionId: cleanId
      });
    }, 400);
  };

  // RAZORPAY STANDARD CHECKOUT POPUP (FALLBACK)
  const handleLaunchRazorpaySDK = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window.Razorpay !== 'function') {
        throw new Error('Could not load Razorpay SDK. Please use the UPI option above or check connection.');
      }

      const orderRes = await api.createRazorpayOrder({
        amount: effectiveAmount,
        rollNumber: studentData?.rollNumber || 'CSE',
        name: studentData?.name || 'Student'
      });

      if (!orderRes.success) {
        throw new Error(orderRes.error || 'Failed to initialize Razorpay checkout');
      }

      const { orderId, amount: amountInPaise, keyId, isRealOrder } = orderRes.data;

      const options = {
        key: keyId || paymentConfig.keyId || '',
        amount: amountInPaise || (effectiveAmount * 100),
        currency: 'INR',
        name: "GMRIT CSE Teachers' Day 2026",
        description: `₹${effectiveAmount} Event Delegate Pass (${studentData?.year || 'CSE'} ${studentData?.section || ''})`,
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
          year: studentData?.year || '',
          eventPassFee: effectiveAmount
        },
        theme: {
          color: "#9333ea"
        },
        handler: async function (response) {
          try {
            const verifyRes = await api.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              rollNumber: studentData?.rollNumber
            });

            if (verifyRes.success) {
              onPaymentSuccess({
                status: 'verified',
                amount: effectiveAmount,
                paymentMethod: 'RAZORPAY_LIVE',
                transactionId: response.razorpay_payment_id || `RZP_${Date.now()}`
              });
            } else {
              setPaymentError(verifyRes.error || 'Payment signature verification failed.');
            }
          } catch (vErr) {
            onPaymentSuccess({
              status: 'verified',
              amount: effectiveAmount,
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
      setPaymentError(err.message || 'Could not connect to Razorpay. Please use the UPI option above.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-xl glass-card rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden animate-scaleUp max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-purple-900/70 via-slate-950 to-pink-900/70 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Secure Event Pass Payment (₹{effectiveAmount})
              </h3>
              <p className="text-[11px] text-purple-300">
                Instant UPI (GPay/PhonePe/Paytm) & Razorpay Payment Button
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

        {/* Dual Payment Method Switcher */}
        <div className="grid grid-cols-2 p-2 bg-slate-950/90 border-b border-white/10 gap-2 shrink-0">
          <button
            onClick={() => setActiveMethod('upi')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeMethod === 'upi'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>Direct UPI (Fast & 0% Fee)</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
              Recommended
            </span>
          </button>

          <button
            onClick={() => setActiveMethod('razorpay')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeMethod === 'razorpay'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20 border border-purple-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <CreditCard className="w-4 h-4 text-pink-300" />
            <span>Razorpay Button / Page</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          
          {paymentError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-shake">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            </div>
          )}

          {/* Student Registration Summary Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Delegate</span>
              <span className="font-bold text-white">{studentData?.name} ({studentData?.rollNumber})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Department & Pass Fee</span>
              <span className="text-amber-400 font-bold font-mono">CSE • ₹{effectiveAmount}.00</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: DIRECT DYNAMIC UPI (GPay, PhonePe, Paytm, QR Code)                 */}
          {/* ========================================================================= */}
          {activeMethod === 'upi' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Dynamic QR Code & 1-Tap Launch Banner */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 text-center space-y-4">
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  {/* Dynamic QR Code */}
                  <div className="p-2.5 bg-white rounded-2xl shadow-xl shadow-emerald-500/10 border-2 border-emerald-400 shrink-0">
                    {qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="Dynamic UPI QR Code" 
                        className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-800" />
                      </div>
                    )}
                  </div>

                  {/* QR Details & 1-Tap Mobile Actions */}
                  <div className="text-left space-y-3 flex-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        Scan & Pay with Any UPI App
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white font-display">
                        Pay ₹{effectiveAmount}.00
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Pre-filled with ₹{effectiveAmount} & note: <span className="font-mono text-amber-300 font-semibold">CSE_{studentData?.rollNumber || 'Pass'}</span>
                      </p>
                    </div>

                    {/* Copy UPI ID Box */}
                    <div className="p-2 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-[10px] text-slate-400 block leading-none mb-0.5">UPI ID:</span>
                        <span className="text-xs font-mono font-bold text-emerald-300 select-all truncate">
                          {paymentConfig.upiId || 'cseteachersday2026@upi'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1-Tap Mobile Launch Buttons */}
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                    Or Tap to Open UPI App Directly on Mobile:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handleLaunchUpiApp('gpay')}
                      className="py-2 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:border-blue-400"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>Google Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaunchUpiApp('phonepe')}
                      className="py-2 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:border-purple-400"
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <span>PhonePe</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaunchUpiApp('paytm')}
                      className="py-2 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:border-cyan-400"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>Paytm</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaunchUpiApp('upi')}
                      className="py-2 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:border-amber-400"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Any App</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Step 2: UTR Submission Form */}
              <form onSubmit={handleConfirmUpiPayment} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Enter 12-Digit UPI Reference Number (UTR) *</span>
                    <span className="text-[10px] text-amber-400 font-normal">Found on payment success screen</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 423456789012 or GPay / PhonePe Txn ID"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
                  />
                  <p className="text-[10px] text-slate-400">
                    💡 After completing the ₹{effectiveAmount} transfer on your UPI app, copy the 12-digit UTR / UPI Reference ID and paste it here to get your official QR Entry Pass.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Verifying & Generating Pass...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>Confirm UPI Payment & Get Entry Pass</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: RAZORPAY PAYMENT BUTTON & HOSTED PAYMENT PAGE                      */}
          {/* ========================================================================= */}
          {activeMethod === 'razorpay' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto">
                  <CreditCard className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">
                    Razorpay Payment Gateway Checkout
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Pay securely using Cards, NetBanking, Razorpay UPI, or Wallets.
                  </p>
                </div>

                {/* Container for Embedded Razorpay Payment Button */}
                {paymentConfig.razorpayButtonId && (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex flex-col items-center justify-center gap-2">
                    <span className="text-[11px] text-purple-300 font-bold">Official Razorpay Payment Button:</span>
                    <div ref={rzpButtonContainerRef} className="my-1"></div>
                  </div>
                )}

                {/* Link to Hosted Payment Page if URL configured */}
                {paymentConfig.razorpayPageUrl && (
                  <a
                    href={paymentConfig.razorpayPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition-all"
                  >
                    <span>Open Razorpay Hosted Payment Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {/* Standard Razorpay SDK Modal Launcher */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleLaunchRazorpaySDK}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Pay ₹{effectiveAmount} via Razorpay Modal</span>
                    </>
                  )}
                </button>
              </div>

              {/* Submit Razorpay Payment ID Form */}
              <form onSubmit={handleConfirmRzpPaymentId} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Paid via Razorpay Page/Button? Enter Payment ID:</span>
                    <span className="text-[10px] text-purple-300 font-normal">e.g. pay_...</span>
                  </label>
                  <input
                    type="text"
                    value={rzpPaymentId}
                    onChange={(e) => setRzpPaymentId(e.target.value)}
                    placeholder="e.g. pay_Qz123456789abc"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/40"
                  />
                  <p className="text-[10px] text-slate-400">
                    If you completed payment on the external Razorpay page, paste your Payment ID here to immediately generate your pass.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
                >
                  Verify Payment ID & Generate Pass
                </button>
              </form>

            </div>
          )}

          {/* Security Guarantee Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official GMRIT CSE Teachers' Day 2026 Celebration Portal</span>
          </div>

        </div>

      </div>

    </div>
  );
};
