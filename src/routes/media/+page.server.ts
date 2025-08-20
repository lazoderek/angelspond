import type { PageServerLoad } from './$types';
import { google } from 'googleapis';
import key from '../../../service-account.json'; // adjust path

const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = '1sXE1cFFyo9Qv7SaA0Ho_2C2bqp6oftHB';

export const load: PageServerLoad = async () => {
    try {
        const res = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
            fields: 'files(id, name)',
            orderBy: 'name'
        });

        const files = res.data.files ?? [];

        // Instead of public links, serve via SvelteKit proxy
        const images = files.map(file => `/media?id=${file.id}`);

        return { images };
    } catch (err) {
        console.error(err);
        return { images: [] };
    }
};