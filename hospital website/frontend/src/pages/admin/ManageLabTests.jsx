import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { labTestAPI } from '../../api';
import toast from 'react-hot-toast';
import { TestTube, Plus, Edit, Trash2, X } from 'lucide-react';

export default function ManageLabTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '', category: '', parameters: '' });

  const fetch = () => { setLoading(true); labTestAPI.getAll({ limit: 50 }).then(r => { setTests(r.data.labTests); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm({ name: '', description: '', price: '', duration: '', category: '', parameters: '' }); setEditId(null); setModal(true); };
  const openEdit = (t) => { setForm({ ...t, price: String(t.price), parameters: t.parameters?.join(', ') || '' }); setEditId(t._id); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, price: Number(form.price), parameters: form.parameters.split(',').map(p => p.trim()).filter(Boolean) };
      if (editId) { await labTestAPI.update(editId, data); toast.success('Updated'); }
      else { await labTestAPI.create(data); toast.success('Lab test created'); }
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lab test?')) return;
    try { await labTestAPI.delete(id); toast.success('Deleted'); fetch(); } catch { toast.error('Delete failed'); }
  };

  return (
    <DashboardLayout title="Manage Lab Tests">
      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Lab Test' : 'Add Lab Test'}</h3>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Test Name *</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  <div className="form-group"><label className="form-label">Category</label><input className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }}></textarea></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Price (₹) *</label><input type="number" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
                  <div className="form-group"><label className="form-label">Duration</label><input className="form-control" placeholder="e.g. 6 hours" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Parameters (comma separated)</label><input className="form-control" placeholder="e.g. RBC, WBC, Hemoglobin" value={form.parameters} onChange={e => setForm({ ...form, parameters: e.target.value })} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lab Tests ({tests.length})</h3>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Lab Test</button>
        </div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Test Name</th><th>Category</th><th>Price</th><th>Duration</th><th>Parameters</th><th>Actions</th></tr></thead>
              <tbody>
                {tests.map(t => (
                  <tr key={t._id}>
                    <td><div style={{ fontWeight: 500 }}>{t.name}</div><div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.description?.slice(0, 50)}</div></td>
                    <td><span className="badge badge-info">{t.category || 'General'}</span></td>
                    <td style={{ fontWeight: 600 }}>₹{t.price}</td>
                    <td>{t.duration || '-'}</td>
                    <td style={{ fontSize: 12 }}>{t.parameters?.slice(0, 3).join(', ')}{t.parameters?.length > 3 ? '...' : ''}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(t)}><Edit size={14} /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(t._id)}><Trash2 size={14} /></button>
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
