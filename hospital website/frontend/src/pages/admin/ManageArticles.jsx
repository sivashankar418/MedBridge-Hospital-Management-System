import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { articleAPI } from '../../api';
import toast from 'react-hot-toast';
import { BookOpen, Plus, Edit, Trash2, X } from 'lucide-react';

const categories = ['General', 'Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Mental Health', 'Preventive Care', 'Endocrinology'];

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'General', tags: '' });

  const fetch = () => { setLoading(true); articleAPI.getAll({ limit: 50 }).then(r => { setArticles(r.data.articles); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm({ title: '', excerpt: '', content: '', category: 'General', tags: '' }); setEditId(null); setModal(true); };
  const openEdit = (a) => { setForm({ ...a, tags: a.tags?.join(', ') || '' }); setEditId(a._id); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editId) { await articleAPI.update(editId, data); toast.success('Updated'); }
      else { await articleAPI.create(data); toast.success('Article published'); }
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try { await articleAPI.delete(id); toast.success('Deleted'); fetch(); } catch { toast.error('Delete failed'); }
  };

  return (
    <DashboardLayout title="Manage Articles">
      {modal && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit Article' : 'Create Article'}</h3>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Title *</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Category</label><select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Tags (comma separated)</label><input className="form-control" placeholder="e.g. heart, health, tips" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Excerpt</label><textarea className="form-control" rows={2} placeholder="Brief description..." value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} style={{ resize: 'vertical' }}></textarea></div>
                <div className="form-group"><label className="form-label">Content *</label><textarea className="form-control" rows={8} placeholder="Full article content..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required style={{ resize: 'vertical' }}></textarea></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Publish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Health Articles ({articles.length})</h3>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> New Article</button>
        </div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : articles.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon"><BookOpen size={36} /></div><h3>No articles</h3></div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Views</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500, maxWidth: 280 }}>{a.title}</td>
                    <td><span className="badge badge-primary">{a.category}</span></td>
                    <td>{a.author?.name || 'Admin'}</td>
                    <td>{a.views}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(a)}><Edit size={14} /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(a._id)}><Trash2 size={14} /></button>
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
