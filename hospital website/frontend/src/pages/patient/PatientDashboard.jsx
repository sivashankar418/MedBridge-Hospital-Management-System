import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, reportAPI, orderAPI, notificationAPI } from '../../api';
import { Calendar, FileText, ShoppingCart, Package, Clock, CheckCircle, AlertCircle, TrendingUp, Heart, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColors = {
  pending: 'badge-warning',
  confirmed: 'badge-success',
  rejected: 'badge-danger',
  completed: 'badge-info',
  cancelled: 'badge-gray',
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, rptRes, ordRes] = await Promise.all([
          appointmentAPI.getMy({ limit: 5 }),
          reportAPI.getMy(),
          orderAPI.getMy({ limit: 5 }),
        ]);
        setAppointments(apptRes.data.appointments);
        setReports(rptRes.data.reports);
        setOrders(ordRes.data.orders);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const upcomingAppt = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');

  return (
    <DashboardLayout title="Patient Dashboard">
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-500) 100%)', borderRadius: 16, padding: '28px 32px', marginBottom: 28, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 180, height: 180, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', right: 60, top: 60, width: 100, height: 100, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }}></div>
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Good day,</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Hello, {user?.name?.split(' ')[0]}! 👋</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>You have {upcomingAppt.length} upcoming appointment{upcomingAppt.length !== 1 ? 's' : ''} and {reports.length} medical reports.</p>
          <Link to="/patient/book-appointment" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '10px 22px', borderRadius: 10, fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.3)' }}>
            <Calendar size={16} /> Book New Appointment
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-cols-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Appointments', value: appointments.length, icon: Calendar, color: '#2563eb', bg: '#dbeafe' },
          { label: 'Medical Reports', value: reports.length, icon: FileText, color: '#0d9488', bg: '#ccfbf1' },
          { label: 'Active Orders', value: pendingOrders.length, icon: ShoppingCart, color: '#7c3aed', bg: '#f3e8ff' },
          { label: 'Total Orders', value: orders.length, icon: Package, color: '#f97316', bg: '#ffedd5' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>
                <Icon size={22} color={s.color} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{loading ? '-' : s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-cols-2">
        {/* Recent Appointments */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Appointments</h3>
            <Link to="/patient/appointments" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner"></div></div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Calendar size={30} /></div>
              <h3>No appointments yet</h3>
              <p>Book your first appointment</p>
              <Link to="/patient/book-appointment" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Book Now</Link>
            </div>
          ) : (
            <div className="card-body" style={{ padding: 0 }}>
              {appointments.slice(0, 4).map(a => (
                <div key={a._id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{a.doctor?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{a.doctor?.specialization} • {new Date(a.date).toLocaleDateString()} at {a.timeSlot}</div>
                  </div>
                  <span className={`badge ${statusColors[a.status] || 'badge-gray'}`}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Medical Reports</h3>
            <Link to="/patient/reports" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner"></div></div>
          ) : reports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><FileText size={30} /></div>
              <h3>No reports yet</h3>
              <p>Reports uploaded by admin will appear here</p>
            </div>
          ) : (
            <div className="card-body" style={{ padding: 0 }}>
              {reports.slice(0, 4).map(r => (
                <div key={r._id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{r.description} • {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className={`badge ${r.reportType === 'lab' ? 'badge-info' : r.reportType === 'scan' ? 'badge-purple' : 'badge-gray'}`}>{r.reportType}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header"><h3 className="card-title">Quick Actions</h3></div>
        <div className="card-body">
          <div className="grid-cols-4">
            {[
              { label: 'Book Appointment', icon: Calendar, path: '/patient/book-appointment', color: '#2563eb', bg: '#dbeafe' },
              { label: 'Order Lab Tests', icon: Activity, path: '/patient/lab-tests', color: '#0d9488', bg: '#ccfbf1' },
              { label: 'Buy Medicines', icon: Heart, path: '/patient/medicines', color: '#7c3aed', bg: '#f3e8ff' },
              { label: 'AI MRI Scan', icon: TrendingUp, path: '/patient/ai-scan', color: '#f97316', bg: '#ffedd5' },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <Link key={i} to={a.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 22, borderRadius: 14, background: a.bg, textDecoration: 'none', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ width: 48, height: 48, background: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Icon size={22} color={a.color} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: a.color, textAlign: 'center' }}>{a.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
