import vanillaMods from "../_common/vanilla-mods.js";

/**
 * @import { Mod } from "../_common/mod.doc.js";
 */

/**
 * Parse a vanilla mod
 *
 * @param {object} options - The options object.
 * @param {string} options.game - The game.
 * @param {Mod} options.mod - The mod.
 * @returns {Mod} - The result.
 * @example
 */
const parseVanillaMod = ({
	game,
	mod: {
		name
	}
}) => {
	const vanillaModsForGame = vanillaMods.get(game);

	if (vanillaModsForGame === undefined) {
		throw new Error(`No vanilla mods for game: ${game}`);
	}

	const mod = vanillaModsForGame
		.find(({ name: vanillaModName }) => vanillaModName === name);

	if (mod === undefined) {
		throw new Error(`Vanilla mod not found: ${name}`);
	}

	return mod;
};

export default parseVanillaMod;
