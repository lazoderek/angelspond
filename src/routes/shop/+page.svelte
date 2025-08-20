<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	export let data: PageData;

	const products = data.products;

	// Track selected image per product
	let selectedImages: (string | null)[] = products.map((p) => p.image);

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
				<div class="relative flex flex-col space-y-2 group">
					<!-- Entire product card -->
					<div
						class="cursor-pointer group"
						on:click={() => !isSoldOut(product) && goto(`/shop/${product.handle}`)}
					>
						<!-- Main image -->
						{#if selectedImages[i]}
							<div
								class="relative w-full aspect-square overflow-hidden border border-transparent group-hover:border-white transition-all duration-150"
							>
								<img
									src={selectedImages[i]!}
									alt={product.title}
									class="w-full h-full object-cover"
								/>
							</div>
						{/if}

						<!-- Product title with Sold Out badge -->
						<div class="mt-2 flex justify-between items-center">
							<h2
								class="text-lg truncate"
								class:text-gray-500={isSoldOut(product)}
							>
								{product.title}
							</h2>
							{#if isSoldOut(product)}
								<span class="ml-2 text-xs bg-red-600 px-2 py-1 text-white whitespace-nowrap">
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