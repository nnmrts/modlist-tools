/*
	eslint-disable

	import-x/unambiguous,
	unicorn/no-empty-file,
	unicorn/prevent-abbreviations
	--
	jsdoc
*/

/**
 * @import { Url } from "../_common/url.doc.js";
 */

/**
 * This data structure is used to hold information on where a plugin is hosted online. It has two forms: a key-value string map and a scalar string.
 *
 * @typedef {object} LootLocation
 * @property {Url} link
 * A URL at which the plugin is found.
 * @property {string} [name]
 * A descriptive name for the URL, which may be used as hyperlink text. If undefined, defaults to an empty string.
 */
