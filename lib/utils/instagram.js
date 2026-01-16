/**
 * Get Instagram thumbnail URL from embed code
 * @param {string} embedCode - The Instagram post/reel ID
 * @param {string} size - 's' (small), 'm' (medium), 'l' (large)
 * @returns {string}
 */
export function getInstagramThumbnail(embedCode, size = 'l') {
    if (!embedCode) return null;

    // Instagram's direct media endpoint (works for most public content)
    return `https://www.instagram.com/p/${embedCode}/media/?size=${size}`;
}

/**
 * Alternative method using a proxy or indirect discovery if needed
 * For now, using the standard /media/ endpoint.
 */
