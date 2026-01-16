import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

// Initialize the Google Drive client with Service Account authentication

let driveClient = null;

export const getDrive = () => {
    if (driveClient) return driveClient;

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_ME_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_ME_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle newlines in env var
                project_id: process.env.GOOGLE_ME_PROJECT_ID,
            },
            scopes: SCOPES,
        });

        driveClient = google.drive({ version: 'v3', auth });
        return driveClient;
    } catch (error) {
        console.error("Google Drive Auth Initialization Failed:", error.message);
        throw error;
    }
};
