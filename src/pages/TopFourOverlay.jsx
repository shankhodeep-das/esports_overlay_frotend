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
                            className="w-50 h-24 relative rounded-xl border border-white/10 bg-black/90 shadow-2xl overflow-hidden"
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
                                {/* TOP ROW: Identity & Alive Bars */}
                                <div className="flex justify-between items-start gap-2 h-10">
                                    {/* Team Identity Container */}
                                    <div className="flex items-center gap-2 min-w-0 flex-1"> 
                                        {/* min-w-0 is CRITICAL here to allow the child (h3) to truncate */}
                                        
                                        {team.teamLogo ? (
                                            <img 
                                                src={team.teamLogo} 
                                                className="w-8 h-8 object-contain flex-shrink-0" 
                                                alt="" 
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-white/5 rounded border border-white/10 flex-shrink-0" />
                                        )}
                                        
                                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                                            <div className="flex-1 min-w-0 overflow-hidden relative">
                                                {/* Container for the sliding effect */}
                                                <div className="flex whitespace-nowrap">
                                                    <motion.div
                                                        initial={{ x: 0 }}
                                                        animate={team.teamName?.length > 10 ? { x: "-50%" } : { x: 0 }}
                                                        transition={{
                                                            duration: 10,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        }}
                                                        className="flex"
                                                    >
                                                        {/* Render Name Twice for seamless looping */}
                                                        <h3 className="text-white font-black italic text-sm uppercase px-4">
                                                            {team.teamName}
                                                        </h3>
                                                        
                                                        {team.teamName?.length > 10 && (
                                                            <h3 className="text-white font-black italic text-sm uppercase px-4">
                                                                {team.teamName}
                                                            </h3>
                                                        )}
                                                    </motion.div>
                                                </div>

                                                {/* Left & Right Edge Fades (Optional: hides the text "popping" in/out) */}
                                                <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black to-transparent z-10" />
                                                <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black to-transparent z-10" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alive Bars - flex-shrink-0 ensures they never get pushed out */}
                                    <div className="flex gap-0.5 mt-1 flex-shrink-0">
                                        {[...Array(4)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`h-3 w-1 skew-x-[-15deg] ${
                                                    i < team.aliveCount 
                                                    ? 'bg-red-600 shadow-[0_0_5px_red]' 
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