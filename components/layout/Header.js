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
  const { currentPage, navigateToPage, easterEggActive, setEasterEggActive } = useApp();
  const currentTitle = PAGE_TITLES[currentPage];

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
      <div className="relative mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-3 items-center">
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

          {/* Title */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigateToPage(PAGES.HOME)}
              className="group text-center transition-opacity hover:opacity-80"
            >
              <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                Menelek Makonnen
              </h1>
            </button>
          </div>

          {/* Premium Brand Icon (animated) */}
          <PremiumNavIcon
            easterEggActive={easterEggActive}
            onToggle={() => setEasterEggActive(prev => !prev)}
          />
        </div>

        <motion.button
          onClick={() => navigateToPage(currentPage)}
          className="pointer-events-auto absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentTitle}
        </motion.button>
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

function PremiumNavIcon({ easterEggActive, onToggle }) {
  return (
    <div className="ml-4 hidden justify-end md:flex">
      <motion.div
        onClick={onToggle}
        className={cn(
          'group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 via-cyan-400/10 to-emerald-400/30 backdrop-blur-sm transition-colors',
          easterEggActive ? 'ring-2 ring-cyan-400/50' : ''
        )}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        animate={{ scale: [1, easterEggActive ? 1.07 : 1.03, 1], rotateZ: [0, 6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 shadow-inner"
          animate={{ rotateZ: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        >
          <GlobeAltIcon className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
        </motion.div>
      </motion.div>
    </div>
  );
}
