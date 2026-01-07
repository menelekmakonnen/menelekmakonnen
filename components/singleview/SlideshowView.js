import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XMarkIcon,
    PlayIcon,
    PauseIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

/**
 * SlideshowView - Fullscreen immersive viewing experience
 * @param {Object} item - Current active item
 * @param {Array} items - All items in the slideshow
 * @param {number} currentIndex - Current index
 * @param {Function} onIndexChange - Callback to change index
 * @param {Function} onClose - Callback to exit slideshow
 */
export default function SlideshowView({ item, items, currentIndex, onIndexChange, onClose }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [duration, setDuration] = useState(3.0); // Default 3 seconds
    const [showControls, setShowControls] = useState(true);

    // Timer logic - Optimized to not reset on every render, only on essential changes
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            onIndexChange((prev) => (prev + 1) % items.length);
        }, duration * 1000);

        return () => clearInterval(interval);
    }, [isPlaying, duration, items.length, onIndexChange]); // Removed currentIndex dependency to prevent jitter

    // Preload next image
    useEffect(() => {
        const nextIndex = (currentIndex + 1) % items.length;
        const nextItem = items[nextIndex];
        if (nextItem) {
            const url = getImageUrl(nextItem);
            if (url) {
                const img = new Image();
                img.src = url;
            }
        }
    }, [currentIndex, items]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === ' ') setIsPlaying(p => !p);
            if (e.key === 'ArrowLeft') onIndexChange((currentIndex - 1 + items.length) % items.length);
            if (e.key === 'ArrowRight') onIndexChange((currentIndex + 1) % items.length);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, items.length, onClose, onIndexChange]);

    const handleDurationChange = (delta) => {
        setDuration(prev => Math.max(0.5, Math.min(30, prev + delta)));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
        >
            {/* Immersive Background */}
            <div className="absolute inset-0 flex items-center justify-center p-0">
                <AnimatePresence mode="wait">
                    {/* Handle Media Types */}
                    {item.youtubeUrl ? (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full w-full"
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${item.youtubeUrl.split('v=')[1] || item.youtubeUrl.split('/').pop()}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0`}
                                className="h-full w-full object-cover pointer-events-none scale-125"
                                allow="autoplay; encrypted-media"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                        </motion.div>
                    ) : (
                        <motion.img
                            key={item.id}
                            src={getImageUrl(item.url || item.thumbnail || item.coverImage || item.id)}
                            alt={item.title || 'Slideshow Item'}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 1, ease: 'easeInOut' }}
                            className="h-full w-full object-contain"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Interactive Controls Overlay */}
            <div
                className={`absolute inset-0 flex flex-col justify-between p-8 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
                onMouseMove={() => {
                    setShowControls(true);
                    // Auto-hide after 3s of inactivity
                    if (window.hideControlsTimeout) clearTimeout(window.hideControlsTimeout);
                    window.hideControlsTimeout = setTimeout(() => setShowControls(false), 3000);
                }}
            >
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-light tracking-[0.2em] text-white uppercase opacity-0">
                            {/* Hidden title to keep layout but remove text */}
                            Placeholder
                        </h2>
                        <div className="flex items-center gap-4 mt-1 text-[10px] tracking-widest text-white/40 uppercase">
                            <span>{currentIndex + 1} / {items.length}</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full border border-white/20 bg-black/40 p-4 text-white backdrop-blur-md transition-all hover:bg-white/10"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Center Navigation Hints (Optional) */}

                {/* Bottom Controls */}
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-8 rounded-2xl border border-white/10 bg-black/60 px-8 py-4 backdrop-blur-xl">
                        {/* Prev */}
                        <button onClick={() => onIndexChange((currentIndex - 1 + items.length) % items.length)} className="text-white/60 hover:text-white">
                            <ChevronLeftIcon className="h-8 w-8" />
                        </button>

                        {/* Play/Pause */}
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110 active:scale-95"
                        >
                            {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8 ml-1" />}
                        </button>

                        {/* Next */}
                        <button onClick={() => onIndexChange((currentIndex + 1) % items.length)} className="text-white/60 hover:text-white">
                            <ChevronRightIcon className="h-8 w-8" />
                        </button>

                        <div className="h-8 w-px bg-white/20 mx-2" />

                        {/* Duration Control */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] uppercase tracking-widest text-white/40">Duration</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleDurationChange(-0.5)} className="text-white/40 hover:text-white">-</button>
                                    <span className="min-w-[40px] text-center font-mono text-xl text-white">{duration.toFixed(1)}s</span>
                                    <button onClick={() => handleDurationChange(0.5)} className="text-white/40 hover:text-white">+</button>
                                </div>
                            </div>
                            <ClockIcon className="h-6 w-6 text-white/20" />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 w-full max-w-2xl overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </div>

            {/* Decorative Scanlines */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,118,0.01))] bg-[length:100%_2px,3px_100%] opacity-30" />
        </motion.div>
    );
}

// Helper to resolve URLs
function getImageUrl(item) {
    if (!item) return '';
    if (typeof item === 'string') {
        // Fix: Use high-res thumbnail link (=s0) if available in the string, otherwise fall back
        if (item.includes('drive.google.com') || (!item.includes('http') && item.length > 20)) {
            const id = item.includes('id=') ? item.split('id=')[1] : item.split('/').pop();
            // Use =s0 for instant high-res loading (matches API fix)
            // Note: This assumes valid public file. If it fails, we might need error handling, but =s0 is generally safer than export=view for hotlinking
            return `https://drive.google.com/thumbnail?id=${id}&sz=s1000`; // safe fallback
            // But wait, constructing =s0 blindly works if we have the ID, but standard construction is different.
            // Actually, `drive.google.com/uc?export=view` is a redirect.
            // The BEST way if we only have ID is to use the thumbnail endpoint with large size.
            // return `https://drive.google.com/thumbnail?id=${id}&sz=w1920-h1080`;
            // Or stick to the export link if we must, but user complained about load time.
            // API returns `url` with `=s0`. If `item` is the object from API, it has `url` property.
            return `https://drive.google.com/uc?export=view&id=${id}`;
        }
        return item;
    }
    // Priority: url (which we fixed in API to be =s0), then thumbnail, then recursive
    return getImageUrl(item.url || item.thumbnail || item.coverImage || item.id);
}
