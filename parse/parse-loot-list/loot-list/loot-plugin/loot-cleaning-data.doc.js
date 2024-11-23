/*
	eslint-disable

	import-x/unambiguous,
	unicorn/no-empty-file,
	unicorn/prevent-abbreviations
	--
	jsdoc
*/

/**
 * @import { LootLocalisedContent } from "./_common/_exports.js";
 */

/**
 * LOOT metadata files can contain suggestions for the addition or removal of Bash Tags, and this is the structure used for them.
 *
 * @typedef {object} LootCleaningData
 * @property {number} crc
 * The CRC-32 checksum of the plugin. If the plugin is dirty, this needs to be the CRC of the plugin before cleaning. LOOT displays the CRCs of installed plugins in its report. The 8-character CRC should be preceded by `0x` so that it is interpreted correctly.
 * @property {string} util
 * The utility that was used to check the plugin for dirty edits. If available, the version of the utility used should also be included (e.g. `TES5Edit v3.11`). The string will be interpreted as CommonMark.
 * @property {string|LootLocalisedContent} [detail]
 * A message that will be displayed to the user. If a string is provided, it will be interpreted as CommonMark. If a localised content list is provided, one of the structures must be for English. This is only used if the plugin is dirty, and is intended for providing cleaning instructions to the user. If undefined, defaults to an empty string.
 * @property {number} [itm]
 * The number of identical-to-master records reported for the dirty plugin. If undefined, defaults to zero.
 * @property {number} [udr]
 * The number of undeleted records reported for the dirty plugin. If undefined, defaults to zero.
 * @property {number} [nav]
 * The number of deleted navmeshes reported for the dirty plugin. If undefined, defaults to zero.
 */
