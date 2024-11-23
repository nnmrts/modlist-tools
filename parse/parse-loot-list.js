import { parse } from "@std/yaml";

import { unique } from "@radashi-org/radashi";

import { masterlistFilePath, userlistFilePath } from "../_common/environment.js";

/**
 * @import { LootList } from "./parse-loot-list/_exports.js";
 */

const {
	readTextFile
} = Deno;

/**
 *
 * @example
 */
const parseLootLists = async () => {
	const [
		{
			groups: masterlistGroups = [],
			plugins: masterlistPlugins = []
		},
		{
			groups: userlistGroups = [],
			plugins: userlistPlugins = []
		}
	] = await Promise.all(
		[masterlistFilePath, userlistFilePath].map(
			async (filePath) => {
				const fileContent = await readTextFile(filePath);

				return /** @type {LootList} */ (parse(fileContent));
			}
		)
	);

	console.log(
		masterlistPlugins
			.filter(({ group }) => group)
	);
};

export default parseLootLists;
