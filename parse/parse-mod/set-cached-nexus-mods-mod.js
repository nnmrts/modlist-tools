import { keyPrefix, kv } from "./_common/_exports.js";

/**
 * @import { NexusModsMod } from "./_common/_exports.js";
 */

/**
 * Set the cached mod.
 *
 * @param {object} options - The options object.
 * @param {string} options.game - The game.
 * @param {number} options.modId - The mod id.
 * @param {NexusModsMod} options.mod - The mod.
 * @example
 */
const setCachedNexusModsMod = async ({
	game, mod, modId
}) => {
	const key = [
		...keyPrefix,
		game,
		modId
	];

	await kv.set(key, mod);
};

export default setCachedNexusModsMod;
