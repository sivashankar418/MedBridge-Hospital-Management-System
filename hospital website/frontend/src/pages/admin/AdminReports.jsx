import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { reportAPI, userAPI } from '../../api';
import toast from 'react-hot-toast';
import { FileText, Plus, Trash2, X, Upload } from 'lucide-react';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ patient: '', title: '', description: '', reportType: 'lab' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true);
    Promise.all([reportAPI.getAll(), userAPI.getAll({ role: 'patient' })]).then(([rRes, uRes]) => {
      setReports(rRes.data.reports);
      setPatients(uRes.data.users);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('file', file);
      await reportAPI.upload(fd);
      toast.success('Report uploaded!');
      setModal(false);
      setForm({ patient: '', title: '', description: '', reportType: 'lab' });
      setFile(null);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try { await reportAPI.delete(id); toast.success('Deleted'); fetch(); } catch { toast.error('Delete failed'); }
  };

  return (
    <DashboardLayout title="Reports Management">
      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Upload Report</h3>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Patient *</label>
                  <select className="form-control" value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} required>
                    <option value="">Select patient</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name} — {p.email}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Report Title *</label>
                    <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Report Type</label>
                    <select className="form-control" value={form.reportType} onChange={e => setForm({ ...form, reportType: e.target.value })}>
                      <option value="lab">Lab</option>
                      <option value="scan">Scan</option>
                      <option value="prescription">Prescription</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Upload File (PDF/Image)</label>
                  <input type="file" className="form-control" accept=".pdf,.jpg,.jpeg,.png,.dicom" onChange={e => setFile(e.target.files[0])} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Uploading...' : 'Upload Report'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Reports ({reports.length})</h3>
          <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Upload Report</button>
        </div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : reports.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon"><FileText size={36} /></div><h3>No reports</h3><p>Upload a patient report to get started.</p></div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Patient</th><th>Report</th><th>Type</th><th>File</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 500 }}>{r.patient?.name}</td>
                    <td>{r.title} {r.description && <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{r.description}</div>}</td>
                    <td><span className="badge badge-info">{r.reportType}</span></td>
                    <td>{r.fileUrl ? <a href={`http://localhost:5000${r.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">View</a> : 'No file'}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(r._id)}><Trash2 size={14} /></button></td>
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
