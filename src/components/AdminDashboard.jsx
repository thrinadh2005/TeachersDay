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
  FileText,
  RotateCcw
} from 'lucide-react';
import QRCode from 'qrcode';
import { api } from '../utils/api';
import { AcknowledgementModal } from './AcknowledgementModal';
import { cleanJntuRoll } from '../utils/jntuValidation';

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

// Section and Year normalization helpers
export const isStudentInYear = (student, targetYear) => {
  if (!targetYear || targetYear === 'ALL') return true;
  if (!student) return false;
  const sYear = String(student.year || '').toUpperCase().trim();
  const sSec = String(student.section || '').toUpperCase().trim();
  if (targetYear.includes('2')) {
    return sYear.includes('2') || sSec.includes('2') || sSec.includes('2A') || sSec.includes('2B') || sSec.includes('2C') || sSec.includes('2D');
  }
  if (targetYear.includes('3')) {
    return sYear.includes('3') || sSec.includes('3') || sSec.includes('3A') || sSec.includes('3B') || sSec.includes('3C') || sSec.includes('3D');
  }
  return false;
};

export const isStudentInSection = (student, targetSec) => {
  if (!targetSec || targetSec === 'ALL') return true;
  if (!student) return false;
  const rawSec = String(student.section || '').toUpperCase().trim();
  const rawYear = String(student.year || '').toUpperCase().trim();
  const targetLetter = String(targetSec).slice(-1).toUpperCase();
  const targetYearNum = String(targetSec).includes('2') ? '2' : String(targetSec).includes('3') ? '3' : '';

  const isYearMatch = targetYearNum === '2'
    ? (rawYear.includes('2') || rawSec.includes('2'))
    : targetYearNum === '3'
    ? (rawYear.includes('3') || rawSec.includes('3'))
    : true;

  if (!isYearMatch) return false;

  return rawSec === String(targetSec).toUpperCase() ||
         rawSec.endsWith(targetLetter) ||
         rawSec === targetLetter ||
         rawSec === `SECTION ${targetLetter}` ||
         rawSec === `SEC ${targetLetter}` ||
         rawSec === `CSE ${targetYearNum}${targetLetter}` ||
         rawSec === `CSE ${targetLetter}`;
};

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
  const [showSectionBreakdown, setShowSectionBreakdown] = useState(false);

  // Add / Edit teacher form
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Add Student Submission state
  const [showAddSubmission, setShowAddSubmission] = useState(false);
  const [isSavingAdd, setIsSavingAdd] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    rollNumber: '',
    year: '2nd Year',
    section: 'CSE 2A',
    phone: '',
    email: '',
    paymentStatus: 'verified',
    amount: 50,
    paymentMethod: 'UPI_DIRECT',
    transactionId: '',
    vpa: '',
    interestedInSpeaking: 'No',
    speechTeacher: '',
    speechTopic: '',
    favoriteTeacher: '',
    anecdote: ''
  });

  // Edit Student Submission state
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    rollNumber: '',
    year: '2nd Year',
    section: 'CSE 2A',
    phone: '',
    email: '',
    paymentStatus: 'verified',
    amount: 50,
    paymentMethod: 'UPI_DIRECT',
    transactionId: '',
    vpa: '',
    interestedInSpeaking: 'No',
    speechTeacher: '',
    speechTopic: '',
    favoriteTeacher: '',
    anecdote: ''
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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
  const [singleRollToReset, setSingleRollToReset] = useState('');
  const [isResettingVotes, setIsResettingVotes] = useState(false);

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

  const handleResetAllVotes = async () => {
    const confirmation = window.prompt('⚠️ CAUTION: You are about to RESET ALL FACULTY VOTES AND CLEAR ALL VOTER RECORDS to 0!\n\nType "RESET" below to confirm and proceed:');
    if (confirmation !== 'RESET') {
      return;
    }

    try {
      setIsResettingVotes(true);
      const res = await api.resetAllVotes(adminPin);
      if (res.success) {
        api.clearLocalVoterCache();
        setNotification({ type: 'success', message: '🎉 All faculty votes and voter records have been successfully reset to ZERO.' });
        loadData(adminPin);
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to reset votes.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Error resetting votes.' });
    } finally {
      setIsResettingVotes(false);
    }
  };

  const handleResetSingleVoter = async (e) => {
    if (e) e.preventDefault();
    const clean = cleanJntuRoll(singleRollToReset);
    if (!clean) {
      setNotification({ type: 'error', message: 'Please enter a valid 10-digit JNTU Roll Number (e.g. 24341A0501).' });
      return;
    }

    try {
      setLoading(true);
      const res = await api.resetSingleVoter(adminPin, clean);
      if (res.success) {
        api.clearLocalVoterCache(clean);
        setNotification({ type: 'success', message: `✅ Voter lock for roll "${clean}" successfully cleared! Student can now cast a ballot again.` });
        setSingleRollToReset('');
        loadData(adminPin);
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to clear voter lock.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Error clearing voter lock.' });
    } finally {
      setLoading(false);
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

  const handleOpenAddModal = (defaultYear = null, defaultSec = null) => {
    const initialYear = defaultYear || (yearFilter !== 'ALL' ? yearFilter : '2nd Year');
    const initialSec = defaultSec || (sectionFilter !== 'ALL' ? sectionFilter : (initialYear.includes('2') ? 'CSE 2A' : 'CSE 3A'));
    const defaultTxn = `TXN_${Date.now().toString().slice(-8)}`;
    setAddFormData({
      name: '',
      rollNumber: '',
      year: initialYear,
      section: initialSec,
      phone: '',
      email: '',
      paymentStatus: 'verified',
      amount: 50,
      paymentMethod: 'UPI_DIRECT',
      transactionId: defaultTxn,
      vpa: '',
      interestedInSpeaking: 'No',
      speechTeacher: '',
      speechTopic: '',
      favoriteTeacher: '',
      anecdote: ''
    });
    setShowAddSubmission(true);
  };

  const handleSaveAddSubmission = async (e) => {
    if (e) e.preventDefault();
    const clean = cleanJntuRoll(addFormData.rollNumber);
    if (!clean) {
      setNotification({ type: 'error', message: 'Please enter a valid 10-digit JNTU Roll Number (e.g. 24341A0502).' });
      return;
    }
    if (!addFormData.name.trim()) {
      setNotification({ type: 'error', message: 'Student name is required.' });
      return;
    }

    setIsSavingAdd(true);
    try {
      const payload = {
        name: addFormData.name.trim(),
        rollNumber: clean,
        year: addFormData.year,
        section: addFormData.section,
        phone: addFormData.phone.trim(),
        email: addFormData.email.trim(),
        paymentStatus: addFormData.paymentStatus,
        amount: Number(addFormData.amount) || 50,
        paymentAmount: Number(addFormData.amount) || 50,
        paymentMethod: addFormData.paymentMethod || 'UPI_DIRECT',
        transactionId: addFormData.transactionId.trim() || `MANUAL_${Date.now()}`,
        vpa: addFormData.vpa.trim(),
        interestedInSpeaking: addFormData.interestedInSpeaking,
        speechTeacher: addFormData.speechTeacher.trim(),
        speechTopic: addFormData.speechTopic.trim(),
        favoriteTeacher: addFormData.favoriteTeacher.trim(),
        anecdote: addFormData.anecdote.trim()
      };

      const res = await api.addSubmission(adminPin, payload);
      if (res.success) {
        setNotification({ 
          type: 'success', 
          message: `🎉 Successfully registered student ${payload.name} (${payload.rollNumber}) with Pass ${res.submission?.ticketNumber || ''}!` 
        });
        setShowAddSubmission(false);
        loadData(adminPin);
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to add student registration' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Error adding student record' });
    } finally {
      setIsSavingAdd(false);
    }
  };

  const handleStartEdit = (sub) => {
    setEditingSubmission(sub);
    setEditFormData({
      name: sub.name || '',
      rollNumber: sub.rollNumber || '',
      year: sub.year || (sub.section && sub.section.includes('2') ? '2nd Year' : '3rd Year'),
      section: sub.section || 'CSE 2A',
      phone: sub.phone || '',
      email: sub.email || '',
      paymentStatus: sub.payment?.status || 'verified',
      amount: sub.payment?.amount || 50,
      paymentMethod: sub.payment?.paymentMethod || 'UPI_DIRECT',
      transactionId: sub.payment?.transactionId || '',
      vpa: sub.payment?.vpa || '',
      interestedInSpeaking: sub.interestedInSpeaking || 'No',
      speechTeacher: sub.speechTeacher || '',
      speechTopic: sub.speechTopic || '',
      favoriteTeacher: sub.favoriteTeacher || '',
      anecdote: sub.anecdote || ''
    });
  };

  const handleSaveEditSubmission = async (e) => {
    if (e) e.preventDefault();
    if (!editingSubmission) return;

    setIsSavingEdit(true);
    try {
      const payload = {
        name: editFormData.name,
        rollNumber: editFormData.rollNumber,
        year: editFormData.year,
        section: editFormData.section,
        phone: editFormData.phone,
        email: editFormData.email,
        interestedInSpeaking: editFormData.interestedInSpeaking,
        speechTeacher: editFormData.speechTeacher,
        speechTopic: editFormData.speechTopic,
        favoriteTeacher: editFormData.favoriteTeacher,
        anecdote: editFormData.anecdote,
        payment: {
          status: editFormData.paymentStatus,
          amount: Number(editFormData.amount) || 50,
          paymentMethod: editFormData.paymentMethod || 'UPI_DIRECT',
          transactionId: editFormData.transactionId,
          vpa: editFormData.vpa
        }
      };

      const res = await api.updateSubmission(adminPin, editingSubmission.id, payload);
      if (res.success) {
        setNotification({ type: 'success', message: `Updated student ${editFormData.name} (${editFormData.rollNumber}) successfully!` });
        setEditingSubmission(null);
        if (selectedStudent && selectedStudent.id === editingSubmission.id) {
          setSelectedStudent(res.submission || { ...selectedStudent, ...payload });
        }
        loadData(adminPin);
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to update student' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Error updating student record' });
    } finally {
      setIsSavingEdit(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="glass-card-glow rounded-3xl p-8 text-center space-y-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1">
              <Code className="w-3.5 h-3.5" /> CSE DEPARTMENT 2026
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Committee Portal</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Enter your authorization PIN to access management tools.</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Enter Security PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 font-mono text-center tracking-widest text-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !pinInput}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 touch-press"
            >
              {loading ? 'Authenticating...' : 'Unlock Management Portal'}
            </button>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  setPinInput('2026');
                  handleLogin(null, '2026');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
              >
                <span>🔑 Quick Unlock (PIN: 2026)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const filteredSubmissions = (submissions || []).filter(s => {
    if (!s) return false;
    const term = (searchTerm || '').trim().toLowerCase();
    const matchesSearch = !term ||
      String(s.name || '').toLowerCase().includes(term) ||
      String(s.rollNumber || '').toLowerCase().includes(term) ||
      String(s.ticketNumber || '').toLowerCase().includes(term) ||
      String(s.acknowledgementNumber || '').toLowerCase().includes(term) ||
      String(s.payment?.transactionId || '').toLowerCase().includes(term) ||
      String(s.phone || '').toLowerCase().includes(term) ||
      String(s.email || '').toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'ALL' || s.payment?.status === statusFilter;
    const matchesYear = yearFilter === 'ALL' || isStudentInYear(s, yearFilter);
    const matchesSection = sectionFilter === 'ALL' || isStudentInSection(s, sectionFilter);

    return matchesSearch && matchesStatus && matchesYear && matchesSection;
  });

  const registeredSpeakers = (submissions || []).filter(s => s && s.interestedInSpeaking === 'Yes');

  const filteredTeachers = teacherResults.filter(t =>
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.designation.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredPresets = (facultyPresets && facultyPresets.length > 0 ? facultyPresets : defaultFacultyPresets).filter(p =>
    p.label.toLowerCase().includes(presetSearch.toLowerCase()) ||
    p.filename.toLowerCase().includes(presetSearch.toLowerCase())
  );

  return (
    <section className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 space-y-3 sm:space-y-4 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
              CSE Dept 2nd & 3rd Year (2A–2D, 3A–3D)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
            CSE Teachers' Day 2026 Control Center
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          {/* Toggle Public Reveal Switch */}
          <button
            onClick={handleToggleReveal}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm touch-press ${isRevealed
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            title="Toggle public disclosure of voting results"
          >
            {isRevealed ? <Eye className="w-3.5 h-3.5 text-slate-950" /> : <EyeOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
            <span>{isRevealed ? 'Results: REVEALED' : 'Results: HIDDEN'}</span>
          </button>

          <button
            onClick={() => loadData(adminPin)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 transition-colors shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-purple-600/30 transition-all touch-press border border-purple-400/30"
            title="Register a student who paid directly and generate pass"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>➕ Add Student (Direct Pay)</span>
          </button>

          <a
            href={api.getExportCsvUrl(adminPin)}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all touch-press"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-300 text-slate-600 dark:text-slate-400 text-xs font-semibold transition-colors border border-slate-200 dark:border-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md ${notification.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500/30' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-400 dark:border-rose-500/30'
          }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">✕</button>
        </div>
      )}

      {/* COMPACT KPI METRICS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">

        <div className="glass-card px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-slate-950 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Registrations</div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-display leading-tight">{overview?.totalSubmissions || 0}</div>
          </div>
          <Users className="w-5 h-5 text-purple-500 shrink-0" />
        </div>

        <div className="glass-card px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-slate-950 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-amber-500">Speakers</div>
            <div className="text-xl font-black text-amber-500 font-display leading-tight">{overview?.speakersCount || registeredSpeakers.length}</div>
          </div>
          <Mic className="w-5 h-5 text-amber-500 shrink-0" />
        </div>

        <div className="glass-card px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-slate-950 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-emerald-500">Funds Raised</div>
            <div className="text-xl font-black text-emerald-500 font-display leading-tight">₹{overview?.totalFundsCollected || 0}</div>
          </div>
          <Coins className="w-5 h-5 text-emerald-500 shrink-0" />
        </div>

        <div className="glass-card px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-slate-950 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase text-pink-500">Secret Votes</div>
            <div className="text-xl font-black text-pink-500 font-display leading-tight">{overview?.totalVotes || 0}</div>
          </div>
          <Vote className="w-5 h-5 text-pink-500 shrink-0" />
        </div>

      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-white/10 pb-1.5 overflow-x-auto scrollbar-none">

        <button
          onClick={() => setActiveTab('votes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all touch-press ${activeTab === 'votes'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Category Voting Results ({teacherResults.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('speakers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all touch-press ${activeTab === 'speakers'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          <Mic className="w-4 h-4" />
          <span>Stage Speakers ({registeredSpeakers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all touch-press ${activeTab === 'submissions'
              ? 'bg-purple-600 text-white font-bold shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Contributions ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all touch-press ${activeTab === 'moderation'
              ? 'bg-purple-600 text-white font-bold shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Anecdotes ({anecdotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all touch-press ${activeTab === 'teachers'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Manage Roster ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('paymentSettings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all touch-press ${activeTab === 'paymentSettings'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>UPI Settings</span>
        </button>
      </div>

      {/* TAB: SECRET BALLOT CATEGORY VOTING RESULTS */}
      {activeTab === 'votes' && (
        <div className="space-y-3">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Confidential Voting Results & Category Breakdown</span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${isRevealed
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                {isRevealed ? '✓ Publicly Disclosed' : '🔒 Confidential / Secret Ballot'}
              </span>
            </div>
          </div>

          {/* Category Winners Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {categories.map(cat => {
              let maxVotes = 0;
              teacherResults.forEach(t => {
                const v = (t.categoryVotes && t.categoryVotes[cat.id]) || 0;
                if (v > maxVotes) maxVotes = v;
              });

              const topFaculty = maxVotes > 0 
                ? teacherResults.filter(t => (t.categoryVotes?.[cat.id] || 0) === maxVotes)
                : [];

              const isTie = topFaculty.length > 1;

              return (
                <div 
                  key={cat.id} 
                  className={`p-2.5 rounded-xl glass-card space-y-1 border transition-all ${
                    isTie 
                      ? 'border-purple-500/50 bg-gradient-to-b from-purple-950/30 to-slate-900 shadow-sm' 
                      : 'border-amber-400/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-bold uppercase text-amber-400 tracking-wider truncate">
                      {cat.title}
                    </span>
                    {isTie && (
                      <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-purple-500/30 text-purple-300 border border-purple-500/40 shrink-0">
                        ⚡ Joint
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate" title={topFaculty.map(f => f.name).join(' & ')}>
                      {topFaculty.length > 0
                        ? (isTie ? `⚡ Joint: ${topFaculty.map(f => f.name).join(' & ')}` : topFaculty[0].name)
                        : 'No votes'}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">
                      {topFaculty.length > 0 ? `${maxVotes} Votes` : '0 votes yet'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Ballot Controls & Search Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
            {/* Search Faculty Results */}
            <div className="lg:col-span-4 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search faculty votes..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Clear Single Voter Lock Form & Reset Button */}
            <div className="lg:col-span-8 flex flex-wrap sm:flex-nowrap items-center justify-start lg:justify-end gap-2">
              <form onSubmit={handleResetSingleVoter} className="flex items-center gap-1.5 w-full sm:w-auto">
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Unlock Roll (e.g. 24341A0501)"
                  value={singleRollToReset}
                  onChange={(e) => setSingleRollToReset(e.target.value.toUpperCase())}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-purple-400 w-full sm:w-48"
                />
                <button
                  type="submit"
                  disabled={loading || !singleRollToReset.trim()}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold whitespace-nowrap shadow-sm transition-all disabled:opacity-50 touch-press flex items-center gap-1 shrink-0"
                  title="Unlock this student roll number so they can vote again"
                >
                  <Unlock className="w-3 h-3" />
                  <span>Unlock</span>
                </button>
              </form>

              <button
                type="button"
                onClick={handleResetAllVotes}
                disabled={isResettingVotes || loading}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-all touch-press disabled:opacity-50 shrink-0"
                title="Reset all faculty votes and clear all voter lock records to ZERO"
              >
                <RotateCcw className={`w-3 h-3 ${isResettingVotes ? 'animate-spin' : ''}`} />
                <span>Reset Votes</span>
              </button>
            </div>
          </div>

          {/* Category Vote Breakdown Table with Internal Scroll */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-x-auto overflow-y-auto max-h-[calc(100vh-290px)] min-h-[300px] shadow-lg w-full">
            <table className="min-w-full text-left text-xs text-slate-300">
              <thead className="sticky top-0 z-10 bg-slate-950 text-slate-400 uppercase font-bold border-b border-white/10 shadow-sm backdrop-blur-md">
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
        <div className="space-y-3">

          {/* Section-Wise Status & Payment Matrix Strip */}
          <div className="glass-card p-3 sm:p-3.5 rounded-2xl border border-purple-500/20 bg-slate-950/60 backdrop-blur-xl shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white font-display flex items-center gap-1.5">
                    <span>Section-Wise Breakdown</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      8 Sections
                    </span>
                  </h3>
                </div>
              </div>

              {/* Global CSV Download & Toggle Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenAddModal()}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all touch-press"
                  title="Add / Register a student manually with full details & generate pass"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add Student</span>
                </button>

                <a
                  href={api.getExportCsvUrl(adminPin, {})}
                  download
                  className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  title="Download complete registered students & payment list"
                >
                  <Download className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Master CSV</span>
                </a>

                <a
                  href={api.getExportCsvUrl(adminPin, { summary: true })}
                  download
                  className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-1 transition-all"
                  title="Download executive section-wise summary numbers"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Summary CSV</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowSectionBreakdown(!showSectionBreakdown)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 font-bold text-xs transition-all"
                >
                  {showSectionBreakdown ? 'Hide Matrix' : 'Show Matrix'}
                </button>
              </div>
            </div>

            {showSectionBreakdown && (
              <div className="space-y-3 pt-1 border-t border-white/10">
                {['2nd Year', '3rd Year'].map((year) => {
                  const isYear2 = year.includes('2');
                  const sectionsList = isYear2 
                    ? ['CSE 2A', 'CSE 2B', 'CSE 2C', 'CSE 2D'] 
                    : ['CSE 3A', 'CSE 3B', 'CSE 3C', 'CSE 3D'];

                  const yearSubmissions = submissions.filter(s => isStudentInYear(s, year));
                  const yearFunds = yearSubmissions.filter(s => s.payment?.status === 'verified').reduce((sum, s) => sum + (s.payment?.amount || 50), 0);
                  
                  return (
                    <div key={year} className="space-y-1.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {year} CSE
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Total in {year}: <strong className="text-white">{yearSubmissions.length} Students</strong> • <strong className="text-emerald-400">₹{yearFunds}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-2">
                        {sectionsList.map((sec) => {
                          const matching = submissions.filter(s => isStudentInSection(s, sec));
                          const verified = matching.filter(s => s.payment?.status === 'verified');
                          const funds = verified.reduce((sum, s) => sum + (s.payment?.amount || 50), 0);
                          const speakers = matching.filter(s => s.interestedInSpeaking === 'Yes').length;
                          const isCurrentFilter = yearFilter === year && sectionFilter === sec;

                          return (
                            <div
                              key={sec}
                              className={`p-2.5 rounded-xl border transition-all relative group flex flex-col justify-between ${
                                isCurrentFilter
                                  ? 'bg-purple-950/70 border-purple-400 shadow-sm ring-1 ring-purple-400'
                                  : matching.length > 0
                                  ? 'bg-slate-900/80 hover:bg-slate-900 border-white/10 hover:border-purple-400/40'
                                  : 'bg-slate-950/40 border-white/5 opacity-75 hover:opacity-100'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                                    {sec}
                                  </span>
                                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                                    matching.length > 0 
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                                      : 'bg-slate-800 text-slate-500'
                                  }`}>
                                    {matching.length} Students
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-1 text-[10px] mb-1.5 font-mono">
                                  <div className="bg-slate-950/60 p-1 rounded border border-white/5">
                                    <span className="text-slate-400 text-[9px] block">Verified:</span>
                                    <span className="font-bold text-emerald-400">✓ {verified.length} (₹{funds})</span>
                                  </div>
                                  <div className="bg-slate-950/60 p-1 rounded border border-white/5">
                                    <span className="text-slate-400 text-[9px] block">Speakers:</span>
                                    <span className="font-bold text-amber-300">🎤 {speakers}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Action buttons inside card */}
                              <div className="flex items-center gap-1 pt-1 border-t border-white/5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setYearFilter(year);
                                    setSectionFilter(sec);
                                  }}
                                  className={`flex-1 py-1 px-2 rounded text-[9px] font-bold transition-all text-center ${
                                    isCurrentFilter
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                                  }`}
                                >
                                  {isCurrentFilter ? 'Selected' : 'Filter Table'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenAddModal(year, sec)}
                                  className="py-1 px-2 rounded bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30 transition-all text-[9px] font-bold flex items-center gap-0.5 shrink-0"
                                  title={`Add new student to ${sec}`}
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                  <span>Add</span>
                                </button>

                                <a
                                  href={api.getExportCsvUrl(adminPin, { year, section: sec })}
                                  download
                                  className="py-1 px-2 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 transition-all text-[9px] font-bold flex items-center gap-0.5 shrink-0"
                                  title={`Download CSV for ${year} ${sec}`}
                                >
                                  <Download className="w-2.5 h-2.5" />
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

          {/* Compact Filters & Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 items-center">
            <div className="relative lg:col-span-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Years (2nd & 3rd Year)</option>
              <option value="2nd Year">2nd Year (Sections 2A–2D)</option>
              <option value="3rd Year">3rd Year (Sections 3A–3D)</option>
            </select>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
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

            <div className="flex items-center gap-1.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="verified">Verified (₹50+)</option>
                <option value="pending">Pending</option>
              </select>

              {(yearFilter !== 'ALL' || sectionFilter !== 'ALL' || statusFilter !== 'ALL' || searchTerm) && (
                <button
                  type="button"
                  onClick={() => {
                    setYearFilter('ALL');
                    setSectionFilter('ALL');
                    setStatusFilter('ALL');
                    setSearchTerm('');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-bold shrink-0 hover:bg-amber-500/30"
                  title="Clear Filters"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Table with Bounded Sticky Internal Scrolling */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-x-auto overflow-y-auto max-h-[calc(100vh-270px)] min-h-[350px] shadow-xl w-full">
            <table className="min-w-full text-left text-xs text-slate-300">
              <thead className="sticky top-0 z-10 bg-slate-950 text-slate-400 uppercase font-bold border-b border-white/10 shadow-sm backdrop-blur-md">
                <tr>
                  <th className="p-3.5">Receipt / Pass ID</th>
                  <th className="p-3.5">Student / Payee</th>
                  <th className="p-3.5">Year & Section</th>
                  <th className="p-3.5">Payment & Payee Details</th>
                  <th className="p-3.5">Stage Speaker?</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <div>No student contributions found matching this filter.</div>
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal()}
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Register / Add Student</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const isVerified = sub.payment?.status === 'verified';
                    const paidDate = sub.payment?.paidAt || sub.createdAt;
                    return (
                      <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-amber-300">
                          <div>{sub.ticketNumber || sub.acknowledgementNumber || sub.id}</div>
                          {sub.acknowledgementNumber && sub.acknowledgementNumber !== sub.ticketNumber && (
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{sub.acknowledgementNumber}</div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-white text-sm">{sub.name}</div>
                          <div className="text-[11px] text-purple-300 font-mono font-bold mt-0.5">{sub.rollNumber}</div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono flex-wrap">
                            {sub.phone && <span>📱 {sub.phone}</span>}
                            {sub.email && <span className="truncate max-w-[140px]" title={sub.email}>✉️ {sub.email}</span>}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{sub.year}</div>
                          <div className="text-[11px] text-amber-400 font-bold">{sub.section}</div>
                          <div className="text-[10px] text-slate-500">CSE Dept</div>
                        </td>
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${isVerified
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}>
                                {isVerified ? `✓ ₹${sub.payment?.amount || 50} Paid` : '⏳ Pending'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {sub.payment?.paymentMethod === 'UPI_DIRECT' ? '📱 UPI Direct' : '💳 Razorpay Gateway'}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-300">
                              <span className="text-slate-500">TXN / UTR: </span>
                              <span className="text-amber-300 font-bold select-all">{sub.payment?.transactionId || 'N/A'}</span>
                            </div>
                            {sub.payment?.vpa && (
                              <div className="text-[10px] font-mono text-emerald-300">
                                <span className="text-slate-500">VPA: </span>
                                <span>{sub.payment.vpa}</span>
                              </div>
                            )}
                            {paidDate && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                📅 {new Date(paidDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date(paidDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          {sub.interestedInSpeaking === 'Yes' ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 text-amber-300 font-bold text-xs">
                                <Mic className="w-3.5 h-3.5" /> Stage Speaker
                              </span>
                              {sub.speechTeacher && (
                                <div className="text-[11px] text-slate-300">
                                  Prof: <span className="text-amber-400">{sub.speechTeacher}</span>
                                </div>
                              )}
                              {sub.speechTopic && (
                                <div className="text-[10px] text-slate-400 italic truncate max-w-[150px]" title={sub.speechTopic}>
                                  "{sub.speechTopic}"
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500">Attendee</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleStartEdit(sub)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition-colors border border-amber-500/30"
                              title="Edit Student Name, JNTU Roll No, Section, & Payment details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

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
                              onClick={() => handleDeleteSubmission(sub.id, sub.name, sub.ticketNumber)}
                              className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 transition-all"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
                onClick={() => {
                  const studentToEdit = selectedStudent;
                  setSelectedStudent(null);
                  handleStartEdit(studentToEdit);
                }}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Edit Student Details"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Student</span>
              </button>

              <button
                onClick={() => setViewingPass(selectedStudent)}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="View & Print Official Acknowledgement Slip"
              >
                <FileText className="w-4 h-4" />
                <span>Open Slip</span>
              </button>

              <button
                onClick={() => handleDeleteSubmission(selectedStudent.id, selectedStudent.name, selectedStudent.ticketNumber)}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Permanently Delete This Registration"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
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

      {/* ADD STUDENT REGISTRATION MODAL */}
      {showAddSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-card-glow rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-purple-500/30 shadow-2xl space-y-5 my-8 bg-slate-950">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                  <Plus className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display">Add Student & Issue Pass</h3>
                  <p className="text-xs text-slate-400">
                    Manually register a CSE student, record their payment, and generate an official acknowledgement slip.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddSubmission(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Live Pass ID Preview Banner */}
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-300">
                  Target Pass Format: <strong className="text-amber-300 font-mono">TD26-{addFormData.section ? addFormData.section.replace(/[^A-Za-z0-9]/g, '').slice(-2) : '2A'}-XXXX</strong>
                </span>
              </div>
              <div className="text-[11px] text-purple-300 font-mono font-bold">
                Auto-generates QR & Acknowledgement Slip
              </div>
            </div>

            <form onSubmit={handleSaveAddSubmission} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    placeholder="e.g. Chowdari Tekshita"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* JNTU Roll Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    JNTU Roll Number * (10 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={addFormData.rollNumber}
                    onChange={(e) => setAddFormData({ ...addFormData, rollNumber: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                    placeholder="e.g. 25341A05P9 or 24341A0502"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-amber-300 font-mono text-xs font-bold focus:outline-none focus:border-purple-400 uppercase"
                  />
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Academic Year *
                  </label>
                  <select
                    value={addFormData.year}
                    onChange={(e) => {
                      const newYear = e.target.value;
                      const defaultSec = newYear.includes('2') ? 'CSE 2A' : 'CSE 3A';
                      setAddFormData({ ...addFormData, year: newYear, section: defaultSec });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400 font-medium"
                  >
                    <option value="2nd Year">2nd Year (2024-2028 Batch)</option>
                    <option value="3rd Year">3rd Year (2023-2027 Batch)</option>
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Section *
                  </label>
                  <select
                    value={addFormData.section}
                    onChange={(e) => setAddFormData({ ...addFormData, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-purple-400"
                  >
                    {addFormData.year?.includes('2') ? (
                      <>
                        <option value="CSE 2A">CSE 2A</option>
                        <option value="CSE 2B">CSE 2B</option>
                        <option value="CSE 2C">CSE 2C</option>
                        <option value="CSE 2D">CSE 2D</option>
                      </>
                    ) : (
                      <>
                        <option value="CSE 3A">CSE 3A</option>
                        <option value="CSE 3B">CSE 3B</option>
                        <option value="CSE 3C">CSE 3C</option>
                        <option value="CSE 3D">CSE 3D</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={addFormData.phone}
                    onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                    placeholder="e.g. student@gmrit.edu.in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Payment Status *
                  </label>
                  <select
                    value={addFormData.paymentStatus}
                    onChange={(e) => setAddFormData({ ...addFormData, paymentStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-emerald-400 text-xs focus:outline-none focus:border-purple-400 font-bold"
                  >
                    <option value="verified">✓ Verified (₹50+ Paid)</option>
                    <option value="pending">⏳ Pending Verification</option>
                  </select>
                </div>

                {/* Payment Amount */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Contribution Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="50"
                    required
                    value={addFormData.amount}
                    onChange={(e) => setAddFormData({ ...addFormData, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-emerald-400 font-mono text-xs font-bold focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={addFormData.paymentMethod}
                    onChange={(e) => setAddFormData({ ...addFormData, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400 font-medium"
                  >
                    <option value="UPI_DIRECT">📱 UPI Direct (GPay / PhonePe / Paytm)</option>
                    <option value="RAZORPAY">💳 Razorpay Gateway</option>
                    <option value="CASH">💵 Cash / Offline Collection</option>
                    <option value="ADMIN_ENTRY">🎟️ Admin Special Pass</option>
                  </select>
                </div>

                {/* Transaction ID / UTR */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Gateway TXN / UTR ID
                    </label>
                    <button
                      type="button"
                      onClick={() => setAddFormData({ ...addFormData, transactionId: `TXN_${Date.now().toString().slice(-8)}` })}
                      className="text-[10px] text-purple-400 hover:text-purple-300 font-bold"
                    >
                      🔄 Auto-Gen
                    </button>
                  </div>
                  <input
                    type="text"
                    value={addFormData.transactionId}
                    onChange={(e) => setAddFormData({ ...addFormData, transactionId: e.target.value })}
                    placeholder="e.g. 831303402797 or pay_TR..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-amber-300 font-mono text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* VPA / UPI ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Payer UPI ID / VPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={addFormData.vpa}
                    onChange={(e) => setAddFormData({ ...addFormData, vpa: e.target.value })}
                    placeholder="e.g. student@oksbi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Favorite Teacher */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Favorite CSE Teacher (Optional)
                  </label>
                  <select
                    value={addFormData.favoriteTeacher}
                    onChange={(e) => setAddFormData({ ...addFormData, favoriteTeacher: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                  >
                    <option value="">-- Select Faculty or None --</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.designation})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stage Speaker options */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-400" />
                    Interested in Speaking on Stage?
                  </span>
                  <select
                    value={addFormData.interestedInSpeaking}
                    onChange={(e) => setAddFormData({ ...addFormData, interestedInSpeaking: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-white text-xs font-bold"
                  >
                    <option value="No">No (Attendee)</option>
                    <option value="Yes">Yes (Stage Speaker)</option>
                  </select>
                </div>

                {addFormData.interestedInSpeaking === 'Yes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Speech Dedicated To Professor
                      </label>
                      <input
                        type="text"
                        value={addFormData.speechTeacher}
                        onChange={(e) => setAddFormData({ ...addFormData, speechTeacher: e.target.value })}
                        placeholder="e.g. Dr. A.V. Ramana"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Speech Topic / Key Thoughts
                      </label>
                      <input
                        type="text"
                        value={addFormData.speechTopic}
                        onChange={(e) => setAddFormData({ ...addFormData, speechTopic: e.target.value })}
                        placeholder="e.g. Impact on our coding journey"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Classroom Memory / Anecdote */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Classroom Memory / Tribute Story (Optional)
                </label>
                <textarea
                  rows={2}
                  value={addFormData.anecdote}
                  onChange={(e) => setAddFormData({ ...addFormData, anecdote: e.target.value })}
                  placeholder="Share a short classroom memory or story about faculty..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddSubmission(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAdd}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center gap-1.5 disabled:opacity-50 touch-press border border-purple-400/30"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{isSavingAdd ? 'Registering Student...' : 'Register & Issue Pass'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT DETAILS MODAL */}
      {editingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-card-glow rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-amber-500/30 shadow-2xl space-y-5 my-8 bg-slate-950">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display">Edit Student & Payee Details</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Pass: {editingSubmission.ticketNumber || editingSubmission.acknowledgementNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingSubmission(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditSubmission} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Enter real student name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* JNTU Roll Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    JNTU Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={editFormData.rollNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, rollNumber: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                    placeholder="e.g. 24341A0502 or 25341A05P9"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-amber-300 font-mono text-xs font-bold focus:outline-none focus:border-amber-400 uppercase"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Academic Year *
                  </label>
                  <select
                    value={editFormData.year}
                    onChange={(e) => {
                      const newYear = e.target.value;
                      const defaultSec = newYear.includes('2') ? 'CSE 2A' : 'CSE 3A';
                      setEditFormData({ ...editFormData, year: newYear, section: defaultSec });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="2nd Year">2nd Year (2024-2028 Batch)</option>
                    <option value="3rd Year">3rd Year (2023-2027 Batch)</option>
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Section *
                  </label>
                  <select
                    value={editFormData.section}
                    onChange={(e) => setEditFormData({ ...editFormData, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                  >
                    {editFormData.year?.includes('2') ? (
                      <>
                        <option value="CSE 2A">CSE 2A</option>
                        <option value="CSE 2B">CSE 2B</option>
                        <option value="CSE 2C">CSE 2C</option>
                        <option value="CSE 2D">CSE 2D</option>
                      </>
                    ) : (
                      <>
                        <option value="CSE 3A">CSE 3A</option>
                        <option value="CSE 3B">CSE 3B</option>
                        <option value="CSE 3C">CSE 3C</option>
                        <option value="CSE 3D">CSE 3D</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    placeholder="e.g. student@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Payment Status
                  </label>
                  <select
                    value={editFormData.paymentStatus}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400 font-bold"
                  >
                    <option value="verified">Verified (₹50+ Paid)</option>
                    <option value="pending">Pending Verification</option>
                  </select>
                </div>

                {/* Payment Amount */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    min="50"
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-emerald-400 font-mono text-xs font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={editFormData.paymentMethod}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400 font-medium"
                  >
                    <option value="UPI_DIRECT">📱 UPI Direct (GPay / PhonePe / Paytm)</option>
                    <option value="RAZORPAY">💳 Razorpay Gateway</option>
                    <option value="CASH">💵 Cash / Offline Collection</option>
                    <option value="ADMIN_ENTRY">🎟️ Admin Special Pass</option>
                  </select>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Gateway TXN / UTR ID
                  </label>
                  <input
                    type="text"
                    value={editFormData.transactionId}
                    onChange={(e) => setEditFormData({ ...editFormData, transactionId: e.target.value })}
                    placeholder="e.g. 831303402797 or pay_TRTFvTYSbcwVCS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* VPA */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Payer VPA / UPI ID
                  </label>
                  <input
                    type="text"
                    value={editFormData.vpa}
                    onChange={(e) => setEditFormData({ ...editFormData, vpa: e.target.value })}
                    placeholder="e.g. student@ybl"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Favorite Teacher */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Favorite CSE Teacher
                  </label>
                  <select
                    value={editFormData.favoriteTeacher}
                    onChange={(e) => setEditFormData({ ...editFormData, favoriteTeacher: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="">-- Select Faculty or None --</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.designation})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stage Speaker options */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-400" />
                    Interested in Speaking on Stage?
                  </span>
                  <select
                    value={editFormData.interestedInSpeaking}
                    onChange={(e) => setEditFormData({ ...editFormData, interestedInSpeaking: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-white text-xs font-bold"
                  >
                    <option value="No">No (Attendee)</option>
                    <option value="Yes">Yes (Stage Speaker)</option>
                  </select>
                </div>

                {editFormData.interestedInSpeaking === 'Yes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Speech Dedicated To Professor
                      </label>
                      <input
                        type="text"
                        value={editFormData.speechTeacher}
                        onChange={(e) => setEditFormData({ ...editFormData, speechTeacher: e.target.value })}
                        placeholder="Faculty name"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Speech Topic / Key Thoughts
                      </label>
                      <input
                        type="text"
                        value={editFormData.speechTopic}
                        onChange={(e) => setEditFormData({ ...editFormData, speechTopic: e.target.value })}
                        placeholder="e.g. Words of gratitude"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingSubmission(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5 disabled:opacity-50 touch-press"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingEdit ? 'Saving Changes...' : 'Save & Update Details'}</span>
                </button>
              </div>
            </form>
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
