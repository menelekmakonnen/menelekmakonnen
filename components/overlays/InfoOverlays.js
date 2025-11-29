import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import { PAGE_DISPLAY_NAMES, PAGES } from '@/lib/constants/pages';
import { getGreeting } from '@/lib/constants/greetings';
import { formatStorage, getRandomItem } from '@/lib/utils/helpers';
import { FILMS, MUSIC_VIDEOS } from '@/lib/data/films';
import { VIDEO_EDIT_ALBUMS } from '@/lib/data/videoEdits';
import { ALL_LINKS } from '@/lib/data/links';
import { TITLE_POOL, INITIAL_TITLES } from '@/lib/constants/titles';

// Calculate file counts based on available data
function getPageFileCount(currentPage) {
  switch (currentPage) {
    case PAGES.FILMS:
      return FILMS.length + MUSIC_VIDEOS.length;
    case PAGES.VIDEO_EDITS:
      return Object.values(VIDEO_EDIT_ALBUMS).reduce((total, album) => total + album.items.length, 0);
    case PAGES.LINKS:
      return ALL_LINKS.length;
    default:
      return 0;
  }
}

function getTotalFileCount() {
  const filmsTotal = FILMS.length + MUSIC_VIDEOS.length;
  const videoEditTotal = Object.values(VIDEO_EDIT_ALBUMS).reduce((total, album) => total + album.items.length, 0);
  return filmsTotal + videoEditTotal;
}

export default function InfoOverlays() {
  const { showInfoOverlays, currentPage } = useApp();

  if (!showInfoOverlays) return null;

  return (
    <>
      <TopLeftInfo currentPage={currentPage} />
      <TopRightInfo />
    </>
  );
}

function TopLeftInfo({ currentPage }) {
  const fileCount = getPageFileCount(currentPage);
  const totalCount = getTotalFileCount();
  const [subtitles, setSubtitles] = useState(INITIAL_TITLES);
  const [intervalId, setIntervalId] = useState(null);

  // Function to change a subtitle at a specific slot or random slot
  const changeSubtitle = (slotIndex = null) => {
    setSubtitles(prev => {
      const newSubtitles = [...prev];
      const targetSlot = slotIndex !== null ? slotIndex : Math.floor(Math.random() * 3);

      // Get a new title that's different from ALL current titles
      let newTitle;
      let attempts = 0;
      do {
        newTitle = getRandomItem(TITLE_POOL);
        attempts++;
      } while (newSubtitles.includes(newTitle) && attempts < 50);

      if (!newSubtitles.includes(newTitle)) {
        newSubtitles[targetSlot] = newTitle;
      }

      return newSubtitles;
    });
  };

  // Handle subtitle click - change immediately and restart timer
  const handleSubtitleClick = (index) => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    changeSubtitle(index);

    const newInterval = setInterval(() => {
      changeSubtitle();
    }, 2500);

    setIntervalId(newInterval);
  };

  // Rotate subtitles every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      changeSubtitle();
    }, 2500);

    setIntervalId(interval);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 left-4 z-30 space-y-2 font-mono text-xs text-white/80"
    >
      <div className="rounded border border-emerald-400/30 bg-black/60 px-2 py-1 text-emerald-200 backdrop-blur-sm">
        {PAGE_DISPLAY_NAMES[currentPage] || 'UNKNOWN'}
      </div>
      {fileCount !== 0 && (
        <div className="text-[10px] text-emerald-200/80">
          Files here: {fileCount}
        </div>
      )}
      <div className="text-[10px] text-white/50">
        Library ready: {totalCount}
      </div>

      {/* Rotating subtitles - relocated here */}
      <div className="flex flex-col gap-1 mt-2">
        {subtitles.map((title, index) => (
          <button
            key={`slot-${index}`}
            onClick={() => handleSubtitleClick(index)}
            className="relative min-h-[16px] cursor-pointer text-left transition-colors hover:text-white/80"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="text-[10px] text-white/60"
              >
                {title}
              </motion.span>
            </AnimatePresence>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function TopRightInfo() {
  const greeting = getGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 right-4 z-30 space-y-2 text-right font-mono text-xs"
    >
      {/* Greeting */}
      <div className="text-white/60">
        {greeting}
      </div>

      {/* Location */}
      <LocationInfo />

      {/* Storage */}
      <div className="text-white/40">
        {formatStorage(25, 512)}
      </div>
    </motion.div>
  );
}

function LocationInfo() {
  return (
    <div className="flex items-center justify-end gap-1 text-white/40">
      <MapPinIcon className="h-3 w-3" />
      <span>Los Angeles, CA</span>
    </div>
  );
}
