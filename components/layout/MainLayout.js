import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { getThemeForTime } from '@/lib/utils/helpers';
import Header from './Header';
import CameraHUD from '../hud/CameraHUD';
import CameraOverlays from '../hud/CameraOverlays';
import CameraVisualEffects from '../hud/CameraVisualEffects';
import InfoOverlays from '../overlays/InfoOverlays';
import CameraCursor from '../cursor/CameraCursor';
import KeyboardHandler from './KeyboardHandler';
import PowerOffConfirm from '../power/PowerOffConfirm';
import KeyboardShortcutsHelp from '../overlays/KeyboardShortcutsHelp';
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/24/outline';

export default function MainLayout({ children }) {
  const { singleViewItem, isShuttingDown, easterEggActive } = useApp();
  const theme = getThemeForTime();

  return (
    <>
      {/* Keyboard event handler */}
      <KeyboardHandler />

      {/* Custom cursor */}
      <CameraCursor />

      {/* Main container */}
      <div className={`min-h-screen ${theme}`}>
        {/* Background with time-based theme */}
        <Background theme={theme} />

        {/* Header */}
        <Header />

        {/* Info overlays */}
        <InfoOverlays />

        {/* Camera overlays (Grid, Focus Peaking, Zebra, Histogram, Waveform) */}
        <CameraOverlays />

        {/* Camera visual effects (ISO grain, Aperture blur, Shutter motion) */}
        <CameraVisualEffects />

        {/* Main content area */}
        <main
          className={`relative min-h-screen pt-20 pb-24 transition-all duration-500 ${
            singleViewItem ? 'blur-sm' : ''
          }`}
        >
          {children}
        </main>

        <ScrollShortcuts />

        {/* HUD */}
        <CameraHUD />

        {/* Power off confirmation */}
        <PowerOffConfirm />

        {/* Keyboard shortcuts help */}
        <KeyboardShortcutsHelp />

        {/* Shutdown overlay */}
        <AnimatePresence>
          {isShuttingDown && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="text-lg tracking-[0.3em] text-white/60">POWERING DOWN</p>
                <div className="mt-4 h-px w-40 bg-white/20" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Easter egg glow */}
        {easterEggActive && (
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_40%)]" />
        )}
      </div>
    </>
  );
}

function Background({ theme }) {
  const getBackgroundGradient = () => {
    switch (theme) {
      case 'golden-hour':
        return 'from-orange-950/20 via-black to-pink-950/20';
      case 'blue-hour':
        return 'from-blue-950/30 via-black to-indigo-950/30';
      case 'midday':
        return 'from-slate-900/50 via-black to-slate-900/50';
      case 'night':
      default:
        return 'from-black via-gray-900 to-black';
    }
  };

  return (
    <motion.div
      className={`fixed inset-0 -z-10 bg-gradient-to-br ${getBackgroundGradient()}`}
      animate={{
        background: [
          `linear-gradient(to bottom right, ${getBackgroundGradient()})`,
        ]
      }}
      transition={{ duration: 2 }}
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </motion.div>
  );
}

function ScrollShortcuts() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight || 0;
      const docHeight = document.documentElement.scrollHeight || 0;

      setShowTop(scrollY > 160);
      setShowBottom(scrollY + viewportHeight + 160 < docHeight);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  return (
    <div className="fixed right-4 bottom-28 z-40 flex flex-col items-end gap-2 md:right-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="back-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Back to top"
          >
            <ChevronDoubleUpIcon className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBottom && (
          <motion.button
            key="skip-to-bottom"
            onClick={scrollToBottom}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Skip to bottom"
          >
            <ChevronDoubleDownIcon className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
