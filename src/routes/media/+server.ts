import type { RequestHandler } from './$types';
import { google } from 'googleapis';
import key from '../../../service-account.json'; // adjust path

const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = '1afkTw339ANHnlZVkiPLBWaItNQ0NRTVl';

export const GET: RequestHandler = async ({ url }) => {
    try {
        const fileId = url.searchParams.get('id');
        if (!fileId) {
            return new Response(JSON.stringify({ error: 'Missing file ID' }), { status: 400 });
        }

        const res = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'arraybuffer' }
        );

        // Optional: dynamically detect MIME type (default to image/jpeg)
        const mimeType = 'image/jpeg';

        return new Response(res.data, {
            status: 200,
            headers: { 'Content-Type': mimeType }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Failed to fetch media' }), { status: 500 });
    }
};