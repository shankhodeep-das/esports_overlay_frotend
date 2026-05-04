import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateMatchModal from '../components/CreateMatchModal';
import { getAllMatches } from '../api/createMatchAPI';
import { useNavigate } from 'react-router-dom';

const MatchControl = () => {
    const navigate = useNavigate();
  const { token,user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    // If you have a toast system, you can call toast.success("ID Copied!");
    console.log("Copied Match ID:", id);
  };
    const fetchMatches = async () => {
      setLoading(true);
        try {
          const data = await getAllMatches();
      
            // Filter logic: Only show matches where the start time is in the future
          if (data && Array.isArray(data)) {
            setMatches(data);
          } else {
            setMatches([]);
          }
        } catch (err) {
            console.error("Fetch Error:", err.message);
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
      
  
      if (user) {
        fetchMatches();
      } else {
        setLoading(false);
      }
    }, [user]);

  // Define who can CREATE (Editor is excluded here)
  const canCreateMatch = ['DEVELOPER', 'ADMIN', 'MANAGER'].includes(user?.role);

  return (
    <div className="p-10 max-w-7xl mx-auto">
        <button 
                onClick={() => navigate(-1)} 
                className="absolute top-3 left-22 text-white flex items-center gap-2 hover:text-green-400 transition-all"
            >
                ← Back to previous page
        </button>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Match <span className="text-blue-500">Control</span>
          </h2>
          <p className="text-gray-500 font-mono text-xs mt-1 uppercase tracking-widest">
            System status: <span className="text-green-500 animate-pulse">Operational</span>
          </p>
        </div>

        {/* Action Button: Only visible to Admin/Dev/Manager */}
        {canCreateMatch && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-white text-black font-black rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-xl flex items-center gap-2 group"
          >
            <span className="text-lg">+</span>
            CREATE MATCH
          </button>
        )}
      </header>

      {/* Access Denied Message for Editors who try to create */}
      {!canCreateMatch && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl mb-8">
          <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">
            Note: Your Editor account has View/Edit access only. Create permissions are restricted.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-blue-500 font-mono animate-pulse tracking-[0.3em]">
              SYNCHRONIZING WITH DATABASE...
            </p>
          </div>
        ) : matches.length > 0 ? (
          matches.map((match) => (
            <div key={match._id} className="bg-[#111] border border-white/10 p-6 rounded-3xl hover:border-blue-500/50 transition-all group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/5 blur-3xl group-hover:bg-blue-600/10 transition-all"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    {match.mapName} • Match #{match.matchNumber}
                  </span>
                  <h4 className="text-xl font-bold text-white uppercase tracking-tighter">{match.matchTitle}</h4>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                    match.status === 'UPCOMING' ? 'text-green-500 border-green-500/20' : 'text-yellow-500 border-yellow-500/20'
                    }`}>
                    {match.status}
                  </span>
                </div>
              </div>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 mb-6">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-2">Sync Match ID</label>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-[10px] text-blue-400 font-mono truncate mr-2">
                    {match._id}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(match._id)}
                    className="p-2 bg-white/5 hover:bg-blue-600 hover:text-white text-gray-400 rounded-lg transition-all"
                    title="Copy ID for Google Sheet"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    if (match.sheetId) {
                      window.open(`https://docs.google.com/spreadsheets/d/${match.sheetId}`, "_blank", "noopener,noreferrer");
                    } else {
                      alert("No Sheet ID found for this match.");
                    }
                  }}
                  className="py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black rounded-xl border border-white/5 transition-all">
                  OPEN EDITOR
                </button>
                <button onClick={() => window.open(`/overlay/${match._id}`, '_blank')} className="py-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white text-[10px] font-black rounded-xl border border-blue-500/10 transition-all">
                  VIEW STATS
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-[#111] border border-dashed border-white/10 p-12 rounded-3xl text-center">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No Upcoming Matches Scheduled</p>
          </div>
        )}
      </div>


      <CreateMatchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} refreshMatches={fetchMatches} />
    </div>
  );
};

export default MatchControl;