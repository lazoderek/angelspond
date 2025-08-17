import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const domain = '9shn40-p0.myshopify.com';
	const token = 'a60e5cbd7ba9db7ce3256bb41d3e6572';

	const query = `
	{
		products(first: 20) {
			edges {
				node {
					id
					title
					handle
					variants(first: 1) { edges { node { price { amount } } } }
					images(first: 1) { edges { node { url } } }
				}
			}
		}
	}`;

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

		const products = data.data.products.edges.map(({ node }: any) => ({
			id: node.id,
			title: node.title,
			handle: node.handle,
			price: node.variants.edges[0]?.node.price.amount || '',
			image: node.images.edges[0]?.node.url || ''
		}));

		return { products };
	} catch (err) {
		console.error(err);
		return { products: [] };
	}
};