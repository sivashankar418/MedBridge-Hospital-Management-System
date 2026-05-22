import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../api';
import toast from 'react-hot-toast';
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const storePatientId = user?.role === 'pharmacist' ? sessionStorage.getItem('storePatientId') : null;
  const [form, setForm] = useState({ deliveryAddress: user?.role === 'pharmacist' ? '' : (user?.address || ''), paymentMethod: 'cash' });
  const [submitting, setSubmitting] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const handleCheckout = async () => {
    if (!form.deliveryAddress) { toast.error('Please enter delivery address'); return; }
    setSubmitting(true);
    try {
      await orderAPI.create({
        items: cartItems.map(i => ({ item: i._id, itemType: i.type === 'medicine' ? 'Medicine' : 'LabTest', name: i.name, price: i.price, quantity: i.quantity })),
        totalPrice,
        orderType: cartItems.every(i => i.type === 'medicine') ? 'medicine' : cartItems.every(i => i.type === 'labtest') ? 'labtest' : 'mixed',
        deliveryAddress: form.deliveryAddress,
        paymentMethod: form.paymentMethod,
        patientId: user?.role === 'pharmacist' ? storePatientId : undefined,
      });
      clearCart();
      if (user?.role === 'pharmacist') {
        sessionStorage.removeItem('storePatientId');
        sessionStorage.removeItem('storePatientName');
      }
      setOrdered(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setSubmitting(false); }
  };

  if (ordered) return (
    <DashboardLayout title="Cart">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={40} color="var(--green-600)" />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Order Placed!</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: 28 }}>Your order has been placed successfully. We'll process it shortly.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to={user?.role === 'pharmacist' ? '/store/prescriptions' : '/patient/order-history'} className="btn btn-primary">View Orders</Link>
            <Link to={user?.role === 'pharmacist' ? '/store/prescriptions' : '/patient/dashboard'} className="btn btn-secondary">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Cart & Checkout">
      {cartItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><ShoppingCart size={36} /></div>
          <h3>Your cart is empty</h3>
          <p>Browse medicines to add items to your cart.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
            <Link to={user?.role === 'pharmacist' ? '/store/medicines' : '/patient/medicines'} className="btn btn-primary btn-sm">Shop Medicines</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Cart Items ({totalItems})</h3>
              <button onClick={clearCart} className="btn btn-danger btn-sm"><Trash2 size={14} /> Clear All</button>
            </div>
            <div>
              {cartItems.map(item => (
                <div key={`${item._id}-${item.type}`} style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--primary-50)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 22 }}>{item.type === 'medicine' ? '💊' : '🧪'}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'capitalize' }}>{item.type}</div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: 15 }}>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button className="btn btn-secondary btn-icon btn-sm" onClick={() => updateQuantity(item._id, item.type, item.quantity - 1)}><Minus size={14} /></button>
                    <span style={{ fontWeight: 700, width: 28, textAlign: 'center' }}>{item.quantity}</span>
                    <button className="btn btn-secondary btn-icon btn-sm" onClick={() => updateQuantity(item._id, item.type, item.quantity + 1)}><Plus size={14} /></button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => removeFromCart(item._id, item.type)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ position: 'sticky', top: 90 }}>
            <div className="card-header"><h3 className="card-title">Order Summary</h3></div>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span>Subtotal ({totalItems} items)</span><span>₹{totalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span>Delivery</span><span style={{ color: 'var(--green-600)' }}>Free</span>
              </div>
              <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                <span>Total</span><span>₹{totalPrice}</span>
              </div>

              <div className="form-group" style={{ marginTop: 20 }}>
                <label className="form-label">Delivery Address</label>
                <textarea className="form-control" rows={3} placeholder="Enter full delivery address..." value={form.deliveryAddress} onChange={e => setForm({ ...form, deliveryAddress: e.target.value })} style={{ resize: 'vertical' }}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-control" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <button className="btn btn-primary w-full btn-lg" onClick={handleCheckout} disabled={submitting}>
                {submitting ? <><span className="loading-spinner"></span> Placing Order...</> : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
