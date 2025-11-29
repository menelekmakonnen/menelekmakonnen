import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PowerIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  BoltIcon,
  ChartBarIcon,
  SignalIcon,
  Square3Stack3DIcon,
  ViewfinderCircleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import { HUD_MODES } from '@/lib/constants/camera';
import { cn } from '@/lib/utils/helpers';
import BatteryIndicator from './BatteryIndicator';
import CameraControls from './CameraControls';

export default function CameraHUD() {
  const {
    hudMode,
    setHudMode,
    handlePowerOff,
    cameraHistory,
    undoLastCameraAction,
    resetAllCameraSettings,
    setShowHistogram,
    setShowWaveform,
    showHistogram,
    showWaveform
  } = useApp();

  const [showResetButton, setShowResetButton] = useState(false);

  const toggleHudMode = () => {
    const modes = [HUD_MODES.FULL, HUD_MODES.PARTIAL, HUD_MODES.HIDDEN];
    const currentIndex = modes.indexOf(hudMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setHudMode(modes[nextIndex]);
  };

  const handleReset = () => {
    if (cameraHistory.length === 0) return;

    if (cameraHistory.length === 1) {
      undoLastCameraAction();
      setShowResetButton(false);
    } else {
      // First click: undo last
      // Second click: reset all
      if (showResetButton) {
        resetAllCameraSettings();
        setShowResetButton(false);
      } else {
        undoLastCameraAction();
      }
    }
  };

  // Show reset button when there are camera changes
  useState(() => {
    setShowResetButton(cameraHistory.length > 0);
  }, [cameraHistory]);

  if (hudMode === HUD_MODES.HIDDEN) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <motion.button
          onClick={toggleHudMode}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-xl transition-all hover:bg-white/10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <EyeIcon className="h-5 w-5 text-white" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/50 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        {/* Full HUD Mode */}
        {hudMode === HUD_MODES.FULL && (
          <div className="space-y-3">
            {/* Camera Controls */}
            <CameraControls />

            {/* Secondary Controls */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <div className="flex items-center gap-2">
                {/* Histogram Toggle */}
                <HUDButton
                  active={showHistogram}
                  onClick={() => setShowHistogram(!showHistogram)}
                  icon={ChartBarIcon}
                  label="Histogram"
                />

                {/* Waveform Toggle */}
                <HUDButton
                  active={showWaveform}
                  onClick={() => setShowWaveform(!showWaveform)}
                  icon={SignalIcon}
                  label="Waveform"
                />

                {/* Grid Overlay */}
                <HUDButton
                  icon={Square3Stack3DIcon}
                  label="Grid"
                />

                {/* Focus Peaking */}
                <HUDButton
                  icon={ViewfinderCircleIcon}
                  label="Focus Peaking"
                />

                {/* Zebra Stripes */}
                <HUDButton
                  icon={AdjustmentsHorizontalIcon}
                  label="Zebra"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Reset Button (conditional) */}
                <AnimatePresence>
                  {cameraHistory.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <HUDButton
                        onClick={handleReset}
                        icon={ArrowPathIcon}
                        label={cameraHistory.length === 1 ? 'Undo' : 'Reset'}
                        variant="warning"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Battery */}
                <BatteryIndicator />

                {/* HUD Toggle */}
                <HUDButton
                  onClick={toggleHudMode}
                  icon={hudMode === HUD_MODES.FULL ? EyeSlashIcon : EyeIcon}
                  label="HUD"
                />

                {/* Power Button */}
                <HUDButton
                  onClick={handlePowerOff}
                  icon={PowerIcon}
                  label="Power"
                  variant="danger"
                />
              </div>
            </div>
          </div>
        )}

        {/* Partial HUD Mode */}
        {hudMode === HUD_MODES.PARTIAL && (
          <div className="flex items-center justify-between">
            {/* Essential info only */}
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span>ISO 400</span>
              <span>f/2.8</span>
              <span>1/250</span>
            </div>

            <div className="flex items-center gap-2">
              <BatteryIndicator compact />
              <HUDButton
                onClick={toggleHudMode}
                icon={EyeIcon}
                label="Show HUD"
              />
              <HUDButton
                onClick={handlePowerOff}
                icon={PowerIcon}
                label="Power"
                variant="danger"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function HUDButton({ onClick, icon: Icon, label, active = false, variant = 'default' }) {
  const [showLabel, setShowLabel] = useState(false);

  const variants = {
    default: 'border-white/20 text-white/60 hover:bg-white/10 hover:text-white',
    warning: 'border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10',
    danger: 'border-red-500/30 text-red-500 hover:bg-red-500/10'
  };

  return (
    <div className="relative">
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded border backdrop-blur-sm transition-all',
          active ? 'bg-white/20 text-white border-white/40' : variants[variant]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="h-4 w-4" />
      </motion.button>

      {/* Label tooltip */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs text-white backdrop-blur-sm"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
