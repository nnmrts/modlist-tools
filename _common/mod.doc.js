/*
	eslint-disable

	import-x/unambiguous,
	unicorn/no-empty-file
	--
	jsdoc
*/

/**
 * @import { ModFile, ModRequirement } from "./mod.doc/_exports.js";
 */

/**
 * @typedef {object} Mod
 * @property {string} name - The mod name.
 * @property {string|null} summary - The mod summary.
 * @property {readonly ModFile[]} files - The mod files.
 * @property {readonly string[]} tags - The mod tags.
 * @property {number|null} id - The Nexus Mods ID or for vanilla mods a manually assigned nonpositive number.
 * @property {readonly (number|ModRequirement)[]} requirements - The requirements.
 */
