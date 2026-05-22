import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { reportAPI } from '../../api';
import { FileText, Download, Eye } from 'lucide-react';

const typeColors = { lab: 'badge-info', scan: 'badge-purple', prescription: 'badge-success', other: 'badge-gray' };

export default function PatientReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportAPI.getMy().then(r => { setReports(r.data.reports); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Medical Reports">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Reports ({reports.length})</h3>
        </div>
        {loading ? (
          <div className="loading-overlay"><div className="loading-spinner"></div></div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FileText size={36} /></div>
            <h3>No Reports Yet</h3>
            <p>Your medical reports will appear here once uploaded by the admin.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Report Title</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, background: 'var(--primary-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={16} color="var(--primary-600)" />
                        </div>
                        <span style={{ fontWeight: 500 }}>{r.title}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${typeColors[r.reportType]}`}>{r.reportType}</span></td>
                    <td style={{ color: 'var(--gray-500)', maxWidth: 200 }}>{r.description || 'N/A'}</td>
                    <td>{r.uploadedBy?.name || 'Admin'}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {r.fileUrl && (
                          <>
                            <a href={`http://localhost:5000${r.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm btn-icon" title="View">
                              <Eye size={14} />
                            </a>
                            <a href={`http://localhost:5000${r.fileUrl}`} download className="btn btn-primary btn-sm btn-icon" title="Download">
                              <Download size={14} />
                            </a>
                          </>
                        )}
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
