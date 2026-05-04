import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createMatch } from '../api/createMatchAPI';
import { useAuth } from '../context/AuthContext';

const CreateMatchModal = ({ isOpen, onClose, refreshMatches }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    matchTitle: '',
    matchNumber: 1,
    teamCount: 12,       // Added (Default 16)
    mapNames: 'Erangel',
    // Defaulting to your provided master sheet ID
    sheetId: '1UstzwqBqk2z3QBQRWByzAl4QuhiADBMQQpDiGUXmVu8', 
    status: 'UPCOMING'
  });

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleOpenEditor = (sheetId) => {
    if (sheetId) {
      // Opens the Google Master Sheet in a new tab
      window.open(sheetId, "_blank", "noopener,noreferrer");
    } else {
      alert("No Master Sheet linked to this match.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // This now matches the destructuring in your backend function
      await createMatch(formData, token);
      refreshMatches();
      onClose();
    } catch (err) {
      console.error("Creation Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0f0f0f] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 bg-[#151515]">
          <h3 className="text-xl font-black text-white tracking-tighter italic uppercase">New Match Instance</h3>
          <p className="text-[10px] text-blue-500 font-mono uppercase tracking-widest mt-1">Linking to Master Sheet</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title and Match Number */}
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Match Title</label>
              <input name="matchTitle" required onChange={handleChange} placeholder="Match 1 - Finals" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">No.</label>
              <input type="number" name="matchNumber" defaultValue={1} onChange={handleChange} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none" />
            </div>
          </div>

          {/* Map Selection */}
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Map Selection</label>
            <select name="mapName" onChange={handleChange} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white outline-none">
              <option value="Erangel">Erangel</option>
              <option value="Miramar">Miramar</option>
              <option value="Sanhok">Sanhok</option>
              <option value="Vikendi">Vikendi</option>
            </select>
          </div>
          <div>
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">Team Slots</label>
              <input type="number" name="teamCount" defaultValue={12} min={1} max={25} onChange={handleChange} className="w-full bg-[#050505] border border-blue-500/20 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" />
          </div>

          {/* Sheet ID - Auto-filled but editable */}
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Master Sheet ID</label>
            <input 
              name="sheetId" 
              value={formData.sheetId} 
              disabled
              onChange={handleChange} 
              title = "This is only viewable not editable"
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-gray-400 focus:text-white focus:border-blue-500/50 outline-none font-mono text-[10px] cursor-not-allowed" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all shadow-lg"
          >
            {loading ? 'Initializing...' : 'Deploy Match'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateMatchModal;