import { listAlbums, getAlbumImages } from '@/lib/google/api';
import { PHOTOGRAPHY_DRIVE_FOLDER, AI_ALBUMS_DRIVE_FOLDER } from '@/lib/data/googleDrive';

export default async function handler(req, res) {
    const { type } = req.query;

    let rootFolderId;
    let useCategories = false;

    if (type === 'photography') {
        rootFolderId = PHOTOGRAPHY_DRIVE_FOLDER;
        useCategories = true; // Photography: Gallery → Categories → Albums
    } else if (type === 'ai') {
        rootFolderId = AI_ALBUMS_DRIVE_FOLDER;
        useCategories = false; // AI: Gallery → Albums (no categories)
    } else {
        return res.status(400).json({ error: 'Invalid type parameter. Use "photography" or "ai".' });
    }

    try {
        let allAlbums = [];

        if (useCategories) {
            // Photography structure: 3 levels
            const categories = await listAlbums(rootFolderId);

            for (const category of categories) {
                const albumsInCategory = await listAlbums(category.id);
                const enhancedAlbums = albumsInCategory.map(album => ({
                    ...album,
                    category: category.title
                }));
                allAlbums.push(...enhancedAlbums);
            }
        } else {
            // AI Albums structure: 2 levels (direct to albums)
            allAlbums = await listAlbums(rootFolderId);
        }

        // Enhance all albums with cover images and counts
        // executed sequentially to avoid Rate Limiting (403/500) from Google Drive API
        const albumsWithCovers = [];
        for (const album of allAlbums) {
            try {
                // Get all images (needed for "preload" requirement)
                // If this is still too slow, we might need pagination, but sequential should fix the stability.
                const images = await getAlbumImages(album.id);

                albumsWithCovers.push({
                    ...album,
                    thumbnail: images.length > 0 ? (images[0].thumbnail || images[0].url) : null,
                    itemCount: images.length,
                    items: images
                });
            } catch (err) {
                console.error(`Failed to fetch images for album ${album.id}:`, err);
                // Push album without images so it doesn't disappear, effectively showing empty
                albumsWithCovers.push({ ...album, thumbnail: null, itemCount: 0, items: [] });
            }
        }

        res.status(200).json(albumsWithCovers);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch albums', details: error.message });
    }
}
