import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { appointmentAPI } from '../../api';
import toast from 'react-hot-toast';
import { ClipboardList } from 'lucide-react';

const statusColors = {
  pending: 'badge-warning',
  approved: 'badge-info',
  ready_for_delivery: 'badge-primary',
  delivered: 'badge-success',
};

export default function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const { data } = await appointmentAPI.getPrescriptions();
      setPrescriptions(data.prescriptions);
    } catch (err) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <DashboardLayout title="Prescriptions">
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">All Doctor Prescriptions ({prescriptions.length})</h3>
            <p style={{ marginTop: 4, color: 'var(--gray-500)' }}>Monitor prescription status and pharmacy fulfillment.</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-overlay"><div className="loading-spinner"></div></div>
        ) : prescriptions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ClipboardList size={36} /></div>
            <h3>No prescriptions found</h3>
            <p>Doctors have not submitted any prescriptions yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Medicines</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.patient?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{item.patient?.email}</div>
                    </td>
                    <td>{item.doctor?.name}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td style={{ maxWidth: 260 }}>
                      {item.prescriptionItems?.length > 0 ? (
                        <div style={{ display: 'grid', gap: 6 }}>
                          {item.prescriptionItems.map((presc, idx) => (
                            <div key={idx} style={{ fontSize: 13 }}>
                              <strong>{presc.medicine}</strong> × {presc.quantity}
                              <div style={{ color: 'var(--gray-500)' }}>{presc.dosage}{presc.instruction ? ` • ${presc.instruction}` : ''}</div>
                            </div>
                          ))}
                        </div>
                      ) : item.prescription ? (
                        <span>{item.prescription}</span>
                      ) : (
                        <span style={{ color: 'var(--gray-500)' }}>No details</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${statusColors[item.prescriptionStatus] || 'badge-gray'}`}>
                        {item.prescriptionStatus === 'ready_for_delivery' ? 'Ready for Delivery' : item.prescriptionStatus || 'pending'}
                      </span>
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
