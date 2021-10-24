<script>
	import { makeRoom } from '../../room/roomApi';
	import Modal from '../atoms/Modal.svelte';
	import RoomForm from '../molecules/RoomForm.svelte';

	export let isLoading = false;
	export let room = makeRoom();
	export let onSubmit = () => {};
	export let openModal = () => {};
	export let closeModal = () => {};

	const handleRoomFormCancel = () => {
		closeModal();
	};
</script>

<Modal bind:openModal bind:closeModal>
	<div class="card bg-base-200" on:click|stopPropagation>
		<div class="card-body">
			<RoomForm {room} {isLoading} onCancel={handleRoomFormCancel} onSave={onSubmit} />
		</div>
	</div>
</Modal>
