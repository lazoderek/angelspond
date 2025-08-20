<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	import { cartCount } from '$lib/stores/cart';
	import { page } from '$app/stores';

	let scWidget: any = null;
	let isPlaying = false;
	let currentTime = 0;
	let duration = 0;

	const formatTime = (seconds: number) => {
		if (!seconds || isNaN(seconds)) return '0:00';
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s.toString().padStart(2, '0')}`;
	};

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://w.soundcloud.com/player/api.js';
		script.onload = () => {
			const iframe = document.getElementById('sc-player') as HTMLIFrameElement;
			if (!iframe) return;

			// @ts-ignore
			scWidget = window.SC.Widget(iframe);

			scWidget.bind(window.SC.Widget.Events.READY, () => scWidget.play());
			scWidget.bind(window.SC.Widget.Events.PLAY, () => {
				isPlaying = true;
				scWidget.getCurrentSound((sound: any) => {
					duration = sound?.duration ? sound.duration / 1000 : 0;
				});
			});
			scWidget.bind(window.SC.Widget.Events.PAUSE, () => (isPlaying = false));
			scWidget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
				currentTime = e.currentPosition / 1000;
			});
		};

		document.body.appendChild(script);
	});

	const togglePlay = () => scWidget && (isPlaying ? scWidget.pause() : scWidget.play());
	const nextTrack = () => scWidget?.next();
	const prevTrack = () => scWidget?.prev();
</script>

<div
	class="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat text-white"
	style="background-image: url('/background.png');"
>
	<header class="flex justify-center py-6">
		<img src="/logo.png" alt="Angels Pond Logo" class="h-60 w-auto max-w-full" />
	</header>

	<nav class="sticky top-0 z-40 py-4">
		<div class="relative mx-auto flex max-w-5xl items-center justify-center">
			<ul class="flex space-x-8 font-sans text-lg font-semibold text-white">
				<li><a href="/" class="hover:underline">Home</a></li>
				<li><a href="/shop" class="hover:underline">Shop</a></li>
				<li><a href="/media" class="hover:underline">Media</a></li>
				<li><a href="/contact" class="hover:underline">Contact</a></li>
			</ul>
			{#if $page.url.pathname.startsWith('/shop') && $cartCount > 0}
				<a href="/cart" aria-label="View cart" class="absolute right-45 top-1/2 -translate-y-1/2">
					<img src="/cart.svg" alt="Cart" class="h-6 w-6 invert filter" />
					<span class="absolute -top-2 -right-2 rounded-full bg-red-500 px-1 text-xs">{$cartCount}</span>
				</a>
			{/if}
		</div>
	</nav>

	<main class="mx-auto max-w-3xl p-6 font-sans">
		<slot />
	</main>

	<iframe
		id="sc-player"
		src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2001484196&auto_play=true"
		width="0"
		height="0"
		scrolling="no"
		frameborder="0"
		allow="autoplay"
		class="hidden"
		title="audio player"
	></iframe>

	<div
		class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center space-x-4 rounded bg-black/80 p-3"
	>
		<!-- Previous track button -->
		<button on:click={prevTrack} class="text-white" aria-label="Previous track">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<button on:click={togglePlay} class="text-white">
			{#if isPlaying}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 5.25v13.5m-7.5-13.5v13.5"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
					/>
				</svg>
			{/if}
		</button>

		<!-- Next track button -->
		<button on:click={nextTrack} class="text-white" aria-label="Next track">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<div class="h-2 w-full overflow-hidden rounded bg-gray-700">
			<div
				class="h-2 rounded bg-red-500"
				style="width: {duration ? Math.min((currentTime / duration) * 100, 100) : 0}%"
			></div>
		</div>

		<div class="mt-1 text-center text-xs whitespace-nowrap text-gray-300">
			{formatTime(currentTime)} / {formatTime(duration)}
		</div>
	</div>
</div>
