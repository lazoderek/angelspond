<script lang="ts">
	import { onMount } from 'svelte';
	import {
		cart,
		removeFromCart,
		updateQuantity,
		clearCart,
		getCartCheckoutUrl
	} from '$lib/stores/cart';
	import { writable } from 'svelte/store';

	let checkoutUrl = writable<string | null>(null);
	let selectedImage: string | null = null;

	onMount(async () => {
		const url = await getCartCheckoutUrl();
		checkoutUrl.set(url);
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') selectedImage = null;
	}
</script>

<main class="mx-auto max-w-4xl p-6 text-white">
	<h1 class="mb-4 text-xl">Cart</h1>

	{#if $cart.length === 0}
		<p>Your cart is empty.</p>
	{:else}
		<ul class="space-y-4">
			{#each $cart as item}
				<li class="flex items-start justify-between space-x-4">
					<div class="flex-1 space-y-1">
						<p class="font-semibold">{item.title}</p>

						<div class="flex items-center space-x-2">
							<!-- Quantity controls -->
							<button
								class="bg-gray-700 px-2 py-1 text-xs"
								on:click={() => updateQuantity(item.id, item.quantity - 1)}
							>
								-
							</button>
							<span class="text-sm">{item.quantity}</span>
							<button
								class="bg-gray-700 px-2 py-1 text-xs"
								on:click={() => updateQuantity(item.id, item.quantity + 1)}
							>
								+
							</button>

							<!-- Remove button -->
							<button class="bg-red-600 px-2 py-1 text-xs" on:click={() => removeFromCart(item.id)}>
								Remove
							</button>
						</div>
					</div>

					<!-- Price -->
					<p class="text-right font-semibold">${item.price * item.quantity}</p>

					<!-- Product Image (click to enlarge) -->
					{#if item.image}
						<button on:click={() => (selectedImage = item.image ?? null)}>
							<img src={item.image} alt={item.title} class="h-16 w-16 object-cover" />
						</button>
					{/if}
				</li>
			{/each}
		</ul>

		<div class="mt-6 flex items-center justify-between">
			<button class="bg-gray-700 px-3 py-1 text-xs" on:click={clearCart}> Clear Cart </button>

			<a
				href={$checkoutUrl ?? '#'}
				target="_blank"
				rel="noopener noreferrer"
				class="bg-white px-3 py-1 text-xs text-black"
				class:opacity-50={$checkoutUrl === null}
				class:pointer-events-none={$checkoutUrl === null}
			>
				Checkout
			</a>
		</div>
	{/if}

	<!-- Modal for enlarged image -->
	{#if selectedImage}
		<div
			role="dialog"
			aria-modal="true"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
			on:click={() => (selectedImage = null)}
			on:keydown={handleKeydown}
			tabindex="0"
		>
			<img
				src={selectedImage}
				alt=""
				class="max-h-[70vh] max-w-[70vw] border border-white shadow-2xl"
			/>
		</div>
	{/if}
</main>
