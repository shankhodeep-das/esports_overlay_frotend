import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user, loading } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
        await API.post("/auth/logout");
        setUser(null);
        navigate("/login");
    };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login"); // Redirect to login if no user is found
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-r border-white/5 p-6 flex flex-col hidden md:flex">
        <div className="mb-10 px-2">
          <h1 className="text-2xl font-black tracking-tighter text-blue-500">FXAE</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Production Suite</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem label="Overview" active />
          <NavItem label="Match Control" />
          <NavItem label="Live Overlays" />
          <NavItem label="Team Management" />
          <NavItem label="Settings" />
        </nav>

        <button 
          onClick={() => handleLogout()}
          className="mt-auto p-3 text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all text-sm flex items-center gap-2"
        >
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold tracking-tight"
            >
              Control Center
            </motion.h2>
            <p className="text-gray-400 text-sm">Monitoring active production sessions</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold border-2 border-white/10 uppercase">
    {/* This logic gets the first letter of the name or '?' if the name isn't loaded yet */}
                {user?.name ? user.name.charAt(0) : '?'}
            </div>
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.name}!</p>
                <p className="text-xs text-green-500 uppercase">{user?.role}</p>
            </div>
        </div>  
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatBox label="Active Players" value="64" detail="+12% from last match" />
          <StatBox label="Stream Latency" value="1.2s" detail="Optimal" color="text-green-400" />
          <StatBox label="Server Load" value="24%" detail="Region: Mumbai" />
          <StatBox label="Current Round" value="04/15" detail="Game: BGMI" />
        </div>

        {/* Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Placeholder for future Live Data */}
            <div className="lg:col-span-2 bg-[#111] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center min-h-[300px] group transition-all hover:border-blue-500/20">
                <div className="text-center p-10">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <svg 
                            className="w-8 h-8 text-blue-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">This section is coming soon</h3>
                    <p className="text-gray-500 text-sm max-w-[280px] mx-auto">
                        Working on integrating logs of every action done by each and every member.
                    </p>
                </div>
            </div>

          {/* Quick Actions */}
          <div className="bg-[#111] rounded-2xl border border-white/5 p-6">
            <h3 className="font-bold text-center text-lg mb-6">Quick Controls</h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton label="Start Match" color="bg-blue-600" />
              <ActionButton label="Show Table" color="bg-gray-800" />
              <ActionButton label="Sync Data" color="bg-gray-800" />
              <ActionButton label="End Stream" color="bg-red-900/20 text-red-500" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components for cleaner code
const NavItem = ({ label, active = false }) => (
  <button className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    {label}
  </button>
);

const StatBox = ({ label, value, detail, color = "text-blue-500" }) => (
  <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
    <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-2">{label}</p>
    <p className={`text-3xl font-black mb-1 ${color}`}>{value}</p>
    <p className="text-[10px] text-gray-600">{detail}</p>
  </div>
);

const KillEntry = ({ player1, player2, weapon }) => (
  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5 text-sm">
    <span className="text-blue-400 font-bold">{player1}</span>
    <span className="text-gray-600 text-xs mx-2">[{weapon}]</span>
    <span className="text-red-400 font-bold">{player2}</span>
  </div>
);

const ActionButton = ({ label, color }) => (
  <button className={`p-4 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${color}`}>
    {label}
  </button>
);

export default Dashboard;