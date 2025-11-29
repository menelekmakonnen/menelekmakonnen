import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function KeyboardHandler() {
  const {
    navigateToPreviousPage,
    navigateToNextPage,
    handleEscapeKey,
    setShowShortcutsHelp,
    isPoweredOn
  } = useApp();

  useEffect(() => {
    if (!isPoweredOn) return;

    const handleKeyDown = (e) => {
      // Ignore if typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        // Page navigation (left/right arrows or A/D)
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          navigateToPreviousPage();
          break;

        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          navigateToNextPage();
          break;

        // ESC key cascade
        case 'Escape':
          e.preventDefault();
          handleEscapeKey();
          break;

        // Help overlay (? or H)
        case '?':
        case 'h':
        case 'H':
          e.preventDefault();
          setShowShortcutsHelp(prev => !prev);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPoweredOn,
    navigateToPreviousPage,
    navigateToNextPage,
    handleEscapeKey,
    setShowShortcutsHelp
  ]);

  return null;
}
