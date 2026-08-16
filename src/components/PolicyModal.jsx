import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Mail, 
  Phone, 
  MapPin, 
  X, 
  Ticket, 
  Calendar, 
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const PolicyModal = ({ initialTab = 'terms', onClose }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl my-8 glass-card rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-950/80 p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white font-display">
                Event Compliance & Legal Policies
              </h3>
              <p className="text-xs text-slate-400">
                CSE Teachers' Day Celebration 2026 • GMR Institute of Technology
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-950/90 border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'terms'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms & Conditions</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'privacy'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'refund'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refund & Cancellation</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'pricing'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Event Pass Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'contact'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
          
          {/* TAB 1: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Terms and Conditions of Event Registration</span>
              </h4>
              <p>
                Welcome to the official <strong>CSE Teachers' Day Celebration 2026</strong> event portal. By registering and purchasing a Student Delegate Entry Pass on this platform, you agree to comply with and be bound by the following terms and conditions:
              </p>
              
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">1. Eligibility</h5>
                  <p className="text-slate-400 text-xs">
                    Event registration is strictly open to bonafide Computer Science & Engineering (CSE) students of GMR Institute of Technology (2nd, 3rd, and 4th Years across Sections A, B, C, and D) and invited faculty/staff. A valid college Roll Number is required.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">2. Delegate Pass & Entry</h5>
                  <p className="text-slate-400 text-xs">
                    Each registered delegate receives an official digital QR Entry Pass. The pass is non-transferable and must be presented at the registration desk on September 5, 2026, for badge collection and venue entry.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">3. Venue Conduct & Discipline</h5>
                  <p className="text-slate-400 text-xs">
                    All attendees must maintain decorum, respect faculty members, and adhere to college campus code of conduct during stage speeches, felicitation ceremonies, and cultural performances.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">4. Modification of Schedule</h5>
                  <p className="text-slate-400 text-xs">
                    The organizing committee reserves the right to alter the event schedule, program timings, or venue hall within the college campus in case of unforeseen administrative circumstances.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Privacy Policy</span>
              </h4>
              <p>
                We are committed to protecting the privacy of student delegates and faculty members. This policy explains how we collect and manage your information:
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">1. Information Collected</h5>
                  <p className="text-slate-400 text-xs">
                    We collect minimal essential student registration information: Full Name, JNTU College Roll Number, Academic Year, Section, Email Address, Phone Number, and Optional Stage Speech preferences.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">2. Secret Ballot Voting Confidentiality</h5>
                  <p className="text-slate-400 text-xs">
                    Votes cast for faculty award categories are held under strict confidential secret ballot. Student voting choices are encrypted and never disclosed publicly.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">3. Payment Information Security</h5>
                  <p className="text-slate-400 text-xs">
                    All payment processing is handled securely through <strong>Razorpay (PCI-DSS Level 1 Certified Payment Gateway)</strong>. This portal does not store your card details, UPI PIN, or bank passwords.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">4. Data Sharing & Retention</h5>
                  <p className="text-slate-400 text-xs">
                    Your registration data is used solely for the coordination of the Teachers' Day 2026 celebration and is never shared, sold, or distributed to any third-party advertisers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND & CANCELLATION */}
          {activeTab === 'refund' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-pink-400" />
                <span>Refund and Cancellation Policy</span>
              </h4>
              <p>
                Please review our policy regarding delegate pass cancellations and payment refunds:
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">1. Delegate Pass Cancellation</h5>
                  <p className="text-slate-400 text-xs">
                    Due to advance procurement of event kits, student badges, mementos, and refreshment catering for confirmed attendees, individual delegate passes are generally <strong>non-cancellable</strong> once issued.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">2. Event Cancellation or Postponement</h5>
                  <p className="text-slate-400 text-xs">
                    In the unlikely event that the celebration is cancelled by the institution, a <strong>100% full refund</strong> will be initiated automatically to the original source payment method (UPI/Card/NetBanking) within <strong>5 to 7 working days</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <h5 className="font-bold text-white mb-1">3. Duplicate Transaction Resolution</h5>
                  <p className="text-slate-400 text-xs">
                    If a student is charged multiple times due to a banking network timeout or gateway delay, the excess amount will be refunded automatically by the gateway or resolved by the committee within 48 hours upon providing the Transaction ID.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVENT PASS PRICING & INCLUSIONS */}
          {activeTab === 'pricing' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-400" />
                <span>Student Delegate Pass & Kit Fee Details</span>
              </h4>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-950 border border-amber-400/30 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <h5 className="font-bold text-white text-base">CSE Teachers' Day 2026 Delegate Pass</h5>
                    <span className="text-xs text-slate-400">Single Student Entry & Celebration Access</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400 font-display">₹50</span>
                    <span className="text-[10px] text-slate-400 block">Inclusive of all taxes</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="font-bold text-amber-300">What is included with your ₹50 Event Pass:</div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Official entry badge & digital QR access pass to the CSE Quadrangle stage venue.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Celebratory high-tea refreshments, sweets, and beverage coupons.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Commemorative Teachers' Day memento kit and tribute felicitation session.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Participation in secret ballot voting for the 5 CSE Superlative Faculty Awards.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Contact Us & Event Support</span>
              </h4>
              <p>
                For inquiries regarding student delegate registration, payment confirmation, or event coordination, please contact the committee coordinators:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Mail className="w-4 h-4" />
                    <span>Official Email</span>
                  </div>
                  <p className="text-white text-xs font-mono">cseteachersday2026@gmail.com</p>
                  <p className="text-slate-400 text-[11px]">Department Coordination Desk</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>Campus Location</span>
                  </div>
                  <p className="text-white text-xs">
                    Department of Computer Science & Engineering (CSE)
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    GMR Institute of Technology, GMR Nagar, Rajam, Andhra Pradesh - 532127
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-300">
                <div className="font-bold text-purple-300 mb-0.5">Organizing Committee:</div>
                <span>CSE 2nd, 3rd & 4th Year Student Committee (Sections A, B, C, D) in coordination with Department of CSE, GMRIT.</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Official Event Portal • Teachers' Day 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
