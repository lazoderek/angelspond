<script lang="ts">
	export let data: { media: { url: string; mimeType: string }[] };
	let media = data?.media ?? [];
	let selected: string | null = null;

	// track loaded state
	let loaded: Record<string, boolean> = {};
	for (const m of media) loaded[m.url] = false;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') selected = null;
	}
</script>

<main class="mx-auto mb-8 max-w-4xl bg-transparent p-6 font-sans text-white">
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
		{#each media as m}
			<button
				type="button"
				class="p-0 focus:ring-offset-2 focus:outline-none"
				on:click={() => (selected = m.url)}
				aria-label="Open media"
			>
				<div class="relative w-full" style="padding-top: 125%;">
					{#if m.mimeType.startsWith('video/')}
						<video
							src={m.url}
							muted
							playsinline
							class="absolute top-0 left-0 block h-full w-full object-cover"
							style="border: {loaded[m.url] ? '1px solid rgba(255,255,255,0.3)' : 'none'}"
							on:loadeddata={() => (loaded[m.url] = true)}
						></video>
					{:else}
						<img
							src={m.url}
							alt=""
							loading="lazy"
							class="absolute top-0 left-0 block h-full w-full object-cover"
							style="border: {loaded[m.url] ? '1px solid rgba(255,255,255,0.3)' : 'none'}"
							on:load={() => (loaded[m.url] = true)}
						/>
					{/if}
				</div>
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
			{#if media.find((m) => m.url === selected)?.mimeType.startsWith('video/')}
				<video src={selected} controls autoplay class="max-h-[70vh] max-w-[70vw] shadow-2xl" >
					<track kind="captions" />
				</video>
			{:else}
				<img src={selected} alt="" class="max-h-[70vh] max-w-[70vw] shadow-2xl" />
			{/if}
		</div>
	{/if}
</main>
