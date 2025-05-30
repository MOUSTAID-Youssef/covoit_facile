import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/simple/Navbar';
import Home from './pages/simple/Home';
import Login from './pages/simple/Login';
import Register from './pages/simple/Register';
import Dashboard from './pages/simple/Dashboard';
import Trips from './pages/simple/Trips';
import CreateTrip from './pages/simple/CreateTrip';
import Profile from './pages/simple/Profile';
import AdminDashboard from './pages/simple/AdminDashboard';
import ProtectedRoute from './components/simple/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/trips" element={<Trips />} />

              {/* Routes protégées */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/create-trip" element={
                <ProtectedRoute requiredRole="conducteur">
                  <CreateTrip />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Route admin */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
