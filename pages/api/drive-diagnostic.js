import drive from '@/lib/google/drive';
import { PHOTOGRAPHY_DRIVE_FOLDER, AI_ALBUMS_DRIVE_FOLDER } from '@/lib/data/googleDrive';

export default async function handler(req, res) {
    try {
        const diagnostics = {
            credentials: {
                hasClientEmail: !!process.env.GOOGLE_ME_CLIENT_EMAIL,
                hasPrivateKey: !!process.env.GOOGLE_ME_PRIVATE_KEY,
                hasProjectId: !!process.env.GOOGLE_ME_PROJECT_ID,
            },
            folderIds: {
                photography: PHOTOGRAPHY_DRIVE_FOLDER,
                aiAlbums: AI_ALBUMS_DRIVE_FOLDER,
            },
            tests: {}
        };

        // Test 1: Can we access the Photography folder?
        try {
            const photoResponse = await drive.files.get({
                fileId: PHOTOGRAPHY_DRIVE_FOLDER,
                fields: 'id,name,mimeType'
            });
            diagnostics.tests.photographyFolder = {
                success: true,
                name: photoResponse.data.name,
                type: photoResponse.data.mimeType
            };
        } catch (error) {
            diagnostics.tests.photographyFolder = {
                success: false,
                error: error.message
            };
        }

        // Test 2: Can we list files in Photography folder?
        try {
            const photoListResponse = await drive.files.list({
                q: `'${PHOTOGRAPHY_DRIVE_FOLDER}' in parents and trashed = false`,
                fields: 'files(id,name,mimeType)',
                pageSize: 10
            });
            diagnostics.tests.photographyContents = {
                success: true,
                count: photoListResponse.data.files.length,
                items: photoListResponse.data.files
            };
        } catch (error) {
            diagnostics.tests.photographyContents = {
                success: false,
                error: error.message
            };
        }

        res.status(200).json(diagnostics);
    } catch (error) {
        res.status(500).json({
            error: 'Diagnostic failed',
            message: error.message,
            stack: error.stack
        });
    }
}
