import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import your Pages (Views)
import RequestAccess from './pages/RequestAccess'; // The form for new members
import AdminDashboard from './pages/AdminDashboard'; // The approval list
import Home from './pages/Home';
import Signup from './pages/signup';
import UpcomingFeature from './components/upcommingPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MatchControl from './pages/MatchControl';
import LiveOverlay from './pages/LiveOverlayPage';



function App() {
  return (
    <Router>
      <div className="app-container bg-gray-900 min-h-screen">

        <Routes>
          <Route path="/" element={ <Home />}/>
          <Route path="/overlay/:matchId" element={<LiveOverlay />} />
          
          <Route path="/match-control" element={<ProtectedRoute allowedRoles={['ADMIN', 'DEVELOPER', 'MANAGER', 'EDITOR']}> <MatchControl /> </ProtectedRoute>} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/" element={<Home />} />

          {/* Public Route: Anyone can request to join */}
          <Route path="/join" element={<RequestAccess />} />

          <Route path='/signup' element={<Signup/>} />

          {/* Admin Route: Only for you to manage members */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Default Route: Redirect to join page if URL doesn't match */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;