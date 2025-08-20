<script lang="ts">
	export let data: { images: string[] };
	let images = data.images;
	let selected: string | null = null;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') selected = null;
	}
</script>

<main class="mx-auto mb-8 max-w-4xl bg-transparent p-6 font-sans text-white">
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
		{#each images as img}
			<button
				type="button"
				class="bg-transparent p-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
				on:click={() => (selected = img)}
				aria-label="Open image"
			>
				<img
					src={img}
					alt=""
					loading="lazy"
					class="h-auto w-full cursor-pointer border border-white/30 transition-opacity duration-200 ease-in-out hover:opacity-90"
				/>
			</button>
		{/each}
	</div>

	{#if selected}
		<div
			role="dialog"
			aria-modal="true"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
			on:click={() => (selected = null)}
			on:keydown={handleKeydown}
			tabindex="0"
		>
			<img src={selected} alt="" class="max-h-[70vh] max-w-[70vw] border border-white shadow-2xl" />
		</div>
	{/if}
</main>