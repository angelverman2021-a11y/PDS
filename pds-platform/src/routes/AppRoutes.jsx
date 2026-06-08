import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ROLES } from '../constants';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import ShopFinder from '../pages/public/ShopFinder';
import ShopDetails from '../pages/public/ShopDetails';
import QRVerification from '../pages/public/QRVerification';
import ComplaintPortal from '../pages/public/ComplaintPortal';
import DataSources from '../pages/public/DataSources';

// Citizen Pages
import CitizenDashboard from '../pages/citizen/Dashboard';
import Allocation from '../pages/citizen/Allocation';
import Receipts from '../pages/citizen/Receipts';
import ComplaintTracker from '../pages/citizen/ComplaintTracker';
import RationDiary from '../pages/citizen/RationDiary';

// Dealer Pages
import DealerDashboard from '../pages/dealer/DealerDashboard';

// Admin Pages
import DistrictDashboard from '../pages/admin/DistrictDashboard';
import AdminPanel from '../pages/admin/AdminPanel';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/shops" element={<ShopFinder />} />
      <Route path="/shops/:id" element={<ShopDetails />} />
      <Route path="/verify" element={<QRVerification />} />
      <Route path="/complaints/new" element={<ComplaintPortal />} />
      <Route path="/complaints/track" element={<ComplaintTracker />} />
      <Route path="/data-sources" element={<DataSources />} />

      {/* Citizen */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole={ROLES.CITIZEN}>
          <CitizenDashboard />
        </ProtectedRoute>
      } />
      <Route path="/allocation" element={
        <ProtectedRoute allowedRole={ROLES.CITIZEN}>
          <Allocation />
        </ProtectedRoute>
      } />
      <Route path="/diary" element={
        <ProtectedRoute allowedRole={ROLES.CITIZEN}>
          <RationDiary />
        </ProtectedRoute>
      } />
      <Route path="/receipts" element={
        <ProtectedRoute allowedRole={ROLES.CITIZEN}>
          <Receipts />
        </ProtectedRoute>
      } />

      {/* Dealer */}
      <Route path="/dealer" element={
        <ProtectedRoute allowedRole={ROLES.DEALER}>
          <DealerDashboard />
        </ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin/district" element={
        <ProtectedRoute allowedRole={ROLES.ADMIN}>
          <DistrictDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedRole={ROLES.ADMIN}>
          <AdminPanel />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
