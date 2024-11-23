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
 * 	LootConditionString
 * } from "./_common/_exports.js";
 */

/**
 * LOOT metadata files can contain suggestions for the addition or removal of Bash Tags, and this is the structure used for them.
 *
 * @typedef {object} LootTag
 * @property {string} name
 * A Bash Tag, prefixed with a minus sign if it is suggested for removal.
 * @property {LootConditionString} condition
 * A condition string that is evaluated to determine whether the message should be displayed: if it evaluates to true, the message is displayed, otherwise it is not.
 */
