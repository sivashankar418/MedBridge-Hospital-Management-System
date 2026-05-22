import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { userAPI, appointmentAPI } from '../../api';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, Search } from 'lucide-react';

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ date: '', timeSlot: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    userAPI.getDoctors({ search }).then(r => { setDoctors(r.data.doctors); setLoading(false); }).catch(() => setLoading(false));
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) { toast.error('Please select a doctor'); return; }
    if (!form.date || !form.timeSlot) { toast.error('Please select date and time slot'); return; }
    setSubmitting(true);
    try {
      await appointmentAPI.create({ doctor: selected._id, date: form.date, timeSlot: form.timeSlot, reason: form.reason });
      toast.success('Appointment booked successfully!');
      setSelected(null);
      setForm({ date: '', timeSlot: '', reason: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  const colors = ['#2563eb', '#0d9488', '#7c3aed', '#f97316', '#ef4444'];

  return (
    <DashboardLayout title="Book Appointment">
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 24 }}>
        {/* Doctor Grid */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Find a Doctor</h3>
              <div className="search-bar">
                <Search className="search-bar-icon" />
                <input placeholder="Search by name or specialization..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading-overlay"><div className="loading-spinner"></div></div>
              ) : (
                <div className="grid-auto">
                  {doctors.map((doc, i) => (
                    <div key={doc._id} className="doctor-card" style={{ cursor: 'pointer', border: selected?._id === doc._id ? '2px solid var(--primary-500)' : '1px solid var(--gray-200)' }} onClick={() => setSelected(doc)}>
                      <div className="doctor-avatar avatar avatar-lg" style={{ background: colors[i % colors.length] }}>{getInitials(doc.name)}</div>
                      <div className="doctor-name">{doc.name}</div>
                      <div className="doctor-spec">{doc.specialization || 'General'}</div>
                      <div className="doctor-meta">{doc.qualification} • {doc.experience} yrs exp</div>
                      <div className="doctor-fee">₹{doc.consultationFee || 500} / consultation</div>
                      <button className={`btn ${selected?._id === doc._id ? 'btn-success' : 'btn-primary'} btn-sm w-full`}>
                        {selected?._id === doc._id ? '✓ Selected' : 'Select Doctor'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        {selected && (
          <div>
            <div className="card" style={{ position: 'sticky', top: 90 }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary-600), var(--teal-500))', padding: '20px', borderRadius: '14px 14px 0 0', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div className="avatar" style={{ background: 'rgba(255,255,255,0.2)' }}>{getInitials(selected.name)}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{selected.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{selected.specialization}</div>
                  </div>
                  <button style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }} onClick={() => setSelected(null)}>✕ Clear</button>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{selected.bio}</div>
              </div>
              <form onSubmit={handleSubmit} className="card-body">
                <div className="form-group">
                  <label className="form-label"><Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />Appointment Date</label>
                  <input type="date" className="form-control" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label"><Clock size={14} style={{ display: 'inline', marginRight: 4 }} />Select Time Slot</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                    {timeSlots.map(slot => (
                      <button key={slot} type="button"
                        style={{ padding: '8px 4px', borderRadius: 8, border: `1.5px solid ${form.timeSlot === slot ? 'var(--primary-500)' : 'var(--gray-200)'}`, background: form.timeSlot === slot ? 'var(--primary-50)' : 'white', color: form.timeSlot === slot ? 'var(--primary-700)' : 'var(--gray-600)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => setForm({ ...form, timeSlot: slot })}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason for Visit</label>
                  <textarea className="form-control" rows={3} placeholder="Briefly describe your symptoms or reason..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} style={{ resize: 'vertical' }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                  {submitting ? <><span className="loading-spinner"></span> Booking...</> : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
