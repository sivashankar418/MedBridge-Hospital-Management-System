import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { appointmentAPI, orderAPI } from '../../api';
import toast from 'react-hot-toast';
import { ClipboardList, ShoppingCart, Package, CheckCircle, X } from 'lucide-react';

const statusColors = {
  pending: 'badge-warning',
  approved: 'badge-info',
  ready_for_delivery: 'badge-primary',
  delivered: 'badge-success',
};

export default function StorePrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(null);
  const [form, setForm] = useState({ deliveryAddress: '', paymentMethod: 'cash', notes: '' });
  const [submitting, setSubmitting] = useState(false);

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

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentAPI.updatePrescriptionStatus(appointmentId, newStatus);
      toast.success('Status updated!');
      setStatusUpdate(null);
      fetchPrescriptions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const openOrder = (prescription) => {
    setSelected(prescription);
    setForm({
      deliveryAddress: prescription.patient?.address || '',
      paymentMethod: 'cash',
      notes: prescription.prescription || '',
    });
  };

  const handleSubmit = async () => {
    if (!form.deliveryAddress) { toast.error('Enter delivery address'); return; }
    if (!selected) return;
    setSubmitting(true);
    try {
      await orderAPI.create({
        items: [{ itemType: 'Medicine', name: `Prescription for ${selected.patient?.name || 'patient'}`, price: 0, quantity: 1 }],
        totalPrice: 0,
        orderType: 'medicine',
        deliveryAddress: form.deliveryAddress,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        patientId: selected.patient?._id,
      });
      toast.success('Order created for patient');
      setSelected(null);
      setForm({ deliveryAddress: '', paymentMethod: 'cash', notes: '' });
      fetchPrescriptions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Medical Store Prescriptions">
      {statusUpdate && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h3 className="modal-title">Update Prescription Status</h3>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setStatusUpdate(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 16, color: 'var(--gray-600)' }}>
                Update status for <strong>{statusUpdate.patient?.name}</strong>'s prescription
              </p>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-control"
                  value={statusUpdate.prescriptionStatus}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, prescriptionStatus: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="ready_for_delivery">Ready for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStatusUpdate(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleStatusUpdate(statusUpdate._id, statusUpdate.prescriptionStatus)}>Update Status</button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3 className="modal-title">Create Order for {selected.patient?.name}</h3>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 16 }}>
                <strong>Prescription</strong>
                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--gray-600)' }}>{selected.prescription || 'No prescription text available'}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.deliveryAddress}
                  onChange={e => setForm({ ...form, deliveryAddress: e.target.value })}
                  placeholder="Enter delivery address for patient"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-control" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Order Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Add medicine instructions or order note"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Placing order...' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Patient Prescriptions</h3>
            <p style={{ marginTop: 4, color: 'var(--gray-500)' }}>View doctor prescriptions, update status, and create medicine orders for patients.</p>
          </div>
          <Link to="/store/medicines" className="btn btn-primary btn-sm">
            <ShoppingCart size={14} /> Browse Medicines
          </Link>
        </div>

        {loading ? (
          <div className="loading-overlay"><div className="loading-spinner"></div></div>
        ) : prescriptions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ClipboardList size={36} /></div>
            <h3>No prescriptions found</h3>
            <p>No doctor prescriptions are available yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Medicines</th>
                  <th>Actions</th>
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
                    <td>
                      <span className={`badge ${statusColors[item.prescriptionStatus] || 'badge-gray'}`}>
                        {item.prescriptionStatus || 'pending'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>
                        {item.prescriptionItems?.map((med, idx) => (
                          <div key={idx}>{med.medicine} x{med.quantity}</div>
                        )) || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button 
                          className="btn btn-info btn-sm" 
                          onClick={() => setStatusUpdate(item)}
                          title="Update Status"
                        >
                          Update Status
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => openOrder(item)}>
                          <Package size={14} /> Order
                        </button>
                      </div>
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
