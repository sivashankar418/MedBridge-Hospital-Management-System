import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientReports from './pages/patient/PatientReports';
import BookAppointment from './pages/patient/BookAppointment';
import PatientAppointments from './pages/patient/PatientAppointments';
import PrescribedMedicines from './pages/patient/PrescribedMedicines';
import LabTests from './pages/patient/LabTests';
import MedicineStore from './pages/patient/MedicineStore';
import Cart from './pages/patient/Cart';
import OrderHistory from './pages/patient/OrderHistory';
import FindDoctor from './pages/patient/FindDoctor';
import HealthArticles from './pages/patient/HealthArticles';
import AIScan from './pages/patient/AIScan';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientList from './pages/doctor/PatientList';
import DoctorReports from './pages/doctor/DoctorReports';
import DoctorAppointments from './pages/doctor/DoctorAppointments';

// Store Pages
import StorePrescriptions from './pages/store/StorePrescriptions';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminPrescriptions from './pages/admin/AdminPrescriptions';
import ManageMedicines from './pages/admin/ManageMedicines';
import ManageLabTests from './pages/admin/ManageLabTests';
import ManageOrders from './pages/admin/ManageOrders';
import ManageArticles from './pages/admin/ManageArticles';
import Analytics from './pages/admin/Analytics';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" />;
  if (user.role === 'pharmacist') return <Navigate to="/store/prescriptions" />;
  return <Navigate to="/patient/dashboard" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/reports" element={<ProtectedRoute roles={['patient']}><PatientReports /></ProtectedRoute>} />
        <Route path="/patient/book-appointment" element={<ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>} />
        <Route path="/patient/appointments" element={<ProtectedRoute roles={['patient']}><PatientAppointments /></ProtectedRoute>} />
        <Route path="/patient/medicines-prescribed" element={<ProtectedRoute roles={['patient']}><PrescribedMedicines /></ProtectedRoute>} />
        <Route path="/patient/lab-tests" element={<ProtectedRoute roles={['patient']}><LabTests /></ProtectedRoute>} />
        <Route path="/patient/medicines" element={<ProtectedRoute roles={['patient']}><MedicineStore /></ProtectedRoute>} />
        <Route path="/patient/cart" element={<ProtectedRoute roles={['patient']}><Cart /></ProtectedRoute>} />
        <Route path="/patient/order-history" element={<ProtectedRoute roles={['patient']}><OrderHistory /></ProtectedRoute>} />
        <Route path="/patient/find-doctor" element={<ProtectedRoute roles={['patient']}><FindDoctor /></ProtectedRoute>} />
        <Route path="/patient/articles" element={<ProtectedRoute roles={['patient']}><HealthArticles /></ProtectedRoute>} />
        <Route path="/patient/ai-scan" element={<ProtectedRoute roles={['patient']}><AIScan /></ProtectedRoute>} />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/patients" element={<ProtectedRoute roles={['doctor']}><PatientList /></ProtectedRoute>} />
        <Route path="/doctor/reports" element={<ProtectedRoute roles={['doctor']}><DoctorReports /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute roles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />

        {/* Store Routes */}
        <Route path="/store/prescriptions" element={<ProtectedRoute roles={['pharmacist']}><StorePrescriptions /></ProtectedRoute>} />
        <Route path="/store/medicines" element={<ProtectedRoute roles={['pharmacist']}><MedicineStore /></ProtectedRoute>} />
        <Route path="/store/cart" element={<ProtectedRoute roles={['pharmacist']}><Cart /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute roles={['admin']}><AdminAppointments /></ProtectedRoute>} />
        <Route path="/admin/prescriptions" element={<ProtectedRoute roles={['admin']}><AdminPrescriptions /></ProtectedRoute>} />
        <Route path="/admin/medicines" element={<ProtectedRoute roles={['admin']}><ManageMedicines /></ProtectedRoute>} />
        <Route path="/admin/lab-tests" element={<ProtectedRoute roles={['admin']}><ManageLabTests /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><ManageOrders /></ProtectedRoute>} />
        <Route path="/admin/articles" element={<ProtectedRoute roles={['admin']}><ManageArticles /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><Analytics /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
