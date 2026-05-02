import { motion, AnimatePresence } from 'framer-motion';

const ComingSoonToast = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 1.0 } }}
          className="fixed bottom-16 left-1/2 z-[999] px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-2xl border border-white/20 flex items-center gap-3"
        >
          <span className="text-xl">🚀</span>
          <div className="flex flex-col">
            <span className="font-bold text-sm">Feature Locked</span>
            <span className="text-xs text-blue-100">Coming soon to FXAE Production</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonToast;