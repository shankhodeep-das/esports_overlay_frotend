import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Draggable from 'react-draggable';
import API from "../api/axiosInstance";
import { motion, AnimatePresence } from 'framer-motion';
import TopFourOverlay from './TopFourOverlay';
import EliminationBanner from './EliminationBanner';
const LiveOverlay = () => {
    const { matchId } = useParams();
    const [teams, setTeams] = useState([]);
    const [overlayWidth, setOverlayWidth] = useState(400);
    const nodeRef = useRef(null); // REQUIRED for React Draggable to work properly
    const aliveTeamsCount = teams.filter(t => t.aliveCount > 0).length;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get(`/admin/get-match-Ui/${matchId}`, {
                    headers: { "ngrok-skip-browser-warning": "true" }
                });
                const sortedTeams = res.data.teams.sort((a, b) => b.kills - a.kills);
                setTeams(sortedTeams);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        const interval = setInterval(fetchStats, 2000);
        fetchStats();
        return () => clearInterval(interval);
    }, [matchId]);

    return (
        /* 1. Ensure this container is full screen so you have room to drag */
        <div className="fixed inset-0 w-full h-full bg-transparent overflow-hidden pointer-events-none">

            <TopFourOverlay teams={teams} />
            <EliminationBanner teams={teams} />
            
            
            {/* Control UI - Re-enable pointer events for the slider */}
            {aliveTeamsCount > 4 && (
                <div className="absolute bottom-10 right-10 bg-black/80 p-4 rounded-xl border border-white/20 z-50 pointer-events-auto">
                    <label className="text-white text-xs block mb-2 font-bold uppercase tracking-widest">Overlay Width</label>
                    <input 
                        type="range" min="300" max="900" value={overlayWidth} 
                        onChange={(e) => setOverlayWidth(e.target.value)}
                        className="w-48 accent-red-600 cursor-pointer"
                    />
                </div>
            )}

            {/* 2. The Draggable Leaderboard */}

            {aliveTeamsCount > 4 && (
                <Draggable 
                    nodeRef={nodeRef} 
                    handle=".drag-handle"
                    bounds="parent"
                >
                    <div 
                        ref={nodeRef}
                        style={{ width: `${overlayWidth}px` }} 
                        className="shadow-2xl select-none pointer-events-auto absolute top-10 left-10"
                    >
                        {/* Header - ONLY THIS AREA TRIGGERS DRAG */}
                        <div className="drag-handle cursor-move bg-red-600 text-white flex justify-between items-center px-4 py-2 text-sm font-black italic uppercase">
                            <span>PLAYING TEAMS</span>
                            <div className="flex gap-8 mr-2">
                                <span>ELIMS</span>
                                <span>ALIVE</span>
                            </div>
                        </div>

                        {/* Team List Container */}
                        <div className="flex flex-col bg-black/90 border-b-4 border-red-600 backdrop-blur-sm">
                            <AnimatePresence initial={false}>
                                {teams.map((team, index) => (
                                    <motion.div
                                        layout
                                        key={team.slotNumber}
                                        className={`flex items-center h-10 border-b border-white/10 transition-all 
                                            ${team.aliveCount === 0 ? 'opacity-40 grayscale-[0.7]' : 'opacity-100'} 
                                            ${index === 0 && team.aliveCount > 0 ? 'bg-gradient-to-r from-red-900/40 to-transparent' : ''}`}
                                        style={{
                                            // Apply the background image from the database
                                            backgroundImage: team.teamBg 
                                                ? `linear-gradient(to right, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%), url(${team.teamBg})` 
                                                : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            filter: 'brightness(1.3) saturate(1.0)', 
                                            transition: 'all 0.3s ease',
                                            backgroundColor: '#050404' // Dark fallback while loading
                                        }}
                                    >
                                        <div className="w-12 text-center text-white font-black italic border-r border-white/10">
                                            {index + 1}<sup>ST</sup>
                                        </div>

                                        <div className="w-10 h-full flex items-center justify-center ml-2">
                                            {team.teamLogo ? (
                                                <img 
                                                    src={team.teamLogo} 
                                                    alt="" 
                                                    className="h-7 w-7 object-contain drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]"
                                                    onError={(e) => { e.target.style.display = 'none'; }} 
                                                />
                                            ) : (
                                                <div className="w-7 h-7 bg-white/5 rounded-full border border-white/10" />
                                            )}
                                        </div>

                                        <div className="flex-1 px-4 text-white font-bold italic truncate uppercase tracking-tight">
                                            {team.teamName || "TBD"}
                                        </div>

                                        <div className="w-16 text-center text-white font-black text-xl bg-white/5 h-full flex items-center justify-center italic">
                                            {team.kills || 0}
                                        </div>

                                        <div className="w-24 flex items-center justify-center gap-1 px-2 h-full bg-black/20">
                                            {team.aliveCount > 0 ? (
                                                [1, 2, 3, 4].map((p) => (
                                                    <div 
                                                        key={p} 
                                                        className={`w-2 h-5 skew-x-[-15deg] transition-all
                                                            ${p <= team.aliveCount ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]' : 'bg-gray-800'}`}
                                                    />
                                                ))
                                            ) : (
                                                <span className="text-red-600 font-black text-[10px] italic">ELIMINATED</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </Draggable>
            )}
        </div>
    );
};

export default LiveOverlay;