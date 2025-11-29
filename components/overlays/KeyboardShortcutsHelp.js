import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';

export default function KeyboardShortcutsHelp() {
  const { showShortcutsHelp, setShowShortcutsHelp } = useApp();

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['←', '→', 'A', 'D'], description: 'Navigate between pages' },
        { keys: ['ESC'], description: 'Cascade escape (slideshow → single view → album → page → home → power off)' }
      ]
    },
    {
      category: 'Single View',
      items: [
        { keys: ['↑', '↓', 'W', 'S'], description: 'Navigate between items in album' },
        { keys: ['←', '→', 'A', 'D'], description: 'Switch between albums' },
        { keys: ['ESC'], description: 'Exit Single View or stop slideshow' }
      ]
    },
    {
      category: 'Help',
      items: [
        { keys: ['?', 'H'], description: 'Toggle this keyboard shortcuts help' }
      ]
    },
    {
      category: 'Camera HUD',
      items: [
        { keys: ['Click ISO/Aperture/Shutter'], description: 'Adjust camera settings' },
        { keys: ['HUD Toggle'], description: 'Cycle between Full, Partial, and Hidden HUD modes' }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {showShortcutsHelp && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm"
            onClick={() => setShowShortcutsHelp(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[91] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/20 bg-black/95 p-6 backdrop-blur-xl"
          >
            {/* Close button */}
            <button
              onClick={() => setShowShortcutsHelp(false)}
              className="absolute top-4 right-4 rounded-full border border-white/20 bg-white/5 p-2 text-white transition-all hover:bg-white/10"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            {/* Title */}
            <h2 className="mb-6 text-2xl font-bold text-white">
              Keyboard Shortcuts
            </h2>

            {/* Shortcuts grid */}
            <div className="space-y-6">
              {shortcuts.map((category) => (
                <div key={category.category}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">
                    {category.category}
                  </h3>

                  <div className="space-y-2">
                    {category.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                      >
                        <span className="text-sm text-white/80">
                          {item.description}
                        </span>

                        <div className="flex gap-1">
                          {item.keys.map((key) => (
                            <kbd
                              key={key}
                              className="min-w-[2rem] rounded border border-white/30 bg-white/10 px-2 py-1 text-center text-xs font-semibold text-white"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-white/40">
              Press <kbd className="rounded border border-white/20 bg-white/10 px-2 py-0.5">ESC</kbd> or click outside to close
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
