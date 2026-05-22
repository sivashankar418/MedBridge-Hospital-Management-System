import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { medicineAPI } from '../../api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Pill, ShoppingCart, Search, CheckCircle } from 'lucide-react';

const categories = ['All', 'Pain Relief', 'Antibiotics', 'Gastrointestinal', 'Diabetes', 'Cardiovascular', 'Allergy', 'Supplements'];

export default function MedicineStore() {
  const location = useLocation();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [storePatient, setStorePatient] = useState(null);
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const patientId = params.get('patientId');
    const patientName = params.get('patientName');
    if (patientId) {
      sessionStorage.setItem('storePatientId', patientId);
      if (patientName) sessionStorage.setItem('storePatientName', patientName);
      setStorePatient({ id: patientId, name: patientName });
    } else {
      const storedName = sessionStorage.getItem('storePatientName');
      const storedId = sessionStorage.getItem('storePatientId');
      if (storedId) setStorePatient({ id: storedId, name: storedName || null });
    }

    setLoading(true);
    medicineAPI.getAll({ search, category: category === 'All' || !category ? '' : category }).then(r => { setMedicines(r.data.medicines); setLoading(false); }).catch(() => setLoading(false));
  }, [search, category, location.search]);

  const isInCart = (id) => cartItems.some(i => i._id === id && i.type === 'medicine');

  const pillColors = ['#2563eb', '#0d9488', '#7c3aed', '#f97316', '#ef4444', '#22c55e', '#f59e0b', '#06b6d4'];

  return (
    <DashboardLayout title="Medicine Store">
      {storePatient && (
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          Ordering on behalf of patient: <strong>{storePatient.name || storePatient.id}</strong>
        </div>
      )}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Medicines</h3>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="search-bar">
              <Search className="search-bar-icon" />
              <input placeholder="Search medicines..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Link to={user?.role === 'pharmacist' ? '/store/cart' : '/patient/cart'} className="btn btn-secondary btn-sm">
              <ShoppingCart size={14} /> Cart
            </Link>
          </div>
        </div>
        <div className="card-body">
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {categories.map(c => (
              <button key={c} className={`btn btn-sm ${(category === c || (!category && c === 'All')) ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCategory(c === 'All' ? '' : c)}>{c}</button>
            ))}
          </div>

          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner"></div></div>
          ) : (
            <div className="grid-auto">
              {medicines.map((med, i) => (
                <div key={med._id} className="product-card">
                  <div className="product-image" style={{ background: `linear-gradient(135deg, ${pillColors[i % pillColors.length]}15, ${pillColors[i % pillColors.length]}30)` }}>
                    <Pill size={56} color={pillColors[i % pillColors.length]} />
                  </div>
                  <div className="product-info">
                    <div className="product-name">{med.name}</div>
                    <div className="product-desc">{med.description}</div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                      {med.category && <span className="badge badge-primary">{med.category}</span>}
                      {med.requiresPrescription && <span className="badge badge-warning">Rx Required</span>}
                    </div>
                    {med.dosage && <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 6 }}>💊 {med.dosage}</div>}
                    <div style={{ fontSize: 12, color: med.stock > 0 ? 'var(--green-600)' : 'var(--red-500)', marginBottom: 4 }}>
                      {med.stock > 0 ? `✓ In Stock (${med.stock})` : '✗ Out of Stock'}
                    </div>
                    <div className="product-price">₹{med.price}</div>
                  </div>
                  <div className="product-footer">
                    {isInCart(med._id) ? (
                      <Link to={user?.role === 'pharmacist' ? '/store/cart' : '/patient/cart'} className="btn btn-success btn-sm w-full"><CheckCircle size={14} /> In Cart</Link>
                    ) : (
                      <button className="btn btn-primary btn-sm w-full" disabled={med.stock === 0} onClick={() => { addToCart(med, 'medicine'); toast.success(`${med.name} added!`); }}>
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
