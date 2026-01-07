import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils/helpers';
import { LENS_MODES } from '@/lib/constants/camera';
import { getDriveImageUrl } from '@/lib/data/googleDrive';
import CachedImage from '../common/CachedImage';

export default function MasonryAlbumGrid({ items, onItemClick, isLoading = false }) {
    const { cameraSettings } = useApp();
    const lensMode = cameraSettings.lensMode || LENS_MODES.STANDARD;

    // CSS Columns config based on lens mode
    const getColumnsClass = () => {
        switch (lensMode) {
            case LENS_MODES.WIDE:
                return 'columns-2 md:columns-4 lg:columns-5'; // More columns
            case LENS_MODES.TELEPHOTO:
                return 'columns-1 md:columns-2 lg:columns-3'; // Fewer columns
            case LENS_MODES.MACRO:
                return 'columns-1 md:columns-2'; // Focus
            case LENS_MODES.STANDARD:
            default:
                return 'columns-2 md:columns-3 lg:columns-4'; // Standard
        }
    };

    if (isLoading) {
        return (
            <div className={cn('w-full', getColumnsClass(), 'gap-4 space-y-4')}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="break-inside-avoid mb-4">
                        <div className="relative w-full overflow-hidden rounded-lg border border-white/5 bg-white/5">
                            {/* Randomize aspect ratios for skeleton look */}
                            <div style={{ paddingBottom: `${Math.random() * 50 + 50}%` }} />
                            <div className="absolute inset-0 animate-pulse bg-white/10" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={cn('w-full', getColumnsClass(), 'gap-4 space-y-4')}>
            {items.map((item, index) => (
                <div key={item.id || index} className="break-inside-avoid mb-4">
                    <MasonryCard
                        item={item}
                        index={index}
                        onClick={() => onItemClick(item, index)}
                    />
                </div>
            ))}
        </div>
    );
}

function MasonryCard({ item, index, onClick }) {
    // Logic for thumbnail sources
    // 1. Daily Cover (passed in as item.thumbnail usually for albums)
    // 2. Hover Image (random from items)

    const initialThumb = useMemo(() => {
        // If it's an album with a pre-calculated daily thumbnail, use it
        if (item.thumbnail) return resolveUrl(item.thumbnail);
        // If it's a single image/item
        if (item.coverImage) return resolveUrl(item.coverImage);
        // Video fallback
        if (item.youtubeUrl) {
            const videoId = item.youtubeUrl.split('v=')[1] || item.youtubeUrl.split('/').pop();
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        // Deep fallback
        return resolveUrl(item.url || item.thumbnailLink || item.id);
    }, [item]);

    const [currentThumb, setCurrentThumb] = useState(initialThumb);
    const [hasImageError, setHasImageError] = useState(false);

    const handleMouseEnter = () => {
        // If this is an album with multiple items/images, pick a random one
        const subItems = item.images || item.items || [];
        if (subItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * subItems.length);
            const randomItem = subItems[randomIndex];
            // Resolve the random item's image
            const randomUrl = resolveUrl(
                typeof randomItem === 'string' ? randomItem : (randomItem.url || randomItem.thumbnailLink || randomItem.id)
            );
            if (randomUrl) setCurrentThumb(randomUrl);
        }
    };

    const handleMouseLeave = () => {
        setCurrentThumb(initialThumb);
    };

    const handleImageError = () => {
        // If current thumb fails (e.g. random hover), revert to initial
        if (currentThumb !== initialThumb) {
            setCurrentThumb(initialThumb);
        } else {
            // If initial fails, maybe we have a backup or just let the placeholder show?
            // For now, if initial fails, we set it to null so the "No Preview" placeholder shows.
            setCurrentThumb(null);
        }
    };

    return (
        <motion.button
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="relative w-full">
                {currentThumb && !hasImageError ? (
                    <CachedImage
                        src={currentThumb}
                        alt={item.title || item.name || 'Gallery Image'}
                        className={cn(
                            "h-auto w-full transform transition-transform duration-700 will-change-transform group-hover:scale-105",
                            hasImageError ? 'opacity-0' : 'opacity-100'
                        )}
                        onError={() => setHasImageError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="flex aspect-square w-full items-center justify-center bg-white/5 text-white/20">
                        <span className="text-xs">No Preview</span>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

                {/* Info Content - Always visible at bottom for albums */}
                <div className="absolute bottom-0 left-0 w-full p-4 text-left">
                    <h3 className="line-clamp-1 text-sm font-bold text-white drop-shadow-md">
                        {item.title || item.name}
                    </h3>
                    {item.itemCount !== undefined && (
                        <p className="mt-0.5 text-xs text-white/60">
                            {item.itemCount} items
                        </p>
                    )}
                </div>
            </div>
        </motion.button>
    );
}

// Helper to ensure we get a high-quality URL
function resolveUrl(input) {
    if (!input) return null;
    if (typeof input !== 'string') return null; // Should have been handled

    if (input.includes('drive.google.com') || (!input.includes('http') && input.length > 20)) {
        return getDriveImageUrl(input);
    }
    return input;
}
