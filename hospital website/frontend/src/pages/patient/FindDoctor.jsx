import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { userAPI } from '../../api';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FindDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');

  const specs = ['All', 'Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Oncology', 'General Practice'];
  const colors = ['#2563eb', '#0d9488', '#7c3aed', '#f97316', '#ef4444', '#22c55e'];
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  useEffect(() => {
    setLoading(true);
    userAPI.getDoctors({ search, specialization: specialization === 'All' ? '' : specialization }).then(r => { setDoctors(r.data.doctors); setLoading(false); }).catch(() => setLoading(false));
  }, [search, specialization]);

  return (
    <DashboardLayout title="Find a Doctor">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-bar" style={{ flex: 1 }}>
              <Search className="search-bar-icon" />
              <input placeholder="Search doctors by name or specialty..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {specs.map(s => (
                <button key={s} className={`btn btn-sm ${specialization === s || (!specialization && s === 'All') ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSpecialization(s === 'All' ? '' : s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="loading-spinner loading-spinner-lg"></div></div>
      ) : (
        <div className="grid-cols-3">
          {doctors.map((doc, i) => (
            <div key={doc._id} className="doctor-card" style={{ padding: 24 }}>
              <div className="doctor-avatar avatar avatar-xl" style={{ background: colors[i % colors.length], margin: '0 auto 14px' }}>
                {getInitials(doc.name)}
              </div>
              <div className="doctor-name">{doc.name}</div>
              <div className="doctor-spec">{doc.specialization || 'General Practice'}</div>
              <div className="doctor-meta">
                {doc.qualification && <span>{doc.qualification} • </span>}
                {doc.experience && <span>{doc.experience} yrs experience</span>}
              </div>
              {doc.bio && <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14, lineHeight: 1.6 }}>{doc.bio}</p>}
              <div className="doctor-fee">₹{doc.consultationFee || 500} consultation fee</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/patient/book-appointment`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Book Appointment</Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && doctors.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><Search size={36} /></div>
          <h3>No doctors found</h3>
          <p>Try a different search term or specialization.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
