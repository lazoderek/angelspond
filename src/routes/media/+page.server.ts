import type { PageServerLoad } from './$types';
import { google } from 'googleapis';
import key from '../../../service-account.json'; // adjust path

const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = '1afkTw339ANHnlZVkiPLBWaItNQ0NRTVl'; // replace with your public folder ID

export const load: PageServerLoad = async () => {
    try {
        // List all images in the folder
        const res = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
            fields: 'files(id, name)',
            orderBy: 'name'
        });

        const files = res.data.files ?? [];

        // Generate public image links
        const images = files.map(
            (file) => `https://drive.google.com/uc?export=view&id=${file.id}`
        );

        return { images };
    } catch (err) {
        console.error(err);
        return { images: [] };
    }
};