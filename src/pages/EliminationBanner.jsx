import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EliminationBanner = ({ teams }) => {
    const [eliminatedTeam, setEliminatedTeam] = useState(null);
    const prevAliveStatus = useRef({});

    useEffect(() => {
        if (!teams || teams.length === 0) return;

        teams.forEach(team => {
            const lastKnownCount = prevAliveStatus.current[team.slotNumber];
            
            // Trigger when a team goes from alive (>0) to dead (0)
            if (lastKnownCount > 0 && team.aliveCount === 0) {
                setEliminatedTeam(team);
                setTimeout(() => setEliminatedTeam(null), 3000); // Shorter duration
            }
        });

        const currentStatus = {};
        teams.forEach(t => { currentStatus[t.slotNumber] = t.aliveCount; });
        prevAliveStatus.current = currentStatus;
    }, [teams]);

    return (
        <AnimatePresence>
            {eliminatedTeam && (
                <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
                    <motion.div
                        initial={{ y: -50, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -20, opacity: 0, scale: 0.8 }}
                        className="bg-gradient-to-r from-red-900/90 via-red-600 to-red-900/90 
                                   px-8 py-2 rounded-full border border-white/20 shadow-[0_0_20px_rgba(255,0,0,0.4)]
                                   flex flex-col items-center min-w-[250px]"
                    >
                        <span className="text-white font-black italic text-xl uppercase tracking-tighter">
                            {eliminatedTeam.teamName}
                        </span>
                        <div className="flex items-center gap-2 -mt-1">
                            <div className="h-[1px] w-8 bg-white/40" />
                            <span className="text-red-100 font-bold tracking-[0.2em] uppercase text-[10px]">
                                Eliminated
                            </span>
                            <div className="h-[1px] w-8 bg-white/40" />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EliminationBanner;