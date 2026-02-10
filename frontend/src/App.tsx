import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { FdpManagePage } from '@/pages/FdpManagePage';
import { FdpRegistrationPage } from '@/pages/FdpRegistrationPage';
import { AttendancePage } from '@/pages/AttendancePage';
import { CertificatesPage } from '@/pages/CertificatesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="fdps" element={<FdpManagePage />} />
        <Route path="fdps/new" element={<ProtectedRoute roles={['super_admin']}><FdpManagePage createMode /></ProtectedRoute>} />
        <Route path="register" element={<ProtectedRoute roles={['participant']}><FdpRegistrationPage /></ProtectedRoute>} />
        <Route path="attendance" element={<ProtectedRoute roles={['faculty', 'super_admin']}><AttendancePage /></ProtectedRoute>} />
        <Route path="certificates" element={<CertificatesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
