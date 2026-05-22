import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { orderAPI } from '../../api';
import { Package } from 'lucide-react';

const statusColors = { pending: 'badge-warning', confirmed: 'badge-info', processing: 'badge-primary', shipped: 'badge-purple', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMy().then(r => { setOrders(r.data.orders); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Order History">
      <div className="card">
        <div className="card-header"><h3 className="card-title">My Orders ({orders.length})</h3></div>
        {loading ? (
          <div className="loading-overlay"><div className="loading-spinner"></div></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Package size={36} /></div>
            <h3>No orders yet</h3>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="card-body" style={{ padding: 0 }}>
            {orders.map(order => (
              <div key={order._id} style={{ padding: '18px 22px', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
                      {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length} items • {order.paymentMethod}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 4 }}>
                      {order.items?.slice(0, 2).map(i => i.name).join(', ')}{order.items?.length > 2 ? ` + ${order.items.length - 2} more` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${statusColors[order.status] || 'badge-gray'}`}>{order.status}</span>
                    <div style={{ fontWeight: 700, fontSize: 16, marginTop: 6 }}>₹{order.totalPrice}</div>
                  </div>
                </div>
                {order.deliveryAddress && (
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 8 }}>📍 {order.deliveryAddress}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
