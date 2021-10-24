export const makeRoom = ({ key, name, rounds, showCards } = {}) => ({
	key: key || null,
	name: name || '',
	rounds: rounds || [{}],
	showCards: showCards || false
});
