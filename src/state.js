import { writable } from 'svelte/store';
import { makeRoom } from './room/roomApi';
import { Rooms } from './deta';
import { isClient } from './helpers';

const makeState = ({ rooms = [], currentRoom = makeRoom() } = {}) => ({
	rooms,
	currentRoom,
	cardPattern: isClient() && localStorage.getItem('cardPattern')
});

export const state = (() => {
	let currentState = makeState();
	const { subscribe, set, update } = writable(currentState);
	subscribe((newState) => {
		currentState = newState;
	});

	return {
		subscribe,
		set,
		update,

		// Config
		setCardPattern(cardPattern) {
			if (!isClient()) {
				return;
			}

			const playerId = localStorage.getItem('id');
			const lastRoundIndex = currentState.currentRoom.rounds.length - 1;
			const currentRound = currentState.currentRoom.rounds[lastRoundIndex] || {};

			set({ ...currentState, cardPattern });
			localStorage.setItem('cardPattern', cardPattern);

			if (currentRound[playerId]) {
				console.log(`playerId`, playerId);
				this.chooseCard(currentRound[playerId].value);
			}
		},

		// Rooms list
		async fetchRooms() {
			return Rooms.fetch().then(({ items }) =>
				set({
					...currentState,
					rooms: items.map(makeRoom)
				})
			);
		},
		async saveRoom(newRoom) {
			const { key, ...room } = makeRoom(newRoom);

			return Rooms.insert(room, key).finally(this.fetchRooms.bind(this));
		},
		async deleteRoom(roomKey) {
			return Rooms.delete(roomKey).finally(this.fetchRooms.bind(this));
		},

		// Rooms
		async loadRoom(roomKey) {
			return Rooms.get(roomKey).then((dbRoom) =>
				set({
					...currentState,
					currentRoom: makeRoom(dbRoom)
				})
			);
		},
		async refreshCurrentRoom() {
			if (currentState.currentRoom.key) {
				this.loadRoom(currentState.currentRoom.key);
			}
		},
		async toggleRevealCards() {
			const newState = {
				...currentState,
				currentRoom: {
					...currentState.currentRoom,
					showCards: !currentState.currentRoom.showCards
				}
			};
			set(newState);

			Rooms.update(
				{
					showCards: newState.currentRoom.showCards
				},
				currentState.currentRoom.key
			).finally(this.refreshCurrentRoom.bind(this));
		},
		async chooseCard(value) {
			const playerId = localStorage.getItem('id');
			const card = {
				playerName: localStorage.getItem('name'),
				pattern: currentState.cardPattern,
				value
			};
			const lastRoundIndex = currentState.currentRoom.rounds.length - 1;
			const currentRound = currentState.currentRoom.rounds[lastRoundIndex] || {};
			const restOfTheRounds = currentState.currentRoom.rounds.slice(0, lastRoundIndex);

			const newState = {
				...currentState,
				currentRoom: {
					...currentState.currentRoom,
					rounds: [
						...restOfTheRounds,
						{
							...currentRound,
							[playerId]: card
						}
					]
				}
			};
			set(newState);

			Rooms.update(
				{ [`rounds[${lastRoundIndex}].${playerId}`]: card },
				currentState.currentRoom.key
			).finally(this.refreshCurrentRoom.bind(this));
		},
		async newRound() {
			const newState = {
				...currentState,
				currentRoom: {
					...currentState.currentRoom,
					rounds: [...currentState.currentRoom.rounds, {}]
				}
			};
			set(newState);
			const { key, ...changes } = currentState.currentRoom;

			Rooms.update(
				{ rounds: Rooms.util.append({ placeholder: true }) },
				currentState.currentRoom.key
			).finally(this.refreshCurrentRoom.bind(this));
		}
	};
})();
