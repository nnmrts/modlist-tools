/*
	eslint-disable

	import-x/unambiguous,
	unicorn/no-empty-file,
	unicorn/prevent-abbreviations
	--
	jsdoc
*/

/**
 * @import {
 * 	LootLocalisedContent,
 * 	LootConditionString
 * } from "./_common/_exports.js";
 * @import { LootExactFilePath } from "../_common/loot-exact-file-path.doc.js";
 */

/**
 * @typedef {object} LootFile
 * @property {LootExactFilePath} name
 * An exact (ie. not regex) file path or name.
 * @property {string} [display]
 * A CommonMark string, to be displayed instead of the file path in any generated messages, eg. the name of the mod the file belongs to.
 * @property {string|(readonly LootLocalisedContent[])} detail
 * if this file causes an error message to be displayed (e.g. because it's a missing requirement), this detail message content will be appended to that error message. If a string is provided, it will be interpreted as CommonMark. If a localised content list is provided, one of the structures must be for English. If undefined, defaults to an empty string.
 * @property {LootConditionString} condition
 * A condition string that is evaluated to determine whether this file data should be used: if it evaluates to true, the data is used, otherwise it is ignored.
 */
