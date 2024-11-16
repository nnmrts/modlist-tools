import { vanillaMods } from "./_common/_exports.js";

/**
 * @import { Mod } from "../_common/mod.doc.js";
 */

/**
 * Check if a mod is a vanilla mod.
 *
 * @param {object} options - The options object.
 * @param {string} options.game - The game.
 * @param {Mod} options.mod - The mod.
 * @returns {boolean} - The result.
 * @example
 */
const isVanillaMod = ({ game, mod: { name } }) => {
	const vanillaModsForGame = vanillaMods.get(game);

	if (vanillaModsForGame === undefined) {
		return false;
	}

	return vanillaModsForGame.some(({ name: vanillaModName }) => vanillaModName === name);
};

export default isVanillaMod;
