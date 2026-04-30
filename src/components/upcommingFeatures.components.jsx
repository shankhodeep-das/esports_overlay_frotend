import { motion, AnimatePresence } from "framer-motion";

const UpcomingFeature = ({ isOpen, onClose, featureName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#1a1a1a] border border-blue-500/30 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_30px_rgba(59,130,246,0.2)]"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {featureName || "New Feature"}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              This feature is currently under development for FXAE Production. 
              Stay tuned for updates!
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              GOT IT
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpcomingFeature;