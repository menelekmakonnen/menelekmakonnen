import { getDrive } from './drive';

/**
 * List all subfolders within a parent folder (used for finding Albums)
 * @param {string} parentFolderId
 * @returns {Promise<Array>} List of album objects { id, title, description, date }
 */
export async function listAlbums(parentFolderId) {
    try {
        const drive = getDrive();
        const response = await drive.files.list({
            q: `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
            fields: 'files(id, name, description, createdTime)',
            orderBy: 'name',
        });

        return response.data.files.map(file => ({
            id: file.id,
            title: file.name,
            description: file.description || '',
            date: file.createdTime,
        }));
    } catch (error) {
        console.error('Error listing albums:', error);
        // Returning empty array allows the UI to fail gracefully or show empty state
        return [];
    }
}

/**
 * List all images in a folder
 * @param {string} folderId
 * @returns {Promise<Array>} List of image objects { id, name, thumbnail, url, width, height }
 */
export async function getAlbumImages(folderId) {
    try {
        const drive = getDrive();
        const response = await drive.files.list({
            q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
            fields: 'files(id, name, thumbnailLink, webViewLink, webContentLink, imageMediaMetadata)',
            orderBy: 'name',
        });

        return response.data.files.map(file => ({
            id: file.id,
            name: file.name,
            // Google Drive thumbnails are small by default (s220).
            // =s0 gets the original size (or very large). =s1600 is also good.
            // We use this as the MAIN url because export=view links often fail with "Virus scan warning" or "No preview" for large files.
            thumbnail: file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, '=s1000') : null,
            // Use high-res thumbnail as the main display URL for reliability
            url: file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, '=s0') : `https://drive.google.com/uc?export=view&id=${file.id}`,
            width: file.imageMediaMetadata?.width,
            height: file.imageMediaMetadata?.height,
        }));
    } catch (error) {
        console.error('Error getting album images:', error);
        return [];
    }
}

/**
 * Get a single random image from a folder to use as a cover
 * @param {string} folderId 
 * @returns {Promise<string|null>} URL of a random image or null
 */
export async function getAlbumCoverImage(folderId) {
    try {
        const images = await getAlbumImages(folderId);
        if (images.length > 0) {
            // Return the first image as cover, or random if preferred
            // For consistency, let's pick the first alphabetic one
            return images[0].thumbnail || images[0].url;
        }
        return null;
    } catch (error) {
        return null;
    }
}
