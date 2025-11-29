import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  BookOpenIcon,
  FilmIcon,
  CameraIcon,
  SparklesIcon,
  VideoCameraIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import { PAGES, PAGE_TITLES } from '@/lib/constants/pages';
import { TITLE_POOL, INITIAL_TITLES } from '@/lib/constants/titles';
import { cn, getRandomItem } from '@/lib/utils/helpers';

export default function Header() {
  const { currentPage, navigateToPage } = useApp();
  const [subtitles, setSubtitles] = useState(INITIAL_TITLES);
  const [intervalId, setIntervalId] = useState(null);

  // Function to change a subtitle at a specific slot or random slot
  const changeSubtitle = (slotIndex = null) => {
    setSubtitles(prev => {
      const newSubtitles = [...prev];
      const targetSlot = slotIndex !== null ? slotIndex : Math.floor(Math.random() * 3);

      // Get a new title that's different from ALL current titles (no repeats across any slots)
      let newTitle;
      let attempts = 0;
      do {
        newTitle = getRandomItem(TITLE_POOL);
        attempts++;
      } while (newSubtitles.includes(newTitle) && attempts < 50);

      // Only update if we found a unique title
      if (!newSubtitles.includes(newTitle)) {
        newSubtitles[targetSlot] = newTitle;
      }

      return newSubtitles;
    });
  };

  // Handle subtitle click - change immediately and restart timer
  const handleSubtitleClick = (index) => {
    // Clear existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Change the clicked subtitle
    changeSubtitle(index);

    // Restart the interval
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

  const pageIcons = {
    [PAGES.HOME]: HomeIcon,
    [PAGES.LOREMAKER]: BookOpenIcon,
    [PAGES.FILMS]: FilmIcon,
    [PAGES.PHOTOGRAPHY]: CameraIcon,
    [PAGES.AI_ALBUMS]: SparklesIcon,
    [PAGES.VIDEO_EDITS]: VideoCameraIcon,
    [PAGES.LINKS]: LinkIcon
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Title and Subtitle */}
          <div className="flex-1">
            <button
              onClick={() => navigateToPage(PAGES.HOME)}
              className="group text-left transition-opacity hover:opacity-80"
            >
              <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                Menelek Makonnen
              </h1>

              {/* Rotating subtitles - clickable to change */}
              <div className="mt-1 flex gap-2 text-xs text-white/60 md:text-sm">
                {subtitles.map((title, index) => (
                  <button
                    key={`slot-${index}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubtitleClick(index);
                    }}
                    className="relative min-w-[100px] cursor-pointer transition-colors hover:text-white/80"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-0 whitespace-nowrap"
                      >
                        {title}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                ))}
              </div>
            </button>
          </div>

          {/* Navigation Icons */}
          <nav className="flex items-center gap-2 md:gap-4">
            {Object.entries(pageIcons).map(([page, Icon]) => (
              <NavIcon
                key={page}
                page={page}
                Icon={Icon}
                isActive={currentPage === page}
                onClick={() => navigateToPage(page)}
                label={PAGE_TITLES[page]}
              />
            ))}
          </nav>

          {/* Premium Brand Icon (animated) */}
          <PremiumNavIcon />
        </div>
      </div>
    </header>
  );
}

function NavIcon({ page, Icon, isActive, onClick, label }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={cn(
          'group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300',
          isActive
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:bg-white/10 hover:text-white'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={label}
      >
        <Icon className="h-5 w-5" />

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 rounded-lg border-2 border-white/30"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs text-white backdrop-blur-sm"
          >
            {label}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-black/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PremiumNavIcon() {
  return (
    <div className="ml-4 hidden md:block">
      <motion.div
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 backdrop-blur-sm"
        animate={{
          background: [
            'linear-gradient(to bottom right, rgba(59,130,246,0.2), rgba(34,197,94,0.2))',
            'linear-gradient(to bottom right, rgba(34,197,94,0.2), rgba(59,130,246,0.2))',
            'linear-gradient(to bottom right, rgba(59,130,246,0.2), rgba(34,197,94,0.2))'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.svg
          className="h-5 w-5 text-white/60"
          fill="currentColor"
          viewBox="0 0 24 24"
          animate={{
            rotateY: [0, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </motion.svg>
      </motion.div>
    </div>
  );
}
