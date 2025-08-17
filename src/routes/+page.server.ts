import type { PageServerLoad } from './$types';

type Post = {
	title: string;
	link: string;
	date: string;
	content: string;
	images: string[];
};

export const load: PageServerLoad = async () => {
	try {
		const res = await fetch(
			'https://public-api.wordpress.com/wp/v2/sites/angelspond3.wordpress.com/posts'
		);

		if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

		const json = await res.json();

		const posts: Post[] = json.map((p: any) => {
			let contentHtml: string = p.content.rendered;
			const images: string[] = [];

			// Strip only <img> tags, keep all other HTML
			contentHtml = contentHtml.replace(/<img\b[^>]*>/gi, (imgTag) => {
				const srcMatch = imgTag.match(/src=["']([^"']+)["']/);
				if (srcMatch) images.push(srcMatch[1]);
				return ''; // remove the <img> itself
			});

			return {
				title: p.title.rendered,
				link: p.link,
				date: new Date(p.date).toLocaleDateString(),
				content: contentHtml,
				images
			};
		});

		return { posts };
	} catch (err) {
		console.error('WordPress API fetch error:', err);
		return { posts: [] };
	}
};