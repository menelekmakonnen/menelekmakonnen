import { useState, useEffect } from 'react';
import { cacheImage, getCachedImage, hasCachePermission } from '@/lib/utils/cache';

export default function CachedImage({ src, alt, className, style, ...props }) {
    const [objectUrl, setObjectUrl] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadImage() {
            if (!src) return;

            // If caching is disabled, just use regular src
            if (!hasCachePermission()) {
                if (active) setObjectUrl(src);
                return;
            }

            // Skip caching for known CORS-restricted domains
            const restrictedDomains = ['cdninstagram.com', 'fbcdn.net', 'facebook.com', 'drive.google.com', 'googleusercontent.com'];
            if (restrictedDomains.some(domain => src.includes(domain))) {
                if (active) setObjectUrl(src);
                return;
            }

            // Check cache first
            try {
                const cachedBlob = await getCachedImage(src);
                if (cachedBlob) {
                    const url = URL.createObjectURL(cachedBlob);
                    if (active) {
                        setObjectUrl(url);
                        return;
                    }
                }

                // Fetch and cache
                const response = await fetch(src);
                const blob = await response.blob();
                if (blob) {
                    await cacheImage(src, blob);
                    const url = URL.createObjectURL(blob);
                    if (active) setObjectUrl(url);
                } else {
                    // Fallback
                    if (active) setObjectUrl(src);
                }
            } catch (err) {
                console.error('Image cache error, falling back:', err);
                if (active) setObjectUrl(src);
            }
        }

        loadImage();

        return () => {
            active = false;
            if (objectUrl && objectUrl !== src) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src]);

    return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
            src={objectUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} // Transparent pixel placeholder
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            onLoad={() => setIsLoaded(true)}
            style={style}
            referrerPolicy="no-referrer"
            {...props}
        />
    );
}
