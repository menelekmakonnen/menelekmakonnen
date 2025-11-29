import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PAGES, PAGE_ORDER } from '@/lib/constants/pages';
import { DEFAULT_CAMERA_SETTINGS, HUD_MODES } from '@/lib/constants/camera';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Power state
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  // Navigation state
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);
  const [previousPage, setPreviousPage] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [singleViewItem, setSingleViewItem] = useState(null);
  const [isSingleViewExpanded, setIsSingleViewExpanded] = useState(false);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  // HUD state
  const [hudMode, setHudMode] = useState(HUD_MODES.FULL);
  const [cameraSettings, setCameraSettings] = useState(DEFAULT_CAMERA_SETTINGS);
  const [cameraHistory, setCameraHistory] = useState([]);
  const [showHistogram, setShowHistogram] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const [showInfoOverlays, setShowInfoOverlays] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showFocusPeaking, setShowFocusPeaking] = useState(false);
  const [showZebra, setShowZebra] = useState(false);

  // Battery state (time-based)
  const [batteryLevel, setBatteryLevel] = useState(100);

  // UI state
  const [showPowerOffConfirm, setShowPowerOffConfirm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [autofocusTrigger, setAutofocusTrigger] = useState(0);

  // Calculate battery level based on time
  useEffect(() => {
    const updateBattery = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const maxMinutes = 24 * 60 - 1; // 23:59
      const level = Math.max(0, 100 - (totalMinutes / maxMinutes) * 100);
      setBatteryLevel(level);

      // Auto power-off at 23:59
      if (hours === 23 && minutes === 59 && isPoweredOn) {
        handlePowerOff();
      }
    };

    updateBattery();
    const interval = setInterval(updateBattery, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isPoweredOn]);

  // Power on handler
  const handlePowerOn = useCallback(async () => {
    setIsBooting(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Boot animation duration
    setIsPoweredOn(true);
    setIsBooting(false);
    setCurrentPage(PAGES.HOME);

    // Check if first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowTutorial(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  // Power off handler
  const handlePowerOff = useCallback(async () => {
    setIsShuttingDown(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Shutdown animation duration
    setIsPoweredOn(false);
    setIsShuttingDown(false);
    setShowPowerOffConfirm(false);

    // Reset states
    setCurrentPage(PAGES.HOME);
    setCurrentAlbum(null);
    setSingleViewItem(null);
    setIsSingleViewExpanded(false);
    setIsSlideshowActive(false);
  }, []);

  // Navigation helpers
  const navigateToPage = useCallback((page) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
    setCurrentAlbum(null);
    setSingleViewItem(null);
    setAutofocusTrigger(prev => prev + 1); // Trigger autofocus animation
  }, [currentPage]);

  const navigateToPreviousPage = useCallback(() => {
    const currentIndex = PAGE_ORDER.indexOf(currentPage);
    const prevIndex = (currentIndex - 1 + PAGE_ORDER.length) % PAGE_ORDER.length;
    navigateToPage(PAGE_ORDER[prevIndex]);
  }, [currentPage, navigateToPage]);

  const navigateToNextPage = useCallback(() => {
    const currentIndex = PAGE_ORDER.indexOf(currentPage);
    const nextIndex = (currentIndex + 1) % PAGE_ORDER.length;
    navigateToPage(PAGE_ORDER[nextIndex]);
  }, [currentPage, navigateToPage]);

  // Album navigation
  const openAlbum = useCallback((album) => {
    setCurrentAlbum(album);
    setAutofocusTrigger(prev => prev + 1);
  }, []);

  const closeAlbum = useCallback(() => {
    setCurrentAlbum(null);
  }, []);

  // Single View navigation
  const openSingleView = useCallback((item) => {
    setSingleViewItem(item);
    setHudMode(HUD_MODES.PARTIAL); // Overlay HUD in Single View but allow hiding
    setAutofocusTrigger(prev => prev + 1);
  }, []);

  const closeSingleView = useCallback(() => {
    setSingleViewItem(null);
    setIsSingleViewExpanded(false);
    setIsSlideshowActive(false);
    setHudMode(HUD_MODES.FULL);
  }, []);

  // Camera settings management
  const updateCameraSetting = useCallback((key, value) => {
    setCameraHistory(prev => [...prev, { ...cameraSettings }]);
    setCameraSettings(prev => ({ ...prev, [key]: value }));
  }, [cameraSettings]);

  const undoLastCameraAction = useCallback(() => {
    if (cameraHistory.length > 0) {
      const lastSettings = cameraHistory[cameraHistory.length - 1];
      setCameraSettings(lastSettings);
      setCameraHistory(prev => prev.slice(0, -1));
    }
  }, [cameraHistory]);

  const resetAllCameraSettings = useCallback(() => {
    setCameraSettings(DEFAULT_CAMERA_SETTINGS);
    setCameraHistory([]);
  }, []);

  // ESC key cascade handler
  const handleEscapeKey = useCallback(() => {
    if (isSlideshowActive) {
      setIsSlideshowActive(false);
      return;
    }

    if (singleViewItem) {
      closeSingleView();
      return;
    }

    if (currentAlbum) {
      closeAlbum();
      return;
    }

    if (currentPage !== PAGES.HOME) {
      navigateToPage(PAGES.HOME);
      return;
    }

    if (currentPage === PAGES.HOME && !showPowerOffConfirm) {
      setShowPowerOffConfirm(true);
      return;
    }

    if (showPowerOffConfirm) {
      handlePowerOff();
    }
  }, [
    isSlideshowActive,
    singleViewItem,
    currentAlbum,
    currentPage,
    showPowerOffConfirm,
    closeSingleView,
    closeAlbum,
    navigateToPage,
    handlePowerOff
  ]);

  const value = {
    // Power state
    isPoweredOn,
    isBooting,
    isShuttingDown,
    handlePowerOn,
    handlePowerOff,
    showPowerOffConfirm,
    setShowPowerOffConfirm,

    // Navigation
    currentPage,
    previousPage,
    navigateToPage,
    navigateToPreviousPage,
    navigateToNextPage,

    // Album
    currentAlbum,
    openAlbum,
    closeAlbum,

    // Single View
    singleViewItem,
    openSingleView,
    closeSingleView,
    isSingleViewExpanded,
    setIsSingleViewExpanded,
    isSlideshowActive,
    setIsSlideshowActive,

    // HUD
    hudMode,
    setHudMode,
    cameraSettings,
    updateCameraSetting,
    cameraHistory,
    undoLastCameraAction,
    resetAllCameraSettings,
    showHistogram,
    setShowHistogram,
    showWaveform,
    setShowWaveform,
    showInfoOverlays,
    setShowInfoOverlays,
    showGrid,
    setShowGrid,
    showFocusPeaking,
    setShowFocusPeaking,
    showZebra,
    setShowZebra,

    // Battery
    batteryLevel,

    // UI
    showTutorial,
    setShowTutorial,
    showShortcutsHelp,
    setShowShortcutsHelp,
    autofocusTrigger,

    // Keyboard
    handleEscapeKey
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
