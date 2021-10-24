<script>
	import { v4 as uuid } from 'uuid';
	import { onMount } from 'svelte';
	import InitialForm from '../components/pages/InitialForm.svelte';
	import RoomList from '../components/pages/RoomList.svelte';

	let playerName = '';

	onMount(() => {
		playerName = localStorage.getItem('name');

		if (!localStorage.getItem('id')) {
			localStorage.setItem('id', uuid());
		}
	});
</script>

<div
	class="inline-flex flex-wrap gap-8 sm:justify-start justify-center max-w-screen-xl p-12 mx-auto w-full"
>
	{#if playerName}
		<RoomList />
	{:else}
		<div class="w-full flex justify-center pt-40">
			<InitialForm
				onSubmit={(newName) => {
					playerName = newName;
				}}
			/>
		</div>
	{/if}
</div>
