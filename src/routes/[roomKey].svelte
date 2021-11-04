<script context="module">
	export const load = async ({ page }) => {
		return { props: page.params };
	};
</script>

<script>
	import { flip } from 'svelte/animate';
	import { state } from '../state';
	import { onMount, onDestroy } from 'svelte';
	import Card from '../components/atoms/Card.svelte';
	import { isClient } from '../helpers';

	let interval = null;
	let id = isClient() && localStorage.getItem('id');
	$: round = $state?.currentRoom.rounds[$state.currentRoom.rounds.length - 1];
	$: currentPlay = round?.[id];

	const cardValues = [0, 1, 2, 3, 5, 8, 13, 21, 34, '?', '☕'];

	export let roomKey = '';

	onMount(() => {
		state.loadRoom(roomKey);

		interval = setInterval(state.refreshCurrentRoom.bind(state), 2000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	const handleCardClick = (value) => {
		state.chooseCard(value);
	};

	const handleRevealClick = () => {
		state.toggleRevealCards();
	};

	const handleNewRoundClick = () => {
		state.newRound();
	};
</script>

<div
	class="w-full grid items-start grid-cols-1 lg:grid-cols-10 lg:pt-12 xl:grid-cols-12 gap-6 max-w-screen-xl mx-auto flex-grow"
>
	<!-- ACTIONS -->
	<div
		class="text-2xl justify-center items-center col-span-full row-start-1 lg:items-stretch lg:col-start-2 lg:col-span-2 lg:flex-col lg:justify-start gap-4 flex sticky py-8 top-16 bg-base-200 z-40"
	>
		<h1 class="text-2xl text-center font-bold" on:click={handleNewRoundClick}>
			{$state?.currentRoom.name}
		</h1>
		<button class="btn btn-secondary btn-outline" on:click={handleNewRoundClick}>
			New round
		</button>
		<button class="btn btn-secondary" on:click={handleRevealClick}>
			{$state?.currentRoom.showCards ? 'Hide' : 'Reveal'}
		</button>
	</div>

	<!-- PLAYED CARDS -->
	<div
		class="text-2xl col-span-full row-start-2 grid-cols-2 px-6 sm:px-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 lg:col-start-4 lg:col-end-10 lg:row-start-1 xl:col-start-4 xl:col-end-12 grid justify-start"
	>
		{#each Object.entries(round || {}).filter(([id]) => id !== 'placeholder') as [playerId, { playerName, value, pattern }] (playerId)}
			<div class="flex flex-col items-center">
				<div>{playerName}</div>
				<span class="transform scale-75">
					<Card {value} {pattern} isFaceDown={!$state?.currentRoom.showCards} />
				</span>
			</div>
		{/each}
	</div>

	<!-- CARD OPTIONS -->
	<div
		class="flex col-span-full sticky bottom-0 space-x-4 w-full overflow-x-scroll overflow-y-visible py-8 px-8 mt-auto"
	>
		{#each cardValues as value}
			<div
				class="transform transition-all"
				class:scale-110={currentPlay?.value === value}
				class:-translate-y-4={currentPlay?.value === value}
				on:click={() => handleCardClick(value)}
			>
				<Card {value} />
			</div>
		{/each}
	</div>
</div>
