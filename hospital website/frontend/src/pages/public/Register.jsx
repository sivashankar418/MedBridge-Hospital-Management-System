import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'patient', phone: '', specialization: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const specializations = ['Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Gynecology', 'Ophthalmology', 'General Practice'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Please fill all required fields'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.register({
        name: form.name, email: form.email, password: form.password,
        role: form.role, phone: form.phone, specialization: form.role === 'doctor' ? form.specialization : undefined,
      });
      login(data.user, data.token);
      toast.success('Account created successfully!');
      if (data.user.role === 'doctor') navigate('/doctor/dashboard');
      else if (data.user.role === 'pharmacist') navigate('/store/prescriptions');
      else navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdfa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 540, background: 'white', borderRadius: 20, boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary-700), var(--primary-600))', padding: '28px 36px', color: 'white' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="rgba(255,255,255,0.2)"/>
              <path d="M18 8v20M8 18h20" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 16 }}>MediCare</span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Join thousands of patients and healthcare professionals</p>
        </div>

        <div style={{ padding: '28px 36px' }}>
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Role selector */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {['patient', 'doctor', 'pharmacist'].map(r => (
              <button key={r} type="button"
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: `2px solid ${form.role === r ? 'var(--primary-500)' : 'var(--gray-200)'}`, background: form.role === r ? 'var(--primary-50)' : 'white', color: form.role === r ? 'var(--primary-700)' : 'var(--gray-500)', fontWeight: 600, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}
                onClick={() => setForm({ ...form, role: r })}>
                {r === 'patient' ? '🏥 ' : r === 'doctor' ? '👨‍⚕️ ' : '🏪 '}{r === 'patient' ? 'Patient' : r === 'doctor' ? 'Doctor' : 'Medical Store'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="input-group">
                  <User className="input-icon" />
                  <input className="form-control" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <div className="input-group">
                  <Phone className="input-icon" />
                  <input className="form-control" placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-group">
                <Mail className="input-icon" />
                <input type="email" className="form-control" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            {form.role === 'doctor' && (
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select className="form-control" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}>
                  <option value="">Select specialization</option>
                  {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="input-group input-group-right">
                  <Lock className="input-icon" />
                  <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input type="password" className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 4 }} disabled={loading}>
              {loading ? <><span className="loading-spinner"></span> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gray-500)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
