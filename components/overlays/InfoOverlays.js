import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import { PAGE_DISPLAY_NAMES, PAGES } from '@/lib/constants/pages';
import { getGreeting } from '@/lib/constants/greetings';
import { formatStorage } from '@/lib/utils/helpers';
import { FILMS, MUSIC_VIDEOS } from '@/lib/data/films';
import { VIDEO_EDIT_ALBUMS } from '@/lib/data/videoEdits';
import { ALL_LINKS } from '@/lib/data/links';

// Calculate total file count based on current page
function getFileCount(currentPage) {
  switch (currentPage) {
    case PAGES.FILMS:
      return FILMS.length + MUSIC_VIDEOS.length;
    case PAGES.VIDEO_EDITS:
      return Object.values(VIDEO_EDIT_ALBUMS).reduce((total, album) => total + album.items.length, 0);
    case PAGES.LINKS:
      return ALL_LINKS.length;
    case PAGES.LOREMAKER:
      // Loremaker loads dynamically, so we show a placeholder
      return '~200+';
    case PAGES.PHOTOGRAPHY:
    case PAGES.AI_ALBUMS:
      // These will be loaded from Google Drive in the future
      return 'TBD';
    default:
      return 0;
  }
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
  const fileCount = getFileCount(currentPage);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 left-4 z-30 space-y-1 font-mono text-xs text-white/60"
    >
      <div className="rounded border border-white/10 bg-black/30 px-2 py-1 backdrop-blur-sm">
        {PAGE_DISPLAY_NAMES[currentPage] || 'UNKNOWN'}
      </div>
      {fileCount !== 0 && (
        <div className="text-[10px] text-white/40">
          FILES: {fileCount}
        </div>
      )}
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
