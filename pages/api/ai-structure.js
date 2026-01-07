import drive from '@/lib/google/drive';

export default async function handler(req, res) {
    const aiGalleryId = '1LflEx48azcfu_EBnLv12SOYWhUMXYoBj';

    try {
        // Check AI Albums gallery structure
        const contents = await drive.files.list({
            q: `'${aiGalleryId}' in parents and trashed = false`,
            fields: 'files(id,name,mimeType)',
            orderBy: 'name',
            pageSize: 20
        });

        const results = {
            galleryName: 'AI Albums',
            galleryId: aiGalleryId,
            itemCount: contents.data.files.length,
            items: contents.data.files,
            hasCategories: false
        };

        // Check if first item is a folder (category structure like Photography)
        const firstFolder = contents.data.files.find(f => f.mimeType === 'application/vnd.google-apps.folder');
        if (firstFolder) {
            const subContents = await drive.files.list({
                q: `'${firstFolder.id}' in parents and trashed = false`,
                fields: 'files(id,name,mimeType)',
                pageSize: 10
            });

            results.firstFolder = {
                name: firstFolder.name,
                id: firstFolder.id,
                contents: subContents.data.files,
                // If it contains mostly folders, it's likely a category
                hasSubfolders: subContents.data.files.filter(f => f.mimeType === 'application/vnd.google-apps.folder').length > 0
            };
        }

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            error: 'AI Albums structure check failed',
            message: error.message
        });
    }
}
