import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, userAPI } from '../../api';
import { Calendar, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColors = { pending: 'badge-warning', confirmed: 'badge-success', rejected: 'badge-danger', completed: 'badge-info', cancelled: 'badge-gray' };

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.getMy({ limit: 10 }).then(r => {
      const appts = r.data.appointments;
      setAppointments(appts);
      setStats({
        total: appts.length,
        pending: appts.filter(a => a.status === 'pending').length,
        confirmed: appts.filter(a => a.status === 'confirmed').length,
        completed: appts.filter(a => a.status === 'completed').length,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Doctor Dashboard">
      <div style={{ background: 'linear-gradient(135deg, var(--teal-600), var(--teal-500))', borderRadius: 16, padding: '28px 32px', marginBottom: 28, color: 'white' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Welcome, {user?.name}! 👨‍⚕️</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{user?.specialization} • {user?.experience} years experience</p>
      </div>

      <div className="grid-cols-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Appointments', value: stats.total, icon: Calendar, color: '#2563eb', bg: '#dbeafe' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: '#22c55e', bg: '#dcfce7' },
          { label: 'Completed', value: stats.completed, icon: Users, color: '#8b5cf6', bg: '#ede9fe' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}><Icon size={22} color={s.color} /></div>
              <div className="stat-info">
                <div className="stat-value">{loading ? '-' : s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Appointments</h3>
          <Link to="/doctor/appointments" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Patient</th><th>Date & Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {appointments.slice(0, 6).map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500 }}>{a.patient?.name}</td>
                    <td>{new Date(a.date).toLocaleDateString()} <br /><span style={{ color: 'var(--gray-500)', fontSize: 12 }}>{a.timeSlot}</span></td>
                    <td style={{ color: 'var(--gray-500)' }}>{a.reason || 'N/A'}</td>
                    <td><span className={`badge ${statusColors[a.status]}`}>{a.status}</span></td>
                    <td><Link to="/doctor/appointments" className="btn btn-secondary btn-sm">Manage</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && <div className="empty-state"><Calendar size={36} /><h3>No appointments yet</h3></div>}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
