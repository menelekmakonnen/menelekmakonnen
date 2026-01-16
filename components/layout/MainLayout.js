import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { getThemeForTime } from '@/lib/utils/helpers';
import Header from './Header';
import CameraHUD from '../hud/CameraHUD';
import CameraOverlays from '../hud/CameraOverlays';
import CameraVisualEffects from '../hud/CameraVisualEffects';
import InfoOverlays from '../overlays/InfoOverlays';
import CameraCursor from '../cursor/CameraCursor';
import KeyboardShortcutsHelp from '../overlays/KeyboardShortcutsHelp';
import CachePermissionPopup from '../common/CachePermissionPopup';

export default function MainLayout({ children }) {
  const { singleViewItem, visualState } = useApp();
  const theme = getThemeForTime();

  return (
    <>
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
          className={`relative min-h-screen pt-20 pb-24 transition-all duration-500`}
          style={{
            filter: visualState.filter + (singleViewItem ? ' blur(4px)' : ''),
            backdropFilter: `blur(${visualState.blurAmount})`
          }}
        >
          {children}
        </main>

        {/* HUD */}
        <CameraHUD />

        {/* Permission Popup */}
        <CachePermissionPopup />

        {/* Keyboard shortcuts help */}
        <KeyboardShortcutsHelp />
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
