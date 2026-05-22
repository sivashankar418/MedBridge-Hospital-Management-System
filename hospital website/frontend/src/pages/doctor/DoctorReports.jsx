import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { reportAPI } from '../../api';
import { FileText, Eye, Download } from 'lucide-react';

export default function DoctorReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportAPI.getAll().then(r => { setReports(r.data.reports); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Patient Reports">
      <div className="card">
        <div className="card-header"><h3 className="card-title">All Reports ({reports.length})</h3></div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : reports.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon"><FileText size={36} /></div><h3>No reports yet</h3></div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Patient</th><th>Report</th><th>Type</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 500 }}>{r.patient?.name}</td>
                    <td>{r.title} {r.description && <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{r.description}</div>}</td>
                    <td><span className="badge badge-info">{r.reportType}</span></td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      {r.fileUrl && (
                        <a href={`http://localhost:5000${r.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm btn-icon"><Eye size={14} /></a>
                      )}
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
