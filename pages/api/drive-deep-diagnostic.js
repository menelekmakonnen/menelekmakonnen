import drive from '@/lib/google/drive';

export default async function handler(req, res) {
    const beautyFolderId = '1q7CcuPAmo0w0ea1YlGaZreweS5fk8tiy';
    const professionalFolderId = '1BjHTapDOAvfdhyuGmN3q_sKsY4QhHX-W';

    try {
        const results = {
            beauty: {},
            professional: {}
        };

        // Check Beauty folder contents
        try {
            const beautyContents = await drive.files.list({
                q: `'${beautyFolderId}' in parents and trashed = false`,
                fields: 'files(id,name,mimeType)',
                pageSize: 20
            });
            results.beauty = {
                success: true,
                count: beautyContents.data.files.length,
                items: beautyContents.data.files
            };

            // If we find subfolders in Beauty, check the first one
            const firstFolder = beautyContents.data.files.find(f => f.mimeType === 'application/vnd.google-apps.folder');
            if (firstFolder) {
                const subContents = await drive.files.list({
                    q: `'${firstFolder.id}' in parents and trashed = false`,
                    fields: 'files(id,name,mimeType)',
                    pageSize: 10
                });
                results.beauty.firstSubfolder = {
                    name: firstFolder.name,
                    id: firstFolder.id,
                    contents: subContents.data.files
                };
            }
        } catch (error) {
            results.beauty = { success: false, error: error.message };
        }

        // Check Professional folder contents
        try {
            const proContents = await drive.files.list({
                q: `'${professionalFolderId}' in parents and trashed = false`,
                fields: 'files(id,name,mimeType)',
                pageSize: 20
            });
            results.professional = {
                success: true,
                count: proContents.data.files.length,
                items: proContents.data.files
            };

            // If we find subfolders, check the first one
            const firstFolder = proContents.data.files.find(f => f.mimeType === 'application/vnd.google-apps.folder');
            if (firstFolder) {
                const subContents = await drive.files.list({
                    q: `'${firstFolder.id}' in parents and trashed = false`,
                    fields: 'files(id,name,mimeType)',
                    pageSize: 10
                });
                results.professional.firstSubfolder = {
                    name: firstFolder.name,
                    id: firstFolder.id,
                    contents: subContents.data.files
                };
            }
        } catch (error) {
            results.professional = { success: false, error: error.message };
        }

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            error: 'Deep diagnostic failed',
            message: error.message
        });
    }
}
