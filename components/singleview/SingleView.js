import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils/helpers';
import { getDriveImageUrl } from '@/lib/data/googleDrive';
import SlideshowView from './SlideshowView';

export default function SingleView({ item, items, albums = [], currentAlbumId, onClose }) {
  const {
    updateCameraSetting,
    hudMode,
    setHudMode,
    isSingleViewExpanded,
    setIsSingleViewExpanded,
    isSlideshowActive,
    setIsSlideshowActive
  } = useApp();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(
    items.findIndex(i => i.id === item.id)
  );
  const [currentItems, setCurrentItems] = useState(items);
  const [selectedAlbumId, setSelectedAlbumId] = useState(currentAlbumId);
  const [slideshowInterval, setSlideshowInterval] = useState(3000);
  const [isSwitchingAlbum, setIsSwitchingAlbum] = useState(false);

  const currentItem = currentItems[currentIndex] || item;

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : currentItems.length - 1));
  }, [currentItems.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < currentItems.length - 1 ? prev + 1 : 0));
  }, [currentItems.length]);

  const handlePreviousAlbum = useCallback(() => {
    if (albums.length === 0) return;
    const currentAlbumIndex = albums.findIndex(a => a.id === selectedAlbumId);
    const prevIndex = currentAlbumIndex > 0 ? currentAlbumIndex - 1 : albums.length - 1;
    setSelectedAlbumId(albums[prevIndex].id);
  }, [albums, selectedAlbumId]);

  const handleNextAlbum = useCallback(() => {
    if (albums.length === 0) return;
    const currentAlbumIndex = albums.findIndex(a => a.id === selectedAlbumId);
    const nextIndex = currentAlbumIndex < albums.length - 1 ? currentAlbumIndex + 1 : 0;
    setSelectedAlbumId(albums[nextIndex].id);
  }, [albums, selectedAlbumId]);

  // Slideshow timer
  useEffect(() => {
    if (!isSlideshowActive) return;

    const timer = setInterval(() => {
      handleNext();
    }, slideshowInterval);

    return () => clearInterval(timer);
  }, [isSlideshowActive, slideshowInterval, currentIndex, handleNext]);

  // Keyboard navigation (W/S for items, A/D for albums)
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handlePrevious();
          break;

        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleNext();
          break;

        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handlePreviousAlbum();
          break;

        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleNextAlbum();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, selectedAlbumId, albums, handleNext, handleNextAlbum, handlePrevious, handlePreviousAlbum]);

  // Handle Album Change
  useEffect(() => {
    if (selectedAlbumId === currentAlbumId) {
      setCurrentItems(items);
      return;
    }

    async function loadNewAlbum() {
      setIsSwitchingAlbum(true);
      try {
        const res = await fetch(`/api/album/${selectedAlbumId}`);
        if (!res.ok) throw new Error('Failed to fetch album');
        const data = await res.json();
        setCurrentItems(data.images);
        setCurrentIndex(0);
      } catch (err) {
        console.error('Error switching album:', err);
      } finally {
        setIsSwitchingAlbum(false);
      }
    }

    loadNewAlbum();
  }, [selectedAlbumId, currentAlbumId, items]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
    >
      {/* Top controls bar */}
      <div className="absolute top-0 left-0 right-0 z-60 flex items-center justify-between border-b border-white/10 bg-black/50 p-4 backdrop-blur-xl">
        {/* Left controls */}
        <div className="flex items-center gap-2">
          <IconButton
            icon={isSlideshowActive ? PauseIcon : PlayIcon}
            onClick={() => setIsSlideshowActive(!isSlideshowActive)}
            active={isSlideshowActive}
          />
          <IconButton
            icon={isSingleViewExpanded ? ArrowsPointingInIcon : ArrowsPointingOutIcon}
            onClick={() => setIsSingleViewExpanded(!isSingleViewExpanded)}
            active={isSingleViewExpanded}
          />
        </div>

        {/* Close button */}
        <IconButton
          icon={XMarkIcon}
          onClick={onClose}
        />
      </div>

      {/* Main layout */}
      <div className={cn(
        'flex h-full',
        isSingleViewExpanded ? 'flex-col pt-16' : 'flex-row pt-16'
      )}>
        {/* Main display area */}
        <div className={cn(
          'flex items-center justify-center',
          isSingleViewExpanded ? 'flex-1 p-0' : 'flex-[3] p-8'
        )}>
          <div className={cn(
            'relative w-full',
            isSingleViewExpanded ? 'h-full' : 'max-w-5xl'
          )}>
            <MainDisplay item={currentItem} expanded={isSingleViewExpanded} />

            {/* Navigation arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Right sidebar (thumbnails) */}
        {!isSingleViewExpanded && (
          <Sidebar
            items={currentItems}
            currentIndex={currentIndex}
            onItemClick={setCurrentIndex}
            isLoading={isSwitchingAlbum}
          />
        )}
      </div>

      {/* Bottom album strip */}
      {!isSingleViewExpanded && albums.length > 0 && (
        <AlbumStrip
          albums={albums}
          selectedAlbumId={selectedAlbumId}
          onAlbumClick={setSelectedAlbumId}
        />
      )}
      {/* Slideshow Mode Overlay */}
      <AnimatePresence>
        {isSlideshowActive && (
          <SlideshowView
            item={currentItem}
            items={currentItems}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
            onClose={() => setIsSlideshowActive(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>,
    document.body
  );
}

function MainDisplay({ item, expanded }) {
  // Render different content based on item type
  if (item.youtubeUrl) {
    return <YouTubeEmbed url={item.youtubeUrl} expanded={expanded} />;
  }

  if (item.instagramUrl) {
    return <InstagramEmbed url={item.instagramUrl} embedCode={item.embedCode} expanded={expanded} />;
  }

  const imageUrl = item.coverImage || item.thumbnail || item.url || (item.id && !item.id.includes('-') && getDriveImageUrl(item.id));

  if (imageUrl) {
    return <ImageDisplay src={getImageUrl(imageUrl)} alt={item.title || item.name || item.character} expanded={expanded} />;
  }

  return (
    <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-12 text-white/60">
      No preview available
    </div>
  );
}

function YouTubeEmbed({ url, expanded }) {
  const getVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);

  return (
    <div className={cn(
      'relative aspect-video w-full overflow-hidden',
      expanded ? 'h-full' : 'rounded-lg'
    )}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function InstagramEmbed({ url, embedCode, expanded }) {
  return (
    <div className={cn(
      'relative aspect-[9/16] w-full overflow-hidden',
      expanded ? 'h-full max-w-none' : 'max-w-md rounded-lg'
    )}>
      <iframe
        src={`https://www.instagram.com/p/${embedCode}/embed`}
        className="h-full w-full"
        frameBorder="0"
        scrolling="no"
        allowTransparency="true"
        allow="encrypted-media"
      />
    </div>
  );
}

function ImageDisplay({ src, alt, expanded }) {
  const [zoom, setZoom] = useState(1);

  const handleWheel = (e) => {
    if (!expanded) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const resetZoom = () => setZoom(1);

  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden',
        expanded ? 'p-0' : 'p-4'
      )}
      onWheel={handleWheel}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'max-h-full max-w-full object-contain transition-transform duration-200',
          expanded ? '' : 'rounded-lg shadow-2xl'
        )}
        style={{
          transform: expanded ? `scale(${zoom})` : 'none'
        }}
        referrerPolicy="no-referrer"
      />

      {/* Zoom reset button */}
      {expanded && zoom !== 1 && (
        <button
          onClick={resetZoom}
          className="absolute top-4 right-4 rounded-full border border-white/20 bg-black/50 p-2 text-xs text-white backdrop-blur-sm transition-all hover:bg-white/10"
        >
          Reset Zoom
        </button>
      )}
    </div>
  );
}


function Sidebar({ items, currentIndex, onItemClick, isLoading }) {
  const scrollRef = useRef(null);
  const [sortMode, setSortMode] = useState('original');
  const [sortedItems, setSortedItems] = useState(items);

  // Update sorted items when items or sort mode changes
  useEffect(() => {
    let newItems = [...items];
    switch (sortMode) {
      case 'az':
        newItems.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
        break;
      case 'za':
        newItems.sort((a, b) => (b.title || b.name || '').localeCompare(a.title || a.name || ''));
        break;
      case 'random':
        newItems = [...items].sort(() => Math.random() - 0.5);
        break;
      default:
        newItems = items;
    }
    setSortedItems(newItems);
  }, [items, sortMode]);

  // Find the index of the current item in the SORTED list to highlight correctly
  const currentItem = items[currentIndex];
  // Calculate sorted index for highlighting
  const sortedCurrentIndex = currentItem ? sortedItems.findIndex(i => i.id === currentItem.id) : -1;

  // Auto-center current item
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeItem = scrollRef.current.children[sortedCurrentIndex];
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [sortedCurrentIndex]);

  return (
    <div className="flex-1 max-w-[300px] overflow-hidden border-l border-white/10 bg-black/30 backdrop-blur-md flex flex-col">
      {/* Sidebar Header with Sort */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Roster</h3>

        {/* Sort Dropdown (Simple) */}
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value)}
          className="bg-black/20 border border-white/10 text-white/60 text-[10px] uppercase rounded px-2 py-1 outline-none hover:border-white/30"
        >
          <option value="original">Default</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
          <option value="random">Random</option>
        </select>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3"
      >
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : (
          sortedItems.map((item, index) => {
            // We need to find the ORIGINAL index to pass back to onItemClick
            const originalIndex = items.findIndex(original => original.id === item.id);
            return (
              <SidebarItem
                key={item.id || index}
                item={item}
                isActive={originalIndex === currentIndex}
                onClick={() => onItemClick(originalIndex)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function SidebarItem({ item, isActive, onClick }) {
  const getThumbnail = () => {
    if (item.thumbnail) return getImageUrl(item.thumbnail);
    if (item.coverImage) return getImageUrl(item.coverImage);
    if (item.url) return getImageUrl(item.url);
    if (item.id && !item.id.includes('-') && item.id.length > 20) return getImageUrl(item.id);

    if (item.youtubeUrl) {
      const videoId = item.youtubeUrl.split('v=')[1] || item.youtubeUrl.split('/').pop();
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return null;
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'flex w-full gap-3 rounded-lg border p-2 text-left transition-all',
        isActive
          ? 'border-white/40 bg-white/20'
          : 'border-white/10 bg-white/5 hover:bg-white/10'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Thumbnail */}
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-white/5">
        {getThumbnail() && (
          <img
            src={getThumbnail()}
            alt={item.title || item.name || item.character}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium text-white">
          {item.title || item.name || item.character}
        </p>
        {item.description && (
          <p className="truncate text-xs text-white/60">
            {item.description}
          </p>
        )}
      </div>
    </motion.button>
  );
}

function AlbumStrip({ albums, selectedAlbumId, onAlbumClick }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="flex gap-2 overflow-x-auto p-4 custom-scrollbar">
        {albums.map(album => (
          <motion.button
            key={album.id}
            onClick={() => onAlbumClick(album.id)}
            className={cn(
              'flex-shrink-0 rounded-lg border px-4 py-2 transition-all',
              selectedAlbumId === album.id
                ? 'border-white/40 bg-white/20 text-white'
                : 'border-white/20 bg-white/5 text-white/60 hover:bg-white/10'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="whitespace-nowrap text-sm font-medium">
              {album.title || album.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, onClick, active = false }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-lg border p-2 text-white backdrop-blur-sm transition-all',
        active
          ? 'border-white/40 bg-white/20'
          : 'border-white/20 bg-black/50 hover:bg-white/10'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
}

// Helper
function getImageUrl(url) {
  if (!url) return null;
  if (url.includes('drive.google.com') || (!url.includes('http') && url.length > 20)) {
    return getDriveImageUrl(url);
  }
  return url;
}
