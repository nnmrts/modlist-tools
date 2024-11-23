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
 */

/**
 * Messages are given as key-value maps.
 *
 * @typedef {object} LootMessage
 * @property {"error"|"say"|"warn"} type
 * The type string can be one of three keywords.
 *
 * - `say`: A generic message, useful for miscellaneous notes.
 * - `warn`: A warning message, describing a non-critical issue with the user's mods (e.g., dirty mods).
 * - `error`: An error message, describing a critical installation issue (e.g., missing masters, corrupt plugins).
 * @property {string|readonly LootLocalisedContent[]} content
 * Either simply a CommonMark string, or a list of localised content data structures. If the latter, one of the structures must be for English.
 * @property {LootConditionString} condition
 * A condition string that is evaluated to determine whether the message should be displayed: if it evaluates to true, the message is displayed, otherwise it is not.
 * @property {readonly string[]} subs
 * A list of CommonMark strings to be substituted into the message content string. The content string must use numbered specifiers (`{0}`, `{1}`, etc.), where the numbers correspond to the position of the substitution string in this list to use, to denote where these strings are to be substituted.
 */
