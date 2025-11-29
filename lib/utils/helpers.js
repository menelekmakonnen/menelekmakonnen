import clsx from 'clsx';

// Class name utility
export function cn(...inputs) {
  return clsx(inputs);
}

// Time utilities
export function getCurrentTime() {
  return new Date();
}

export function getCurrentHour() {
  return new Date().getHours();
}

export function getTimeOfDay() {
  const hour = getCurrentHour();

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getThemeForTime() {
  const hour = getCurrentHour();

  // Golden hour (sunrise/sunset)
  if ((hour >= 5 && hour < 7) || (hour >= 17 && hour < 19)) {
    return 'golden-hour';
  }

  // Blue hour
  if ((hour >= 19 && hour < 21) || (hour >= 4 && hour < 5)) {
    return 'blue-hour';
  }

  // Midday
  if (hour >= 10 && hour < 16) {
    return 'midday';
  }

  // Night
  return 'night';
}

// Array utilities
export function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomItems(array, count) {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

// Format utilities
export function formatFileCount(count) {
  if (count >= 10000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export function formatStorage(usedGB, totalGB) {
  return `${totalGB} GB → ${(totalGB - usedGB).toFixed(0)} GB free`;
}

// Debounce utility
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Local storage utilities
export function getLocalStorage(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setLocalStorage(key, value) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
}

// Image histogram calculation (simplified)
export function calculateHistogram(imageElement) {
  // This is a simplified version - in production you'd use canvas to read pixel data
  // For now, return mock data that looks realistic
  const r = Array(256).fill(0).map(() => Math.random() * 100);
  const g = Array(256).fill(0).map(() => Math.random() * 100);
  const b = Array(256).fill(0).map(() => Math.random() * 100);

  return { r, g, b };
}

// Waveform calculation (simplified)
export function calculateWaveform(imageElement) {
  // Simplified - return mock data
  const width = 256;
  const data = Array(width).fill(0).map(() => ({
    y: Math.random(),
    r: Math.random(),
    g: Math.random(),
    b: Math.random()
  }));

  return data;
}

// Keyboard event helpers
export function isNavigationKey(event) {
  const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's', 'A', 'D', 'W', 'S'];
  return navKeys.includes(event.key);
}

export function isEscapeKey(event) {
  return event.key === 'Escape';
}

// Animation timing
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}
