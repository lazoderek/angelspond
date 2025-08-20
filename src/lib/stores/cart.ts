import { writable, derived } from 'svelte/store';

export type CartItem = {
	id: string;
	title: string;
	price: number;
	quantity: number;
	image?: string | null;
};

// Local cart store
export const cart = writable<CartItem[]>([]);

// Count of items
export const cartCount = derived(cart, ($cart) =>
	$cart.reduce((sum, item) => sum + item.quantity, 0)
);

// Add item to cart
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

// Remove item
export function removeFromCart(id: string) {
	cart.update((current) => current.filter((i) => i.id !== id));
}

// Clear cart
export function clearCart() {
	cart.set([]);
}