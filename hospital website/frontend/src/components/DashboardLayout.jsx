import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { notificationAPI } from '../api';
import {
  LayoutDashboard, Users, Calendar, FileText, ShoppingCart, Pill, TestTube,
  BookOpen, Brain, LogOut, Bell, Menu, X, User, ChevronRight, ClipboardList,
  Activity, Settings, Package, Heart, Search
} from 'lucide-react';

const navItems = {
  pharmacist: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/store/prescriptions' },
    { label: 'Prescriptions', icon: FileText, path: '/store/prescriptions' },
    { label: 'Medicine Inventory', icon: Pill, path: '/store/medicines' },
    { label: 'Cart', icon: ShoppingCart, path: '/store/cart' },
  ],
  patient: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/patient/dashboard' },
    { label: 'My Reports', icon: FileText, path: '/patient/reports' },
    { label: 'Book Appointment', icon: Calendar, path: '/patient/book-appointment' },
    { label: 'My Appointments', icon: ClipboardList, path: '/patient/appointments' },
    { label: 'Prescribed Medicines', icon: Pill, path: '/patient/medicines-prescribed' },
    { label: 'Lab Tests', icon: TestTube, path: '/patient/lab-tests' },
    { label: 'Medicine Store', icon: Package, path: '/patient/medicines' },
    { label: 'Cart', icon: ShoppingCart, path: '/patient/cart' },
    { label: 'Order History', icon: Package, path: '/patient/order-history' },
    { label: 'Find Doctor', icon: Search, path: '/patient/find-doctor' },
    { label: 'Health Articles', icon: BookOpen, path: '/patient/articles' },
    { label: 'AI MRI Scan', icon: Brain, path: '/patient/ai-scan' },
  ],
  doctor: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/doctor/dashboard' },
    { label: 'Patient List', icon: Users, path: '/doctor/patients' },
    { label: 'View Reports', icon: FileText, path: '/doctor/reports' },
    { label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
  ],
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Manage Users', icon: Users, path: '/admin/users' },
    { label: 'Upload Reports', icon: FileText, path: '/admin/reports' },
    { label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
    { label: 'Prescriptions', icon: Package, path: '/admin/prescriptions' },
    { label: 'Medicines', icon: Pill, path: '/admin/medicines' },
    { label: 'Lab Tests', icon: TestTube, path: '/admin/lab-tests' },
    { label: 'Orders', icon: Package, path: '/admin/orders' },
    { label: 'Articles', icon: BookOpen, path: '/admin/articles' },
    { label: 'Analytics', icon: Activity, path: '/admin/analytics' },
  ],
};

const roleColors = {
  admin: { bg: '#7c3aed', light: '#f3e8ff' },
  doctor: { bg: '#0d9488', light: '#ccfbf1' },
  patient: { bg: '#2563eb', light: '#dbeafe' },
  pharmacist: { bg: '#c2410c', light: '#fed7aa' },
};

export default function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  const items = navItems[user?.role] || [];
  const colors = roleColors[user?.role] || roleColors.patient;

  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const { data } = await notificationAPI.getAll();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch {}
    };
    fetchNotif();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <svg viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#2563eb"/>
            <path d="M18 8v20M8 18h20" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
            <circle cx="18" cy="18" r="6" stroke="white" strokeWidth="2"/>
          </svg>
          <div>
            <div className="sidebar-logo-text">Medi<span>Care</span></div>
            <div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'capitalize' }}>{user?.role} Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.path === '/patient/cart' && totalItems > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--red-500)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{totalItems}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--gray-50)', marginBottom: 8 }}>
            <div className="avatar avatar-sm" style={{ background: colors.bg }}>
              {getInitials(user?.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-800)', truncate: true }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--gray-500)', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
          <button className="sidebar-item" style={{ width: '100%' }} onClick={handleLogout}>
            <LogOut size={18} style={{ color: 'var(--red-500)' }} />
            <span style={{ color: 'var(--red-500)' }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div className="flex items-center gap-3">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="topbar-title">{title}</h1>
          </div>

          <div className="topbar-right">
            {/* Notifications */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                style={{ position: 'relative', padding: 8, borderRadius: 'var(--radius-md)', background: unreadCount > 0 ? 'var(--primary-50)' : 'var(--gray-100)', color: unreadCount > 0 ? 'var(--primary-600)' : 'var(--gray-500)', display: 'flex', alignItems: 'center' }}
                onClick={() => setShowNotif(!showNotif)}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: 4, right: 4, background: 'var(--red-500)', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="notification-dropdown">
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button style={{ fontSize: 'var(--font-size-xs)', color: 'var(--primary-600)', fontWeight: 500 }} onClick={async () => { await notificationAPI.markRead(); setUnreadCount(0); }}>Mark all read</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)' }}>No notifications</div>
                  ) : (
                    notifications.slice(0, 8).map(n => (
                      <div key={n._id} className={`notification-item ${!n.isRead ? 'unread' : ''}`}>
                        <div style={{ width: 36, height: 36, background: 'var(--primary-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bell size={14} style={{ color: 'var(--primary-600)' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-800)' }}>{n.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginTop: 2 }}>{n.message}</div>
                          <div style={{ fontSize: '10px', color: 'var(--gray-400)', marginTop: 4 }}>{new Date(n.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User Avatar */}
            <Link to={`/${user?.role}/dashboard`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="avatar avatar-sm" style={{ background: colors.bg, fontSize: 12 }}>
                {getInitials(user?.name)}
              </div>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--gray-700)' }}>{user?.name?.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
