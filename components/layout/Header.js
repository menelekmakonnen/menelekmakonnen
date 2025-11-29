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

  // Rotate subtitles every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitles(prev => {
        const newSubtitles = [...prev];
        // Pick a random slot (0, 1, or 2)
        const slotToChange = Math.floor(Math.random() * 3);

        // Get a new title that's different from the current one in that slot
        let newTitle;
        do {
          newTitle = getRandomItem(TITLE_POOL);
        } while (newTitle === prev[slotToChange]);

        newSubtitles[slotToChange] = newTitle;
        return newSubtitles;
      });
    }, 2500);

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

              {/* Rotating subtitles */}
              <div className="mt-1 flex gap-2 text-xs text-white/60 md:text-sm">
                {subtitles.map((title, index) => (
                  <div key={`slot-${index}`} className="relative min-w-[100px]">
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
                  </div>
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
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"
        animate={{
          background: [
            'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            'linear-gradient(to bottom right, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
            'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="h-4 w-4 rounded-sm border-2 border-white/40"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
}
