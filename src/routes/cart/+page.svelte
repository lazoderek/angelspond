<script lang="ts">
	import { cart, cartCount, removeFromCart, clearCart } from '$lib/stores/cart';
</script>

<main class="mx-auto max-w-4xl p-6 text-white">
	<h1 class="text-xl mb-4">Cart</h1>

	{#if $cart.length === 0}
		<p>Your cart is empty.</p>
	{:else}
		<ul class="space-y-4">
			{#each $cart as item}
				<li class="flex items-center space-x-4">
					{#if item.image}
						<img src={item.image} alt={item.title} class="h-16 w-16 object-cover" />
					{/if}
					<div class="flex-1">
						<p>{item.title}</p>
						<p class="text-sm">${item.price} × {item.quantity}</p>
					</div>
					<button class="bg-red-600 px-2 py-1 text-xs" on:click={() => removeFromCart(item.id)}>
						Remove
					</button>
				</li>
			{/each}
		</ul>

		<div class="mt-6 flex justify-between">
			<button class="bg-gray-700 px-3 py-1 text-xs" on:click={clearCart}>
				Clear Cart
			</button>
			<a href="/checkout" class="bg-white text-black px-3 py-1 text-xs">
				Checkout
			</a>
		</div>
	{/if}
</main>