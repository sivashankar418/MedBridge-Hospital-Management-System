import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { labTestAPI } from '../../api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { TestTube, ShoppingCart, Search, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LabTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    setLoading(true);
    labTestAPI.getAll({ search }).then(r => { setTests(r.data.labTests); setLoading(false); }).catch(() => setLoading(false));
  }, [search]);

  const isInCart = (id) => cartItems.some(i => i._id === id && i.type === 'labtest');

  const handleAdd = (test) => {
    addToCart(test, 'labtest');
    toast.success(`${test.name} added to cart!`);
  };

  return (
    <DashboardLayout title="Lab Test Store">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Available Lab Tests</h3>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="search-bar">
              <Search className="search-bar-icon" />
              <input placeholder="Search tests..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Link to="/patient/cart" className="btn btn-secondary btn-sm">
              <ShoppingCart size={14} /> View Cart
            </Link>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner"></div></div>
          ) : (
            <div className="grid-auto">
              {tests.map(test => (
                <div key={test._id} className="product-card">
                  <div className="product-image">
                    <TestTube size={56} color="var(--primary-400)" />
                  </div>
                  <div className="product-info">
                    <div className="product-name">{test.name}</div>
                    <div className="product-desc">{test.description}</div>
                    {test.category && <span className="badge badge-info" style={{ marginBottom: 8 }}>{test.category}</span>}
                    {test.duration && <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 6 }}>⏱ Results in {test.duration}</div>}
                    {test.parameters?.length > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 8 }}>
                        Includes: {test.parameters.slice(0, 3).join(', ')}{test.parameters.length > 3 ? '...' : ''}
                      </div>
                    )}
                    <div className="product-price">₹{test.price}</div>
                  </div>
                  <div className="product-footer">
                    {isInCart(test._id) ? (
                      <Link to="/patient/cart" className="btn btn-success btn-sm w-full">
                        <CheckCircle size={14} /> In Cart
                      </Link>
                    ) : (
                      <button className="btn btn-primary btn-sm w-full" onClick={() => handleAdd(test)}>
                        <ShoppingCart size={14} /> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
