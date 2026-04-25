import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/login/login';
import Register from './pages/register/register';
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import CreateTrip from './pages/trips/CreateTrip';
import BrowseTrips from './pages/trips/BrowseTrips';
import MyTrips from './pages/trips/MyTrips';
import TripDetails from './pages/trips/TripDetails';
import MyBookings from './pages/trips/MyBookings';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* User routes */}
        <Route path="/dashboard" element={<PrivateRoute requiredRole="user"><Dashboard /></PrivateRoute>} />
        <Route path="/trips/create" element={<PrivateRoute requiredRole="user"><CreateTrip /></PrivateRoute>} />
        <Route path="/trips/browse" element={<PrivateRoute requiredRole="user"><BrowseTrips /></PrivateRoute>} />
        <Route path="/trips/my-trips" element={<PrivateRoute requiredRole="user"><MyTrips /></PrivateRoute>} />
        <Route path="/trips/my-bookings" element={<PrivateRoute requiredRole="user"><MyBookings /></PrivateRoute>} />
        <Route path="/trips/:tripId" element={<PrivateRoute requiredRole="user"><TripDetails /></PrivateRoute>} />
        
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;