import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { userAPI, appointmentAPI, orderAPI } from '../../api';
import { Users, Calendar, Package, TrendingUp, UserCheck, Stethoscope, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userAPI.getAnalytics(),
      appointmentAPI.getAll({ limit: 5 }),
      orderAPI.getAll({ limit: 5 }),
    ]).then(([aRes, apRes, oRes]) => {
      setAnalytics(aRes.data.analytics);
      setAppointments(apRes.data.appointments);
      setOrders(oRes.data.orders);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = analytics ? [
    { label: 'Total Patients', value: analytics.totalPatients, icon: Users, color: '#2563eb', bg: '#dbeafe' },
    { label: 'Total Doctors', value: analytics.totalDoctors, icon: Stethoscope, color: '#0d9488', bg: '#ccfbf1' },
    { label: 'Total Users', value: analytics.totalUsers, icon: UserCheck, color: '#7c3aed', bg: '#f3e8ff' },
    { label: 'Appointments Today', value: appointments.length, icon: Calendar, color: '#f97316', bg: '#ffedd5' },
  ] : [];

  const statusColors = { pending: 'badge-warning', confirmed: 'badge-success', rejected: 'badge-danger', completed: 'badge-info' };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', borderRadius: 16, padding: '28px 32px', marginBottom: 28, color: 'white' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>System Overview 🏥</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Manage users, appointments, orders, and system analytics from here.</p>
      </div>

      {loading ? <div className="loading-overlay"><div className="loading-spinner loading-spinner-lg"></div></div> : (
        <>
          <div className="grid-cols-4" style={{ marginBottom: 28 }}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="stat-card">
                  <div className="stat-icon" style={{ background: s.bg }}><Icon size={22} color={s.color} /></div>
                  <div className="stat-info">
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Links */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header"><h3 className="card-title">Quick Management</h3></div>
            <div className="card-body">
              <div className="grid-cols-4">
                {[
                  { label: 'Manage Users', path: '/admin/users', color: '#2563eb', bg: '#dbeafe', emoji: '👥' },
                  { label: 'Upload Reports', path: '/admin/reports', color: '#0d9488', bg: '#ccfbf1', emoji: '📋' },
                  { label: 'Manage Medicines', path: '/admin/medicines', color: '#7c3aed', bg: '#f3e8ff', emoji: '💊' },
                  { label: 'System Analytics', path: '/admin/analytics', color: '#f97316', bg: '#ffedd5', emoji: '📊' },
                ].map((item, i) => (
                  <Link key={i} to={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 20, borderRadius: 14, background: item.bg, transition: 'transform 0.2s', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <span style={{ fontSize: 30 }}>{item.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: item.color, textAlign: 'center' }}>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-cols-2">
            {/* Recent Appointments */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Appointments</h3>
                <Link to="/admin/appointments" className="btn btn-secondary btn-sm">View All</Link>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Patient</th><th>Doctor</th><th>Status</th></tr></thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a._id}>
                        <td style={{ fontWeight: 500 }}>{a.patient?.name}</td>
                        <td>{a.doctor?.name}</td>
                        <td><span className={`badge ${statusColors[a.status] || 'badge-gray'}`}>{a.status}</span></td>
                      </tr>
                    ))}
                    {appointments.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 24 }}>No appointments</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Orders</h3>
                <Link to="/admin/orders" className="btn btn-secondary btn-sm">View All</Link>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {orders.map(o => (
                  <div key={o._id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{o.user?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{o.items?.length} items • ₹{o.totalPrice}</div>
                    </div>
                    <span className={`badge ${o.status === 'delivered' ? 'badge-success' : o.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>{o.status}</span>
                  </div>
                ))}
                {orders.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--gray-400)' }}>No orders</div>}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
