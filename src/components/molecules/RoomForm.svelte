<script>
	import { makeRoom } from '../../room/roomApi';

	export let isLoading = false;
	export let room = makeRoom();
	export let onSave = () => {};
	export let onCancel = () => {};
</script>

<div class="flex flex-col space-y-4">
	<label for="name" class="label flex flex-col space-y-4 items-start">
		<span class="label-text">Room Name</span>
		<input id="name" class="input pr-16" bind:value={room.name} placeholder="Player Name" />
	</label>
	<div class="flex space-x-2 justify-end">
		<button class="btn btn-ghost" on:click={onCancel}>Cancel</button>
		<button class="btn btn-primary" class:loading={isLoading} on:click={() => onSave(room)}>
			Save
		</button>
	</div>
</div>
