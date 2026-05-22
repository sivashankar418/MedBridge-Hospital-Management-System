import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { appointmentAPI } from '../../api';
import toast from 'react-hot-toast';
import { Calendar, Check, X, MessageSquare } from 'lucide-react';

const statusColors = { pending: 'badge-warning', confirmed: 'badge-success', rejected: 'badge-danger', completed: 'badge-info', cancelled: 'badge-gray' };

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [prescModal, setPrescModal] = useState(null);
  const [prescForm, setPrescForm] = useState({ prescription: '', feedback: '', status: '', prescriptionItems: [{ medicine: '', dosage: '', quantity: 1, instruction: '' }] });

  const fetch = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const { data } = await appointmentAPI.getMy(params);
      setAppointments(data.appointments);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filter]);

  const handleAction = async (id, status) => {
    try {
      await appointmentAPI.update(id, { status });
      toast.success(`Appointment ${status}`);
      fetch();
    } catch { toast.error('Action failed'); }
  };

  const handleSavePrescription = async () => {
    try {
      // Filter out empty medicine items
      const validItems = (prescForm.prescriptionItems || []).filter(
        item => item.medicine.trim() || item.dosage.trim() || item.instruction.trim()
      );

      const dataToSend = {
        ...prescForm,
        prescriptionItems: validItems,
      };

      await appointmentAPI.update(prescModal._id, dataToSend);
      toast.success('Prescription saved as draft!');
      fetch();
    } catch (error) { 
      console.error('Save prescription error:', error);
      toast.error(error.response?.data?.message || 'Failed to save prescription');
    }
  };

  const handleSubmitPrescription = async () => {
    try {
      // Validate prescription has content
      const validItems = (prescForm.prescriptionItems || []).filter(
        item => item.medicine.trim() || item.dosage.trim() || item.instruction.trim()
      );
      
      if (!prescForm.prescription.trim() && validItems.length === 0) {
        toast.error('Please add prescription notes or at least one medicine');
        return;
      }

      // First save the prescription
      const dataToSend = {
        ...prescForm,
        prescriptionItems: validItems,
      };
      await appointmentAPI.update(prescModal._id, dataToSend);
      
      // Then submit it
      await appointmentAPI.submitPrescription(prescModal._id);
      toast.success('Prescription submitted successfully!');
      setPrescModal(null);
      fetch();
    } catch (error) { 
      console.error('Submit prescription error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit prescription');
    }
  };

  const handlePrescription = async () => {
    try {
      // Filter out empty medicine items
      const validItems = (prescForm.prescriptionItems || []).filter(
        item => item.medicine.trim() || item.dosage.trim() || item.instruction.trim()
      );
      
      // Check if prescription has content
      if (!prescForm.prescription.trim() && validItems.length === 0) {
        toast.error('Please add prescription notes or at least one medicine');
        return;
      }

      const dataToSend = {
        ...prescForm,
        prescriptionItems: validItems,
      };

      await appointmentAPI.update(prescModal._id, dataToSend);
      toast.success('Prescription saved!');
      setPrescModal(null);
      fetch();
    } catch (error) { 
      console.error('Save prescription error:', error);
      toast.error(error.response?.data?.message || 'Failed to save prescription');
    }
  };

  const addPrescriptionItem = () => {
    setPrescForm(prev => ({
      ...prev,
      prescriptionItems: [...(prev.prescriptionItems || []), { medicine: '', dosage: '', quantity: 1, instruction: '' }],
    }));
  };

  const updatePrescriptionItem = (index, field, value) => {
    setPrescForm(prev => ({
      ...prev,
      prescriptionItems: prev.prescriptionItems.map((item, idx) => idx === index ? { ...item, [field]: value } : item),
    }));
  };

  const removePrescriptionItem = (index) => {
    setPrescForm(prev => ({
      ...prev,
      prescriptionItems: prev.prescriptionItems.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <DashboardLayout title="Appointment Management">
      {prescModal && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 className="modal-title">Add Prescription & Feedback</h3>
              <button onClick={() => setPrescModal(null)} className="btn btn-secondary btn-icon btn-sm"><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>Patient: <strong>{prescModal.patient?.name}</strong> • {new Date(prescModal.date).toLocaleDateString()}</p>
              <div className="form-group">
                <label className="form-label">Mark Status</label>
                <select className="form-control" value={prescForm.status} onChange={e => setPrescForm({ ...prescForm, status: e.target.value })}>
                  <option value="">Keep current</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Prescription Notes</label>
                <textarea className="form-control" rows={3} placeholder="Enter prescription summary..." value={prescForm.prescription} onChange={e => setPrescForm({ ...prescForm, prescription: e.target.value })} style={{ resize: 'vertical' }}></textarea>
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Medicine List</label>
                  <button type="button" className="btn btn-sm btn-primary" onClick={addPrescriptionItem}>Add Medicine</button>
                </div>
                {(prescForm.prescriptionItems || []).map((item, index) => (
                  <div key={index} style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr 1fr auto', marginBottom: 12 }}>
                    <input className="form-control" placeholder="Medicine name" value={item.medicine} onChange={e => updatePrescriptionItem(index, 'medicine', e.target.value)} />
                    <input className="form-control" placeholder="Dosage" value={item.dosage} onChange={e => updatePrescriptionItem(index, 'dosage', e.target.value)} />
                    <input type="number" min={1} className="form-control" placeholder="Qty" value={item.quantity} onChange={e => updatePrescriptionItem(index, 'quantity', Number(e.target.value) || 1)} />
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removePrescriptionItem(index)} style={{ minWidth: 44 }}>Remove</button>
                    <input className="form-control" placeholder="Instructions" value={item.instruction} onChange={e => updatePrescriptionItem(index, 'instruction', e.target.value)} style={{ gridColumn: '1 / span 4' }} />
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Doctor's Notes / Feedback</label>
                <textarea className="form-control" rows={3} placeholder="Add notes or feedback..." value={prescForm.feedback} onChange={e => setPrescForm({ ...prescForm, feedback: e.target.value })} style={{ resize: 'vertical' }}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setPrescModal(null)}>Cancel</button>
              <button className="btn btn-secondary" onClick={handleSavePrescription}>Save Draft</button>
              <button className="btn btn-primary" onClick={handleSubmitPrescription}>Submit Prescription</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">My Appointments</h3>
          <select className="form-control" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Status</option>
            {['pending', 'confirmed', 'completed', 'rejected', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : appointments.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon"><Calendar size={36} /></div><h3>No appointments</h3></div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Patient</th><th>Date & Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{a.patient?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.patient?.phone}</div>
                    </td>
                    <td>{new Date(a.date).toLocaleDateString()}<br /><span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.timeSlot}</span></td>
                    <td style={{ maxWidth: 180 }}>{a.reason || 'N/A'}</td>
                    <td><span className={`badge ${statusColors[a.status]}`}>{a.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {a.status === 'pending' && (
                          <>
                            <button className="btn btn-success btn-sm btn-icon" onClick={() => handleAction(a._id, 'confirmed')} title="Confirm"><Check size={14} /></button>
                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleAction(a._id, 'rejected')} title="Reject"><X size={14} /></button>
                          </>
                        )}
                        {a.status === 'confirmed' && (
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => handleAction(a._id, 'completed')} title="Complete"><Check size={14} /></button>
                        )}
                        <button className="btn btn-primary btn-sm btn-icon" onClick={() => { setPrescModal(a); setPrescForm({ prescription: a.prescription || '', feedback: a.feedback || '', status: '', prescriptionItems: a.prescriptionItems?.length ? a.prescriptionItems : [{ medicine: '', dosage: '', quantity: 1, instruction: '' }] }); }} title="Prescription">
                          <MessageSquare size={14} />
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
