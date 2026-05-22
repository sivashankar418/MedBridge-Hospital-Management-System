import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { orderAPI } from '../../api';
import toast from 'react-hot-toast';
import { Package } from 'lucide-react';

const statusColors = { pending: 'badge-warning', confirmed: 'badge-info', processing: 'badge-primary', shipped: 'badge-purple', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => { setLoading(true); orderAPI.getAll({ limit: 50 }).then(r => { setOrders(r.data.orders); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const handleStatus = async (id, status) => {
    try { await orderAPI.updateStatus(id, status); toast.success('Status updated'); fetch(); } catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout title="Manage Orders">
      <div className="card">
        <div className="card-header"><h3 className="card-title">All Orders ({orders.length})</h3></div>
        {loading ? <div className="loading-overlay"><div className="loading-spinner"></div></div> : orders.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon"><Package size={36} /></div><h3>No orders</h3></div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: 13 }}>#{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.name}</td>
                    <td style={{ maxWidth: 200, fontSize: 12 }}>{o.items?.map(i => i.name).join(', ')}</td>
                    <td style={{ fontWeight: 700 }}>₹{o.totalPrice}</td>
                    <td style={{ textTransform: 'capitalize' }}>{o.paymentMethod}</td>
                    <td><span className={`badge ${statusColors[o.status] || 'badge-gray'}`}>{o.status}</span></td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--gray-200)', fontSize: 12, cursor: 'pointer' }} value={o.status} onChange={e => handleStatus(o._id, e.target.value)}>
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
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
