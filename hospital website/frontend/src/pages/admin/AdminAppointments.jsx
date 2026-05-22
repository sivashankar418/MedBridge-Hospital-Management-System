import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { appointmentAPI } from '../../api';
import toast from 'react-hot-toast';
import { Calendar } from 'lucide-react';

const statusColors = { pending: 'badge-warning', confirmed: 'badge-success', rejected: 'badge-danger', completed: 'badge-info', cancelled: 'badge-gray' };

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetch = () => {
    setLoading(true);
    appointmentAPI.getAll({ status: filter }).then(r => { setAppointments(r.data.appointments); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [filter]);

  const handleStatus = async (id, status) => {
    try { await appointmentAPI.update(id, { status }); toast.success('Status updated'); fetch(); } catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout title="Manage Appointments">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Appointments ({appointments.length})</h3>
          <select className="form-control" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Status</option>
            {['pending', 'confirmed', 'rejected', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : appointments.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon"><Calendar size={36} /></div><h3>No appointments</h3></div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500 }}>{a.patient?.name}</td>
                    <td>{a.doctor?.name} <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.doctor?.specialization}</div></td>
                    <td>{new Date(a.date).toLocaleDateString()}<br /><span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.timeSlot}</span></td>
                    <td style={{ maxWidth: 150 }}>{a.reason || 'N/A'}</td>
                    <td><span className={`badge ${statusColors[a.status] || 'badge-gray'}`}>{a.status}</span></td>
                    <td>
                      <select style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--gray-200)', fontSize: 12, cursor: 'pointer' }} value={a.status} onChange={e => handleStatus(a._id, e.target.value)}>
                        {['pending', 'confirmed', 'rejected', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
