// Camera HUD settings and options
export const ISO_VALUES = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];
export const APERTURE_VALUES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
export const SHUTTER_SPEEDS = [
  '1/8000', '1/4000', '1/2000', '1/1000', '1/500', '1/250', '1/125',
  '1/60', '1/30', '1/15', '1/8', '1/4', '1/2', '1"', '2"', '4"'
];
export const WHITE_BALANCE_MODES = [
  { id: 'auto', name: 'AWB', temp: 'Auto' },
  { id: 'daylight', name: 'Daylight', temp: '5500K' },
  { id: 'cloudy', name: 'Cloudy', temp: '6500K' },
  { id: 'shade', name: 'Shade', temp: '7500K' },
  { id: 'tungsten', name: 'Tungsten', temp: '3200K' },
  { id: 'fluorescent', name: 'Fluorescent', temp: '4000K' },
  { id: 'flash', name: 'Flash', temp: '5500K' }
];

export const GRID_TYPES = [
  { id: 'rule-of-thirds', name: 'Rule of Thirds' },
  { id: 'golden-ratio', name: 'Golden Ratio' },
  { id: 'diagonal', name: 'Diagonal' }
];

export const HUD_MODES = {
  FULL: 'full',
  PARTIAL: 'partial',
  HIDDEN: 'hidden'
};

export const CURSOR_MODES = [
  { id: 'classic', name: 'Classic Reticle' },
  { id: 'modern', name: 'Modern Square' },
  { id: 'cinematic', name: 'Cinematic Cross' }
];

export const LENS_MODES = {
  WIDE: '24mm',
  STANDARD: '50mm',
  TELEPHOTO: '85mm',
  MACRO: 'Macro'
};

export const DEFAULT_CAMERA_SETTINGS = {
  iso: 400,
  aperture: 5.6,
  shutter: '1/250',
  whiteBalance: 'auto',
  histogram: false,
  waveform: false,
  grid: null,
  focusPeaking: false,
  zebra: false,
  liveViewFlicker: false,
  vignette: false,
  cursorMode: 'classic',
  lensMode: LENS_MODES.STANDARD
};
