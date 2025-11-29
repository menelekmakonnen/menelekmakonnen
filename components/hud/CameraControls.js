import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import {
  ISO_VALUES,
  APERTURE_VALUES,
  SHUTTER_SPEEDS,
  WHITE_BALANCE_MODES
} from '@/lib/constants/camera';
import { cn } from '@/lib/utils/helpers';

export default function CameraControls() {
  return (
    <div className="flex items-center justify-center gap-6">
      <ISOControl />
      <ApertureControl />
      <ShutterControl />
      <WhiteBalanceControl />
    </div>
  );
}

function ISOControl() {
  const { cameraSettings, updateCameraSetting } = useApp();
  const [showPicker, setShowPicker] = useState(false);

  const currentIndex = ISO_VALUES.indexOf(cameraSettings.iso);

  const increment = () => {
    if (currentIndex < ISO_VALUES.length - 1) {
      updateCameraSetting('iso', ISO_VALUES[currentIndex + 1]);
    }
  };

  const decrement = () => {
    if (currentIndex > 0) {
      updateCameraSetting('iso', ISO_VALUES[currentIndex - 1]);
    }
  };

  return (
    <CameraControl
      label="ISO"
      value={cameraSettings.iso}
      onIncrement={increment}
      onDecrement={decrement}
      canIncrement={currentIndex < ISO_VALUES.length - 1}
      canDecrement={currentIndex > 0}
      showPicker={showPicker}
      setShowPicker={setShowPicker}
    >
      <ValuePicker
        values={ISO_VALUES}
        currentValue={cameraSettings.iso}
        onSelect={(val) => {
          updateCameraSetting('iso', val);
          setShowPicker(false);
        }}
      />
    </CameraControl>
  );
}

function ApertureControl() {
  const { cameraSettings, updateCameraSetting } = useApp();
  const [showPicker, setShowPicker] = useState(false);

  const currentIndex = APERTURE_VALUES.indexOf(cameraSettings.aperture);

  const increment = () => {
    if (currentIndex < APERTURE_VALUES.length - 1) {
      updateCameraSetting('aperture', APERTURE_VALUES[currentIndex + 1]);
    }
  };

  const decrement = () => {
    if (currentIndex > 0) {
      updateCameraSetting('aperture', APERTURE_VALUES[currentIndex - 1]);
    }
  };

  return (
    <CameraControl
      label="Aperture"
      value={`f/${cameraSettings.aperture}`}
      onIncrement={increment}
      onDecrement={decrement}
      canIncrement={currentIndex < APERTURE_VALUES.length - 1}
      canDecrement={currentIndex > 0}
      showPicker={showPicker}
      setShowPicker={setShowPicker}
    >
      <ValuePicker
        values={APERTURE_VALUES.map(v => `f/${v}`)}
        currentValue={`f/${cameraSettings.aperture}`}
        onSelect={(val) => {
          const numVal = parseFloat(val.replace('f/', ''));
          updateCameraSetting('aperture', numVal);
          setShowPicker(false);
        }}
      />
    </CameraControl>
  );
}

function ShutterControl() {
  const { cameraSettings, updateCameraSetting } = useApp();
  const [showPicker, setShowPicker] = useState(false);

  const currentIndex = SHUTTER_SPEEDS.indexOf(cameraSettings.shutter);

  const increment = () => {
    if (currentIndex < SHUTTER_SPEEDS.length - 1) {
      updateCameraSetting('shutter', SHUTTER_SPEEDS[currentIndex + 1]);
    }
  };

  const decrement = () => {
    if (currentIndex > 0) {
      updateCameraSetting('shutter', SHUTTER_SPEEDS[currentIndex - 1]);
    }
  };

  return (
    <CameraControl
      label="Shutter"
      value={cameraSettings.shutter}
      onIncrement={increment}
      onDecrement={decrement}
      canIncrement={currentIndex < SHUTTER_SPEEDS.length - 1}
      canDecrement={currentIndex > 0}
      showPicker={showPicker}
      setShowPicker={setShowPicker}
    >
      <ValuePicker
        values={SHUTTER_SPEEDS}
        currentValue={cameraSettings.shutter}
        onSelect={(val) => {
          updateCameraSetting('shutter', val);
          setShowPicker(false);
        }}
      />
    </CameraControl>
  );
}

function WhiteBalanceControl() {
  const { cameraSettings, updateCameraSetting } = useApp();
  const [showPicker, setShowPicker] = useState(false);

  const currentMode = WHITE_BALANCE_MODES.find(m => m.id === cameraSettings.whiteBalance);

  const increment = () => {
    const currentIndex = WHITE_BALANCE_MODES.findIndex(m => m.id === cameraSettings.whiteBalance);
    if (currentIndex < WHITE_BALANCE_MODES.length - 1) {
      updateCameraSetting('whiteBalance', WHITE_BALANCE_MODES[currentIndex + 1].id);
    }
  };

  const decrement = () => {
    const currentIndex = WHITE_BALANCE_MODES.findIndex(m => m.id === cameraSettings.whiteBalance);
    if (currentIndex > 0) {
      updateCameraSetting('whiteBalance', WHITE_BALANCE_MODES[currentIndex - 1].id);
    }
  };

  const currentIndex = WHITE_BALANCE_MODES.findIndex(m => m.id === cameraSettings.whiteBalance);

  return (
    <CameraControl
      label="WB"
      value={currentMode?.name || 'AWB'}
      onIncrement={increment}
      onDecrement={decrement}
      canIncrement={currentIndex < WHITE_BALANCE_MODES.length - 1}
      canDecrement={currentIndex > 0}
      showPicker={showPicker}
      setShowPicker={setShowPicker}
    >
      <div className="space-y-1">
        {WHITE_BALANCE_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              updateCameraSetting('whiteBalance', mode.id);
              setShowPicker(false);
            }}
            className={cn(
              'w-full rounded px-3 py-2 text-left text-sm transition-colors',
              mode.id === cameraSettings.whiteBalance
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            )}
          >
            <div className="flex items-center justify-between">
              <span>{mode.name}</span>
              <span className="text-xs text-white/40">{mode.temp}</span>
            </div>
          </button>
        ))}
      </div>
    </CameraControl>
  );
}

function CameraControl({
  label,
  value,
  onIncrement,
  onDecrement,
  canIncrement,
  canDecrement,
  showPicker,
  setShowPicker,
  children
}) {
  return (
    <div className="relative">
      {/* Picker popup */}
      <AnimatePresence>
        {showPicker && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-50"
              onClick={() => setShowPicker(false)}
            />

            {/* Picker */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full mb-2 z-50 max-h-64 overflow-y-auto rounded-lg border border-white/20 bg-black/90 p-2 backdrop-blur-xl"
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Control */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onIncrement}
          disabled={!canIncrement}
          className={cn(
            'transition-colors',
            canIncrement ? 'text-white/60 hover:text-white' : 'text-white/20'
          )}
        >
          <ChevronUpIcon className="h-3 w-3" />
        </button>

        <button
          onClick={() => setShowPicker(!showPicker)}
          className="group min-w-[80px] rounded border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur-sm transition-all hover:bg-white/10"
        >
          <div className="text-[10px] font-medium uppercase text-white/40">
            {label}
          </div>
          <div className="text-sm font-semibold text-white">
            {value}
          </div>
        </button>

        <button
          onClick={onDecrement}
          disabled={!canDecrement}
          className={cn(
            'transition-colors',
            canDecrement ? 'text-white/60 hover:text-white' : 'text-white/20'
          )}
        >
          <ChevronDownIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function ValuePicker({ values, currentValue, onSelect }) {
  return (
    <div className="min-w-[100px] space-y-1">
      {values.map((value) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={cn(
            'w-full rounded px-3 py-2 text-sm transition-colors',
            value === currentValue
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          )}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
