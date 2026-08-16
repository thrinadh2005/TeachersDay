import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  CreditCard, 
  X, 
  Loader2,
  Sparkles,
  Lock,
  ArrowRight,
  User,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Smartphone,
  Copy,
  Check,
  Info,
  Zap,
  Coins,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti } from '../utils/confetti';

export const PaymentModal = ({ studentData, initialAmount = 50, onPaymentSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  
  // Payment Config from Server (Defaults to 9663355000@ybl)
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: '9663355000@ybl',
    payeeName: 'CSE Teachers Day 2026',
    enableUpi: true
  });

  // Amount State (Minimum ₹50 with optional custom higher contribution)
  const presetAmounts = [50, 100, 150, 200, 500];
  const initialIsPreset = presetAmounts.includes(Number(initialAmount));
  const [selectedPreset, setSelectedPreset] = useState(initialIsPreset ? Number(initialAmount) : null);
  const [customInputText, setCustomInputText] = useState(!initialIsPreset && initialAmount ? String(initialAmount) : '');
  const [isCustom, setIsCustom] = useState(!initialIsPreset && Boolean(initialAmount));

  // UPI Specific State
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showUtrHelp, setShowUtrHelp] = useState(false);

  // Determine current effective amount (Minimum ₹50)
  const currentTypedNumber = Number(customInputText);
  const effectiveAmount = isCustom
    ? (isNaN(currentTypedNumber) || currentTypedNumber < 50 ? 50 : Math.floor(currentTypedNumber))
    : (selectedPreset || 50);

  // Load Payment Config from backend
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.getPaymentConfig();
        if (res.success && res.upiId) {
          setPaymentConfig(res);
        }
      } catch (err) {
        console.warn('Could not fetch payment config:', err);
      }
    };
    fetchConfig();
  }, []);

  // Generate Dynamic UPI QR Code whenever amount or UPI ID changes
  useEffect(() => {
    const upiId = paymentConfig.upiId || '9663355000@ybl';
    const payeeName = paymentConfig.payeeName || 'CSE Teachers Day 2026';
    const note = `CSE_${studentData?.rollNumber || 'TeachersDay'}`;
    
    // Standard UPI URI format: upi://pay?pa=ID&pn=NAME&am=AMOUNT&cu=INR&tn=NOTE
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${effectiveAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

    QRCode.toDataURL(upiUri, {
      width: 240,
      margin: 1.5,
      color: {
        dark: '#090d16',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Error generating UPI QR code:', err));
  }, [paymentConfig, effectiveAmount, studentData]);

  // Copy UPI ID helper with feedback
  const handleCopyUpiId = () => {
    const upi = paymentConfig.upiId || '9663355000@ybl';
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  // 1-Tap UPI Launchers for Mobile
  const handleLaunchUpiApp = (appScheme) => {
    const upiId = paymentConfig.upiId || '9663355000@ybl';
    const payeeName = paymentConfig.payeeName || 'CSE Teachers Day 2026';
    const note = `CSE_${studentData?.rollNumber || 'TeachersDay'}`;
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

    const cleanUtr = utrNumber.trim().replace(/\s+/g, '');
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
              <Smartphone className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-display leading-tight">
                  Instant UPI Contribution
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/30">
                  0% Fees
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Direct to Coordinator Bank Account • GPay, PhonePe, Paytm & BHIM
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
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs animate-shake shadow-lg">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
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

          {/* Contribution Amount Selector (Min ₹50 with optional custom higher contribution) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-emerald-950/60 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  Celebration Contribution
                </span>
                <span className="text-[11px] text-slate-400">
                  Select amount or enter custom contribution (Min ₹50)
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-black text-amber-400 text-2xl font-display">₹{effectiveAmount}</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-5 gap-1.5">
              {presetAmounts.map((amt) => {
                const isSelected = !isCustom && selectedPreset === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(amt);
                      setCustomInputText('');
                      setIsCustom(false);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 scale-[1.03] border border-emerald-300 ring-2 ring-emerald-400/40'
                        : 'bg-slate-950/80 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    ₹{amt}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">Custom Amount:</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">₹</span>
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={isCustom ? customInputText : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomInputText(val);
                    setIsCustom(true);
                  }}
                  onBlur={() => {
                    if (isCustom) {
                      const num = Number(customInputText);
                      if (isNaN(num) || num < 50) {
                        setCustomInputText('50');
                      }
                    }
                  }}
                  className={`w-full pl-7 pr-3 py-1.5 rounded-xl bg-slate-950 border text-white font-mono text-xs focus:outline-none ${
                    isCustom 
                      ? 'border-amber-400 ring-1 ring-amber-400/40' 
                      : 'border-white/20 focus:border-emerald-400'
                  }`}
                  placeholder="Enter any amount (e.g. 250, 500)"
                />
              </div>
            </div>
          </div>

          {/* Dynamic QR Code & 1-Tap Launch Banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 text-center space-y-4 shadow-xl neon-pulse-emerald relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              
              {/* Dynamic QR Code with Laser Scanner Animation */}
              <div className="relative p-2.5 bg-white rounded-2xl shadow-2xl border-2 border-emerald-400 shrink-0 overflow-hidden group">
                
                {/* Laser Scanner Line */}
                <div className="laser-scanner-line"></div>
                
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Dynamic UPI QR Code" 
                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg object-contain relative z-0"
                  />
                ) : (
                  <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-800" />
                  </div>
                )}

                {/* Cyber Corner Brackets */}
                <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-600 pointer-events-none"></div>
                <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-600 pointer-events-none"></div>
                <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-600 pointer-events-none"></div>
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-600 pointer-events-none"></div>
              </div>

              {/* QR Details & Copy Box */}
              <div className="text-left space-y-3 flex-1 w-full">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Live Dynamic QR Code
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white font-display mt-0.5">
                    Scan & Pay ₹{effectiveAmount}.00
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Pre-configured note: <span className="font-mono text-amber-300 font-semibold">CSE_{studentData?.rollNumber || 'TeachersDay'}</span>
                  </p>
                </div>

                {/* High-Tech Copy UPI ID Box */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-2 shadow-inner">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block leading-none mb-0.5">Official Recipient UPI:</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-emerald-300 select-all truncate block">
                      {paymentConfig.upiId || '9663355000@ybl'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpiId}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 shadow-md ${
                      copiedUpi 
                        ? 'bg-emerald-500 text-slate-950' 
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 1-Tap Mobile Launch Buttons */}
            <div className="pt-3 border-t border-white/10">
              <span className="text-[11px] text-slate-300 block mb-2 font-medium">
                📲 Or Tap to Open Your UPI App Instantly (Mobile):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleLaunchUpiApp('gpay')}
                  className="py-2.5 px-2 rounded-xl bg-slate-950 hover:bg-blue-950/40 border border-blue-500/30 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:border-blue-400 hover:scale-[1.02] active:scale-95"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  <span>Google Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchUpiApp('phonepe')}
                  className="py-2.5 px-2 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-purple-500/30 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:border-purple-400 hover:scale-[1.02] active:scale-95"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span>PhonePe</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchUpiApp('paytm')}
                  className="py-2.5 px-2 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-cyan-500/30 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:border-cyan-400 hover:scale-[1.02] active:scale-95"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span>Paytm</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchUpiApp('upi')}
                  className="py-2.5 px-2 rounded-xl bg-slate-950 hover:bg-amber-950/40 border border-amber-500/30 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:border-amber-400 hover:scale-[1.02] active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Any App</span>
                </button>
              </div>
            </div>

          </div>

          {/* Step 2: 12-Digit UTR Submission Form */}
          <form onSubmit={handleConfirmUpiPayment} className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Enter 12-Digit UPI Reference (UTR) *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowUtrHelp(!showUtrHelp)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Where to find UTR?</span>
                </button>
              </div>

              {showUtrHelp && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 space-y-1 animate-fadeIn">
                  <p className="font-bold">Where to find your 12-digit UTR / Reference ID:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    <li><strong className="text-blue-300">Google Pay:</strong> Tap on the completed payment $\rightarrow$ "UPI transaction ID"</li>
                    <li><strong className="text-purple-300">PhonePe:</strong> Tap on payment details $\rightarrow$ "UTR Number" (12 digits)</li>
                    <li><strong className="text-cyan-300">Paytm:</strong> Tap on the transaction receipt $\rightarrow$ "UPI Ref No."</li>
                  </ul>
                </div>
              )}

              <input
                type="text"
                required
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="Paste 12-digit UTR / UPI Ref ID here (e.g. 423456789012)"
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
                  <span>Verifying & Generating Official Acknowledgement...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-current text-slate-950" />
                  <span>Confirm ₹{effectiveAmount} & Get Official Acknowledgement</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Security & Verification Guarantee */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official GMRIT CSE Teachers' Day 2026 Celebration Portal</span>
          </div>

        </div>

      </div>

    </div>
  );
};
