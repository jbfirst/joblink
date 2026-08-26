import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { CandidateLayout } from './components/layout/CandidateLayout';
import { RecruiterLayout } from './components/layout/RecruiterLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { JobListingsPage } from './pages/public/JobListingsPage';
import { JobDetailsPage } from './pages/public/JobDetailsPage';
import { CompanyProfilePage } from './pages/public/CompanyProfilePage';
import { ChooseRolePage } from './pages/public/ChooseRolePage';
import { AuthCallbackPage } from './pages/public/AuthCallbackPage';

// Candidate Pages
import { CandidateDashboardPage } from './pages/candidate/CandidateDashboardPage';
import { CandidateProfilePage } from './pages/candidate/CandidateProfilePage';
import { CandidateApplicationsPage } from './pages/candidate/CandidateApplicationsPage';

// Recruiter Pages
import { RecruiterDashboardPage } from './pages/recruiter/RecruiterDashboardPage';
import { RecruiterCompanyProfilePage } from './pages/recruiter/RecruiterCompanyProfilePage';
import { PostJobPage } from './pages/recruiter/PostJobPage';
import { EditJobPage } from './pages/recruiter/EditJobPage';
import { ManageJobsPage } from './pages/recruiter/ManageJobsPage';
import { ManageApplicationsPage } from './pages/recruiter/ManageApplicationsPage';

// Shared Pages
import { NotificationsPage } from './pages/shared/NotificationsPage';
import { SettingsPage } from './pages/shared/SettingsPage';
import { HelpCenterPage } from './pages/shared/HelpCenterPage';
import { TermsPage } from './pages/shared/TermsPage';
import { PrivacyPage } from './pages/shared/PrivacyPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <JobProvider>
              <Routes>
                {/* Public Routes with Navbar, Footer & MobileBottomNav */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/connexion" element={<LoginPage />} />
                  <Route path="/inscription" element={<RegisterPage />} />
                  <Route path="/offres" element={<JobListingsPage />} />
                  <Route path="/offres/:id" element={<JobDetailsPage />} />
                  <Route path="/entreprises/:id" element={<CompanyProfilePage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/parametres" element={<SettingsPage />} />
                  <Route path="/aide" element={<HelpCenterPage />} />
                  <Route path="/conditions" element={<TermsPage />} />
                  <Route path="/confidentialite" element={<PrivacyPage />} />
                </Route>

                {/* Auth flow (choix de rôle après Google, callback OAuth) */}
                <Route path="/choisir-role" element={<ChooseRolePage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />

                {/* Candidate Protected Shell */}
                <Route element={<ProtectedRoute allowedRole="candidate" />}>
                  <Route path="/candidat" element={<CandidateLayout />}>
                    <Route path="dashboard" element={<CandidateDashboardPage />} />
                    <Route path="profil" element={<CandidateProfilePage />} />
                    <Route path="candidatures" element={<CandidateApplicationsPage />} />
                    <Route index element={<Navigate to="/candidat/dashboard" replace />} />
                  </Route>
                </Route>

                {/* Recruiter Protected Shell */}
                <Route element={<ProtectedRoute allowedRole="recruiter" />}>
                  <Route path="/recruteur" element={<RecruiterLayout />}>
                    <Route path="dashboard" element={<RecruiterDashboardPage />} />
                    <Route path="entreprise" element={<RecruiterCompanyProfilePage />} />
                    <Route path="publier-offre" element={<PostJobPage />} />
                    <Route path="modifier-offre/:jobId" element={<EditJobPage />} />
                    <Route path="offres" element={<ManageJobsPage />} />
                    <Route path="candidatures" element={<ManageApplicationsPage />} />
                    <Route index element={<Navigate to="/recruteur/dashboard" replace />} />
                  </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </JobProvider>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
