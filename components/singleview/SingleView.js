import { useState, useEffect, useCallback } from 'react';
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

export default function SingleView({ item, items, albums = [], currentAlbumId, onClose }) {
  const {
    isSingleViewExpanded,
    setIsSingleViewExpanded,
    isSlideshowActive,
    setIsSlideshowActive
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(
    items.findIndex(i => i.id === item.id)
  );
  const [selectedAlbumId, setSelectedAlbumId] = useState(currentAlbumId);
  const [slideshowInterval, setSlideshowInterval] = useState(3000);

  const currentItem = items[currentIndex];

  // Slideshow timer
  useEffect(() => {
    if (!isSlideshowActive) return;

    const timer = setInterval(() => {
      handleNext();
    }, slideshowInterval);

    return () => clearInterval(timer);
  }, [isSlideshowActive, slideshowInterval, currentIndex]);

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
  }, [currentIndex, selectedAlbumId, albums]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < items.length - 1 ? prev + 1 : 0));
  }, [items.length]);

  const handlePreviousAlbum = useCallback(() => {
    if (albums.length === 0) return;
    const currentAlbumIndex = albums.findIndex(a => a.id === selectedAlbumId);
    const prevIndex = currentAlbumIndex > 0 ? currentAlbumIndex - 1 : albums.length - 1;
    setSelectedAlbumId(albums[prevIndex].id);
    setCurrentIndex(0); // Go to first item of new album
  }, [albums, selectedAlbumId]);

  const handleNextAlbum = useCallback(() => {
    if (albums.length === 0) return;
    const currentAlbumIndex = albums.findIndex(a => a.id === selectedAlbumId);
    const nextIndex = currentAlbumIndex < albums.length - 1 ? currentAlbumIndex + 1 : 0;
    setSelectedAlbumId(albums[nextIndex].id);
    setCurrentIndex(0);
  }, [albums, selectedAlbumId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 rounded-full border border-white/20 bg-black/50 p-2 text-white transition-all hover:bg-white/10"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>

      {/* Main layout */}
      <div className={cn(
        'flex h-full',
        isSingleViewExpanded ? 'flex-col' : 'flex-row'
      )}>
        {/* Main display area */}
        <div className={cn(
          'flex items-center justify-center p-8',
          isSingleViewExpanded ? 'flex-1' : 'flex-[3]'
        )}>
          <div className="relative w-full max-w-5xl">
            <MainDisplay item={currentItem} />

            {/* Controls overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <ControlButton
                icon={isSlideshowActive ? PauseIcon : PlayIcon}
                label={isSlideshowActive ? 'Pause' : 'Slideshow'}
                onClick={() => setIsSlideshowActive(!isSlideshowActive)}
              />
              <ControlButton
                icon={isSingleViewExpanded ? ArrowsPointingInIcon : ArrowsPointingOutIcon}
                label={isSingleViewExpanded ? 'Collapse' : 'Expand'}
                onClick={() => setIsSingleViewExpanded(!isSingleViewExpanded)}
              />
            </div>

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
            items={items}
            currentIndex={currentIndex}
            onItemClick={setCurrentIndex}
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
    </motion.div>
  );
}

function MainDisplay({ item }) {
  // Render different content based on item type
  if (item.youtubeUrl) {
    return <YouTubeEmbed url={item.youtubeUrl} />;
  }

  if (item.instagramUrl) {
    return <InstagramEmbed url={item.instagramUrl} embedCode={item.embedCode} />;
  }

  if (item.coverImage || item.thumbnail) {
    return <ImageDisplay src={item.coverImage || item.thumbnail} alt={item.title || item.name || item.character} />;
  }

  return (
    <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-12 text-white/60">
      No preview available
    </div>
  );
}

function YouTubeEmbed({ url }) {
  const getVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function InstagramEmbed({ url, embedCode }) {
  return (
    <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg">
      <iframe
        src={`https://www.instagram.com/p/${embedCode}/embed`}
        className="h-full w-full"
        frameBorder="0"
        scrolling="no"
        allowTransparency="true"
      />
    </div>
  );
}

function ImageDisplay({ src, alt }) {
  return (
    <div className="relative w-full">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg object-contain"
        style={{ maxHeight: '70vh' }}
      />
    </div>
  );
}

function Sidebar({ items, currentIndex, onItemClick }) {
  return (
    <div className="flex-1 overflow-y-auto border-l border-white/10 bg-black/30 p-4 custom-scrollbar">
      <div className="space-y-2">
        {items.map((item, index) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={index === currentIndex}
            onClick={() => onItemClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({ item, isActive, onClick }) {
  const getThumbnail = () => {
    if (item.thumbnail) return item.thumbnail;
    if (item.coverImage) return item.coverImage;
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

function ControlButton({ icon: Icon, label, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/50 px-3 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/10"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm">{label}</span>
    </motion.button>
  );
}
