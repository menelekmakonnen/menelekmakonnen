import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

export default function CameraCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickMarkers, setClickMarkers] = useState([]);
  const { cameraSettings, autofocusTrigger } = useApp();

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Detect hovering over interactive elements
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.closest('button') ||
        target.closest('a') ||
        target.hasAttribute('role');

      setIsHovering(isInteractive);
    };

    document.addEventListener('mouseover', handleMouseOver, true);
    return () => document.removeEventListener('mouseover', handleMouseOver, true);
  }, []);

  // Handle clicks (create markers)
  useEffect(() => {
    const handleClick = (e) => {
      const newMarker = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };

      setClickMarkers(prev => [...prev, newMarker]);

      // Remove marker after animation
      setTimeout(() => {
        setClickMarkers(prev => prev.filter(m => m.id !== newMarker.id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const cursorMode = cameraSettings.cursorMode || 'classic';

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Custom camera cursor */}
      <motion.div
        className="pointer-events-none fixed z-[9999] mix-blend-difference"
        style={{
          left: position.x,
          top: position.y,
          x: '-50%',
          y: '-50%'
        }}
        animate={{
          scale: isHovering ? 1.2 : 1
        }}
        transition={{ duration: 0.15 }}
      >
        {cursorMode === 'classic' && <ClassicReticle isHovering={isHovering} />}
        {cursorMode === 'modern' && <ModernSquare isHovering={isHovering} />}
        {cursorMode === 'cinematic' && <CinematicCross isHovering={isHovering} />}
      </motion.div>

      {/* Click markers */}
      <AnimatePresence>
        {clickMarkers.map(marker => (
          <motion.div
            key={marker.id}
            className="pointer-events-none fixed z-[9999]"
            style={{
              left: marker.x,
              top: marker.y,
              x: '-50%',
              y: '-50%'
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-12 w-12 rounded-sm border-2 border-white mix-blend-difference" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Autofocus animation */}
      <AutofocusAnimation trigger={autofocusTrigger} />
    </>
  );
}

function ClassicReticle({ isHovering }) {
  return (
    <div className="relative h-8 w-8">
      {/* Corners */}
      <div className="absolute top-0 left-0 h-2 w-2 border-l-2 border-t-2 border-white" />
      <div className="absolute top-0 right-0 h-2 w-2 border-r-2 border-t-2 border-white" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-l-2 border-b-2 border-white" />
      <div className="absolute bottom-0 right-0 h-2 w-2 border-r-2 border-b-2 border-white" />

      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`h-1 w-1 rounded-full bg-white ${isHovering ? 'opacity-100' : 'opacity-50'}`} />
      </div>
    </div>
  );
}

function ModernSquare({ isHovering }) {
  return (
    <div className={`h-10 w-10 rounded-sm border-2 border-white transition-all ${
      isHovering ? 'border-white/100' : 'border-white/60'
    }`}>
      {/* Inner square */}
      <div className="absolute inset-2 rounded-sm border border-white/40" />
    </div>
  );
}

function CinematicCross({ isHovering }) {
  return (
    <div className="relative h-10 w-10">
      {/* Horizontal line */}
      <div className={`absolute top-1/2 left-0 right-0 h-px bg-white ${
        isHovering ? 'opacity-100' : 'opacity-60'
      }`} />

      {/* Vertical line */}
      <div className={`absolute top-0 bottom-0 left-1/2 w-px bg-white ${
        isHovering ? 'opacity-100' : 'opacity-60'
      }`} />

      {/* Center circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`h-3 w-3 rounded-full border border-white ${
          isHovering ? 'border-2' : ''
        }`} />
      </div>
    </div>
  );
}

function AutofocusAnimation({ trigger }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setShow(true);
      const timeout = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  if (!show) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-1/2 top-1/2 z-[9998] -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 1.5 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [1.5, 1, 1, 0.9] }}
      transition={{ duration: 0.8, times: [0, 0.2, 0.8, 1] }}
    >
      <div className="h-32 w-32 rounded-sm border-2 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]">
        <div className="absolute inset-2 rounded-sm border border-green-400/50" />
      </div>
    </motion.div>
  );
}
