import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PowerIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ChartBarIcon,
  SignalIcon,
  Square3Stack3DIcon,
  ViewfinderCircleIcon,
  Bars3Icon,  // Changed Zebra icon
  CameraIcon,
  SunIcon,
  BoltIcon,
  AdjustmentsVerticalIcon,
  CursorArrowRaysIcon,
  VariableIcon,
  MagnifyingGlassCircleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import {
  HUD_MODES,
  ISO_VALUES,
  APERTURE_VALUES,
  SHUTTER_SPEEDS,
  WHITE_BALANCE_MODES,
  GRID_TYPES,
  CURSOR_MODES,
  LENS_MODES
} from '@/lib/constants/camera';
import { PAGES } from '@/lib/constants/pages';
import { cn } from '@/lib/utils/helpers';
import BatteryIndicator from './BatteryIndicator';

export default function CameraHUD() {
  const {
    hudMode,
    setHudMode,
    handlePowerOff,
    cameraSettings,
    updateCameraSetting,
    cameraHistory,
    undoLastCameraAction,
    resetAllCameraSettings,
    setShowHistogram,
    setShowWaveform,
    showHistogram,
    showWaveform,
    showGrid,
    setShowGrid,
    showFocusPeaking,
    setShowFocusPeaking,
    showZebra,
    setShowZebra,
    navigateToPage
  } = useApp();

  const [openPanel, setOpenPanel] = useState(null); // 'iso', 'aperture', 'shutter', 'wb', or null

  const toggleHudMode = () => {
    const modes = [HUD_MODES.FULL, HUD_MODES.PARTIAL, HUD_MODES.HIDDEN];
    const currentIndex = modes.indexOf(hudMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setHudMode(modes[nextIndex]);
  };

  const handleReset = () => {
    if (cameraHistory.length === 0) return;

    // Reset all camera settings
    resetAllCameraSettings();

    // Close all overlays
    setShowHistogram(false);
    setShowWaveform(false);
    setShowGrid(false);
    setShowFocusPeaking(false);
    setShowZebra(false);
    setOpenPanel(null);
  };

  const togglePanel = (panel) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const toggleGrid = () => {
    if (!showGrid || !cameraSettings.grid) {
      updateCameraSetting('grid', GRID_TYPES[0].id);
      setShowGrid(true);
      return;
    }

    const currentIndex = GRID_TYPES.findIndex(type => type.id === cameraSettings.grid);
    const nextIndex = (currentIndex + 1) % (GRID_TYPES.length + 1);

    if (nextIndex === GRID_TYPES.length) {
      setShowGrid(false);
      updateCameraSetting('grid', null);
      return;
    }

    updateCameraSetting('grid', GRID_TYPES[nextIndex].id);
    setShowGrid(true);
  };

  const cycleCursorMode = () => {
    const currentIndex = CURSOR_MODES.findIndex(mode => mode.id === cameraSettings.cursorMode);
    const nextMode = CURSOR_MODES[(currentIndex + 1) % CURSOR_MODES.length];
    updateCameraSetting('cursorMode', nextMode.id);
  };

  const cycleLensMode = () => {
    const lensOrder = [LENS_MODES.WIDE, LENS_MODES.STANDARD, LENS_MODES.TELEPHOTO, LENS_MODES.MACRO];
    const currentIndex = lensOrder.indexOf(cameraSettings.lensMode || LENS_MODES.STANDARD);
    const nextMode = lensOrder[(currentIndex + 1) % lensOrder.length];
    updateCameraSetting('lensMode', nextMode);
  };

  const currentGridLabel = cameraSettings.grid
    ? GRID_TYPES.find(type => type.id === cameraSettings.grid)?.name || 'Grid'
    : 'Grid';

  const currentCursorLabel = CURSOR_MODES.find(mode => mode.id === cameraSettings.cursorMode)?.name || 'Cursor';
  const currentLensLabel = cameraSettings.lensMode || LENS_MODES.STANDARD;

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
    <>
      {/* Temporary Panels */}
      <AnimatePresence>
        {openPanel === 'iso' && (
          <ISOPanel
            currentValue={cameraSettings.iso}
            onSelect={(val) => {
              updateCameraSetting('iso', val);
              setOpenPanel(null);
            }}
            onClose={() => setOpenPanel(null)}
          />
        )}
        {openPanel === 'aperture' && (
          <AperturePanel
            currentValue={cameraSettings.aperture}
            onSelect={(val) => {
              updateCameraSetting('aperture', val);
              setOpenPanel(null);
            }}
            onClose={() => setOpenPanel(null)}
          />
        )}
        {openPanel === 'shutter' && (
          <ShutterPanel
            currentValue={cameraSettings.shutter}
            onSelect={(val) => {
              updateCameraSetting('shutter', val);
              setOpenPanel(null);
            }}
            onClose={() => setOpenPanel(null)}
          />
        )}
        {openPanel === 'wb' && (
          <WhiteBalancePanel
            currentValue={cameraSettings.whiteBalance}
            onSelect={(val) => {
              updateCameraSetting('whiteBalance', val);
              setOpenPanel(null);
            }}
            onClose={() => setOpenPanel(null)}
          />
        )}
      </AnimatePresence>

      {/* Main HUD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/50 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 py-3">
          {/* Full HUD Mode - Single Row */}
          {hudMode === HUD_MODES.FULL && (
            <div className="flex items-center justify-between">
              {/* Left Side - Camera Settings */}
              <div className="flex items-center gap-2">
                {/* ISO */}
                <HUDButton
                  onClick={() => togglePanel('iso')}
                  icon={BoltIcon}
                  label={`ISO ${cameraSettings.iso}`}
                  active={openPanel === 'iso'}
                />

                {/* Aperture */}
                <HUDButton
                  onClick={() => togglePanel('aperture')}
                  icon={CameraIcon}
                  label={`f/${cameraSettings.aperture}`}
                  active={openPanel === 'aperture'}
                />

                {/* Shutter Speed */}
                <HUDButton
                  onClick={() => togglePanel('shutter')}
                  icon={AdjustmentsVerticalIcon}
                  label={cameraSettings.shutter}
                  active={openPanel === 'shutter'}
                />

                {/* White Balance */}
                <HUDButton
                  onClick={() => togglePanel('wb')}
                  icon={SunIcon}
                  label="WB"
                  active={openPanel === 'wb'}
                />
              </div>

              {/* Center - Overlays */}
              <div className="flex items-center gap-2">
                {/* Histogram */}
                <HUDButton
                  active={showHistogram}
                  onClick={() => setShowHistogram(!showHistogram)}
                  icon={ChartBarIcon}
                  label="Histogram"
                />

                {/* Waveform */}
                <HUDButton
                  active={showWaveform}
                  onClick={() => setShowWaveform(!showWaveform)}
                  icon={SignalIcon}
                  label="Waveform"
                />

                {/* Grid */}
                <HUDButton
                  active={showGrid}
                  onClick={toggleGrid}
                  icon={Square3Stack3DIcon}
                  label={currentGridLabel}
                />

                {/* Focus Peaking */}
                <HUDButton
                  active={showFocusPeaking}
                  onClick={() => setShowFocusPeaking(!showFocusPeaking)}
                  icon={ViewfinderCircleIcon}
                  label="Focus"
                />

                {/* Zebra Stripes - NEW ICON */}
                <HUDButton
                  active={showZebra}
                  onClick={() => setShowZebra(!showZebra)}
                  icon={Bars3Icon}
                  label="Zebra"
                />

                {/* Cursor Style */}
                <HUDButton
                  onClick={cycleCursorMode}
                  icon={CursorArrowRaysIcon}
                  label={currentCursorLabel}
                />

                {/* Lens Mode */}
                <HUDButton
                  onClick={cycleLensMode}
                  icon={MagnifyingGlassCircleIcon}
                  label={`Lens ${currentLensLabel}`}
                />
              </div>

              {/* Right Side - System */}
              <div className="flex items-center gap-2">
                {/* Home */}
                <HUDButton
                  onClick={() => navigateToPage(PAGES.HOME)}
                  icon={HomeIcon}
                  label="Home"
                />

                {/* Reset */}
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
                        label="Reset"
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
                  icon={EyeSlashIcon}
                  label="Hide HUD"
                />

                {/* Power */}
                <HUDButton
                  onClick={handlePowerOff}
                  icon={PowerIcon}
                  label="Power"
                  variant="danger"
                />
              </div>
            </div>
          )}

          {/* Partial HUD Mode */}
          {hudMode === HUD_MODES.PARTIAL && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span>ISO {cameraSettings.iso}</span>
                <span>f/{cameraSettings.aperture}</span>
                <span>{cameraSettings.shutter}</span>
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
    </>
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

// Temporary Panel Components with Sliders
function ISOPanel({ currentValue, onSelect, onClose }) {
  const currentIndex = ISO_VALUES.indexOf(currentValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 left-4 z-50 w-80 rounded-lg border border-white/20 bg-black/90 p-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">ISO: {currentValue}</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max={ISO_VALUES.length - 1}
        value={currentIndex}
        onChange={(e) => onSelect(ISO_VALUES[parseInt(e.target.value)])}
        className="w-full accent-white"
      />

      {/* Value labels */}
      <div className="mt-2 flex justify-between text-xs text-white/40">
        <span>{ISO_VALUES[0]}</span>
        <span>{ISO_VALUES[Math.floor(ISO_VALUES.length / 2)]}</span>
        <span>{ISO_VALUES[ISO_VALUES.length - 1]}</span>
      </div>
    </motion.div>
  );
}

function AperturePanel({ currentValue, onSelect, onClose }) {
  const currentIndex = APERTURE_VALUES.indexOf(currentValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 left-4 z-50 w-80 rounded-lg border border-white/20 bg-black/90 p-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Aperture: f/{currentValue}</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max={APERTURE_VALUES.length - 1}
        value={currentIndex}
        onChange={(e) => onSelect(APERTURE_VALUES[parseInt(e.target.value)])}
        className="w-full accent-white"
      />

      {/* Value labels */}
      <div className="mt-2 flex justify-between text-xs text-white/40">
        <span>f/{APERTURE_VALUES[0]}</span>
        <span>f/{APERTURE_VALUES[Math.floor(APERTURE_VALUES.length / 2)]}</span>
        <span>f/{APERTURE_VALUES[APERTURE_VALUES.length - 1]}</span>
      </div>
    </motion.div>
  );
}

function ShutterPanel({ currentValue, onSelect, onClose }) {
  const currentIndex = SHUTTER_SPEEDS.indexOf(currentValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 left-4 z-50 w-80 rounded-lg border border-white/20 bg-black/90 p-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Shutter: {currentValue}</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max={SHUTTER_SPEEDS.length - 1}
        value={currentIndex}
        onChange={(e) => onSelect(SHUTTER_SPEEDS[parseInt(e.target.value)])}
        className="w-full accent-white"
      />

      {/* Value labels */}
      <div className="mt-2 flex justify-between text-xs text-white/40">
        <span>{SHUTTER_SPEEDS[0]}</span>
        <span>{SHUTTER_SPEEDS[Math.floor(SHUTTER_SPEEDS.length / 2)]}</span>
        <span>{SHUTTER_SPEEDS[SHUTTER_SPEEDS.length - 1]}</span>
      </div>
    </motion.div>
  );
}

function WhiteBalancePanel({ currentValue, onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 left-4 z-50 w-64 rounded-lg border border-white/20 bg-black/90 p-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">White Balance</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
      </div>

      {/* Grid of options */}
      <div className="grid grid-cols-2 gap-2">
        {WHITE_BALANCE_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={cn(
              'rounded border p-2 text-left text-sm transition-all',
              mode.id === currentValue
                ? 'border-white/40 bg-white/20 text-white'
                : 'border-white/20 bg-white/5 text-white/60 hover:bg-white/10'
            )}
          >
            <div className="font-medium">{mode.name}</div>
            <div className="text-xs text-white/40">{mode.temp}</div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
