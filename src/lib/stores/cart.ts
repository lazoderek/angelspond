import { writable, derived } from 'svelte/store';

export type CartItem = {
	id: string;
	title: string;
	price: number;
	quantity: number;
	image?: string | null;
};

// --- Local cart store ---
export const cart = writable<CartItem[]>([]);
export const cartCount = derived(cart, ($cart) =>
	$cart.reduce((sum, item) => sum + item.quantity, 0)
);

// --- Shopify checkout URL store ---
export const checkoutUrl = writable<string | null>(null);

// --- Local store helpers ---
export function addToCart(item: CartItem) {
	cart.update((current) => {
		const existing = current.find((i) => i.id === item.id);
		if (existing) {
			existing.quantity += item.quantity;
			return [...current];
		}
		return [...current, item];
	});
}

export function removeFromCart(id: string) {
	cart.update((current) => current.filter((i) => i.id !== id));
}

export function updateQuantity(id: string, quantity: number) {
	if (quantity <= 0) {
		removeFromCart(id);
		return;
	}
	cart.update((current) =>
		current.map((i) => (i.id === id ? { ...i, quantity } : i))
	);
}

export function clearCart() {
	cart.set([]);
	checkoutUrl.set(null);
}

// --- Shopify Integration ---
const SHOP_DOMAIN = '9shn40-p0.myshopify.com';
const SHOP_TOKEN = 'a60e5cbd7ba9db7ce3256bb41d3e6572';

let shopifyCartId: string | null = null;
if (typeof localStorage !== 'undefined') {
	shopifyCartId = localStorage.getItem('shopifyCartId') || null;
}

async function shopifyRequest(query: string, variables: any = {}) {
	const res = await fetch(`https://${SHOP_DOMAIN}/api/2023-10/graphql.json`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': SHOP_TOKEN
		},
		body: JSON.stringify({ query, variables })
	});
	return res.json();
}

// Create Shopify cart
export async function createShopifyCart() {
	const query = `
	mutation {
		cartCreate {
			cart { id checkoutUrl }
		}
	}`;
	const data = await shopifyRequest(query);
	shopifyCartId = data.data.cartCreate.cart.id;
	if (typeof localStorage !== 'undefined' && shopifyCartId) {
		localStorage.setItem('shopifyCartId', shopifyCartId);
	}
	checkoutUrl.set(data.data.cartCreate.cart.checkoutUrl);
	return data.data.cartCreate.cart;
}

// Add variant to Shopify cart (does NOT overwrite local store)
export async function addToCartShopify(variantId: string, quantity: number = 1) {
	if (!shopifyCartId) {
		await createShopifyCart();
	}

	const query = `
	mutation($cartId: ID!, $lines: [CartLineInput!]!) {
		cartLinesAdd(cartId: $cartId, lines: $lines) {
			cart { id checkoutUrl }
		}
	}`;
	const variables = { cartId: shopifyCartId, lines: [{ merchandiseId: variantId, quantity }] };
	const data = await shopifyRequest(query, variables);

	// Only update checkout URL
	checkoutUrl.set(data.data.cartLinesAdd.cart.checkoutUrl);

	return data.data.cartLinesAdd.cart.checkoutUrl;
}

// Fetch current Shopify checkout URL
export async function getCartCheckoutUrl(): Promise<string | null> {
	if (!shopifyCartId) return null;

	const query = `
	query($cartId: ID!) {
		cart(id: $cartId) {
			checkoutUrl
		}
	}`;
	const variables = { cartId: shopifyCartId };
	const data = await shopifyRequest(query, variables);
	const url = data?.data?.cart?.checkoutUrl ?? null;
	checkoutUrl.set(url);
	return url;
}