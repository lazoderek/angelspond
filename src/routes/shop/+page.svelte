<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	export let data: PageData;

	const products = data.products;

	// Track selected image per product
	interface Product {
		image?: string | null;
		// add other fields if needed
	}

	let selectedImages: (string | null)[] = products.map((p: Product) => p.image ?? null);

	// Check if product is sold out
	function isSoldOut(product: any) {
		return product.variants?.every((v: any) => !v.availableForSale);
	}
</script>

<main class="mx-auto max-w-6xl p-6 text-white">
	{#if products.length === 0}
		<p class="mx-auto mt-8 text-white">No products found.</p>
	{:else}
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each products as product, i}
				<div class="group relative flex flex-col space-y-2">
					<!-- Entire product card -->
					<div
						class="group cursor-pointer"
						role="button"
						tabindex="0"
						on:click={() => !isSoldOut(product) && goto(`/shop/${product.handle}`)}
						on:keydown={(e) =>
							e.key === 'Enter' && !isSoldOut(product) && goto(`/shop/${product.handle}`)}
					>
						<!-- Main image -->
						{#if selectedImages[i]}
							<div
								class="relative aspect-square w-full overflow-hidden border border-transparent transition-all duration-150 group-hover:border-white"
							>
								<img
									src={selectedImages[i]!}
									alt={product.title}
									class="h-full w-full object-cover"
								/>
							</div>
						{/if}

						<!-- Product title with Sold Out badge -->
						<div class="mt-2 flex items-center justify-between">
							<h2 class="truncate text-lg" class:text-gray-500={isSoldOut(product)}>
								{product.title}
							</h2>
							{#if isSoldOut(product)}
								<span class="ml-2 bg-red-600 px-2 py-1 text-xs whitespace-nowrap text-white">
									Sold Out
								</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>
