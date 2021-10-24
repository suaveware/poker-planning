<script>
	export let onSubmit = () => {};

	let name = '';

	const handleGoOnClick = () => {
		localStorage.setItem('name', name);
		onSubmit(name);
	};
</script>

<label for="name" class="label flex flex-col space-y-4 items-start">
	<span class="label-text">First Time? Pick a name.</span>
	<span class="relative">
		<input id="name" class="input pr-16" bind:value={name} placeholder="Player Name" />
		<button
			class="absolute top-0 right-0 rounded-l-none btn btn-primary"
			on:click={handleGoOnClick}
		>
			go
		</button>
	</span>
</label>
