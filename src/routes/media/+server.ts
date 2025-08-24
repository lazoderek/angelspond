import type { RequestHandler } from './$types';
import { google } from 'googleapis';
import key from '../../../service-account.json';
import sharp from 'sharp';

const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });

export const GET: RequestHandler = async ({ url }) => {
    try {
        const fileId = url.searchParams.get('id');
        if (!fileId) return new Response(JSON.stringify({ error: 'Missing file ID' }), { status: 400 });

        // Fetch file metadata to check MIME type
        const metadata = await drive.files.get({ fileId, fields: 'mimeType, name' });
        const mimeType = metadata.data.mimeType ?? 'application/octet-stream';
        const fileName = metadata.data.name ?? 'file';

        // Fetch file content
        const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
        let buffer = Buffer.from(res.data as ArrayBuffer);

        // If HEIC, convert to JPEG
        let contentType = mimeType;
        if (mimeType === 'image/heic' || fileName.toLowerCase().endsWith('.heic')) {
            buffer = await sharp(buffer).jpeg().toBuffer();
            contentType = 'image/jpeg';
        }

        return new Response(buffer, {
            status: 200,
            headers: { 'Content-Type': contentType }
        });
    } catch (err) {
        console.error('Drive fetch error:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch media' }), { status: 500 });
    }
};