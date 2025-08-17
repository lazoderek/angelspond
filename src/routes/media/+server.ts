import type { RequestHandler } from './$types';
import { google } from 'googleapis';
import key from '../../../service-account.json'; // adjust path

const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = '1afkTw339ANHnlZVkiPLBWaItNQ0NRTVl';

export const GET: RequestHandler = async () => {
    try {
        const res = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and mimeType contains 'image/'`,
            fields: 'files(id, name)',
            orderBy: 'name'
        });

        const files = res.data.files ?? [];

        const urls = files.map(file => `https://drive.google.com/uc?export=view&id=${file.id}`);

        return new Response(JSON.stringify(urls), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Failed to fetch media' }), { status: 500 });
    }
};