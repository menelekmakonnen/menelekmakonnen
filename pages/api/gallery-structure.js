import drive from '@/lib/google/drive';

export default async function handler(req, res) {
    const currentPhotoId = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';

    try {
        const results = {
            currentFolder: {},
            parentFolder: {},
            siblingFolders: []
        };

        // Get current folder info
        try {
            const current = await drive.files.get({
                fileId: currentPhotoId,
                fields: 'id,name,parents'
            });
            results.currentFolder = current.data;
        } catch (error) {
            results.currentFolder = { error: error.message };
        }

        // Get parent folder if it exists
        if (results.currentFolder.parents && results.currentFolder.parents.length > 0) {
            const parentId = results.currentFolder.parents[0];
            try {
                const parent = await drive.files.get({
                    fileId: parentId,
                    fields: 'id,name,mimeType'
                });
                results.parentFolder = parent.data;

                // List all folders in parent (siblings of current folder)
                const siblings = await drive.files.list({
                    q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
                    fields: 'files(id,name)',
                    orderBy: 'name'
                });
                results.siblingFolders = siblings.data.files;
            } catch (error) {
                results.parentFolder = { error: error.message };
            }
        }

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            error: 'Gallery structure diagnostic failed',
            message: error.message
        });
    }
}
