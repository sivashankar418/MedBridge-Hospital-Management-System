import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { userAPI, appointmentAPI, orderAPI } from '../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, Calendar, Package, TrendingUp } from 'lucide-react';

const COLORS = ['#2563eb', '#0d9488', '#7c3aed', '#f97316', '#22c55e', '#ef4444'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userAPI.getAnalytics(),
      appointmentAPI.getAll({ limit: 100 }),
      orderAPI.getAll({ limit: 100 }),
    ]).then(([aRes, apRes, oRes]) => {
      setAnalytics(aRes.data.analytics);
      setAppointments(apRes.data.appointments);
      setOrders(oRes.data.orders);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const userPieData = analytics ? [
    { name: 'Patients', value: analytics.totalPatients },
    { name: 'Doctors', value: analytics.totalDoctors },
    { name: 'Admins', value: analytics.totalAdmins },
  ] : [];

  const statusData = ['pending', 'confirmed', 'completed', 'rejected', 'cancelled'].map(s => ({
    status: s,
    count: appointments.filter(a => a.status === s).length,
  }));

  const orderStatusData = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'].map(s => ({
    status: s,
    count: orders.filter(o => o.status === s).length,
  }));

  return (
    <DashboardLayout title="System Analytics">
      {loading ? <div className="loading-overlay"><div className="loading-spinner loading-spinner-lg"></div></div> : (
        <>
          {/* Summary Cards */}
          <div className="grid-cols-4" style={{ marginBottom: 28 }}>
            {[
              { label: 'Total Users', value: analytics?.totalUsers, icon: Users, color: '#2563eb', bg: '#dbeafe' },
              { label: 'Total Appointments', value: appointments.length, icon: Calendar, color: '#0d9488', bg: '#ccfbf1' },
              { label: 'Total Orders', value: orders.length, icon: Package, color: '#7c3aed', bg: '#f3e8ff' },
              { label: 'Revenue (₹)', value: orders.reduce((s, o) => s + o.totalPrice, 0).toLocaleString(), icon: TrendingUp, color: '#f97316', bg: '#ffedd5' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="stat-card">
                  <div className="stat-icon" style={{ background: s.bg }}><Icon size={22} color={s.color} /></div>
                  <div className="stat-info"><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
                </div>
              );
            })}
          </div>

          <div className="grid-cols-2" style={{ marginBottom: 24 }}>
            {/* Appointment Status Chart */}
            <div className="card">
              <div className="card-header"><h3 className="card-title">Appointment Status</h3></div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Distribution */}
            <div className="card">
              <div className="card-header"><h3 className="card-title">User Distribution</h3></div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={userPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                      {userPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Order Status Chart */}
          <div className="card">
            <div className="card-header"><h3 className="card-title">Order Status Distribution</h3></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={orderStatusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="status" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d9488" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
