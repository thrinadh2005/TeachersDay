import { defaultCategories, defaultTeachers, defaultAnecdotes, defaultShowcase } from './defaultData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  // Teachers & Multi-Category Voting
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) return data;
      }
    } catch (err) {
      console.warn('Using local categories fallback:', err.message);
    }
    return { success: true, data: defaultCategories };
  },

  async getTeachers() {
    try {
      const res = await fetch(`${API_BASE}/teachers`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) return data;
      }
    } catch (err) {
      console.warn('Using local teachers fallback:', err.message);
    }
    return { success: true, data: defaultTeachers };
  },

  async getVoterHistory(roll) {
    if (!roll) return { success: true, data: { hasVoted: false } };
    try {
      const res = await fetch(`${API_BASE}/voter-status/${encodeURIComponent(roll.trim().toUpperCase())}`);
      if (res.ok) return res.json();
    } catch (e) {
      // fallback
    }
    return { success: true, data: { hasVoted: false } };
  },

  async submitBallot(voterKey, votes) {
    const res = await fetch(`${API_BASE}/vote-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterKey, votes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit secret ballot');
    return data;
  },

  async voteTeacher(teacherId, voterKey, categoryId = 'starFaculty') {
    const res = await fetch(`${API_BASE}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, voterKey, categoryId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit vote');
    return data;
  },

  // Anecdotes
  async getAnecdotes() {
    try {
      const res = await fetch(`${API_BASE}/anecdotes`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) return data;
      }
    } catch (err) {
      console.warn('Using local anecdotes fallback:', err.message);
    }
    return { success: true, data: defaultAnecdotes };
  },

  async submitAnonymousAnecdote({ teacherName, anecdote, rollNumber, section }) {
    const res = await fetch(`${API_BASE}/anecdotes/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherName, anecdote, rollNumber, section })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit story');
    return data;
  },

  async reactAnecdote(id, type) {
    const res = await fetch(`${API_BASE}/anecdotes/${id}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    if (!res.ok) throw new Error('Failed to react');
    return res.json();
  },

  // Payments & UPI Integration
  async getPaymentConfig() {
    try {
      const res = await fetch(`${API_BASE}/pay/config`);
      if (res.ok) return res.json();
    } catch (e) {
      // fallback
    }
    return {
      success: true,
      amount: 50,
      currency: 'INR',
      upiId: '9663355000@ybl',
      payeeName: 'ADABALA VENKATA THRINADH',
      mobileNumber: '9663355000',
      enableUpi: true
    };
  },

  async createRazorpayOrder(payload) {
    const res = await fetch(`${API_BASE}/pay/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to initialize Razorpay order');
    return data;
  },

  async verifyRazorpayPayment(payload) {
    const res = await fetch(`${API_BASE}/pay/verify-razorpay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to verify payment signature');
    return data;
  },

  async verifyRazorpayLiveStatus(payload) {
    const res = await fetch(`${API_BASE}/pay/verify-live-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Payment verification failed');
    return data;
  },

  async checkRegistration(roll) {
    if (!roll) return { success: true, alreadyRegistered: false };
    try {
      const res = await fetch(`${API_BASE}/check-registration/${encodeURIComponent(roll.trim().toUpperCase())}`);
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false, alreadyRegistered: false, error: e.message };
    }
  },

  async submitStudentIdea(payload) {
    const res = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed');
    return data;
  },

  // Showcase
  async getShowcase() {
    try {
      const res = await fetch(`${API_BASE}/showcase`);
      if (res.ok) return res.json();
    } catch (e) {
      // fallback
    }
    return { success: true, data: defaultShowcase };
  },

  // Admin APIs
  async getAdminOverview(pin) {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Admin auth failed');
    return data;
  },

  async getAdminTeacherResults(pin) {
    const res = await fetch(`${API_BASE}/admin/teachers-results`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch detailed results');
    return data;
  },

  async toggleRevealResults(pin, reveal) {
    const res = await fetch(`${API_BASE}/admin/toggle-reveal-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify({ reveal })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle result status');
    return data;
  },

  async getAdminSubmissions(pin) {
    const res = await fetch(`${API_BASE}/admin/submissions`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin submissions');
    return data;
  },

  async getAdminAnecdotes(pin) {
    const res = await fetch(`${API_BASE}/admin/anecdotes`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin anecdotes');
    return data;
  },

  async moderateAnecdote(pin, anecdoteId, status, updatedText = null) {
    const res = await fetch(`${API_BASE}/admin/moderate-anecdote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify({ anecdoteId, status, updatedText })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Moderation failed');
    return data;
  },

  async verifyPayment(pin, submissionId, status, transactionId) {
    const res = await fetch(`${API_BASE}/admin/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify({ submissionId, status, transactionId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update payment');
    return data;
  },

  async deleteSubmission(pin, submissionId) {
    const res = await fetch(`${API_BASE}/admin/submissions/${encodeURIComponent(submissionId)}`, {
      method: 'DELETE',
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete submission');
    return data;
  },

  async deleteAnecdote(pin, anecdoteId) {
    const res = await fetch(`${API_BASE}/admin/anecdotes/${encodeURIComponent(anecdoteId)}`, {
      method: 'DELETE',
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete anecdote');
    return data;
  },

  async addTeacher(pin, teacherData) {
    const res = await fetch(`${API_BASE}/admin/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify(teacherData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add teacher');
    return data;
  },

  async deleteTeacher(pin, teacherId) {
    const res = await fetch(`${API_BASE}/admin/teachers/${teacherId}`, {
      method: 'DELETE',
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete teacher');
    return data;
  },

  async updateTeacher(pin, teacherId, teacherData) {
    const res = await fetch(`${API_BASE}/admin/teachers/${teacherId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify(teacherData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update teacher');
    return data;
  },

  async getFacultyPresets(pin) {
    const res = await fetch(`${API_BASE}/admin/faculty-presets`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch faculty presets');
    return data;
  },

  async getAdminPaymentConfig(pin) {
    const res = await fetch(`${API_BASE}/admin/payment-config`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch payment config');
    return data;
  },

  async updateAdminPaymentConfig(pin, config) {
    const res = await fetch(`${API_BASE}/admin/payment-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update payment config');
    return data;
  },

  getExportCsvUrl(pin, filters = {}) {
    const params = new URLSearchParams({ pin });
    if (filters.year && filters.year !== 'ALL') params.append('year', filters.year);
    if (filters.section && filters.section !== 'ALL') params.append('section', filters.section);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.summary) params.append('summary', 'true');
    return `${API_BASE}/admin/export-csv?${params.toString()}`;
  }
};
