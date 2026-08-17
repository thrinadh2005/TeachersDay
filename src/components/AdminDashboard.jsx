import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Users,
  Coins,
  MessageSquare,
  Vote,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  AlertCircle,
  Clock,
  Sparkles,
  Mic,
  Code,
  GraduationCap,
  Eye,
  EyeOff,
  Trophy,
  Star,
  Check,
  Ticket,
  Printer,
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon,
  Camera,
  FolderOpen,
  CreditCard,
  Smartphone,
  QrCode,
  ExternalLink,
  Save,
  FileSpreadsheet,
  Layers,
  Table,
  FileText
} from 'lucide-react';
import QRCode from 'qrcode';
import { api } from '../utils/api';
import { AcknowledgementModal } from './AcknowledgementModal';

const defaultFacultyPresets = [
  { filename: "Dr_A_V_Ramana.jpg", path: "/faculty/Dr_A_V_Ramana.jpg", label: "Dr. A.V. Ramana" },
  { filename: "Dr_Deevi_Radha_Rani.jpg", path: "/faculty/Dr_Deevi_Radha_Rani.jpg", label: "Dr. Deevi Radha Rani" },
  { filename: "Dr_K_Lakshmana_Rao.jpg", path: "/faculty/Dr_K_Lakshmana_Rao.jpg", label: "Dr. K. Lakshmana Rao" },
  { filename: "Dr_R_Cristin.jpg", path: "/faculty/Dr_R_Cristin.jpg", label: "Dr. R. Cristin" },
  { filename: "Dr_S_Akila_Agnes.jpg", path: "/faculty/Dr_S_Akila_Agnes.jpg", label: "Dr. S. Akila Agnes" },
  { filename: "Dr_K_Kavitha.jpg", path: "/faculty/Dr_K_Kavitha.jpg", label: "Dr. K. Kavitha" },
  { filename: "Dr_D_Sowjanya.jpg", path: "/faculty/Dr_D_Sowjanya.jpg", label: "Dr. D. Sowjanya" },
  { filename: "Ms_A_Bhavani.jpg", path: "/faculty/Ms_A_Bhavani.jpg", label: "Ms. A. Bhavani" },
  { filename: "Mr_Baisakh.jpg", path: "/faculty/Mr_Baisakh.jpg", label: "Mr. Baisakh" },
  { filename: "Ms_Santhoshini_Sahu.jpg", path: "/faculty/Ms_Santhoshini_Sahu.jpg", label: "Ms. Santhoshini Sahu" },
  { filename: "Mr_G_Suneel.jpg", path: "/faculty/Mr_G_Suneel.jpg", label: "Mr. G. Suneel" },
  { filename: "Mr_G_Dharma_Raju.jpg", path: "/faculty/Mr_G_Dharma_Raju.jpg", label: "Mr. G. Dharma Raju" },
  { filename: "Mr_D_Ganesh.jpg", path: "/faculty/Mr_D_Ganesh.jpg", label: "Mr. D. Ganesh" },
  { filename: "Ms_Y_Nagamani.jpg", path: "/faculty/Ms_Y_Nagamani.jpg", label: "Ms. Y. Nagamani" },
  { filename: "Ms_A_Vineela.jpg", path: "/faculty/Ms_A_Vineela.jpg", label: "Ms. A. Vineela" },
  { filename: "Ms_M_Sravani.jpg", path: "/faculty/Ms_M_Sravani.jpg", label: "Ms. M. Sravani" },
  { filename: "Mr_S_Vinod_Kumar.jpg", path: "/faculty/Mr_S_Vinod_Kumar.jpg", label: "Mr. S. Vinod Kumar" },
  { filename: "Mr_D_Srinuvasa_Rao.jpg", path: "/faculty/Mr_D_Srinuvasa_Rao.jpg", label: "Mr. D. Srinuvasa Rao" },
  { filename: "Ms_M_Maanasa.jpg", path: "/faculty/Ms_M_Maanasa.jpg", label: "Ms. M. Maanasa" },
  { filename: "Ms_K_Venkata_Lakshmi.jpg", path: "/faculty/Ms_K_Venkata_Lakshmi.jpg", label: "Ms. K. Venkata Lakshmi" },
  { filename: "Ms_T_Anusha.jpg", path: "/faculty/Ms_T_Anusha.jpg", label: "Ms. T. Anusha" },
  { filename: "Ms_G_Nirosha.jpg", path: "/faculty/Ms_G_Nirosha.jpg", label: "Ms. G. Nirosha" },
  { filename: "Mr_G_Ravi_Kumar.jpg", path: "/faculty/Mr_G_Ravi_Kumar.jpg", label: "Mr. G. Ravi Kumar" },
  { filename: "Mr_S_Ravi_Shankar.jpg", path: "/faculty/Mr_S_Ravi_Shankar.jpg", label: "Mr. S. Ravi Shankar" },
  { filename: "Mr_Suraj_Soren.jpg", path: "/faculty/Mr_Suraj_Soren.jpg", label: "Mr. Suraj Soren" },
  { filename: "Ms_Binodini_Kar.jpg", path: "/faculty/Ms_Binodini_Kar.jpg", label: "Ms. Binodini Kar" },
  { filename: "Ms_Sucheta_Krupalini_Moharana.jpg", path: "/faculty/Ms_Sucheta_Krupalini_Moharana.jpg", label: "Ms. Sucheta Krupalini Moharana" },
  { filename: "Ms_K_Sakunthala.jpg", path: "/faculty/Ms_K_Sakunthala.jpg", label: "Ms. K. Sakunthala" },
  { filename: "Mr_Y_Nagapramodkumar.jpg", path: "/faculty/Mr_Y_Nagapramodkumar.jpg", label: "Mr. Y. Nagapramodkumar" },
  { filename: "Ms_S_Geetha.jpg", path: "/faculty/Ms_S_Geetha.jpg", label: "Ms. S. Geetha" },
  { filename: "Mr_Md_Aamir_Sohail.jpg", path: "/faculty/Mr_Md_Aamir_Sohail.jpg", label: "Mr. Md. Aamir Sohail" },
  { filename: "Mr_M_Harshavardhan.jpg", path: "/faculty/Mr_M_Harshavardhan.jpg", label: "Mr. M. Harshavardhan" },
  { filename: "Mr_P_Kedar.jpg", path: "/faculty/Mr_P_Kedar.jpg", label: "Mr. P. Kedar" },
  { filename: "Mr_Subrahmanya_Srikanth_G.jpg", path: "/faculty/Mr_Subrahmanya_Srikanth_G.jpg", label: "Mr. Subrahmanya Srikanth G" },
  { filename: "Mr_M_Santhosh_Kumar.jpg", path: "/faculty/Mr_M_Santhosh_Kumar.jpg", label: "Mr. M. Santhosh Kumar (AS)" },
  { filename: "Dr_B_Sanyasi_Rao.jpg", path: "/faculty/Dr_B_Sanyasi_Rao.jpg", label: "Dr. B. Sanyasi Rao (SS)" },
  { filename: "Dr_A_Ganapathi_Rao.jpg", path: "/faculty/Dr_A_Ganapathi_Rao.jpg", label: "Dr. A. Ganapathi Rao (DMS)" },
  { filename: "Dr_Y_Aditya.jpg", path: "/faculty/Dr_Y_Aditya.jpg", label: "Dr. Y. Aditya (DMS)" },
  { filename: "Dr_D_Srinivasa_Kumar.jpg", path: "/faculty/Dr_D_Srinivasa_Kumar.jpg", label: "Dr. D. Srinivasa Kumar (EEPM)" },
  { filename: "Dr_KVS_Prasad.jpg", path: "/faculty/Dr_KVS_Prasad.jpg", label: "Dr. KVS Prasad (EEPM)" },
  { filename: "Mr_N_L_V_Venu_Gopal.jpg", path: "/faculty/Mr_N_L_V_Venu_Gopal.jpg", label: "Mr. N.L.V. Venu Gopal" },
  { filename: "Ms_G_Lavanya.jpg", path: "/faculty/Ms_G_Lavanya.jpg", label: "Ms. G. Lavanya" },
  { filename: "Ms_Vasantha_Lakshmi_K.jpg", path: "/faculty/Ms_Vasantha_Lakshmi_K.jpg", label: "Ms. Vasantha Lakshmi K" }
];

export const AdminDashboard = () => {
  const [adminPin, setAdminPin] = useState(localStorage.getItem('td_admin_pin') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(null);

  // Dashboard Data
  const [activeTab, setActiveTab] = useState('votes'); // 'votes' | 'speakers' | 'submissions' | 'moderation' | 'teachers'
  const [overview, setOverview] = useState(null);
  const [anecdotes, setAnecdotes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacherResults, setTeacherResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [viewingPass, setViewingPass] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [showSectionBreakdown, setShowSectionBreakdown] = useState(true);

  // Add / Edit teacher form
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    degree: 'M.Tech.',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    avatar: '/faculty/Dr_A_V_Ramana.jpg'
  });

  // Image adding & Preset Gallery state
  const [facultyPresets, setFacultyPresets] = useState(defaultFacultyPresets);
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'preset' | 'url'
  const [presetSearch, setPresetSearch] = useState('');
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Payment & UPI Configuration state
  const [paymentSettings, setPaymentSettings] = useState({
    upiId: 'cseteachersday2026@upi',
    payeeName: 'CSE Teachers Day 2026',
    razorpayButtonId: '',
    razorpayPageUrl: '',
    enableUpi: true,
    enableRazorpayButton: true
  });
  const [isSavingPaymentSettings, setIsSavingPaymentSettings] = useState(false);
  const [adminQrPreview, setAdminQrPreview] = useState('');

  // Client-side Canvas Image Compression Helper (400x400 max, 85% JPEG)
  const compressImageFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Please select a valid image file (PNG, JPG, WEBP, SVG, etc.).'));
      }
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read SVG image file.'));
        reader.readAsDataURL(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 400;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Unable to decode image file.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileUpload = async (file) => {
    if (!file) return;
    setIsOptimizingImage(true);
    try {
      const dataUrl = await compressImageFile(file);
      setTeacherFormData(prev => ({ ...prev, avatar: dataUrl }));
      setNotification({ type: 'success', message: 'Faculty photo uploaded and optimized successfully!' });
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to process image file.' });
    } finally {
      setIsOptimizingImage(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    const pinToTry = pinInput || adminPin;
    setAuthError(null);
    setLoading(true);

    try {
      const data = await api.getAdminOverview(pinToTry);
      if (data.success) {
        setIsAuthenticated(true);
        setAdminPin(pinToTry);
        localStorage.setItem('td_admin_pin', pinToTry);
        setOverview(data.data);
        setIsRevealed(data.data.revealVotingResults || false);
        loadData(pinToTry);
      }
    } catch (err) {
      setAuthError(err.message || 'Invalid Admin Authorization PIN. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (pin) => {
    setLoading(true);
    try {
      const [anecRes, subRes, overRes, teacherRes, resultsRes, presetsRes, payRes] = await Promise.all([
        api.getAdminAnecdotes(pin),
        api.getAdminSubmissions(pin),
        api.getAdminOverview(pin),
        api.getTeachers(),
        api.getAdminTeacherResults(pin),
        api.getFacultyPresets(pin).catch(() => ({ success: false, data: [] })),
        api.getAdminPaymentConfig(pin).catch(() => ({ success: false, data: null }))
      ]);
      if (anecRes.success) setAnecdotes(anecRes.data);
      if (subRes.success) setSubmissions(subRes.data);
      if (overRes.success) {
        setOverview(overRes.data);
        setIsRevealed(overRes.data.revealVotingResults || false);
      }
      if (teacherRes.success) setTeachers(teacherRes.data);
      if (resultsRes.success) {
        setTeacherResults(resultsRes.data);
        setCategories(resultsRes.categories || []);
      }
      if (presetsRes && presetsRes.success && Array.isArray(presetsRes.data) && presetsRes.data.length > 0) {
        setFacultyPresets(presetsRes.data);
      }
      if (payRes && payRes.success && payRes.data) {
        setPaymentSettings(payRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate Admin Test QR Code Preview
  useEffect(() => {
    const upiId = paymentSettings.upiId || 'cseteachersday2026@upi';
    const payeeName = paymentSettings.payeeName || 'CSE Teachers Day 2026';
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=50&cu=INR&tn=CSE_TeachersDay2026`;

    QRCode.toDataURL(upiUri, { width: 180, margin: 1 })
      .then(url => setAdminQrPreview(url))
      .catch(console.error);
  }, [paymentSettings.upiId, paymentSettings.payeeName]);

  const handleSavePaymentSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSavingPaymentSettings(true);
    try {
      const res = await api.updateAdminPaymentConfig(adminPin, paymentSettings);
      if (res.success) {
        setNotification({ type: 'success', message: 'UPI ID & Razorpay Button settings saved successfully!' });
        if (res.data) setPaymentSettings(res.data);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to save payment settings' });
    } finally {
      setIsSavingPaymentSettings(false);
    }
  };

  useEffect(() => {
    if (adminPin) {
      handleLogin();
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPin('');
    localStorage.removeItem('td_admin_pin');
  };

  const handleToggleReveal = async () => {
    const nextState = !isRevealed;
    try {
      const res = await api.toggleRevealResults(adminPin, nextState);
      if (res.success) {
        setIsRevealed(nextState);
        setNotification({
          type: 'success',
          message: nextState
            ? 'Voting results are now PUBLICLY REVEALED to all students!'
            : 'Voting results are now HIDDEN (Secret Ballot Active).'
        });
        loadData(adminPin);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleModerate = async (anecdoteId, status) => {
    try {
      const res = await api.moderateAnecdote(adminPin, anecdoteId, status);
      if (res.success) {
        setNotification({ type: 'success', message: `Anecdote status updated to "${status}"!` });
        loadData(adminPin);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleTogglePayment = async (submissionId, currentStatus) => {
    const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';
    try {
      const res = await api.verifyPayment(adminPin, submissionId, newStatus);
      if (res.success) {
        setNotification({ type: 'success', message: `Payment marked as ${newStatus}!` });
        loadData(adminPin);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleDeleteSubmission = async (id, studentName, ticketNumber) => {
    if (!window.confirm(`Are you sure you want to permanently delete registration for "${studentName}" (${ticketNumber || id})? This will remove their event ticket and voting record.`)) {
      return;
    }

    try {
      const res = await api.deleteSubmission(adminPin, id);
      if (res.success) {
        setNotification({ type: 'success', message: `Registration for ${studentName} successfully deleted.` });
        if (selectedStudent && (selectedStudent.id === id || selectedStudent.ticketNumber === id)) {
          setSelectedStudent(null);
        }
        loadData(adminPin);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleDeleteAnecdote = async (id, teacherName) => {
    if (!window.confirm(`Are you sure you want to permanently delete this memory story about "${teacherName}"?`)) {
      return;
    }

    try {
      const res = await api.deleteAnecdote(adminPin, id);
      if (res.success) {
        setNotification({ type: 'success', message: `Memory story deleted successfully.` });
        loadData(adminPin);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    if (!teacherFormData.name.trim()) return;

    try {
      if (editingTeacherId) {
        const res = await api.updateTeacher(adminPin, editingTeacherId, teacherFormData);
        if (res.success) {
          setNotification({ type: 'success', message: `Faculty ${teacherFormData.name} successfully updated!` });
        }
      } else {
        const res = await api.addTeacher(adminPin, teacherFormData);
        if (res.success) {
          setNotification({ type: 'success', message: `Faculty ${teacherFormData.name} successfully added to roster!` });
        }
      }
      setShowAddTeacher(false);
      setEditingTeacherId(null);
      setTeacherFormData({
        name: '',
        degree: 'M.Tech.',
        department: 'Computer Science & Engineering',
        designation: 'Assistant Professor',
        avatar: '/faculty/Dr_A_V_Ramana.jpg'
      });
      loadData(adminPin);
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleDeleteTeacher = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the CSE Faculty roster?`)) return;

    try {
      const res = await api.deleteTeacher(adminPin, id);
      if (res.success) {
        setNotification({ type: 'success', message: `Faculty ${name} removed from roster.` });
        loadData(adminPin);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleEditClick = (t) => {
    setEditingTeacherId(t.id);
    setTeacherFormData({
      name: t.name,
      degree: t.degree || 'M.Tech.',
      department: t.department || 'Computer Science & Engineering',
      designation: t.designation || 'Assistant Professor',
      avatar: t.avatar || '/faculty/Dr_A_V_Ramana.jpg'
    });
    setShowAddTeacher(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="glass-card-glow rounded-3xl p-8 text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 mb-1">
              <Code className="w-3.5 h-3.5" /> CSE DEPARTMENT 2026
            </div>
            <h2 className="text-2xl font-black text-white font-display">Committee Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your authorization PIN to access management tools.</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                placeholder="Enter Security PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm shadow-lg transition-all"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.ticketNumber && s.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.acknowledgementNumber && s.acknowledgementNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || s.payment?.status === statusFilter;
    
    const sYear = (s.year || '').toUpperCase();
    const sSec = (s.section || '').toUpperCase();
    const matchesYear = yearFilter === 'ALL' ||
      (yearFilter.includes('2') && (sYear.includes('2') || sSec.includes('2'))) ||
      (yearFilter.includes('3') && (sYear.includes('3') || sSec.includes('3')));

    const matchesSection = sectionFilter === 'ALL' ||
      sSec === sectionFilter.toUpperCase() ||
      sSec.includes(sectionFilter.slice(-1));

    return matchesSearch && matchesStatus && matchesYear && matchesSection;
  });

  const registeredSpeakers = submissions.filter(s => s.interestedInSpeaking === 'Yes');

  const filteredTeachers = teacherResults.filter(t =>
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.designation.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredPresets = (facultyPresets && facultyPresets.length > 0 ? facultyPresets : defaultFacultyPresets).filter(p =>
    p.label.toLowerCase().includes(presetSearch.toLowerCase()) ||
    p.filename.toLowerCase().includes(presetSearch.toLowerCase())
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase">
              CSE Department 2nd & 3rd Year (Sections 2A–2D, 3A–3D)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
            CSE Teachers' Day 2026 Control Center
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Public Reveal Switch */}
          <button
            onClick={handleToggleReveal}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${isRevealed
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700'
              }`}
            title="Toggle public disclosure of voting results"
          >
            {isRevealed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
            <span>{isRevealed ? 'Public Results: REVEALED' : 'Public Results: HIDDEN (Secret)'}</span>
          </button>

          <button
            onClick={() => loadData(adminPin)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <a
            href={api.getExportCsvUrl(adminPin)}
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 hover:text-rose-300 text-slate-400 text-xs font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between ${notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
          }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">CSE Registrations</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {overview?.totalSubmissions || 0}
          </div>
          <span className="text-[11px] text-slate-400">2nd, 3rd & 4th Years (A-D)</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Stage Speakers</span>
            <Mic className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
            {overview?.speakersCount || registeredSpeakers.length}
          </div>
          <span className="text-[11px] text-amber-300">Registered on stage</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Funds Raised (₹)</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">
            ₹{overview?.totalFundsCollected || 0}
          </div>
          <span className="text-[11px] text-emerald-300">
            {overview?.verifiedPayments || 0} Verified Contributions
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Secret Ballot Votes</span>
            <Vote className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-pink-400 font-display">
            {overview?.totalVotes || 0}
          </div>
          <span className="text-[11px] text-slate-400">Cast across categories</span>
        </div>

      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">

        <button
          onClick={() => setActiveTab('votes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'votes'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Category Voting Results ({teacherResults.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('speakers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'speakers'
              ? 'bg-amber-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
          <Mic className="w-4 h-4" />
          <span>Stage Speakers ({registeredSpeakers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'submissions'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Contributions ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'moderation'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Anecdotes ({anecdotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'teachers'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Manage Roster ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('paymentSettings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'paymentSettings'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>UPI Settings</span>
        </button>
      </div>

      {/* TAB: SECRET BALLOT CATEGORY VOTING RESULTS */}
      {activeTab === 'votes' && (
        <div className="space-y-6">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Confidential Voting Results & Category Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400">
                These tallies are strictly confidential to the committee unless you click <span className="text-amber-400 font-bold">"Reveal Public Results"</span>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isRevealed
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                {isRevealed ? '✓ Publicly Disclosed' : '🔒 Confidential / Secret Ballot'}
              </span>
            </div>
          </div>

          {/* Category Winners Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {categories.map(cat => {
              const topInCat = [...teacherResults].sort((a, b) => {
                const vA = (a.categoryVotes && a.categoryVotes[cat.id]) || 0;
                const vB = (b.categoryVotes && b.categoryVotes[cat.id]) || 0;
                return vB - vA;
              })[0];

              const leaderVotes = topInCat?.categoryVotes?.[cat.id] || 0;

              return (
                <div key={cat.id} className="p-4 rounded-2xl glass-card border border-amber-400/30 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block truncate">
                    {cat.title}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white truncate">
                      {topInCat && leaderVotes > 0 ? topInCat.name : 'Voting in progress'}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {topInCat && leaderVotes > 0 ? `${leaderVotes} Votes • ${topInCat.designation}` : '0 votes recorded yet'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search Faculty Results */}
          <div className="max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty votes..."
              value={teacherSearch}
              onChange={(e) => setTeacherSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category Vote Breakdown Table */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-white/10">
                <tr>
                  <th className="p-3.5">Faculty Member</th>
                  <th className="p-3.5 text-center">🏆 Inspiring Mentor</th>
                  <th className="p-3.5 text-center">💡 Concept Explainer</th>
                  <th className="p-3.5 text-center">😊 Friendly & Approachable</th>
                  <th className="p-3.5 text-center">💻 Tech Guru</th>
                  <th className="p-3.5 text-center">🌟 Star Faculty</th>
                  <th className="p-3.5 text-right font-black text-amber-400">Total Votes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTeachers.map((t) => {
                  const catV = t.categoryVotes || { inspiring: 0, explainer: 0, friendly: 0, techGuru: 0, starFaculty: 0 };
                  const total = t.totalVotes || 0;

                  return (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-lg object-cover border border-white/15" />
                          <div>
                            <div className="font-bold text-white">{t.name}</div>
                            <div className="text-[11px] text-slate-400">{t.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-amber-300">{catV.inspiring || 0}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-yellow-300">{catV.explainer || 0}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-emerald-300">{catV.friendly || 0}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-cyan-300">{catV.techGuru || 0}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-pink-300">{catV.starFaculty || 0}</td>
                      <td className="p-3.5 text-right font-mono font-black text-base text-amber-400">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB: STAGE SPEAKERS LINEUP */}
      {activeTab === 'speakers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-amber-400" />
                <span>Students Who Want to Speak / Share Words on Stage</span>
              </h3>
              <p className="text-xs text-slate-400">Speakers from 2nd, 3rd, and 4th Years (Sections A-D)</p>
            </div>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Total Speakers: {registeredSpeakers.length}
            </span>
          </div>

          {registeredSpeakers.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl text-xs text-slate-400">
              No students have registered to speak on stage yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registeredSpeakers.map((sp) => (
                <div key={sp.id} className="glass-card rounded-2xl p-5 border border-amber-500/30 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{sp.name}</h4>
                      <span className="text-xs text-purple-300 font-mono">{sp.rollNumber} • {sp.year} • {sp.section}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {sp.ticketNumber}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1 text-xs">
                    <div className="text-slate-400">
                      Speaking About: <span className="text-amber-400 font-bold">{sp.speechTeacher || sp.favoriteTeacher}</span>
                    </div>
                    <div className="text-slate-300 italic">
                      "{sp.speechTopic || 'Tribute & gratitude speech'}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                    <span className="font-semibold text-emerald-400">✓ ₹{sp.payment?.amount || 50} Verified</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedStudent(sp)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 font-bold text-[11px] flex items-center gap-1 transition-colors border border-purple-500/30"
                        title="View Full Pass Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSubmission(sp.id, sp.name, sp.ticketNumber)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-bold text-[11px] flex items-center gap-1 transition-colors border border-rose-500/30"
                        title="Delete Speaker Registration"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: ANECDOTES MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Student Anecdotes & Fun Wall Queue</h3>
            <span className="text-xs text-slate-400">Total: {anecdotes.length}</span>
          </div>

          {anecdotes.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl text-xs text-slate-400">
              No anecdotes submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anecdotes.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-xs font-bold text-amber-400">{item.teacherName}</span>
                        <p className="text-[11px] text-slate-400">By {item.studentName} (CSE {item.year}, {item.section})</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-white/5 italic my-3">
                      "{item.anecdote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    {item.status !== 'approved' && (
                      <button
                        onClick={() => handleModerate(item.id, 'approved')}
                        className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {item.status !== 'rejected' && (
                      <button
                        onClick={() => handleModerate(item.id, 'rejected')}
                        className="flex-1 py-1.5 px-3 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {item.status !== 'pending' && (
                      <button
                        onClick={() => handleModerate(item.id, 'pending')}
                        className="py-1.5 px-3 bg-slate-800 text-slate-400 rounded-lg text-xs font-semibold"
                      >
                        Reset
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteAnecdote(item.id, item.teacherName)}
                      className="py-1.5 px-2.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 border border-rose-500/30"
                      title="Permanently Delete Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: ALL SUBMISSIONS & PAYMENTS */}
      {activeTab === 'submissions' && (
        <div className="space-y-5">

          {/* Section-Wise Status & Payment Matrix */}
          <div className="glass-card p-4 sm:p-5 rounded-3xl border border-purple-500/20 bg-slate-950/60 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                    <span>Section-Wise Status & Payments</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      8 Sections
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live registration, verified payment count, funds raised, and 1-click section CSV downloads
                  </p>
                </div>
              </div>

              {/* Global CSV Download Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={api.getExportCsvUrl(adminPin, {})}
                  download
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95"
                  title="Download complete registered students & payment list"
                >
                  <Download className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Master CSV (All)</span>
                </a>

                <a
                  href={api.getExportCsvUrl(adminPin, { summary: true })}
                  download
                  className="px-3.5 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
                  title="Download executive section-wise summary numbers"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Section Summary CSV</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowSectionBreakdown(!showSectionBreakdown)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 font-bold text-xs transition-all"
                >
                  {showSectionBreakdown ? 'Hide Matrix' : 'Show Matrix'}
                </button>
              </div>
            </div>

            {showSectionBreakdown && (
              <div className="space-y-4 pt-1">
                {['2nd Year', '3rd Year'].map((year) => {
                  const isYear2 = year.includes('2');
                  const sectionsList = isYear2 
                    ? ['CSE 2A', 'CSE 2B', 'CSE 2C', 'CSE 2D'] 
                    : ['CSE 3A', 'CSE 3B', 'CSE 3C', 'CSE 3D'];

                  const yearSubmissions = submissions.filter(s => {
                    const sYear = (s.year || '').toUpperCase();
                    const sSec = (s.section || '').toUpperCase();
                    return isYear2 ? (sYear.includes('2') || sSec.includes('2')) : (sYear.includes('3') || sSec.includes('3'));
                  });
                  const yearFunds = yearSubmissions.filter(s => s.payment?.status === 'verified').reduce((sum, s) => sum + (s.payment?.amount || 50), 0);
                  
                  return (
                    <div key={year} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          {year} CSE
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Total in {year}: <strong className="text-white">{yearSubmissions.length} Students</strong> • <strong className="text-emerald-400">₹{yearFunds} Collected</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {sectionsList.map((sec) => {
                          const letter = sec.slice(-1);
                          const matching = submissions.filter(s => {
                            const sYear = (s.year || '').toUpperCase();
                            const sSec = (s.section || '').toUpperCase();
                            const isYearMatch = isYear2 ? (sYear.includes('2') || sSec.includes('2')) : (sYear.includes('3') || sSec.includes('3'));
                            const isSecMatch = sSec === sec || sSec.includes(letter);
                            return isYearMatch && isSecMatch;
                          });
                          const verified = matching.filter(s => s.payment?.status === 'verified');
                          const funds = verified.reduce((sum, s) => sum + (s.payment?.amount || 50), 0);
                          const speakers = matching.filter(s => s.interestedInSpeaking === 'Yes').length;
                          const isCurrentFilter = yearFilter === year && sectionFilter === sec;

                          return (
                            <div
                              key={sec}
                              className={`p-3 rounded-2xl border transition-all relative group flex flex-col justify-between ${
                                isCurrentFilter
                                  ? 'bg-purple-950/70 border-purple-400 shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                                  : matching.length > 0
                                  ? 'bg-slate-900/80 hover:bg-slate-900 border-white/10 hover:border-purple-400/40'
                                  : 'bg-slate-950/40 border-white/5 opacity-75 hover:opacity-100'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                                    {sec}
                                  </span>
                                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                                    matching.length > 0 
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                                      : 'bg-slate-800 text-slate-500'
                                  }`}>
                                    {matching.length} Students
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-1 text-[11px] mb-2 font-mono">
                                  <div className="bg-slate-950/60 p-1.5 rounded-lg border border-white/5">
                                    <span className="text-slate-400 text-[10px] block">Verified:</span>
                                    <span className="font-bold text-emerald-400">✓ {verified.length} (₹{funds})</span>
                                  </div>
                                  <div className="bg-slate-950/60 p-1.5 rounded-lg border border-white/5">
                                    <span className="text-slate-400 text-[10px] block">Speakers:</span>
                                    <span className="font-bold text-amber-300">🎤 {speakers}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Action buttons inside card */}
                              <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setYearFilter(year);
                                    setSectionFilter(sec);
                                  }}
                                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all text-center ${
                                    isCurrentFilter
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                                  }`}
                                >
                                  {isCurrentFilter ? 'Selected' : 'Filter Table'}
                                </button>

                                <a
                                  href={api.getExportCsvUrl(adminPin, { year, section: sec })}
                                  download
                                  className="p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 transition-all text-[10px] font-bold flex items-center gap-1 px-2"
                                  title={`Download CSV for ${year} ${sec}`}
                                >
                                  <Download className="w-3 h-3" />
                                  <span>CSV</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Filters Bar & Summary Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400 font-mono">
              Showing <strong className="text-white">{filteredSubmissions.length}</strong> matching students • Verified Total: <strong className="text-emerald-400">₹{filteredSubmissions.filter(s => s.payment?.status === 'verified').reduce((sum, s) => sum + (s.payment?.amount || 50), 0)}</strong>
            </div>

            {(yearFilter !== 'ALL' || sectionFilter !== 'ALL' || statusFilter !== 'ALL' || searchTerm) && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setYearFilter('ALL');
                    setSectionFilter('ALL');
                    setStatusFilter('ALL');
                    setSearchTerm('');
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline"
                >
                  Clear Filters
                </button>
                
                <a
                  href={api.getExportCsvUrl(adminPin, { year: yearFilter, section: sectionFilter, status: statusFilter })}
                  download
                  className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Filtered CSV ({filteredSubmissions.length})</span>
                </a>
              </div>
            )}
          </div>

          {/* Filters Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative sm:col-span-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or roll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Years (2nd & 3rd Year)</option>
              <option value="2nd Year">2nd Year (Sections 2A–2D)</option>
              <option value="3rd Year">3rd Year (Sections 3A–3D)</option>
            </select>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Sections (8 Sections)</option>
              <optgroup label="2nd Year Sections">
                <option value="CSE 2A">CSE 2A</option>
                <option value="CSE 2B">CSE 2B</option>
                <option value="CSE 2C">CSE 2C</option>
                <option value="CSE 2D">CSE 2D</option>
              </optgroup>
              <optgroup label="3rd Year Sections">
                <option value="CSE 3A">CSE 3A</option>
                <option value="CSE 3B">CSE 3B</option>
                <option value="CSE 3C">CSE 3C</option>
                <option value="CSE 3D">CSE 3D</option>
              </optgroup>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Payment Status</option>
              <option value="verified">Verified (₹50+ Paid)</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-white/10">
                <tr>
                  <th className="p-3.5">Receipt / Pass ID</th>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Year & Section</th>
                  <th className="p-3.5">Stage Speaker?</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No student contributions found matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const isVerified = sub.payment?.status === 'verified';
                    return (
                      <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-amber-300">
                          {sub.ticketNumber}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-white">{sub.name}</div>
                          <div className="text-[11px] text-purple-300 font-mono">{sub.rollNumber}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{sub.year}</div>
                          <div className="text-[11px] text-amber-400">{sub.section}</div>
                        </td>
                        <td className="p-3.5">
                          {sub.interestedInSpeaking === 'Yes' ? (
                            <span className="inline-flex items-center gap-1 text-amber-300 font-bold text-xs">
                              <Mic className="w-3.5 h-3.5" /> Yes ({sub.speechTeacher})
                            </span>
                          ) : (
                            <span className="text-slate-500">Attendee</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${isVerified
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                              {isVerified ? `✓ ₹${sub.payment?.amount || 50} Paid` : '⏳ Pending'}
                            </span>
                            <div className="text-[10px] font-mono text-slate-400">
                              {sub.payment?.paymentMethod === 'UPI_DIRECT' ? '📱 UPI: ' : '💳 RZP: '}
                              <span className="text-amber-300 font-bold select-all">{sub.payment?.transactionId || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingPass(sub)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 font-bold text-[11px] flex items-center gap-1 transition-colors border border-emerald-500/30"
                            title="View & Print Official Acknowledgement Slip"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Slip</span>
                          </button>

                          <button
                            onClick={() => setSelectedStudent(sub)}
                            className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 font-bold text-[11px] flex items-center gap-1 transition-colors border border-purple-500/30"
                            title="View Full Registration Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => handleTogglePayment(sub.id, sub.payment?.status)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all border ${isVerified
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/10'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500/40'
                              }`}
                            title={isVerified ? 'Mark as Pending' : `Verify ₹${sub.payment?.amount || 50} Payment`}
                          >
                            {isVerified ? 'Mark Pending' : `Verify ₹${sub.payment?.amount || 50}`}
                          </button>

                          <button
                            onClick={() => handleDeleteSubmission(sub.id, sub.name, sub.ticketNumber)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-bold text-[11px] flex items-center gap-1 transition-colors border border-rose-500/30"
                            title="Delete Student Registration"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB: MANAGE CSE ROSTER */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span>CSE Faculty Roster Management</span>
              </h3>
              <p className="text-xs text-slate-400">Total Present Faculty: {teachers.length}</p>
            </div>

            <button
              onClick={() => {
                setEditingTeacherId(null);
                setTeacherFormData({
                  name: '',
                  degree: 'M.Tech.',
                  department: 'Computer Science & Engineering',
                  designation: 'Assistant Professor',
                  avatar: '/faculty/Dr_A_V_Ramana.jpg'
                });
                setShowAddTeacher(!showAddTeacher);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 text-xs font-black shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddTeacher ? 'Close Form' : '+ Add New Faculty Member'}</span>
            </button>
          </div>

          {/* Form */}
          {showAddTeacher && (
            <div className="glass-card-glow rounded-3xl p-6 border border-amber-500/40 shadow-2xl animate-fadeIn">
              <h4 className="text-base font-bold text-white mb-4">
                {editingTeacherId ? 'Edit Faculty Details' : 'Add New Faculty to Roster'}
              </h4>

              <form onSubmit={handleSaveTeacher} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Faculty Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Kulkarni"
                      value={teacherFormData.name}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Degree / Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. M.Tech., Ph.D."
                      value={teacherFormData.degree}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, degree: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Associate Professor"
                      value={teacherFormData.designation}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, designation: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Faculty Photo / Avatar Management Section */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>Faculty Member Photo / Avatar</span>
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Upload custom photo, pick from 40+ department faculty presets, or enter an image web URL.
                      </p>
                    </div>

                    {/* Reset button */}
                    <button
                      type="button"
                      onClick={() => setTeacherFormData({ ...teacherFormData, avatar: '/faculty/Dr_A_V_Ramana.jpg' })}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-white border border-white/10 transition-colors self-start sm:self-auto"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    
                    {/* Left Column: Live Avatar Preview Card */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-center space-y-2.5">
                      <div className="relative group">
                        <img
                          src={teacherFormData.avatar || '/faculty/Dr_A_V_Ramana.jpg'}
                          alt="Faculty Preview"
                          className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-amber-400/80 shadow-xl shadow-amber-500/20 bg-slate-950 transition-all"
                          onError={(e) => {
                            e.target.src = '/faculty/Dr_A_V_Ramana.jpg';
                          }}
                        />
                        {isOptimizingImage && (
                          <div className="absolute inset-0 rounded-2xl bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-amber-400 text-xs font-bold gap-1">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        )}
                      </div>

                      <div className="w-full">
                        <div className="text-xs font-bold text-white truncate">
                          {teacherFormData.name || 'Faculty Full Name'}
                        </div>
                        <div className="text-[10px] text-purple-300 truncate">
                          {teacherFormData.designation || 'Designation'}
                        </div>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          teacherFormData.avatar?.startsWith('data:image/')
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : teacherFormData.avatar?.startsWith('http')
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        }`}>
                          {teacherFormData.avatar?.startsWith('data:image/')
                            ? '✨ Uploaded Custom Photo'
                            : teacherFormData.avatar?.startsWith('http')
                              ? '🔗 Web Link Photo'
                              : '🏛️ Department Preset'}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Image Input Mode Tabs */}
                    <div className="md:col-span-8 space-y-3">
                      {/* Sub-tabs */}
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <button
                          type="button"
                          onClick={() => setImageTab('upload')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            imageTab === 'upload'
                              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                              : 'text-slate-400 hover:text-white bg-slate-900/80 border border-white/5'
                          }`}
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setImageTab('preset')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            imageTab === 'preset'
                              ? 'bg-purple-600 text-white font-bold shadow-md'
                              : 'text-slate-400 hover:text-white bg-slate-900/80 border border-white/5'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Department Gallery ({facultyPresets.length || 40})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setImageTab('url')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            imageTab === 'url'
                              ? 'bg-cyan-600 text-white font-bold shadow-md'
                              : 'text-slate-400 hover:text-white bg-slate-900/80 border border-white/5'
                          }`}
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Web URL Link</span>
                        </button>
                      </div>

                      {/* Tab 1: Upload from Computer/Phone */}
                      {imageTab === 'upload' && (
                        <div className="space-y-3">
                          <label
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOver(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) handleImageFileUpload(file);
                            }}
                            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                              dragOver
                                ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
                                : 'border-white/20 hover:border-amber-400/60 bg-slate-900/50 hover:bg-slate-900'
                            }`}
                          >
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageFileUpload(file);
                              }}
                              className="hidden"
                            />
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <div className="text-xs font-bold text-white">
                              Click to Browse or Drag & Drop Photo Here
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Supports PNG, JPG, JPEG, WEBP, SVG • Auto-resizes & compresses for high speed
                            </p>
                          </label>
                        </div>
                      )}

                      {/* Tab 2: Choose from Department Gallery */}
                      {imageTab === 'preset' && (
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search department photo by faculty name..."
                              value={presetSearch}
                              onChange={(e) => setPresetSearch(e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-400"
                            />
                          </div>

                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-52 overflow-y-auto pr-1 p-1 bg-slate-950/60 rounded-xl border border-white/5">
                            {filteredPresets.map((preset) => {
                              const isSelected = teacherFormData.avatar === preset.path;
                              return (
                                <button
                                  key={preset.filename}
                                  type="button"
                                  onClick={() => setTeacherFormData({ ...teacherFormData, avatar: preset.path })}
                                  className={`relative group rounded-xl p-1.5 border transition-all text-left flex flex-col items-center ${
                                    isSelected
                                      ? 'border-amber-400 bg-amber-400/20 ring-2 ring-amber-400 shadow-md'
                                      : 'border-white/10 hover:border-white/30 bg-slate-900/60 hover:bg-slate-800'
                                  }`}
                                  title={preset.label}
                                >
                                  <img
                                    src={preset.path}
                                    alt={preset.label}
                                    className="w-12 h-12 rounded-lg object-cover bg-slate-950"
                                    onError={(e) => { e.target.src = '/faculty/Dr_A_V_Ramana.jpg'; }}
                                  />
                                  <span className="text-[9px] text-slate-300 font-medium truncate w-full text-center mt-1 block">
                                    {preset.label}
                                  </span>
                                  {isSelected && (
                                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[9px] shadow">
                                      ✓
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Tab 3: Web Image URL Link */}
                      {imageTab === 'url' && (
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-slate-300">
                            Enter Public Image Web URL (HTTPS):
                          </label>
                          <div className="relative">
                            <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="url"
                              placeholder="https://example.com/faculty-photo.jpg"
                              value={teacherFormData.avatar?.startsWith('data:') ? '' : teacherFormData.avatar}
                              onChange={(e) => setTeacherFormData({ ...teacherFormData, avatar: e.target.value.trim() })}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Paste any direct photo link from college website, Google Drive, LinkedIn, or Cloudinary.
                          </p>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg transition-all"
                  >
                    {editingTeacherId ? 'Save Changes' : 'Add to Faculty Roster'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowAddTeacher(false); setEditingTeacherId(null); }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((t, idx) => (
              <div
                key={t.id}
                className="glass-card rounded-2xl p-4 border border-white/10 flex items-start justify-between gap-3 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/15 shrink-0"
                    onError={(e) => {
                      e.target.src = '/faculty/Dr_A_V_Ramana.jpg';
                    }}
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{t.name}</h4>
                    <p className="text-[11px] text-slate-400">{t.designation}</p>
                    <p className="text-[11px] text-purple-300 font-medium">{t.degree}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleEditClick(t)}
                    className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 transition-colors"
                    title="Edit Designation"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteTeacher(t.id, t.name)}
                    className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 transition-colors"
                    title="Remove Faculty"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB: UPI SETTINGS */}
      {activeTab === 'paymentSettings' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>UPI Configuration & Live QR Verification</span>
              </h3>
              <p className="text-xs text-slate-400">
                Direct instant payments with 0% gateway fees. Funds are credited directly to your bank account.
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePaymentSettings} className="space-y-6 max-w-3xl">
            
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Recipient UPI Details</h4>
                    <span className="text-xs text-emerald-400 font-semibold">Universal UPI Link & Dynamic QR</span>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  Active (0% Fees)
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">
                    Receiver UPI ID <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. venkatathrinadh958301.rzp@rxairtel"
                    value={paymentSettings.upiId || ''}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                  <p className="text-[11px] text-slate-400">
                    All student contributions will be sent directly to this UPI address.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">
                    Payee Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ADABALA VENKATA THRINADH"
                    value={paymentSettings.payeeName || ''}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, payeeName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/15 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Live Dynamic QR Code Preview */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-center gap-5">
                  <div className="p-2.5 bg-white rounded-2xl shadow-xl shrink-0">
                    {adminQrPreview ? (
                      <img src={adminQrPreview} alt="Live UPI QR" className="w-32 h-32 rounded-lg object-contain" />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center text-slate-800 text-xs">Loading...</div>
                    )}
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="text-sm font-bold text-white">Live QR Code Test Preview</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Scan this QR code with any UPI app to verify that payments route correctly to your bank account before student registrations begin.
                    </p>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 inline-block">
                      upi://pay?pa={paymentSettings.upiId || 'venkatathrinadh958301.rzp@rxairtel'}&am=50
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isSavingPaymentSettings}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all"
                >
                  {isSavingPaymentSettings ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Saving UPI ID...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save UPI Settings</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </form>

        </div>
      )}

      {/* STUDENT REGISTRATION DETAILS MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg glass-card rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden animate-scaleUp p-6 space-y-4">

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  Ticket: {selectedStudent.ticketNumber || selectedStudent.id}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Student Registration Details</h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/80 border border-white/5">
                <div>
                  <span className="text-slate-400 text-[11px] block">Full Name</span>
                  <span className="font-bold text-white text-sm">{selectedStudent.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">CSE Roll Number</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{selectedStudent.rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Year & Section</span>
                  <span className="font-semibold text-slate-200">{selectedStudent.year} • {selectedStudent.section}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Department</span>
                  <span className="text-slate-200">CSE</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Phone / WhatsApp</span>
                  <span className="text-slate-200 font-mono">{selectedStudent.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Email</span>
                  <span className="text-slate-200 font-mono truncate">{selectedStudent.email || 'N/A'}</span>
                </div>
              </div>

              {/* Stage Speech details */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  Stage Speech Interest: {selectedStudent.interestedInSpeaking || 'No'}
                </span>
                {selectedStudent.interestedInSpeaking === 'Yes' && (
                  <>
                    <div className="text-slate-300">
                      Faculty To Tell About: <span className="font-bold text-white">{selectedStudent.speechTeacher || 'All CSE Faculty'}</span>
                    </div>
                    {selectedStudent.speechTopic && (
                      <div className="text-slate-400 italic">
                        Topic: "{selectedStudent.speechTopic}"
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Favorite Teacher & Anecdote */}
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Favorite Teacher:</span>
                  <span className="text-purple-300 font-bold">{selectedStudent.favoriteTeacher || 'Not Selected'}</span>
                </div>
                {selectedStudent.anecdote && (
                  <div className="border-t border-white/5 pt-1.5 text-slate-300 italic">
                    "{selectedStudent.anecdote}"
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Celebration Contribution</div>
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>₹{selectedStudent.payment?.amount || 50} • {selectedStudent.payment?.status === 'verified' ? 'Verified' : 'Pending'}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    TXN / UTR: {selectedStudent.payment?.transactionId || 'N/A'} ({selectedStudent.payment?.paymentMethod === 'UPI_DIRECT' ? '📱 Direct UPI' : selectedStudent.payment?.paymentMethod || 'UPI'})
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-400">
                  {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleString() : ''}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => setViewingPass(selectedStudent)}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="View & Print Official Acknowledgement Slip"
              >
                <FileText className="w-4 h-4" />
                <span>Open Acknowledgement Slip</span>
              </button>

              <button
                onClick={() => handleDeleteSubmission(selectedStudent.id, selectedStudent.name, selectedStudent.ticketNumber)}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Permanently Delete This Registration"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Registration</span>
              </button>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FULL PRINTABLE OFFICIAL ACKNOWLEDGEMENT MODAL WITH DELETE */}
      {viewingPass && (
        <AcknowledgementModal
          submission={viewingPass}
          onClose={() => setViewingPass(null)}
          onDelete={handleDeleteSubmission}
        />
      )}

    </section>
  );
};
