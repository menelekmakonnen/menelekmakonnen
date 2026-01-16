import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

export default function CameraOverlays() {
  const { showHistogram, showWaveform, showGrid, showFocusPeaking, showZebra } = useApp();

  return (
    <>
      {/* Grid Overlay */}
      <AnimatePresence>
        {showGrid && <GridOverlay />}
      </AnimatePresence>

      {/* Focus Peaking Overlay */}
      <AnimatePresence>
        {showFocusPeaking && <FocusPeakingOverlay />}
      </AnimatePresence>

      {/* Zebra Stripes Overlay */}
      <AnimatePresence>
        {showZebra && <ZebraOverlay />}
      </AnimatePresence>

      {/* Histogram Panel */}
      <AnimatePresence>
        {showHistogram && <HistogramPanel />}
      </AnimatePresence>

      {/* Waveform Panel */}
      <AnimatePresence>
        {showWaveform && <WaveformPanel />}
      </AnimatePresence>
    </>
  );
}

function GridOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-30"
    >
      {/* Rule of thirds grid */}
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {/* Vertical lines */}
        <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="white" strokeWidth="1" opacity="0.3" />
        <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="white" strokeWidth="1" opacity="0.3" />

        {/* Horizontal lines */}
        <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="white" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="white" strokeWidth="1" opacity="0.3" />

        {/* Center crosshair */}
        <circle cx="50%" cy="50%" r="4" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

function FocusPeakingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        background: 'radial-gradient(circle at center, transparent 40%, rgba(255,0,0,0.2) 100%)',
        mixBlendMode: 'screen'
      }}
    />
  );
}

function ZebraOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-30"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="zebra" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
            <rect width="5" height="10" fill="black" opacity="0.3" />
            <rect x="5" width="5" height="10" fill="white" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zebra)" />
      </svg>
    </motion.div>
  );
}

function HistogramPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-4 z-40 w-64 rounded-lg border border-white/20 bg-black/90 p-4 backdrop-blur-xl"
    >
      <h3 className="mb-2 text-xs font-semibold text-white/60">HISTOGRAM</h3>

      {/* Simple histogram visualization */}
      <div className="relative h-32 rounded bg-black/50">
        <svg className="h-full w-full" viewBox="0 0 256 128" preserveAspectRatio="none">
          {/* RGB channels */}
          <path d="M0,128 Q64,80 128,60 T256,40" fill="none" stroke="red" strokeWidth="1" opacity="0.6" />
          <path d="M0,128 Q64,70 128,50 T256,30" fill="none" stroke="green" strokeWidth="1" opacity="0.6" />
          <path d="M0,128 Q64,90 128,70 T256,50" fill="none" stroke="blue" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      <div className="mt-2 flex justify-between text-xs text-white/40">
        <span>0</span>
        <span>EXPOSURE</span>
        <span>255</span>
      </div>
    </motion.div>
  );
}

function WaveformPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 left-4 z-40 w-64 rounded-lg border border-white/20 bg-black/90 p-4 backdrop-blur-xl"
    >
      <h3 className="mb-2 text-xs font-semibold text-white/60">WAVEFORM</h3>

      {/* Simple waveform visualization */}
      <div className="relative h-32 rounded bg-black/50">
        <svg className="h-full w-full" viewBox="0 0 256 128">
          {/* Waveform lines */}
          {Array.from({ length: 50 }).map((_, i) => {
            const x = i * 5;
            const height = Math.random() * 80 + 20;
            return (
              <line
                key={i}
                x1={x}
                y1={128 - height}
                x2={x}
                y2={128}
                stroke="lime"
                strokeWidth="3"
                opacity="0.6"
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-2 flex justify-between text-xs text-white/40">
        <span>BLACK</span>
        <span>LUMINANCE</span>
        <span>WHITE</span>
      </div>
    </motion.div>
  );
}
