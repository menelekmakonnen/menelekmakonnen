import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  BookOpenIcon,
  FilmIcon,
  CameraIcon,
  SparklesIcon,
  VideoCameraIcon,
  LinkIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import { PAGES, PAGE_TITLES } from '@/lib/constants/pages';
import { cn } from '@/lib/utils/helpers';

export default function Header() {
  const { currentPage, navigateToPage } = useApp();

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
          {/* Title */}
          <div className="flex-1">
            <button
              onClick={() => navigateToPage(PAGES.HOME)}
              className="group text-left transition-opacity hover:opacity-80"
            >
              <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                Menelek Makonnen
              </h1>
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
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 via-cyan-400/10 to-emerald-400/30 backdrop-blur-sm"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 shadow-inner"
          animate={{ rotateZ: [-12, 12, -12] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <GlobeAltIcon className="h-5 w-5 text-white/70" />
        </motion.div>
      </motion.div>
    </div>
  );
}
