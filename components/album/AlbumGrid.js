import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils/helpers';
import { LENS_MODES } from '@/lib/constants/camera';
import CachedImage from '../common/CachedImage';

export default function AlbumGrid({ albums, onAlbumClick, isLoading = false, variant = 'square' }) {
  const { cameraSettings } = useApp();
  const lensMode = cameraSettings.lensMode || LENS_MODES.STANDARD;

  // Determine grid columns based on lens mode
  const getGridColumns = () => {
    switch (lensMode) {
      case LENS_MODES.WIDE:
        return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'; // More items (24mm)
      case LENS_MODES.TELEPHOTO:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'; // Fewer items (85mm)
      case LENS_MODES.MACRO:
        return 'grid-cols-1 md:grid-cols-2'; // Very few items (Macro)
      case LENS_MODES.STANDARD:
      default:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'; // Standard (50mm)
    }
  };


  const aspectRatio = variant === 'vertical' ? 'aspect-[3/4]' : variant === 'horizontal' ? 'aspect-video' : 'aspect-square';

  if (isLoading) {
    return (
      <div className={cn('grid gap-4', getGridColumns())}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={cn(aspectRatio, "w-full overflow-hidden rounded-lg bg-white/10 relative")}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4', getGridColumns())}>
      {albums.map((album, index) => (
        <AlbumCard
          key={album.id}
          album={album}
          index={index}
          onClick={() => onAlbumClick(album)}
          aspectRatio={aspectRatio}
        />
      ))}
    </div>
  );
}


function AlbumCard({ album, index, onClick, aspectRatio }) {
  // 1. Initialize with the passed thumbnail (which is already the daily cover)
  const [currentThumb, setCurrentThumb] = useState(album.thumbnail);

  useEffect(() => {
    setCurrentThumb(album.thumbnail);
  }, [album.thumbnail]);

  const handleMouseEnter = () => {
    // If we have items/images, pick a random one
    const subItems = album.images || album.items || [];
    if (subItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * subItems.length);
      const randomItem = subItems[randomIndex];

      // Resolve URL (naive local helper or robust one needed)
      // Since we don't have getImageUrl imported here, we'll import it or genericise
      // Assuming subItems have .url or .thumbnail property or are strings
      let url = null;
      if (typeof randomItem === 'string') url = randomItem;
      else url = randomItem.url || randomItem.thumbnail || randomItem.coverImage || randomItem.id;

      // Quick fix for drive URLs if raw ID
      if (url && !url.includes('http') && url.length > 20) {
        url = `https://drive.google.com/uc?export=view&id=${url}`; // Basic resolution
      }

      if (url) setCurrentThumb(url);
    }
  };

  const handleMouseLeave = () => {
    setCurrentThumb(album.thumbnail);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10",
        aspectRatio
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Thumbnail */}
      {currentThumb && (
        <div className="absolute inset-0">
          <CachedImage
            src={currentThumb}
            alt={album.title || album.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Fallback for broken thumbnails
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-purple-900/20', 'via-pink-900/20', 'to-orange-900/20');

              // Add icon
              const icon = document.createElement('div');
              icon.innerHTML = '<svg class="h-8 w-8 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>';
              e.target.parentElement.appendChild(icon);
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end p-4">
        <h3 className="text-left text-lg font-bold text-white">
          {album.title || album.name}
        </h3>

        {album.description && (
          <p className="mt-1 text-left text-sm text-white/60 line-clamp-2">
            {album.description}
          </p>
        )}

        {/* Item count */}
        {album.items && (
          <div className="mt-2 text-left text-xs text-white/40">
            {album.items.length} {album.items.length === 1 ? 'item' : 'items'}
          </div>
        )}
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
        <div className="rounded-full border-2 border-white p-3">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}
