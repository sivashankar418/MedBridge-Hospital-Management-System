import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { userAPI } from '../../api';
import toast from 'react-hot-toast';
import { Users, Plus, Edit, Trash2, X, Search } from 'lucide-react';

const roleColors = { patient: 'badge-info', doctor: 'badge-success', admin: 'badge-purple' };

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', specialization: '', phone: '' });
  const [editId, setEditId] = useState(null);

  const fetch = () => {
    setLoading(true);
    userAPI.getAll({ search, role: roleFilter }).then(r => { setUsers(r.data.users); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [search, roleFilter]);

  const openCreate = () => { setForm({ name: '', email: '', password: '', role: 'patient', specialization: '', phone: '' }); setEditId(null); setModal(true); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, password: '', role: u.role, specialization: u.specialization || '', phone: u.phone || '' }); setEditId(u._id); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await userAPI.update(editId, form); toast.success('User updated'); }
      else { await userAPI.create(form); toast.success('User created'); }
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await userAPI.delete(id); toast.success('User deleted'); fetch(); } catch { toast.error('Delete failed'); }
  };

  const getInitials = (n) => n?.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2);

  return (
    <DashboardLayout title="Manage Users">
      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Edit User' : 'Create User'}</h3>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                {!editId && (
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input type="password" className="form-control" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editId} />
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-control" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {form.role === 'doctor' && (
                    <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <input className="form-control" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
                    </div>
                  )}
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
          <h3 className="card-title">All Users ({users.length})</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="search-bar">
              <Search className="search-bar-icon" />
              <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control" style={{ width: 'auto' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add User</button>
          </div>
        </div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Specialization</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm" style={{ background: `hsl(${i * 40}, 65%, 55%)` }}>{getInitials(u.name)}</div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{u.phone || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${roleColors[u.role]}`}>{u.role}</span></td>
                    <td>{u.specialization || '-'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(u)}><Edit size={14} /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(u._id)}><Trash2 size={14} /></button>
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
