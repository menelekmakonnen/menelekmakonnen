import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils/helpers';
import { LENS_MODES } from '@/lib/constants/camera';

export default function AlbumGrid({ albums, onAlbumClick }) {
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

  return (
    <div className={cn('grid gap-4', getGridColumns())}>
      {albums.map((album, index) => (
        <AlbumCard
          key={album.id}
          album={album}
          index={index}
          onClick={() => onAlbumClick(album)}
        />
      ))}
    </div>
  );
}

function AlbumCard({ album, index, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Thumbnail */}
      {album.thumbnail && (
        <div className="absolute inset-0">
          <img
            src={album.thumbnail}
            alt={album.title || album.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
