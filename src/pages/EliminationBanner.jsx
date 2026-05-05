import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EliminationBanner = ({ teams }) => {
    const [eliminatedTeam, setEliminatedTeam] = useState(null);
    const prevAliveStatus = useRef({});

    useEffect(() => {
        if (!teams || teams.length === 0) return;

        teams.forEach(team => {
            const lastKnownCount = prevAliveStatus.current[team.slotNumber];
            
            // Detection logic for team elimination
            if (lastKnownCount > 0 && team.aliveCount === 0) {
                setEliminatedTeam(team);
                setTimeout(() => setEliminatedTeam(null), 3500); 
            }
        });

        const currentStatus = {};
        teams.forEach(t => { currentStatus[t.slotNumber] = t.aliveCount; });
        prevAliveStatus.current = currentStatus;
    }, [teams]);

    return (
        <AnimatePresence>
            {eliminatedTeam && (
                <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="relative flex items-center"
                    >
                        {/* Compact Skewed Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-red-950/95 to-black/90 skew-x-[-12deg] border-l-2 border-r-2 border-red-600 shadow-lg" />

                        <div className="relative flex items-center px-5 py-2 z-10">
                            {/* Smaller Logo Section */}
                            <div className="mr-4">
                                {eliminatedTeam.teamLogo ? (
                                    <img 
                                        src={eliminatedTeam.teamLogo}
                                        className="w-10 h-10 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
                                        alt=""
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-white text-xs font-black italic">
                                        {eliminatedTeam.slotNumber}
                                    </div>
                                )}
                            </div>

                            {/* Compact Text Section */}
                            <div className="flex flex-col">
                                <span className="text-white font-black italic text-xl uppercase tracking-tight leading-none">
                                    {eliminatedTeam.teamName}
                                </span>
                                <span className="text-red-500 font-bold tracking-[0.2em] uppercase text-[9px] mt-0.5">
                                    Eliminated
                                </span>
                            </div>

                            {/* Minimal Stats Section */}
                            <div className="ml-6 border-l border-white/20 pl-4 flex flex-col justify-center">
                                <span className="text-white font-black text-lg italic leading-none">{eliminatedTeam.kills || 0}</span>
                                <span className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">Kills</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EliminationBanner;