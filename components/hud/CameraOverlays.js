import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

export default function CameraOverlays() {
  const { showHistogram, showWaveform, showGrid, showFocusPeaking, showZebra, cameraSettings, setShowHistogram, setShowWaveform } = useApp();
  const gridType = cameraSettings.grid;

  const [histogramPosition, setHistogramPosition] = useState({ x: 0, y: 0 });
  const [waveformPosition, setWaveformPosition] = useState({ x: 0, y: 0 });

  return (
    <>
      {/* Grid Overlay */}
      <AnimatePresence>
        {showGrid && gridType && <GridOverlay type={gridType} />}
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
        {showHistogram && (
          <HistogramPanel
            position={histogramPosition}
            onDragEnd={(_, info) => setHistogramPosition(info.point)}
            onClose={() => setShowHistogram(false)}
          />
        )}
      </AnimatePresence>

      {/* Waveform Panel */}
      <AnimatePresence>
        {showWaveform && (
          <WaveformPanel
            position={waveformPosition}
            onDragEnd={(_, info) => setWaveformPosition(info.point)}
            onClose={() => setShowWaveform(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function GridOverlay({ type }) {
  const renderGrid = () => {
    switch (type) {
      case 'golden-ratio':
        return (
          <>
            <line x1="38.2%" y1="0" x2="38.2%" y2="100%" stroke="white" strokeWidth="1" opacity="0.3" />
            <line x1="61.8%" y1="0" x2="61.8%" y2="100%" stroke="white" strokeWidth="1" opacity="0.3" />
            <line x1="0" y1="38.2%" x2="100%" y2="38.2%" stroke="white" strokeWidth="1" opacity="0.3" />
            <line x1="0" y1="61.8%" x2="100%" y2="61.8%" stroke="white" strokeWidth="1" opacity="0.3" />
            <circle cx="61.8%" cy="38.2%" r="5" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
          </>
        );
      case 'diagonal':
        return (
          <>
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="1" opacity="0.25" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="1" opacity="0.25" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="1" opacity="0.2" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" opacity="0.2" />
          </>
        );
      case 'rule-of-thirds':
      default:
        return (
          <>
            <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="white" strokeWidth="1" opacity="0.3" />
            <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="white" strokeWidth="1" opacity="0.3" />
            <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="white" strokeWidth="1" opacity="0.3" />
            <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="white" strokeWidth="1" opacity="0.3" />
            <circle cx="50%" cy="50%" r="4" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
          </>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-30"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {renderGrid()}
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

function HistogramPanel({ position, onDragEnd, onClose }) {
  const constraints = typeof window !== 'undefined'
    ? { top: 40, left: 20, right: window.innerWidth - 260, bottom: window.innerHeight - 140 }
    : { top: 0, left: 0, right: 0, bottom: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      drag
      dragMomentum={false}
      onDragEnd={onDragEnd}
      dragConstraints={constraints}
      style={{ x: position.x, y: position.y }}
      className="fixed bottom-24 right-4 z-40 w-64 rounded-lg border border-white/20 bg-black/90 p-4 backdrop-blur-xl"
    >
      <h3 className="mb-2 text-xs font-semibold text-white/60">HISTOGRAM</h3>

      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60 hover:bg-white/10"
      >
        Close
      </button>

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

function WaveformPanel({ position, onDragEnd, onClose }) {
  const constraints = typeof window !== 'undefined'
    ? { top: 40, left: 20, right: window.innerWidth - 260, bottom: window.innerHeight - 140 }
    : { top: 0, left: 0, right: 0, bottom: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      drag
      dragMomentum={false}
      onDragEnd={onDragEnd}
      dragConstraints={constraints}
      style={{ x: position.x, y: position.y }}
      className="fixed bottom-24 left-4 z-40 w-64 rounded-lg border border-white/20 bg-black/90 p-4 backdrop-blur-xl"
    >
      <h3 className="mb-2 text-xs font-semibold text-white/60">WAVEFORM</h3>

      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60 hover:bg-white/10"
      >
        Close
      </button>

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
