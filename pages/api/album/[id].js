import { getAlbumImages } from '@/lib/google/api';

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Album ID is required' });
    }

    try {
        const images = await getAlbumImages(id);
        res.status(200).json({ images });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch album images' });
    }
}
