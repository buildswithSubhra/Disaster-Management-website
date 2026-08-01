import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import LandingLayout from '../layouts/LandingLayout';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UserDashboard from '../pages/User/Dashboard';
import ReportDisaster from '../pages/User/ReportDisaster';
import MyReports from '../pages/User/MyReports';
import ReportDetail from '../pages/User/ReportDetail';
import NearbyShelters from '../pages/User/NearbyShelters';
import UserProfile from '../pages/User/Profile';
import AdminDashboard from '../pages/Admin/Dashboard';
import ManageDisasters from '../pages/Admin/ManageDisasters';
import DisasterDetail from '../pages/Admin/DisasterDetail';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageRescuers from '../pages/Admin/ManageRescuers';
import ManageShelters from '../pages/Admin/ManageShelters';
import Analytics from '../pages/Admin/Analytics';
import NotificationsPage from '../pages/Admin/Notifications';
import AdminProfile from '../pages/Admin/Profile';
import RescuerDashboard from '../pages/Rescuer/Dashboard';
import MyMissions from '../pages/Rescuer/MyMissions';
import RescuerProfile from '../pages/Rescuer/Profile';
import NotFound from '../pages/NotFound';
import EmergencyContacts from '../pages/EmergencyContacts';
import SafetyGuidelines from '../pages/SafetyGuidelines';
import DisasterPreparedness from '../pages/DisasterPreparedness';
import AboutUs from '../pages/AboutUs';
import Contact from '../pages/Contact';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingSpinner from '../components/LoadingSpinner';

const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading application..." />;
  }

  const getDashboardRedirect = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'rescuer') return '/rescuer/dashboard';
    return '/user/dashboard';
  };

  return (
    <Routes>
      <Route path="/" element={<LandingLayout><Landing /></LandingLayout>} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={getDashboardRedirect()} replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={getDashboardRedirect()} replace />} />
      <Route path="/emergency-contacts" element={<LandingLayout><EmergencyContacts /></LandingLayout>} />
      <Route path="/safety-guidelines" element={<LandingLayout><SafetyGuidelines /></LandingLayout>} />
      <Route path="/disaster-preparedness" element={<LandingLayout><DisasterPreparedness /></LandingLayout>} />
      <Route path="/about" element={<LandingLayout><AboutUs /></LandingLayout>} />
      <Route path="/contact" element={<LandingLayout><Contact /></LandingLayout>} />
      <Route path="/privacy-policy" element={<LandingLayout><PrivacyPolicy /></LandingLayout>} />
      <Route path="/terms-of-service" element={<LandingLayout><TermsOfService /></LandingLayout>} />

      <Route path="/user" element={<ProtectedRoute allowedRoles={['user']}><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="report" element={<ReportDisaster />} />
        <Route path="reports" element={<MyReports />} />
        <Route path="reports/:id" element={<ReportDetail />} />
        <Route path="shelters" element={<NearbyShelters />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="disasters" element={<ManageDisasters />} />
        <Route path="disasters/:id" element={<DisasterDetail />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="rescuers" element={<ManageRescuers />} />
        <Route path="shelters" element={<ManageShelters />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="/rescuer" element={<ProtectedRoute allowedRoles={['rescuer']}><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/rescuer/dashboard" replace />} />
        <Route path="dashboard" element={<RescuerDashboard />} />
        <Route path="missions" element={<MyMissions />} />
        <Route path="profile" element={<RescuerProfile />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
