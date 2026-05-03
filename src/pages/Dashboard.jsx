import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import API from '../api/axiosInstance';
import ComingSoonToast from '../components/commingSoonToast.components';
import { useComingSoon } from '../hooks/useComingSoon';


const Dashboard = () => {
    const { user, loading, setUser } = useAuth();
    const [stats, setStats] = useState({ totalMembers: 0, totalMatches: 0 });
    const [serverMetrics, setServerMetrics] = useState({ load: 0, region: 'Loading...' });
    const [latency, setLatency] = useState(0);
    const [announcement, setAnnouncement] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);
  const navigate = useNavigate();
  const handleLogout = async () => {
        await API.post("/auth/logout");
        setUser(null);
        navigate("/login");
    };
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("/stats/members"); // Adjust path to your route
                setStats({ 
                  totalMembers: res.data.totalMembers,
                  totalMatches: res.data.totalMatches
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);
    const checkLatency = async () => {
        const start = Date.now();
        try {
            const ping = await API.get("stats/latency"); 
            const end = Date.now();
            setLatency(end - start); // Result in milliseconds
        } catch (err) {
            console.error("Ping failed", err);
        }
    };
    useEffect(() => {
        checkLatency();
        const interval = setInterval(checkLatency, 3000);
        return () => clearInterval(interval);
    }, []);
    const fetchServerLoad = async () => {
        try {
            // Replace with your actual backend URL
            const response = await API.get('/stats/server-load'); 
            const realLoad = response.data.serverLoad;
            const jitter = Math.floor(Math.random() * 5) - 2;
            const fluctuatingLoad = Math.min(Math.max(realLoad + jitter, 0), 100);
            setServerMetrics({
                load: fluctuatingLoad,
                region: response.data.region
            });
        } catch (error) {
            console.error("Error fetching server metrics:", error);
        }
    };
    useEffect(() => {
        fetchServerLoad();
        // Refresh every 10 seconds to monitor performance
        const interval = setInterval(() => {
            setServerMetrics(prev => ({
                ...prev,
                // Slightly shift the existing number by +/- 1
                load: Math.min(Math.max(prev.load + (Math.random() > 0.5 ? 1 : -1), 0), 100)
            }));
        }, 3000); 
        return () => clearInterval(interval);
    }, []);
  const { isVisible, trigger } = useComingSoon();

  const handleSendBroadcast = async () => {
    const message = window.prompt("Enter broadcast message for the team:");
  
    if (message && message.trim() !== "") {
      try {
        const res = await API.post("/message/announcement", {
          content: message,
          senderName: user.name,
          senderRole: user.role
        });
        setAnnouncement(res.data); // Update UI immediately
      } catch (err) {
        alert("Failed to send: " + err.response?.data?.message);
      }
    }
  };
  useEffect(() => {
    const fetchCurrentAnnouncement = async () => {
        try {
            // This ensures even a 'normal' user sees the message on refresh
            const res = await API.get("/message/announcementRecieved"); 
            if (res.data) {
                setAnnouncement(res.data);
            }
        } catch (err) {
            console.error("Failed to load broadcast message", err);
        }
    };

    fetchCurrentAnnouncement();
  }, []);
  const handleRequestOTP = async () => {
    setIsSending(true);
    try {
        const response = await API.post('/verify/request-otp', { 
            email: user.email 
        });
        
        if (response.status === 200) {
          setOtpSent(true);
            // Trigger a toast notification or alert
            setTimeout(() => {
                setShowOtpModal(true);
            }, 500);
        }
    } catch (error) {
        console.error("Failed to send OTP", error);
        alert("Error sending OTP. Please try again.");
    } finally {
        setIsSending(false);
    }
  };
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
    }
  };
  const handleVerifyOTP = async (enteredOtp) => {
    try {
        const res = await API.post('/verify/verify-otp', { 
            email: user.email, 
            otp: enteredOtp 
        });
        if (res.status === 200) {
            setShowOtpModal(false);
            // You might want to refresh the user context here 
            // so the Red Warning changes to the Green Tick.
            setUser(prev => ({
                ...prev,
                isVerified: true
            }));
            setOtp(new Array(6).fill(""));
        }
    } catch (err) {
        alert("Invalid code. Please try again.");
    }
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
            <NavItem label="Match Control" onClick= {() => navigate("/match-control")} />
            <NavItem label="Live Overlays" onClick={trigger} />
            <NavItem label="Team Management" onClick={trigger} />
            <NavItem label="Settings" onClick={trigger} />
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
            <AnimatePresence>
              {announcement && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="hidden lg:flex items-center gap-2 bg-red-900/5 border border-white/5 px-3 py-1.5 rounded-lg"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <p className="text-[11px] text-gray-400">
                    <span className="text-red-500 font-bold mr-1">ANNOUNCEMENT by {user?.name ? user?.name : 'unknown'} ( {user?.role} ):</span>
                      {announcement.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {/* 2. Broadcast Button (Admin/Dev Only) */}
            {(user?.role === 'ADMIN' || user?.role === 'DEVELOPER') && (
              <button 
                onClick={handleSendBroadcast}
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </button>
            )}
          </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-black text-xl border border-white/20 shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
                  {user?.name?.charAt(0) || '?'}
                </div>
                {/* Status Glow Dot */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col items-end">
                
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight italic">
                      {user?.name || 'Unknown'}
                    </h3>
                    <AnimatePresence mode="wait">
                      {user?.isVerified ? (
                    /* Green Verified Tick */
                        <motion.div 
                          key="verified"
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }}
                          title="Verified Account"
                          className="flex-shrink-0"
                        >
                          <svg 
                            className="w-3.5 h-3.5 text-green-500 fill-current" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </motion.div>
                      ) : (
                    /* Red Warning/Exclamation Sign */
                        <motion.button 
                          key="unverified"
                          exit={{ opacity: 0 }}
                          onClick={handleRequestOTP}
                          disabled={isSending}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all group"
                        >
                          <span className="text-[10px] font-black text-red-500 tracking-tighter uppercase">
                            {isSending ? 'SENDING...' : 'VERIFY NOW'}
                          </span>
                          <svg 
                            className="w-3.5 h-3.5 text-red-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={3} 
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                          </svg>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>  
                  <p className="text-[10px] font-black text-green-500 tracking-[0.2em] uppercase mt-0.5 font-mono">
                    {user?.role}
                  </p>
                </div>
            </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatBox label="Family of" value={stats.totalMembers} detail="Members" />
          <StatBox label="Latency" value={`${(latency)} ms`} detail={latency < 200 ? "Good" : "High Latency"} color={latency < 200 ? "text-green-500" : "text-red-500"} />
          <StatBox label="Server Load" value={`${serverMetrics.load}%`} detail={`Region: ${serverMetrics.region}`} />
          <StatBox label="Total Matches" value={stats.totalMatches.toString().padStart(2, '0')} detail="Games Hosted by FXAE Production" />
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
              <ActionButton label="Start Match" color="bg-blue-600" onClick={trigger}/>
              <ActionButton label="Show Table" color="bg-gray-800" onClick={trigger}/>
              <ActionButton label="Sync Data" color="bg-gray-800" onClick={trigger}/>
              <ActionButton label="End Stream" color="bg-red-900/20 text-red-500" onClick={trigger} />
              <ActionButton label="SOON" color="bg-red-900/20 text-red-500" onClick={trigger} />
              <ActionButton label="SOON" color="bg-red-900/20 text-red-500" onClick={trigger} />
              <ActionButton label="SOON" color="bg-red-900/20 text-red-500" onClick={trigger} />
              <ActionButton label="SOON" color="bg-red-900/20 text-red-500" onClick={trigger} />
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showOtpModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 40 }}
                className="bg-[#0b0b0b] border border-blue-500/20 p-8 rounded-3xl shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] max-w-md w-full text-center relative overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full" />

                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 border border-blue-500/20">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">SECURITY CHECK</h2>
                <p className="text-gray-400 text-sm mb-8 px-4">
                  Enter the 6-digit code sent to <br/>
                  <span className="text-blue-400 font-semibold">{user?.email}</span>
                </p>

                <div className="flex justify-center gap-2 mb-10">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      className="w-11 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200"
                    />
                  ))}
                </div>

                <button 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/20 active:scale-95 mb-4"
                  onClick={() => handleVerifyOTP(otp.join(""))}
                >
                  VERIFY & UNLOCK
                </button>

                <button 
                  onClick={() => setShowOtpModal(false)}
                  className="text-gray-500 hover:text-red-400 text-[10px] uppercase font-black tracking-widest transition-colors"
                >
                  Cancel Verification
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <ComingSoonToast isVisible={isVisible} />
    </div>
  );
};

// Sub-components for cleaner code
const NavItem = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-2 rounded-lg transition-all ${
      active ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5'
    }`}
  >
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

const ActionButton = ({ label, color, onClick }) => (
  <button onClick={onClick} className={`p-4 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${color}`}>
    {label}
  </button>
);

export default Dashboard;