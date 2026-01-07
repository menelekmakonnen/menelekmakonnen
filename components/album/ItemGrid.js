import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { cn, shuffle } from '@/lib/utils/helpers';
import { LENS_MODES } from '@/lib/constants/camera';
import {
  ArrowsUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const SORT_OPTIONS = {
  RANDOM: 'random',
  AZ: 'a-z',
  ZA: 'z-a'
};

export default function ItemGrid({ items, onItemClick, type = 'vertical', isLoading = false }) {
  const { cameraSettings } = useApp();
  const [sortMode, setSortMode] = useState(SORT_OPTIONS.RANDOM);
  const [sortedItems, setSortedItems] = useState(items);

  const lensMode = cameraSettings.lensMode || LENS_MODES.STANDARD;

  // Determine grid columns based on lens mode and item type
  const getGridColumns = () => {
    if (type === 'horizontal') {
      // For YouTube videos
      switch (lensMode) {
        case LENS_MODES.WIDE:
          return 'grid-cols-2 md:grid-cols-4';
        case LENS_MODES.TELEPHOTO:
          return 'grid-cols-1 md:grid-cols-2';
        case LENS_MODES.MACRO:
          return 'grid-cols-1';
        case LENS_MODES.STANDARD:
        default:
          return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      }
    } else {
      // For photos / Instagram (vertical/square)
      switch (lensMode) {
        case LENS_MODES.WIDE:
          return 'grid-cols-3 md:grid-cols-5 lg:grid-cols-6';
        case LENS_MODES.TELEPHOTO:
          return 'grid-cols-2 md:grid-cols-3';
        case LENS_MODES.MACRO:
          return 'grid-cols-1 md:grid-cols-2';
        case LENS_MODES.STANDARD:
        default:
          return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      }
    }
  };

  const handleSort = (mode) => {
    let sorted = [...items];

    switch (mode) {
      case SORT_OPTIONS.AZ:
        sorted.sort((a, b) => {
          const aName = a.title || a.name || a.character || '';
          const bName = b.title || b.name || b.character || '';
          return aName.localeCompare(bName);
        });
        break;

      case SORT_OPTIONS.ZA:
        sorted.sort((a, b) => {
          const aName = a.title || a.name || a.character || '';
          const bName = b.title || b.name || b.character || '';
          return bName.localeCompare(aName);
        });
        break;

      case SORT_OPTIONS.RANDOM:
        sorted = shuffle(sorted);
        break;

      default:
        break;
    }

    setSortMode(mode);
    setSortedItems(sorted);
  };

  // Determine aspect ratio based on content type
  const aspectRatio =
    type === 'horizontal' ? 'aspect-video' :   // 16:9 for films/YouTube
      type === 'vertical' ? 'aspect-[9/16]' :    // 9:16 for Instagram/TikTok
        'aspect-square';                            // 1:1 for photos

  if (isLoading) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-end gap-2 opacity-50 pointer-events-none">
          <div className="h-6 w-16 rounded bg-white/10" />
          <div className="h-6 w-16 rounded bg-white/10" />
        </div>
        <div className={cn('grid gap-4', getGridColumns())}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className={cn('w-full overflow-hidden rounded-lg border border-white/5 bg-white/5', aspectRatio)}>
              <div className="h-full w-full animate-pulse bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="mb-4 flex items-center justify-end gap-2">
        <span className="text-xs text-white/40">Sort:</span>
        <SortButton
          icon={ArrowPathIcon}
          label="Random"
          active={sortMode === SORT_OPTIONS.RANDOM}
          onClick={() => handleSort(SORT_OPTIONS.RANDOM)}
        />
        <SortButton
          icon={ArrowUpIcon}
          label="A-Z"
          active={sortMode === SORT_OPTIONS.AZ}
          onClick={() => handleSort(SORT_OPTIONS.AZ)}
        />
        <SortButton
          icon={ArrowDownIcon}
          label="Z-A"
          active={sortMode === SORT_OPTIONS.ZA}
          onClick={() => handleSort(SORT_OPTIONS.ZA)}
        />
      </div>

      {/* Item Grid */}
      <div className={cn('grid gap-4', getGridColumns())}>
        {sortedItems.map((item, index) => (
          <ItemCard
            key={item.id}
            item={item}
            index={index}
            type={type}
            onClick={() => onItemClick(item, index)}
          />
        ))}
      </div>
    </div>
  );
}

function SortButton({ icon: Icon, label, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 rounded border px-2 py-1 text-xs transition-all',
        active
          ? 'border-white/40 bg-white/20 text-white'
          : 'border-white/20 bg-white/5 text-white/60 hover:bg-white/10'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </motion.button>
  );
}

import { getDriveImageUrl } from '@/lib/data/googleDrive';

function ItemCard({ item, index, type, onClick }) {
  // Determine aspect ratio based on content type
  const aspectRatio =
    type === 'horizontal' ? 'aspect-video' :   // 16:9 for films/YouTube
      type === 'vertical' ? 'aspect-[9/16]' :    // 9:16 for Instagram/TikTok
        'aspect-square';                            // 1:1 for photos

  // Get thumbnail based on item type
  const getThumbnail = () => {
    // 1. If we have a thumbnail, check if it's a Drive link that needs resolution
    if (item.thumbnail) {
      if (item.thumbnail.includes('drive.google.com')) {
        return getDriveImageUrl(item.thumbnail);
      }
      return item.thumbnail;
    }

    // 2. If we have a cover image (Loremaker style)
    if (item.coverImage) {
      return getDriveImageUrl(item.coverImage);
    }

    // 3. YouTube fallback
    if (item.youtubeUrl) {
      const videoId = item.youtubeUrl.split('v=')[1] || item.youtubeUrl.split('/').pop();
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // 4. Drive ID fallback
    if (item.id && !item.id.includes('-') && item.id.length > 20) {
      return getDriveImageUrl(item.id);
    }

    return null;
  };

  const thumbnail = getThumbnail();

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10',
        aspectRatio
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Thumbnail */}
      {thumbnail && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={item.title || item.name || item.character}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      )}

      {/* Instagram placeholder when no thumbnail */}
      {!thumbnail && item.instagramUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20">
          <svg className="h-16 w-16 text-white/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      )}

      {/* Content overlay */}
      {(item.title || item.name || item.character) && (
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="text-left text-sm font-semibold text-white drop-shadow-lg">
            {item.title || item.name || item.character}
          </p>
        </div>
      )}

      {/* Hover indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
        <div className="rounded-full border-2 border-white bg-black/50 p-2 backdrop-blur-sm">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}
