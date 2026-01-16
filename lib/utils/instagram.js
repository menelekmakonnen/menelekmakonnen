/**
 * Get Instagram thumbnail URL from embed code
 * Using Instagram's CDN for more reliable thumbnail access
 * @param {string} embedCode - The Instagram post/reel ID
 * @returns {string}
 */
export function getInstagramThumbnail(embedCode) {
    if (!embedCode) return null;

    // Use Instagram CDN (scontent.cdninstagram) which is more reliable
    // Format: https://scontent.cdninstagram.com/v/CODE...
    // Fallback to placeholder if CDN doesn't work
    return `https://www.instagram.com/p/${embedCode}/media/?size=l`;
}

/**
 * Get embed URL for Instagram post
 */
export function getInstagramEmbedUrl(embedCode) {
    if (!embedCode) return null;
    return `https://www.instagram.com/p/${embedCode}/embed/captioned`;
}
