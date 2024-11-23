/*
	eslint-disable

	import-x/unambiguous,
	unicorn/no-empty-file,
	unicorn/prevent-abbreviations
	--
	jsdoc
*/

/**
 * @import { LootGroup, LootPlugin } from "./loot-list/_exports.js";
 */

/**
 * @typedef {object} LootList
 * @property {readonly LootGroup[]} groups
 * A set of group data structures that represent the groups that plugins can belong to.
 * @property {readonly LootPlugin[]} plugins
 * The plugin data structures that hold all the plugin metadata within the
 * file. It is a mixture of a list and a set because **no non-regex plugin
 * value may be equal to any other non-regex plugin value** , but there may
 * be any number of equal regex plugin values, and non-regex plugin values
 * may be equal to regex plugin values. If multiple plugin values match a
 * single plugin, their metadata is merged in the order the values are
 * listed, and as defined in `plugin-merging`{.interpreted-text
 * role="ref"}.
 */
