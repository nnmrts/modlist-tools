/*
	eslint-disable

	import-x/unambiguous,
	unicorn/no-empty-file
	--
	jsdoc
*/

/**
 * @import { ModFile } from "./mod.doc/_exports.js";
 */

/**
 * @typedef {object} Mod
 * @property {string} name - The mod name.
 * @property {string|null} summary - The mod summary.
 * @property {readonly ModFile[]} files - The mod files.
 * @property {readonly string[]} tags - The mod tags.
 */
