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

		interval = setInterval(state.refreshCurrentRoom.bind(state), 5000);
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

<h1 class="text-6xl text-center pt-4 mb-8">{$state?.currentRoom.name}</h1>
<div class="text-2xl flex space-x-2 justify-center">
	<button class="btn btn-secondary mb-20" on:click={handleRevealClick}>
		{$state?.currentRoom.showCards ? 'Hide' : 'Reveal'}
	</button>
	<button class="btn btn-secondary mb-20" on:click={handleNewRoundClick}> New round </button>
</div>

<div class="text-2xl flex space-x-2 justify-center">
	{#each Object.entries(round || {}).filter(([id]) => id !== 'placeholder') as [playerId, { playerName, value, pattern }] (playerId)}
		<div class="flex flex-col items-center" animate:flip>
			<div>{playerName}</div>
			<span class="transform scale-75">
				<Card {value} {pattern} isFaceDown={!$state?.currentRoom.showCards} />
			</span>
		</div>
	{/each}
</div>

<div class="flex space-x-4 w-full overflow-x-scroll justify-center fixed bottom-0 px-10 py-8">
	{#each cardValues as value}
		<div
			class="flex-shrink-0 transform transition-all"
			class:scale-110={currentPlay?.value === value}
			class:-translate-y-4={currentPlay?.value === value}
			on:click={() => handleCardClick(value)}
		>
			<Card {value} />
		</div>
	{/each}
</div>
