import { openDB } from 'idb';

const DB_NAME = 'mm_portfolio_cache';
const STORE_NAME = 'image_blobs';
const CACHE_VERSION = 1;

// Initialize the database
export const initCacheDB = async () => {
    return openDB(DB_NAME, CACHE_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
};

// Check if user has granted permission
export const hasCachePermission = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('cache_permission') === 'granted';
};

// Set permission
export const setCachePermission = (granted) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cache_permission', granted ? 'granted' : 'denied');
};

// Save blob to cache
export const cacheImage = async (url, blob) => {
    if (!hasCachePermission()) return;
    try {
        const db = await initCacheDB();
        await db.put(STORE_NAME, blob, url);
    } catch (error) {
        console.error('Failed to cache image:', error);
    }
};

// Get blob from cache
export const getCachedImage = async (url) => {
    if (!hasCachePermission()) return null;
    try {
        const db = await initCacheDB();
        const blob = await db.get(STORE_NAME, url);
        return blob || null;
    } catch (error) {
        return null;
    }
};

// Clear cache
export const clearImageCache = async () => {
    try {
        const db = await initCacheDB();
        await db.clear(STORE_NAME);
    } catch (error) {
        console.error('Failed to clear cache:', error);
    }
};
