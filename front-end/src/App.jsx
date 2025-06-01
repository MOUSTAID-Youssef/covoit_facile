import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import CreateTrip from './pages/CreateTrip';
import Profile from './pages/ProfileImproved';
import Login from './pages/Login';
import AuthTest from './pages/AuthTest';
import LoginTest from './pages/LoginTest';
import UploadTest from './pages/UploadTest';
import ImageTest from './pages/ImageTest';
import ProfileTest from './pages/ProfileTest';
import TripTest from './pages/TripTest';
import SimpleTest from './pages/SimpleTest';
import MyTrips from './pages/MyTrips';

import ReservationTest from './pages/ReservationTest';
import IdentityUploadTest from './pages/IdentityUploadTest';

import AdminTest from './pages/AdminTest';
import HomeTest from './pages/HomeTest';
import AdminAPITest from './pages/AdminAPITest';
import AdminDashboardTest from './pages/AdminDashboardTest';
import AdminImageTest from './pages/AdminImageTest';
import AvatarTest from './pages/AvatarTest';
import DashboardFunctionalityTest from './pages/DashboardFunctionalityTest';
import DatabaseConnectionTest from './pages/DatabaseConnectionTest';
import StatsTest from './pages/StatsTest';
import VehicleTestPage from './pages/VehicleTestPage';
import DashboardImprovements from './pages/DashboardImprovements';
import FinalVerification from './pages/FinalVerification';
import SolutionSummary from './pages/SolutionSummary';
import SimpleProjectTest from './pages/SimpleProjectTest';
import AdminRoutesTest from './pages/AdminRoutesTest';
import AdminStatsDebug from './pages/AdminStatsDebug';
import SimpleStatsTest from './pages/SimpleStatsTest';
import FinalFixSummary from './pages/FinalFixSummary';
import AdminUITest from './pages/AdminUITest';
import UIModificationsSummary from './pages/UIModificationsSummary';
import UITestSimple from './pages/UITestSimple';
import FinalUISuccess from './pages/FinalUISuccess';
import DashboardFixTest from './pages/DashboardFixTest';
import StatsPageTest from './pages/StatsPageTest';
import AdminAPIDiagnostic from './pages/AdminAPIDiagnostic';
import StatsErrorFixSummary from './pages/StatsErrorFixSummary';
import VerificationStatesTest from './pages/VerificationStatesTest';
import UserDataDiagnostic from './pages/UserDataDiagnostic';
import VerificationFixSummary from './pages/VerificationFixSummary';
import CinOnlyVerificationSummary from './pages/CinOnlyVerificationSummary';
import TelephoneColumnTest from './pages/TelephoneColumnTest';
import UsersManagementUpdateSummary from './pages/UsersManagementUpdateSummary';
import RealTimeStatsUpdateSummary from './pages/RealTimeStatsUpdateSummary';
import ProfileImprovementSummary from './pages/ProfileImprovementSummary';
import AdminPagesImprovementSummary from './pages/AdminPagesImprovementSummary';
import ReservationsDebugTest from './pages/ReservationsDebugTest';
import ReservationsErrorFixSummary from './pages/ReservationsErrorFixSummary';
import VehiclePhoneImprovementSummary from './pages/VehiclePhoneImprovementSummary';
import VehicleApiFixSummary from './pages/VehicleApiFixSummary';
import ReservationsPhotosDebugTest from './pages/ReservationsPhotosDebugTest';
import ReservationsRealPhotosFixSummary from './pages/ReservationsRealPhotosFixSummary';
import AuthenticationPersistenceFixSummary from './pages/AuthenticationPersistenceFixSummary';
import ReservationDebugTest from './pages/ReservationDebugTest';
import ComprehensiveFixesSummary from './pages/ComprehensiveFixesSummary';
import FinalFixesSummary from './pages/FinalFixesSummary';
import PhoneTestSummary from './pages/PhoneTestSummary';
import PhoneFixesFinalSummary from './pages/PhoneFixesFinalSummary';
import ReservationAndAuthFixesSummary from './pages/ReservationAndAuthFixesSummary';
import AdminPhotosFixSummary from './pages/AdminPhotosFixSummary';
import AdminTripCancelFixSummary from './pages/AdminTripCancelFixSummary';
import VehicleStatusAndAdminProtectionFixSummary from './pages/VehicleStatusAndAdminProtectionFixSummary';
import ReservationImprovementsFixSummary from './pages/ReservationImprovementsFixSummary';
import ExpiredTripsAndReservationSyncFixSummary from './pages/ExpiredTripsAndReservationSyncFixSummary';
import TripListDesignImprovementSummary from './pages/TripListDesignImprovementSummary';
import InvalidDateFixSummary from './pages/InvalidDateFixSummary';
import ProfileImprovementsSummary from './pages/ProfileImprovementsSummary';
import AdminStats from './pages/admin/AdminStatsRealTime';
import AccountVerification from './pages/admin/AccountVerificationCinOnly';
import UsersManagement from './pages/admin/UsersManagementWithVerificationStatus';
import TripsManagement from './pages/admin/TripsManagementImproved';
import VehiclesManagement from './pages/admin/VehiclesManagementImproved';
import ReservationsManagement from './pages/admin/ReservationsManagementImproved';
import Register from './pages/Register';
import Footer from './components/Footer';
import LoginDebug from './components/LoginDebug';

// Auth imports
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProtectedRoute from './components/AuthProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Suppression des imports d'anciens fichiers admin qui n'existent plus

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col transition-all duration-300">
              <Navbar />
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-grow mt-16 px-4 animate-fadeIn">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/login" element={
                    <AuthProtectedRoute>
                      <Login />
                    </AuthProtectedRoute>
                  } />
                  <Route path="/register" element={
                    <AuthProtectedRoute>
                      <Register />
                    </AuthProtectedRoute>
                  } />
                  <Route path="/test-auth" element={<AuthTest />} />
                  <Route path="/test-login" element={<LoginTest />} />
                  <Route path="/test-upload" element={<UploadTest />} />
                  <Route path="/test-images" element={<ImageTest />} />
                  <Route path="/test-profile" element={<ProfileTest />} />
                  <Route path="/test-trips" element={<TripTest />} />
                  <Route path="/simple-test" element={<SimpleTest />} />
                  <Route path="/test-reservations" element={<ReservationTest />} />
                  <Route path="/test-identity" element={<IdentityUploadTest />} />
                  <Route path="/admin/dashboard" element={
                    <AdminProtectedRoute>
                      <AdminStats />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/verification" element={
                    <AdminProtectedRoute>
                      <AccountVerification />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminProtectedRoute>
                      <UsersManagement />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/trips" element={
                    <AdminProtectedRoute>
                      <TripsManagement />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/vehicles" element={
                    <AdminProtectedRoute>
                      <VehiclesManagement />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/reservations" element={
                    <AdminProtectedRoute>
                      <ReservationsManagement />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/test-admin" element={<AdminTest />} />
                  <Route path="/test-admin-api" element={<AdminAPITest />} />
                  <Route path="/test-admin-dashboard" element={<AdminDashboardTest />} />
                  <Route path="/test-admin-images" element={<AdminImageTest />} />
                  <Route path="/test-avatars" element={<AvatarTest />} />
                  <Route path="/test-dashboard-functionality" element={<DashboardFunctionalityTest />} />
                  <Route path="/test-database-connection" element={<DatabaseConnectionTest />} />
                  <Route path="/stats-test" element={<StatsTest />} />
                  <Route path="/test-vehicles" element={<VehicleTestPage />} />
                  <Route path="/dashboard-improvements" element={<DashboardImprovements />} />
                  <Route path="/final-verification" element={<FinalVerification />} />
                  <Route path="/solution-summary" element={<SolutionSummary />} />
                  <Route path="/simple-project-test" element={<SimpleProjectTest />} />
                  <Route path="/admin-routes-test" element={<AdminRoutesTest />} />
                  <Route path="/admin-stats-debug" element={<AdminStatsDebug />} />
                  <Route path="/simple-stats-test" element={<SimpleStatsTest />} />
                  <Route path="/final-fix-summary" element={<FinalFixSummary />} />
                  <Route path="/admin-ui-test" element={<AdminUITest />} />
                  <Route path="/ui-modifications-summary" element={<UIModificationsSummary />} />
                  <Route path="/ui-test-simple" element={<UITestSimple />} />
                  <Route path="/final-ui-success" element={<FinalUISuccess />} />
                  <Route path="/dashboard-fix-test" element={<DashboardFixTest />} />
                  <Route path="/stats-page-test" element={<StatsPageTest />} />
                  <Route path="/admin-api-diagnostic" element={<AdminAPIDiagnostic />} />
                  <Route path="/stats-error-fix-summary" element={<StatsErrorFixSummary />} />
                  <Route path="/verification-states-test" element={<VerificationStatesTest />} />
                  <Route path="/user-data-diagnostic" element={<UserDataDiagnostic />} />
                  <Route path="/verification-fix-summary" element={<VerificationFixSummary />} />
                  <Route path="/cin-only-verification-summary" element={<CinOnlyVerificationSummary />} />
                  <Route path="/telephone-column-test" element={<TelephoneColumnTest />} />
                  <Route path="/users-management-update-summary" element={<UsersManagementUpdateSummary />} />
                  <Route path="/real-time-stats-update-summary" element={<RealTimeStatsUpdateSummary />} />
                  <Route path="/profile-improvement-summary" element={<ProfileImprovementSummary />} />
                  <Route path="/admin-pages-improvement-summary" element={<AdminPagesImprovementSummary />} />
                  <Route path="/reservations-debug-test" element={<ReservationsDebugTest />} />
                  <Route path="/reservations-error-fix-summary" element={<ReservationsErrorFixSummary />} />
                  <Route path="/vehicle-phone-improvement-summary" element={<VehiclePhoneImprovementSummary />} />
                  <Route path="/vehicle-api-fix-summary" element={<VehicleApiFixSummary />} />
                  <Route path="/reservations-photos-debug-test" element={<ReservationsPhotosDebugTest />} />
                  <Route path="/reservations-real-photos-fix-summary" element={<ReservationsRealPhotosFixSummary />} />
                  <Route path="/authentication-persistence-fix-summary" element={<AuthenticationPersistenceFixSummary />} />
                  <Route path="/reservation-debug-test" element={<ReservationDebugTest />} />
                  <Route path="/comprehensive-fixes-summary" element={<ComprehensiveFixesSummary />} />
                  <Route path="/final-fixes-summary" element={<FinalFixesSummary />} />
                  <Route path="/phone-test-summary" element={<PhoneTestSummary />} />
                  <Route path="/phone-fixes-final-summary" element={<PhoneFixesFinalSummary />} />
                  <Route path="/reservation-auth-fixes-summary" element={<ReservationAndAuthFixesSummary />} />
                  <Route path="/admin-photos-fix-summary" element={<AdminPhotosFixSummary />} />
                  <Route path="/admin-trip-cancel-fix-summary" element={<AdminTripCancelFixSummary />} />
                  <Route path="/vehicle-status-admin-protection-fix-summary" element={<VehicleStatusAndAdminProtectionFixSummary />} />
                  <Route path="/reservation-improvements-fix-summary" element={<ReservationImprovementsFixSummary />} />
                  <Route path="/expired-trips-reservation-sync-fix-summary" element={<ExpiredTripsAndReservationSyncFixSummary />} />
                  <Route path="/trip-list-design-improvement-summary" element={<TripListDesignImprovementSummary />} />
                  <Route path="/invalid-date-fix-summary" element={<InvalidDateFixSummary />} />
                  <Route path="/profile-improvements-summary" element={<ProfileImprovementsSummary />} />
                  <Route path="/test-home" element={<HomeTest />} />
                  <Route path="/debug-login" element={<LoginDebug />} />

                  {/* Protected Routes */}
                  <Route path="/create" element={
                    <ProtectedRoute requiredRole="conducteur">
                      <CreateTrip />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-trips" element={
                    <ProtectedRoute requiredRole="conducteur">
                      <MyTrips />
                    </ProtectedRoute>
                  } />

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          } />

          {/* Admin Routes - Utilisation du nouveau AdminDashboard */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
