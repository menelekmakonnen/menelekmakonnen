import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { setCachePermission, hasCachePermission } from '@/lib/utils/cache';

export default function CachePermissionPopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if decision already made
        const permission = localStorage.getItem('cache_permission');
        if (permission === null) {
            // Delay slightly so it doesn't pop instantly on load
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        setCachePermission(true);
        setIsVisible(false);
    };

    const handleDecline = () => {
        setCachePermission(false);
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-8 right-8 z-[100] max-w-sm overflow-hidden rounded-lg border border-white/10 bg-black/80 p-6 backdrop-blur-xl shadow-2xl"
                >
                    <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-white">Faster Experience?</h3>
                        <button
                            onClick={handleDecline}
                            className="rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>

                    <p className="mt-2 text-sm text-white/60">
                        Allow us to securely cache images on your device? This makes the gallery load instantly on your next visit.
                    </p>

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleDecline}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            No, thanks
                        </button>
                        <button
                            onClick={handleAccept}
                            className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                            Yes, optimize
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
