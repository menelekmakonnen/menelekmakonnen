import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';

export default function PowerOffConfirm() {
  const { showPowerOffConfirm, setShowPowerOffConfirm, handlePowerOff } = useApp();

  return (
    <AnimatePresence>
      {showPowerOffConfirm && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPowerOffConfirm(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/20 bg-black/90 p-6 backdrop-blur-xl"
          >
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-2 text-center text-xl font-bold text-white">
              Power Off?
            </h2>

            {/* Message */}
            <p className="mb-6 text-center text-sm text-white/60">
              Are you sure you want to power off the system? All unsaved progress will be lost.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => setShowPowerOffConfirm(false)}
                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-3 font-medium text-white transition-colors hover:bg-white/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>

              <motion.button
                onClick={handlePowerOff}
                className="flex-1 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 font-medium text-red-500 transition-colors hover:bg-red-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Power Off
              </motion.button>
            </div>

            {/* Hint */}
            <p className="mt-4 text-center text-xs text-white/40">
              Press ESC again to confirm power off
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
