import { getDrive } from '@/lib/google/drive';
import { PHOTOGRAPHY_DRIVE_FOLDER, AI_ALBUMS_DRIVE_FOLDER } from '@/lib/data/googleDrive';

export default async function handler(req, res) {
    const diagnostics = {
        envVarsPresent: {
            clientEmail: !!process.env.GOOGLE_ME_CLIENT_EMAIL,
            privateKey: !!process.env.GOOGLE_ME_PRIVATE_KEY,
            projectId: !!process.env.GOOGLE_ME_PROJECT_ID,
        },
        clientEmail: process.env.GOOGLE_ME_CLIENT_EMAIL,
        folderIds: {
            photography: PHOTOGRAPHY_DRIVE_FOLDER,
            ai: AI_ALBUMS_DRIVE_FOLDER,
        },
        tests: {}
    };

    try {
        const drive = getDrive();

        // Test 1: List folders in Photography root
        try {
            const photoResponse = await drive.files.list({
                q: `'${PHOTOGRAPHY_DRIVE_FOLDER}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
                fields: 'files(id, name)',
                pageSize: 5
            });
            diagnostics.tests.photographyFolders = {
                success: true,
                count: photoResponse.data.files.length,
                folders: photoResponse.data.files
            };
        } catch (err) {
            diagnostics.tests.photographyFolders = {
                success: false,
                error: err.message
            };
        }

        // Test 2: List folders in AI root
        try {
            const aiResponse = await drive.files.list({
                q: `'${AI_ALBUMS_DRIVE_FOLDER}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
                fields: 'files(id, name)',
                pageSize: 5
            });
            diagnostics.tests.aiFolders = {
                success: true,
                count: aiResponse.data.files.length,
                folders: aiResponse.data.files
            };
        } catch (err) {
            diagnostics.tests.aiFolders = {
                success: false,
                error: err.message
            };
        }

        // Test 3: Get folder metadata directly
        try {
            const photoMetadata = await drive.files.get({
                fileId: PHOTOGRAPHY_DRIVE_FOLDER,
                fields: 'id, name, permissions'
            });
            diagnostics.tests.photographyMetadata = {
                success: true,
                name: photoMetadata.data.name,
                id: photoMetadata.data.id
            };
        } catch (err) {
            diagnostics.tests.photographyMetadata = {
                success: false,
                error: err.message
            };
        }

        res.status(200).json(diagnostics);
    } catch (error) {
        diagnostics.error = error.message;
        diagnostics.stack = error.stack;
        res.status(500).json(diagnostics);
    }
}
