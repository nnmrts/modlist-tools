/*
	eslint-disable

	import-x/unambiguous,
	unicorn/no-empty-file,
	unicorn/prevent-abbreviations
	--
	jsdoc
*/

/**
 * @import { LootExactFilePath, Url } from "./_common/_exports.js";
 * @import { LootFilePath, LootLocation, LootMessage, LootTag, LootCleaningData, LootFile } from "./loot-plugin/_exports.js";
 */

/**
 * This is the structure that brings all the others together, and forms the main component of a metadata file. It is a key-value map.
 *
 * @typedef {object} LootPlugin
 * @property {LootFilePath} name
 * Can be an exact plugin filename or a regular expression plugin filename. If the filename contains any of the characters `:*?|`, the string will be treated as a regular expression, otherwise it will be treated as an exact filename. For example, `Example\.esm` will be treated as a regular expression, as it contains a `\` character.
 *
 * Regular expression plugin filenames must be written in [modified ECMAScript](https://en.cppreference.com/w/cpp/regex/ecmascript) syntax.
 * @property {string} [group]
 * The name of the group the plugin belongs to. If unspecified, defaults to `default`.
 *
 * The named group must exist when LOOT sorts plugins, but doesn't need to be defined in the same metadata file. If at sort time the group does not exist, a sorting error will occur.
 *
 * The plugin must load after all the plugins in the groups its group is defined to load after, resolving them recursively. An exception exists if doing so would introduce a cyclic dependency between two plugins without any other group loading rules applied.
 *
 * For example, if for plugins A.esp, B.esp, C.esp and D.esp:
 *
 * - B.esp has A.esp as a master
 * - A.esp is in group A
 * - B.esp and C.esp are in the default group
 * - D.esp is in group D
 * - group A loads after the default group
 * - the default group loads after group D
 *
 * Then the load order must be D.esp, C.esp, A.esp, B.esp. Although A.esp's group must load after B.esp's group, this would cause a cycle between A.esp and B.esp, so the requirement is ignored for that pair of plugins.
 *
 * However, if for plugins A.esp, B.esp and C.esp in groups of the same names:
 *
 * 1. group B loads after group A
 * 2. group C loads after group B
 * 3. A.esp has C.esp as a master
 *
 * This will cause a sorting error, as neither group rule introduces a cyclic dependency when combined in isolation with the third rule, but having all three rules applied causes a cycle.
 * @property {readonly (LootFile|LootExactFilePath)[]} [after]
 * Plugins that this plugin must load after, but which are not dependencies. Used to resolve specific compatibility issues. If undefined, the set is empty.
 *
 * > [!NOTE]
 * > since an `after` entry uses a `file` structure, its `name` value can't be a regex. This applies to `req` & `inc` entries too.
 * @property {readonly (LootFile|LootExactFilePath)[]} [req]
 * Files that this plugin requires to be present. This plugin will load after any plugins listed. If any of these files are missing, an error message will be displayed. Intended for use specifying implicit dependencies, as LOOT will detect a plugin's explicit masters itself. If undefined, the set is empty.
 *
 * > [!NOTE]
 * > if a `condition` is used in a `req` entry, a requirement message will only be displayed if the file isn't present *and* the `condition` is true.
 * @property {readonly (LootFile|LootExactFilePath)[]} [inc]
 * Files that this plugin is incompatible with. If any of these files are present, an error message will be displayed. If undefined, the set is empty.
 * @property {readonly LootMessage[]} [msg]
 * The messages attached to this plugin. The messages will be displayed in the order that they are listed. If undefined, the list is empty.
 * @property {readonly LootTag[]} [tag]
 * Bash Tags suggested for this plugin. If a Bash Tag is suggested for both addition and removal, the latter will override the former when the list is evaluated. If undefined, the set is empty.
 * @property {readonly (Url|LootLocation)[]} [url]
 * An unordered set of locations for this plugin. If the same version can be found at multiple locations, only one location should be recorded. If undefined, the set is empty. This metadata is not currently used by LOOT.
 * @property {readonly LootCleaningData[]} [dirty]
 * An unordered set of cleaning data structures for this plugin, identifying dirty plugins.
 * @property {readonly LootCleaningData[]} [clean]
 * An unordered set of cleaning data structures for this plugin, identifying clean plugins. The `itm`, `udr` and `nav` fields are unused in this context, as they're assumed to be zero.
 */
