// @ts-nocheck
import {
	basename, dirname, join
} from "@std/path";

import { counting } from "@radashi-org/radashi";

import {
	game,
	isVanillaMod,
	modlistModifiedFilePath,
	parseOutputModifiedFilePath
} from "./_common/_exports.js";
import { convertTagsToCategory } from "./stringify/_exports.js";

/**
 * @import { Mod } from "./_common/_exports.js";
 */

const {
	readTextFile,
	writeTextFile
} = Deno;

const parseOutputModifiedFileContent = await readTextFile(parseOutputModifiedFilePath);

const mods = JSON.parse(parseOutputModifiedFileContent).map(({ files, ...rest }) => rest);

/**
 *
 * @param mods
 * @param ungroupedMods
 * @example
 */
const groupMods = (ungroupedMods) => [
	...Map.groupBy(
		ungroupedMods,
		({ tags }) => {
			const category = convertTagsToCategory(tags);

			if (category.replaceAll(/\(.*?\)/gu, "").includes(" | ")) {
				return category;
			}

			return category.split(" > ")[0];
		}
	)
]
	.map(([category, modsInCategory]) => [
		category,
		[
			...modsInCategory
				.filter(({ tags }) => {
					const innerCategory = convertTagsToCategory(tags);

					return !innerCategory.includes(" > ") || innerCategory.replaceAll(/\(.*?\)/gu, "").includes(" | ");
				}),
			...groupMods(
				modsInCategory
					.filter(({ tags }) => {
						const innerCategory = convertTagsToCategory(tags);

						return !(!innerCategory.includes(" > ") || innerCategory.replaceAll(/\(.*?\)/gu, "").includes(" | "));
					})
					.map(({ tags, ...rest }) => ({
						...rest,
						tags: tags
							.filter((tag) => tag.includes(" > "))
							.map((tag) => tag.split(" > ").slice(1).join(" > "))
					}))
			)
		]
	])
	.toSorted(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB));

/**
 *
 * @param modTree
 * @param level
 * @example
 */
const stringifyToModlistMods = (modTree, level = 0) => modTree.map(([separator, modsOrTrees]) => [
	`-${"-".repeat(level)}${separator}_separator`,
	...modsOrTrees
		.filter((modOrTree) => !Array.isArray(modOrTree))
		.map(({ enabled, name }) => {
			const prefix = isVanillaMod({
				game,
				mod: { name }
			})
				? "*"
				: (
					enabled
						? "+"
						: "-"
				);

			return `${prefix}${name}`;
		}),
	...modsOrTrees
		.filter((modOrTree) => Array.isArray(modOrTree))
		.map((tree) => stringifyToModlistMods([tree], level + 1))
]
	.join("\n"))
	.join("\n");

/**
 *
 * @param mods
 * @example
 */
const stringifyToModlist = (mods) => {
	const tree = groupMods(mods);

	const mainText = stringifyToModlistMods(tree)
		.split("\n")
		.toReversed()
		.join("\n");

	return `# This file was automatically generated by Mod Organizer.\n${mainText}\n`;
};

await writeTextFile(modlistModifiedFilePath, stringifyToModlist(mods));
