import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TopFourOverlay = ({ teams }) => {
    const aliveTeams = teams.filter(t => t.aliveCount > 0);
    
    if (aliveTeams.length > 4 || aliveTeams.length === 0) return null;

    const totalTopWeight = aliveTeams.reduce((acc, team) => acc + (team.aliveCount + team.kills), 0);

    return (
        <div className="fixed top-1 left-1/2 -translate-x-1/2 flex gap-4 z-[100] pointer-events-none">
            <AnimatePresence>
                {aliveTeams.map((team) => {
                    const teamWeight = team.aliveCount + team.kills;
                    const winProb = totalTopWeight > 0 
                        ? ((teamWeight / totalTopWeight) * 100).toFixed(1) 
                        : 0;

                    return (
                        <motion.div
                            key={team.slotNumber}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            /* Adjusted Width and Height here */
                            className="w-64 h-20 relative rounded-xl border border-white/10 bg-black/90 shadow-2xl overflow-hidden"
                        >
                            {/* Background Image Layer */}
                            {team.teamBg && (
                                <div 
                                    className="absolute inset-0 opacity-30"
                                    style={{
                                        backgroundImage: `url(${team.teamBg})`,
                                        backgroundSize: 'cover',
                                        filter: 'brightness(1.5)'
                                    }}
                                />
                            )}

                            <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                                {/* TOP ROW: Name on Left, Alive Bars on Right */}
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <h3 className="text-white font-black italic text-xl uppercase leading-none">
                                            {team.teamName}
                                        </h3>
                                    </div>

                                    {/* ALIVE BARS - Positioned Top Right */}
                                    <div className="flex gap-1 pt-1">
                                        {[...Array(4)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`h-4 w-1.5 skew-x-[-0deg] transition-colors duration-500 ${
                                                    i < team.aliveCount 
                                                    ? 'bg-red-600 shadow-[0_0_8px_#dc2626]' 
                                                    : 'bg-gray-800'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* BOTTOM SECTION: Win Probability */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                            Win Probability
                                        </span>
                                        <span className="text-sm text-white font-black italic">
                                            {winProb}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${winProb}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-red-700 via-red-500 to-orange-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default TopFourOverlay;