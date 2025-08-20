import type { PageServerLoad } from './$types';

type Product = {
	id: string;
	title: string;
	handle: string;
	price: string;
	image: string | null;
	images: string[];
	description?: string;
	options?: { name: string; values: string[] }[];
	variants?: any[];
};

export const load: PageServerLoad = async ({ params }) => {
	const handle = params?.handle || 'default-product-handle'; // fallback handle
	const domain = '9shn40-p0.myshopify.com';
	const token = 'a60e5cbd7ba9db7ce3256bb41d3e6572';

	const query = `
		{
			productByHandle(handle: "${handle}") {
				id
				title
				handle
				descriptionHtml
				options {
					name
					values
				}
				variants(first: 10) {
					edges {
						node {
						id
						price { amount }
						availableForSale
						selectedOptions { name value }
						}
					}
				}
				images(first: 10) {
					edges { node { url } }
				}
			}
		}
	`;

	try {
		const res = await fetch(`https://${domain}/api/2023-10/graphql.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': token
			},
			body: JSON.stringify({ query })
		});

		const data = await res.json();
		const node = data.data.productByHandle;

		if (!node) return { product: null };

		const product: Product = {
			id: node.id,
			title: node.title,
			handle: node.handle,
			price: node.variants.edges[0]?.node.price.amount || '',
			image: node.images.edges[0]?.node.url || null,
			images: node.images.edges.map((img: any) => img.node.url),
			description: node.descriptionHtml,
			options: node.options,
			variants: node.variants.edges.map((v: any) => v.node)
		};

		return { product };
	} catch (err) {
		console.error(err);
		return { product: null };
	}
};