import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CameraVisualEffects() {
  const { cameraSettings, visualState, isEcoMode } = useApp();

  const getBlurIntensity = () => {
    if (isEcoMode) return '0px';
    // Lower aperture (wider opening) = more blur
    const aperture = cameraSettings.aperture;
    if (aperture <= 1.8) return '4px';
    if (aperture <= 2.8) return '2px';
    if (aperture <= 4) return '1px';
    return '0px';
  };

  const getMotionBlur = () => {
    if (isEcoMode) return false;
    // Slower shutter = more motion blur potential
    const shutter = cameraSettings.shutter;
    if (shutter.includes('1"') || shutter.includes('2"')) return true;
    if (shutter === '1/30' || shutter === '1/60') return true;
    return false;
  };

  const grainOpacity = visualState.grainOpacity;
  const blurAmount = getBlurIntensity();
  const hasMotionBlur = getMotionBlur();

  return (
    <>
      {/* Film Grain Overlay (ISO effect) */}
      <AnimatePresence>
        {grainOpacity > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: grainOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}
          />
        )}
      </AnimatePresence>

      {/* Depth of Field Blur (Aperture effect) */}
      <AnimatePresence>
        {blurAmount !== '0px' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-20"
            style={{
              background: `radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.3) 100%)`,
              backdropFilter: `blur(${blurAmount})`,
              WebkitBackdropFilter: `blur(${blurAmount})`
            }}
          />
        )}
      </AnimatePresence>

      {/* Motion Blur Indicator (Shutter effect) */}
      <AnimatePresence>
        {hasMotionBlur && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.15, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none fixed inset-0 z-20"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
              transform: 'skewX(-10deg)'
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
