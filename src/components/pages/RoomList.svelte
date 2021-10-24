<script>
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import { state } from '../../state';
	import RoomFormModal from '../organisms/RoomFormModal.svelte';
	import Modal from '../atoms/Modal.svelte';

	let isSaveRoomLoading = false;
	let deletingRoomKey = '';
	let isDeleteRoomLoading = false;
	let openForm = () => {};
	let closeForm = () => {};
	let openDeleteConfirmation = () => {};
	let closeDeleteConfirmation = () => {};

	onMount(() => {
		state.fetchRooms();
	});

	const handlePlusClick = () => {
		openForm();
	};

	const handleRoomFormSubmit = (newRoom) => {
		isSaveRoomLoading = true;
		state
			.saveRoom(newRoom)
			.then(() => {
				closeForm();
			})
			.finally(() => {
				isSaveRoomLoading = false;
			});
	};

	const handleRoomClick = (roomKey) => {
		goto(roomKey);
	};

	const handleDeleteClick = (roomKey) => {
		deletingRoomKey = roomKey;
		openDeleteConfirmation();
	};

	const handleDeleteConfirmed = () => {
		isDeleteRoomLoading = true;
		state
			.deleteRoom(deletingRoomKey)
			.then(closeDeleteConfirmation)
			.finally(() => {
				isDeleteRoomLoading = false;
			});
	};
</script>

<Modal bind:openModal={openDeleteConfirmation} bind:closeModal={closeDeleteConfirmation}>
	<div class="modal-box" on:click|stopPropagation>
		Are you sure you want to delete this room? It will be deleted for everyone.
		<div class="modal-action">
			<button class="btn btn-ghost" on:click={closeDeleteConfirmation}>Cancel</button>
			<button
				class="btn btn-error"
				class:loading={isDeleteRoomLoading}
				on:click={handleDeleteConfirmed}>Delete</button
			>
		</div>
	</div>
</Modal>

<RoomFormModal
	isLoading={isSaveRoomLoading}
	bind:openModal={openForm}
	bind:closeModal={closeForm}
	onSubmit={handleRoomFormSubmit}
/>

{#each $state.rooms as room (room.key)}
	<button
		class="relative btn btn-primary w-40 h-40"
		animate:flip={{ duration: 200 }}
		on:click={() => handleRoomClick(room.key)}
	>
		<span>{room.name}</span>
		<span class="absolute inset-0 opacity-0 hover:opacity-100 transition-all">
			<button
				class="absolute right-2 top-2 btn btn-square btn-ghost btn-sm text-primary-content"
				on:click|stopPropagation={() => handleDeleteClick(room.key)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
			</button>
		</span>
	</button>
{/each}

<button class="relative btn btn-accent btn-outline w-40 h-40" on:click={handlePlusClick}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
	</svg>
</button>
