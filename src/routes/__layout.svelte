<script>
	import '../app.css';
	import { state } from '../state';
	import { isClient } from '../helpers';

	const patternList = [
		{ value: 'yyy', label: 'Default' },
		{ value: 'jigsaw', label: 'Jigsaw' },
		{ value: 'piano', label: 'Piano' },
		{ value: 'food', label: 'Food' },
		{ value: 'kiwi', label: 'Kiwi' },
		{ value: 'steelbeams', label: 'Steelbeams' },
		{ value: 'brickwall', label: 'Brickwall' },
		{ value: 'bubbles', label: 'Bubbles' },
		{ value: 'skulls', label: 'Skulls' }
	];

	const themeList = [
		{ value: '', label: 'Default' },
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'cupcake', label: 'Cupcake' },
		{ value: 'bumblebee', label: 'Bumblebee' },
		{ value: 'emerald', label: 'Emerald' },
		{ value: 'corporate', label: 'Corporate' },
		{ value: 'synthwave', label: 'Synthwave' },
		/* { value: 'retro', label: 'Retro' }, */
		{ value: 'cyberpunk', label: 'Cyberpunk' },
		/* { value: 'valentine', label: 'Valentine' }, */
		{ value: 'halloween', label: 'Halloween' },
		/* { value: 'garden', label: 'Garden' }, */
		{ value: 'forest', label: 'Forest' },
		{ value: 'aqua', label: 'Aqua' },
		{ value: 'lofi', label: 'Lofi' },
		{ value: 'pastel', label: 'Pastel' },
		{ value: 'fantasy', label: 'Fantasy' },
		{ value: 'wireframe', label: 'Wireframe' },
		{ value: 'black', label: 'Black' },
		/* { value: 'luxury', label: 'Luxury' }, */
		{ value: 'dracula', label: 'Dracula' }
	];

	let theme = (isClient() && localStorage.getItem('theme')) || '';
	$: isClient() && localStorage.setItem('theme', theme);

	$: cardPattern = $state?.cardPattern || 'yyy';
	$: state?.setCardPattern(cardPattern);
</script>

<div
	class="bg-base-200 w-full h-full overflow-y-scroll text-base-content flex flex-col"
	data-theme={theme}
>
	<div
		class="flex justify-between items-center px-8 py-4 sticky top-0 bg-base-300 shadow z-50 gap-6"
	>
		<h1 class="text-xl font-bold">{$state?.currentRoom.name}</h1>
		<span class="flex gap-4 overflow-x-scroll sm:overflow-x-hidden px-4">
			<select class="select select-sm w-36" bind:value={cardPattern}>
				{#each patternList as { value, label }}
					<option {value} selected={value === theme}>{label}</option>
				{/each}
			</select>
			<select class="select select-sm w-36" bind:value={theme}>
				{#each themeList as { value, label }}
					<option {value} selected={value === theme}>{label}</option>
				{/each}
			</select>
		</span>
	</div>
	<slot />
</div>
