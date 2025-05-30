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
import Register from './pages/Register';
import Footer from './components/Footer';
import LoginDebug from './components/LoginDebug';

// Auth imports
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Admin imports
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/DashboardNew';
import TripsManagement from './pages/admin/TripsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import VehiclesManagement from './pages/admin/VehiclesManagement';
import Analytics from './pages/admin/Analytics';

// Import admin styles
import './styles/admin.css';

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

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="trips" element={<TripsManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="vehicles" element={<VehiclesManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<div>Settings Page (À implémenter)</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
