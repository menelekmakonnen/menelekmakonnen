import { getDriveImageUrl } from '../data/googleDrive';

const STORAGE_KEY = 'daily_covers';

/**
 * Get today's date string (YYYY-MM-DD)
 */
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get the daily cover image for an album
 * @param {string} albumId - Unique ID of the album
 * @param {Array} images - All images available in the album
 * @returns {string} Image URL
 */
export function getDailyThumbnail(albumId, images) {
    if (!images || images.length === 0) return null;

    try {
        const today = getTodayString();
        const stored = localStorage.getItem(STORAGE_KEY);
        let coversMap = stored ? JSON.parse(stored) : { date: today, mappings: {} };

        // If it's a new day, reset the mappings
        if (coversMap.date !== today) {
            coversMap = { date: today, mappings: {} };
        }

        // If we already have a mapping for this album, use it
        if (coversMap.mappings[albumId]) {
            // Find the image in the current list to make sure it still exists
            const existingImage = images.find(img => (img.id || img.name) === coversMap.mappings[albumId].id);
            if (existingImage) {
                return getImageUrl(existingImage);
            }
        }

        // Pick a new random image
        const randomIndex = Math.floor(Math.random() * images.length);
        const selectedImage = images[randomIndex];
        const imageUrl = getImageUrl(selectedImage);

        // Store it
        coversMap.mappings[albumId] = {
            id: selectedImage.id || selectedImage.name,
            url: imageUrl
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(coversMap));
        return imageUrl;

    } catch (e) {
        console.error('Error in daily cover logic:', e);
        return getImageUrl(images[0]);
    }
}

/**
 * Force reset all daily covers (used on power cycle)
 */
export function resetDailyCovers() {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Helper to get URL from image object
 */
function getImageUrl(img) {
    if (!img) return null;
    const input = typeof img === 'string' ? img : (img.url || img.thumbnailLink || img.id);
    if (!input) return null;

    // If it's a Drive ID or Drive Link, convert to direct URL
    if (input.includes('drive.google.com') || (!input.includes('http') && input.length > 20)) {
        return getDriveImageUrl(input);
    }
    return input;
}
