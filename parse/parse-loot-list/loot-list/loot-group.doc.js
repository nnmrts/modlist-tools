/*
	eslint-disable

	import-x/unambiguous,
	unicorn/no-empty-file,
	unicorn/prevent-abbreviations
	--
	jsdoc
*/

/**
 * Groups represent sets of plugins, and are a way to concisely and extensibly load sets of plugins after other sets of plugins.
 *
 * This structure can be used to hold group definitions. It is a key-value map.
 *
 * @typedef {object} LootGroup
 * @property {string} name
 * A case-sensitive name that identifies the group.
 * @property {string} [description]
 * A CommonMark description of the group, e.g. what sort of plugins it contains. If undefined, the description is an empty string.
 * @property {readonly string[]} [after]
 * The names of groups that this group loads after. Group names are case-sensitive. If undefined, the set is empty. The named groups must be defined when LOOT sorts plugins, but they don’t need to be defined in the same metadata file.
 *
 * Sorting errors will occur if:
 *
 * - A group loads after another group that does not exist.
 * - Group loading is cyclic (e.g. A loads after B and B loads after A).
 */
