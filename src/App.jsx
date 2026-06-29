import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogPostPage } from './pages/public/BlogPostPage';
import { RepositoriesPage } from './pages/public/RepositoriesPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OTPPage } from './pages/auth/OTPPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Dashboard Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ControlPanelPage } from './pages/dashboard/ControlPanelPage';
import { TelemetryPage } from './pages/dashboard/TelemetryPage';
import { PathDrawPage } from './pages/dashboard/PathDrawPage';
import { TaskSchedulerPage } from './pages/dashboard/TaskSchedulerPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { DeviceRegistrationPage } from './pages/dashboard/DeviceRegistrationPage';
import { MediaGalleryPage } from './pages/dashboard/MediaGalleryPage';
import { AITrainingPage } from './pages/dashboard/AITrainingPage';

import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/repositories" element={<RepositoriesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Route>

        {/* Auth Pages */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="otp" element={<OTPPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Dashboard Pages */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="control" element={<ControlPanelPage />} />
          <Route path="telemetry" element={<TelemetryPage />} />
          <Route path="path-draw" element={<PathDrawPage />} />
          <Route path="tasks" element={<TaskSchedulerPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="registration" element={<DeviceRegistrationPage />} />
          <Route path="media" element={<MediaGalleryPage />} />
          <Route path="ai-training" element={<AITrainingPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
