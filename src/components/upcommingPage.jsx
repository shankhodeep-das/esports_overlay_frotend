import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UpcomingFeature = ({ featureName = "This Section" }) => {
  const navigate = useNavigate();

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  // Animation variants for text/items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }
    }
  };

  // Pulse animation for the progress indicator
  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans overflow-hidden p-6">
      
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-[#001c40] opacity-30 rounded-full blur-[150px] transform -translate-y-1/2"></div>
      
      <motion.div
        className="relative z-10 text-center max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Icon/Visual */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <div className="relative">
            {/* Pulsing Outer Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-500/50"
              variants={pulseVariants}
              animate="animate"
            />
            {/* Core Icon/Placeholder */}
            <div className="w-24 h-24 rounded-full bg-[#111] border border-blue-600/30 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* The Feature Name */}
        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4 uppercase"
          variants={itemVariants}
        >
          {featureName} IS<br />UNDER CONSTRUCTION
        </motion.h1>
        
        {/* The Patience Message */}
        <motion.p 
          className="text-gray-400 text-lg md:text-xl font-light mb-12 tracking-wide px-6"
          variants={itemVariants}
        >
          Our development squad is fine-tuning this section to deliver a premium experience. We appreciate your patience while we deploy the final patches.
        </motion.p>
        
        {/* Action Button */}
        <motion.div variants={itemVariants}>
          <button 
            onClick={() => navigate(-1)}
            className="px-10 py-3 bg-blue-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300"
          >
            RETURN TO PREVIOUS PAGE
          </button>
        </motion.div>

        {/* Progress Dots */}
        <motion.div variants={itemVariants} className="mt-16 flex gap-3 justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-blue-600"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </motion.div>
        
      </motion.div>
    </div>
  );
};

export default UpcomingFeature;