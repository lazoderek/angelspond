<script lang="ts">
	import type { PageData } from './$types';
	import { addToCart, addToCartShopify } from '$lib/stores/cart';

	export let data: PageData;
	const product = data.product;

	// Track selected options
	let selectedOptions: Record<string, string> = {};
	if (product?.options) {
		for (const opt of product.options) {
			selectedOptions[opt.name] = opt.values[0];
		}
	}

	function selectOption(name: string, value: string) {
		selectedOptions[name] = value;
	}

	function getSelectedVariant() {
		return product?.variants?.find((v) =>
			v.selectedOptions?.every((so: any) => selectedOptions[so.name] === so.value)
		);
	}

	let selectedImage = product?.image ?? product?.images?.[0] ?? null;
	let enlarged: string | null = null;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') enlarged = null;
	}

	// Check if the product is sold out
	function isSoldOut(product: any) {
		return product.variants?.every((v: any) => !v.availableForSale);
	}

	// Add to Cart handler
	async function addToCartHandler() {
		const variant = getSelectedVariant();
		if (!variant) return;

		// Update Shopify cart
		await addToCartShopify(variant.id, 1);

		// Update local store so UI is responsive
		addToCart({
			id: variant.id ?? product!.handle,
			title: product!.title,
			price: parseFloat(variant.price.amount ?? '0'),
			quantity: 1,
			image: selectedImage
		});
	}
</script>

<main class="mx-auto max-w-6xl p-6 text-white">
	{#if !product || isSoldOut(product)}
		<p class="mx-auto mt-8 text-center text-lg text-white">Product Not Available</p>
	{:else}
		<div class="flex flex-col space-y-6 md:flex-row md:space-x-8">
			<!-- Left: Images -->
			<div class="flex w-full max-w-md flex-shrink-0 flex-col space-y-2">
				{#if selectedImage}
					<button
						type="button"
						class="aspect-square overflow-hidden border border-white"
						on:click={() => (enlarged = selectedImage)}
					>
						<img src={selectedImage} alt={product.title} class="h-full w-full object-cover" />
					</button>
				{/if}

				{#if product.images?.length > 1}
					<div class="mt-2 flex space-x-2">
						{#each product.images as img}
							<button
								type="button"
								class="aspect-square w-20 overflow-hidden border border-white/30 hover:border-white"
								on:click={() => (selectedImage = img)}
							>
								<img src={img} alt="" class="h-full w-full object-cover" />
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Right: Details -->
			<div class="flex-1 space-y-2">
				<h1 class="text-xl">{product.title}</h1>
				<p class="text-l">
					$<span>{Math.floor(getSelectedVariant()?.price?.amount ?? 0)}</span>
				</p>

				{#if product.options?.length}
					{#each product.options as opt}
						<div>
							<label for={opt.name} class="mb-1 block text-xs">{opt.name}</label>
							<select
								id={opt.name}
								class="w-40 border border-white bg-black px-2 py-1 text-xs text-white"
								bind:value={selectedOptions[opt.name]}
								on:change={(e) => selectOption(opt.name, e.currentTarget.value)}
							>
								{#each opt.values as val (val)}
									{#if product.variants?.some(
										(v: any) =>
											v.selectedOptions?.some(
												(so: any) => so.name === opt.name && so.value === val
											) && v.availableForSale
									)}
										<option value={val}>{val}</option>
									{/if}
								{/each}
							</select>
						</div>
					{/each}
				{/if}

				<button
					class="mt-2 w-40 bg-white px-3 py-1 text-xs text-black hover:bg-gray-100"
					on:click={addToCartHandler}
				>
					Add to Cart
				</button>
			</div>
		</div>

		<!-- Modal for enlarged image -->
		{#if enlarged}
			<div
				role="dialog"
				aria-modal="true"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
				on:click={() => (enlarged = null)}
				on:keydown={handleKeydown}
				tabindex="0"
			>
				<img
					src={enlarged}
					alt=""
					class="max-h-[70vh] max-w-[70vw] border border-white shadow-2xl"
				/>
			</div>
		{/if}

		<!-- Description at the bottom -->
		{#if product.description}
			<div class="mt-6 max-w-none">
				{@html product.description}
			</div>
		{/if}
	{/if}
</main>
