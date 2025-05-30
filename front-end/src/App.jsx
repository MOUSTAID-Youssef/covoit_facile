import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import CreateTrip from './pages/CreateTrip';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AuthTest from './pages/AuthTest';
import LoginTest from './pages/LoginTest';
import UploadTest from './pages/UploadTest';
import ImageTest from './pages/ImageTest';
import ProfileTest from './pages/ProfileTest';
import TripTest from './pages/TripTest';
import SimpleTest from './pages/SimpleTest';
import MyTrips from './pages/MyTrips';
import MyReservations from './pages/MyReservations';
import ReservationTest from './pages/ReservationTest';
import IdentityUploadTest from './pages/IdentityUploadTest';
import AdminDashboard from './pages/admin/AdminDashboardSimple';
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
import AdminStats from './pages/admin/AdminStats';
import AccountVerification from './pages/admin/AccountVerification';
import UsersManagement from './pages/admin/UsersManagement';
import TripsManagement from './pages/admin/TripsManagement';
import VehiclesManagement from './pages/admin/VehiclesManagement';
import ReservationsManagement from './pages/admin/ReservationsManagement';
import Register from './pages/Register';
import Footer from './components/Footer';
import LoginDebug from './components/LoginDebug';

// Auth imports
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/test-auth" element={<AuthTest />} />
                  <Route path="/test-login" element={<LoginTest />} />
                  <Route path="/test-upload" element={<UploadTest />} />
                  <Route path="/test-images" element={<ImageTest />} />
                  <Route path="/test-profile" element={<ProfileTest />} />
                  <Route path="/test-trips" element={<TripTest />} />
                  <Route path="/simple-test" element={<SimpleTest />} />
                  <Route path="/test-reservations" element={<ReservationTest />} />
                  <Route path="/test-identity" element={<IdentityUploadTest />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminStats />} />
                  <Route path="/admin/verification" element={<AccountVerification />} />
                  <Route path="/admin/users" element={<UsersManagement />} />
                  <Route path="/admin/trips" element={<TripsManagement />} />
                  <Route path="/admin/vehicles" element={<VehiclesManagement />} />
                  <Route path="/admin/reservations" element={<ReservationsManagement />} />
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
                  <Route path="/my-reservations" element={
                    <ProtectedRoute requiredRole="voyageur">
                      <MyReservations />
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
