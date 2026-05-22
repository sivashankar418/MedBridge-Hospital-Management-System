import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { userAPI } from '../../api';
import { Users, Search } from 'lucide-react';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    userAPI.getAll({ role: 'patient', search }).then(r => { setPatients(r.data.users); setLoading(false); }).catch(() => setLoading(false));
  }, [search]);

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <DashboardLayout title="Patient List">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Patients ({patients.length})</h3>
          <div className="search-bar">
            <Search className="search-bar-icon" />
            <input placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : patients.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon"><Users size={36} /></div><h3>No patients found</h3></div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Patient</th><th>Email</th><th>Phone</th><th>Member Since</th></tr></thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm" style={{ background: `hsl(${i * 40}, 70%, 55%)` }}>{getInitials(p.name)}</div>
                        <span style={{ fontWeight: 500 }}>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.email}</td>
                    <td>{p.phone || 'N/A'}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
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
