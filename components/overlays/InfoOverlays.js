import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import { PAGE_DISPLAY_NAMES } from '@/lib/constants/pages';
import { getGreeting } from '@/lib/constants/greetings';
import { formatStorage } from '@/lib/utils/helpers';

export default function InfoOverlays() {
  const { showInfoOverlays, currentPage, cameraSettings } = useApp();

  if (!showInfoOverlays) return null;

  return (
    <>
      <TopLeftInfo currentPage={currentPage} />
      <TopRightInfo />
      <BottomLeftInfo cameraSettings={cameraSettings} />
    </>
  );
}

function TopLeftInfo({ currentPage }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 left-4 z-30 space-y-1 font-mono text-xs text-white/60"
    >
      <div className="rounded border border-white/10 bg-black/30 px-2 py-1 backdrop-blur-sm">
        {PAGE_DISPLAY_NAMES[currentPage] || 'UNKNOWN'}
      </div>
      <div className="text-[10px] text-white/40">
        FILE: 001 / 10k
      </div>
    </motion.div>
  );
}

function TopRightInfo() {
  const greeting = getGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 right-4 z-30 space-y-2 text-right font-mono text-xs"
    >
      {/* Greeting */}
      <div className="text-white/60">
        {greeting}
      </div>

      {/* Location */}
      <LocationInfo />

      {/* Storage */}
      <div className="text-white/40">
        {formatStorage(25, 512)}
      </div>
    </motion.div>
  );
}

function LocationInfo() {
  return (
    <div className="flex items-center justify-end gap-1 text-white/40">
      <MapPinIcon className="h-3 w-3" />
      <span>Los Angeles, CA</span>
    </div>
  );
}

function BottomLeftInfo({ cameraSettings }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="fixed bottom-20 left-4 z-30 space-y-1 font-mono text-xs text-white/60"
      >
        <div>ISO {cameraSettings.iso}</div>
        <div>f/{cameraSettings.aperture}</div>
        <div>{cameraSettings.shutter}</div>
        <div>{cameraSettings.whiteBalance.toUpperCase()}</div>
      </motion.div>
    </AnimatePresence>
  );
}
