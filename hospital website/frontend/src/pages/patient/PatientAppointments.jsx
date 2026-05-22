import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { appointmentAPI } from '../../api';
import toast from 'react-hot-toast';
import { Calendar, X } from 'lucide-react';

const statusColors = { pending: 'badge-warning', confirmed: 'badge-success', rejected: 'badge-danger', completed: 'badge-info', cancelled: 'badge-gray' };

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const { data } = await appointmentAPI.getMy(params);
      setAppointments(data.appointments);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, [filter]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.update(id, { status: 'cancelled' });
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch { toast.error('Failed to cancel'); }
  };

  return (
    <DashboardLayout title="My Appointments">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Appointments</h3>
          <select className="form-control" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Status</option>
            {['pending', 'confirmed', 'rejected', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {loading ? (
          <div className="loading-overlay"><div className="loading-spinner"></div></div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Calendar size={36} /></div>
            <h3>No Appointments</h3>
            <p>You haven't booked any appointments yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Doctor</th><th>Specialization</th><th>Date & Time</th><th>Reason</th><th>Status</th><th>Prescription</th><th>Actions</th></tr></thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500 }}>{a.doctor?.name}</td>
                    <td>{a.doctor?.specialization}</td>
                    <td>{new Date(a.date).toLocaleDateString()} <br /><span style={{ color: 'var(--gray-500)', fontSize: 12 }}>{a.timeSlot}</span></td>
                    <td style={{ color: 'var(--gray-500)', maxWidth: 150 }}>{a.reason || 'N/A'}</td>
                    <td><span className={`badge ${statusColors[a.status]}`}>{a.status}</span></td>
                    <td>
                      {a.prescriptionSubmitted ? (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span className={`badge ${a.prescriptionStatus === 'delivered' ? 'badge-success' : a.prescriptionStatus === 'ready_for_delivery' ? 'badge-info' : 'badge-warning'}`}>
                            {a.prescriptionStatus === 'ready_for_delivery' ? 'Ready for Delivery' : a.prescriptionStatus || 'pending'}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>({a.prescriptionItems?.length || 0} medicines)</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--gray-400)', fontSize: 12 }}>Not submitted</span>
                      )}
                    </td>
                    <td>
                      {(a.status === 'pending' || a.status === 'confirmed') && (
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleCancel(a._id)} title="Cancel">
                          <X size={14} />
                        </button>
                      )}
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
