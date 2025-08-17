<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	export let data: PageData;

	const products = data.products;

	// Track selected image per product
	let selectedImages: (string | null)[] = products.map((p) => p.image);
</script>

<main class="mx-auto max-w-6xl p-6 text-white">
	{#if products.length === 0}
		<p class="mx-auto mt-8 text-white">No products found.</p>
	{:else}
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each products as product, i}
				<!-- Entire product card is clickable -->
				<div
					class="flex flex-col space-y-2 text-white cursor-pointer group"
					on:click={() => goto(`/shop/${product.handle}`)}
				>
					<!-- Main image -->
					{#if selectedImages[i]}
						<div class="relative w-full aspect-square overflow-hidden border border-transparent group-hover:border-white transition-all duration-150">
							<img
								src={selectedImages[i]!}
								alt={product.title}
								class="w-full h-full object-cover"
							/>
						</div>
					{/if}

					<h2 class="mt-2 text-lg group-hover:underline">{product.title}</h2>
				</div>
			{/each}
		</div>
	{/if}
</main>