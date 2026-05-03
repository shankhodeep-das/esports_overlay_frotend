import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-blue-500">Verifying Credentials...</div>;

  // 1. Check if user is logged in
  if (!user) return <Navigate to="/signup" replace />;

  // 2. Check Email Verification
  if (!user.isVerified) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="bg-[#111] border border-red-500/20 p-8 rounded-3xl text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Email Verification Required</h2>
          <p className="text-gray-400 text-sm mb-6">You must verify your email in the Dashboard before accessing Match Control.</p>
          <button onClick={() => window.location.href = '/dashboard'} className="text-blue-500 font-bold hover:underline">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  // 3. Check Role Authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;