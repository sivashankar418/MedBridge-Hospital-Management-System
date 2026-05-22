import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { medicineAPI } from '../../api';
import toast from 'react-hot-toast';
import { Pill, Plus, Edit, Trash2, X } from 'lucide-react';

export default function ManageMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '', manufacturer: '', dosage: '', requiresPrescription: false });

  const fetch = () => { setLoading(true); medicineAPI.getAll({ limit: 50 }).then(r => { setMedicines(r.data.medicines); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm({ name: '', description: '', price: '', stock: '', category: '', manufacturer: '', dosage: '', requiresPrescription: false }); setEditId(null); setModal(true); };
  const openEdit = (m) => { setForm({ ...m, price: String(m.price), stock: String(m.stock) }); setEditId(m._id); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editId) { await medicineAPI.update(editId, data); toast.success('Updated'); }
      else { await medicineAPI.create(data); toast.success('Medicine created'); }
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    try { await medicineAPI.delete(id); toast.success('Deleted'); fetch(); } catch { toast.error('Delete failed'); }
  };

  return (
    <DashboardLayout title="Manage Medicines">
      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Medicine' : 'Add Medicine'}</h3>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Name *</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  <div className="form-group"><label className="form-label">Category</label><input className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }}></textarea></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Price (₹) *</label><input type="number" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
                  <div className="form-group"><label className="form-label">Stock *</label><input type="number" className="form-control" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Manufacturer</label><input className="form-control" value={form.manufacturer} onChange={e => setForm({ ...form, manufacturer: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Dosage</label><input className="form-control" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} /></div>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                    <input type="checkbox" checked={form.requiresPrescription} onChange={e => setForm({ ...form, requiresPrescription: e.target.checked })} />
                    Requires Prescription
                  </label>
                </div>
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
          <h3 className="card-title">Medicines ({medicines.length})</h3>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Medicine</button>
        </div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Prescription</th><th>Actions</th></tr></thead>
              <tbody>
                {medicines.map(m => (
                  <tr key={m._id}>
                    <td><div style={{ fontWeight: 500 }}>{m.name}</div><div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{m.manufacturer}</div></td>
                    <td><span className="badge badge-primary">{m.category || 'General'}</span></td>
                    <td style={{ fontWeight: 600 }}>₹{m.price}</td>
                    <td><span className={m.stock > 0 ? 'text-success' : 'text-danger'} style={{ fontWeight: 500 }}>{m.stock}</span></td>
                    <td>{m.requiresPrescription ? <span className="badge badge-warning">Required</span> : <span className="badge badge-gray">No</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(m)}><Edit size={14} /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(m._id)}><Trash2 size={14} /></button>
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
