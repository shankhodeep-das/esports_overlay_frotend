import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UpcomingFeature from "../components/upcommingFeatures.components";
import { useState } from "react";



const Home = () => {
  const navigate = useNavigate();

  const letterAni = {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Top Right Buttons */}
      <div className="absolute top-8 right-8 flex gap-4 z-20">
        <button 
          onClick={() => navigate('/join')}
          className="px-6 py-2 border border-white text-white font-medium rounded-full hover:bg-white hover:text-black transition-all"
        >
          JOIN
        </button>
        <button 
          onClick={() => navigate('/signup')}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          SIGNUP
        </button>
      </div>

      {/* Animated Text */}
      <div className="text-center">
        <motion.h1 
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-white"
        >
          {"FXAE PRODUCTION".split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterAni}
              transition={{ duration: 1.0, ease: [0.6, 0.01, 0.05, 0.95] }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2.0 }}
          className="text-gray-400 mt-4 tracking-[0.8em] text-xs uppercase"
        >
          Premium Esports Overlays
        </motion.p>
      </div>
    </div>
  );
};

export default Home;