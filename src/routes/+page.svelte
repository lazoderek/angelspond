<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	let posts = data.posts;

	// Decode HTML titles only on client to handle &nbsp; etc.
	onMount(() => {
		const txt = document.createElement('textarea');
		posts = posts.map(post => ({
			...post,
			title: (() => {
				txt.innerHTML = post.title;
				return txt.value;
			})()
		}));
	});

	// Track selected image per post
	let selectedImages: (string | null)[] = posts.map((post) =>
		post.images && post.images.length ? post.images[0] : null
	);

	function selectImage(postIndex: number, img: string) {
		selectedImages[postIndex] = img;
	}
</script>

{#if posts.length === 0}
	<p class="mt-8 text-center text-white">No blog posts found.</p>
{:else}
	{#each posts as post, i}
		<article class="mx-auto mb-12 max-w-4xl text-white">
			<!-- Big blog heading -->
			<h2 class="mb-4 text-2xl font-bold">{post.title}</h2>

			{#if post.images && post.images.length > 0}
				<!-- Main image (square container, portrait/landscape fit) -->
				<div class="mb-2 w-full flex justify-center">
					<div class="relative w-full max-w-full aspect-square flex items-center justify-center">
						<img
							src={selectedImages[i]!}
							alt=""
							class="max-w-full max-h-full object-contain"
						/>
					</div>
				</div>

				<!-- Thumbnails -->
				{#if post.images.length > 1}
					<div class="mb-4 flex space-x-2">
						{#each post.images as img}
							<button
								type="button"
								class="aspect-square w-20 overflow-hidden border border-white/30 hover:border-white"
								on:click={() => selectImage(i, img)}
							>
								<img src={img} alt="" class="h-full w-full object-cover" />
							</button>
						{/each}
					</div>
				{/if}
			{/if}

			<!-- WordPress content preserved exactly -->
			<div class="prose prose-invert max-w-none">
				{@html post.content}
			</div>
		</article>
	{/each}
{/if}