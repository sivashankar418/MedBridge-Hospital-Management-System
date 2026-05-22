import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill all fields'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'doctor') navigate('/doctor/dashboard');
      else if (data.user.role === 'pharmacist') navigate('/store/prescriptions');
      else navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@hospital.com', password: 'admin123' },
      doctor: { email: 'sarah@hospital.com', password: 'doctor123' },
      patient: { email: 'patient@hospital.com', password: 'patient123' },
      pharmacist: { email: 'pharmacy@hospital.com', password: 'pharmacist123' },
    };
    setForm(creds[role]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left Panel */}
      <div style={{ background: 'linear-gradient(160deg, var(--primary-800) 0%, var(--primary-600) 50%, var(--teal-600) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 60, color: 'white' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 60 }}>
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(255,255,255,0.2)"/>
            <path d="M18 8v20M8 18h20" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 24, fontWeight: 800 }}>MediCare</span>
        </Link>
        <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>Healthcare at<br />your fingertips</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 48 }}>
          Access your medical records, book appointments, order medicines, and consult with top doctors all in one place.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { emoji: '🏥', text: 'Book appointments with top doctors' },
            { emoji: '🧬', text: 'Order lab tests from home' },
            { emoji: '💊', text: 'Get medicines delivered fast' },
            { emoji: '🧠', text: 'AI-powered MRI analysis' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{item.emoji}</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'white' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--gray-500)', marginBottom: 32, fontSize: 14 }}>Sign in to your MediCare account</p>

          {/* Demo login buttons */}
          <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 10, fontWeight: 500 }}>Quick Demo Login:</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['patient', 'doctor', 'pharmacist', 'admin'].map(role => (
                <button key={role} onClick={() => fillDemo(role)} style={{ flex: 1, padding: '7px 4px', borderRadius: 8, border: '1.5px solid var(--gray-200)', background: 'white', fontSize: 12, fontWeight: 600, color: 'var(--gray-700)', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-400)'; e.currentTarget.style.color = 'var(--primary-600)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-700)'; }}>
                  {role}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 20 }}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <Mail className="input-icon" />
                <input type="email" className="form-control" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-group input-group-right">
                <Lock className="input-icon" />
                <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 8 }} disabled={loading}>
              {loading ? <><span className="loading-spinner"></span> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--gray-500)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
