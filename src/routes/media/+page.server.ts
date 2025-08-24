import type { PageServerLoad } from './$types';
import { google } from 'googleapis';
import key from '../../../service-account.json';

const auth = new google.auth.GoogleAuth({
	credentials: key,
	scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = '1sXE1cFFyo9Qv7SaA0Ho_2C2bqp6oftHB';

export const load: PageServerLoad = async () => {
	try {
		const res = await drive.files.list({
			q: `'${FOLDER_ID}' in parents and trashed = false`,
			fields: 'files(id, name, mimeType)',
			orderBy: 'name'
		});

		const files = res.data.files ?? [];

		const media = files.map((file) => ({
			url: `/media?id=${file.id}`,
			mimeType: file.mimeType ?? ''
		}));

		return { media };
	} catch (err) {
		console.error('Drive list error:', err);
		return { media: [] };
	}
};