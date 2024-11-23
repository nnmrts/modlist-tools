import { keyPrefix, kv } from "./_common/_exports.js";

/**
 * @import { NexusModsMod } from "./_common/_exports.js";
 */

/**
 * Get the cached mod.
 *
 * @param {object} options - The options object.
 * @param {string} options.game - The game.
 * @param {number} options.modId - The mod id.
 * @returns {Promise<NexusModsMod|null>} - The mod.
 * @example
 */
const getCachedNexusModsMod = async ({ game, modId }) => {
	const key = [
		...keyPrefix,
		game,
		modId
	];

	/**
	 * @type {Deno.KvEntryMaybe<NexusModsMod>}
	 */
	const { value: cachedModInfo } = await kv.get(key);

	return cachedModInfo;
};

export default getCachedNexusModsMod;
