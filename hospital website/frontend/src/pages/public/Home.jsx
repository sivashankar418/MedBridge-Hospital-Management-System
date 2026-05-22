import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, Shield, Clock, Users, Star, ArrowRight, Phone, Mail, MapPin, Activity, Stethoscope, Brain, TestTube, Pill, Calendar } from 'lucide-react';

const features = [
  { icon: Calendar, title: 'Easy Appointments', desc: 'Book appointments with top doctors in seconds, anytime anywhere.', color: '#2563eb' },
  { icon: TestTube, title: 'Lab Tests', desc: 'Order lab tests from home, get results delivered digitally.', color: '#0d9488' },
  { icon: Pill, title: 'Medicine Store', desc: 'Order medications with prescription verification and fast delivery.', color: '#7c3aed' },
  { icon: Brain, title: 'AI MRI Analysis', desc: 'Upload MRI scans and get instant AI-powered preliminary analysis.', color: '#f97316' },
  { icon: Shield, title: 'Secure Records', desc: 'Your medical records protected with bank-grade encryption.', color: '#22c55e' },
  { icon: Activity, title: 'Health Tracking', desc: 'Monitor your health journey with detailed reports and analytics.', color: '#ef4444' },
];

const specializations = ['Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Gynecology', 'Ophthalmology'];

const stats = [
  { value: '500+', label: 'Expert Doctors' },
  { value: '50K+', label: 'Happy Patients' },
  { value: '98%', label: 'Success Rate' },
  { value: '24/7', label: 'Support Available' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ fontFamily: 'var(--font-family)', background: 'white' }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#2563eb"/>
              <path d="M18 8v20M8 18h20" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-700)' }}>Medi<span style={{ color: 'var(--teal-500)' }}>Care</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#features" style={{ color: 'var(--gray-600)', fontSize: 14, fontWeight: 500 }}>Features</a>
            <a href="#specializations" style={{ color: 'var(--gray-600)', fontSize: 14, fontWeight: 500 }}>Specializations</a>
            <a href="#contact" style={{ color: 'var(--gray-600)', fontSize: 14, fontWeight: 500 }}>Contact</a>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">Go to Dashboard</Link>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdfa 50%, #faf5ff 100%)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--primary-100)', color: 'var(--primary-700)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
              <Heart size={14} fill="currentColor" /> Trusted Healthcare Platform
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.15, marginBottom: 20 }}>
              Your Health,<br />
              <span style={{ color: 'var(--primary-600)' }}>Our Priority</span>
            </h1>
            <p style={{ fontSize: 18, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 32, maxWidth: 500 }}>
              MediCare connects patients, doctors, and administrators in one seamless platform. Book appointments, manage records, order medications, and access AI-powered health insights.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary-600)', color: 'white', padding: '14px 28px', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: 15, transition: 'all 0.2s' }}>
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: 'var(--gray-700)', padding: '14px 28px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 15, border: '1.5px solid var(--gray-200)' }}>
                Sign In
              </Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { bg: 'linear-gradient(135deg, #2563eb, #1d4ed8)', icon: <Stethoscope size={32} color="white" />, label: 'Book Doctor' },
              { bg: 'linear-gradient(135deg, #0d9488, #0f766e)', icon: <TestTube size={32} color="white" />, label: 'Lab Tests' },
              { bg: 'linear-gradient(135deg, #7c3aed, #6d28d9)', icon: <Brain size={32} color="white" />, label: 'AI Scan' },
              { bg: 'linear-gradient(135deg, #f97316, #ea580c)', icon: <Pill size={32} color="white" />, label: 'Pharmacy' },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, borderRadius: 20, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-lg)', transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {item.icon}
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--primary-700)', padding: '40px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Everything You Need</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 14 }}>Comprehensive Healthcare Features</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 17, maxWidth: 600, margin: '0 auto' }}>From booking appointments to AI-powered diagnostics, MediCare has everything you need for modern healthcare.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.25s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: f.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <Icon size={24} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section id="specializations" style={{ background: 'var(--gray-50)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>Medical Specializations</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: 48, fontSize: 16 }}>Expert doctors across all major medical specialties</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            {specializations.map((s, i) => (
              <Link to="/register" key={i} style={{ padding: '10px 22px', background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-full)', fontSize: 14, fontWeight: 500, color: 'var(--gray-700)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-400)'; e.currentTarget.style.color = 'var(--primary-600)'; e.currentTarget.style.background = 'var(--primary-50)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-700)'; e.currentTarget.style.background = 'white'; }}>
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary-700), var(--primary-900))', padding: '80px 40px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: 'white', marginBottom: 16 }}>Ready to take control of your health?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 36 }}>Join thousands of patients who trust MediCare for their healthcare needs.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <Link to="/register" style={{ background: 'white', color: 'var(--primary-700)', padding: '14px 32px', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link to="/login" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '14px 32px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 15 }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '60px 40px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 30 }}>
          {[
            { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
            { icon: Mail, label: 'Email', value: 'support@medicare.com' },
            { icon: MapPin, label: 'Address', value: '123 Medical Center Blvd, NY' },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 20, borderRadius: 14, background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
                <div style={{ width: 44, height: 44, background: 'var(--primary-100)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color="var(--primary-600)" />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>{c.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{c.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--gray-900)', color: 'rgba(255,255,255,0.6)', padding: '24px 40px', textAlign: 'center', fontSize: 13 }}>
        © 2024 MediCare Hospital Management System. All rights reserved.
      </footer>
    </div>
  );
}
