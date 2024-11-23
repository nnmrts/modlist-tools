import { join } from "@std/path";

import {
	game,
	modlistFilePath,
	modsFolderPath,
	parseOutputFilePath
} from "./_common/_exports.js";
import {
	isVanillaMod,
	parseLootLists,
	parseMod,
	parseVanillaMod
} from "./parse/_exports.js";

/**
 * @import { Mod } from "./_common/_exports.js";
 */

const {
	readDir,
	readTextFile,
	writeTextFile
} = Deno;

const modlistFileContent = await readTextFile(modlistFilePath);

const enabledMods = modlistFileContent
	.split(/\r?\n/u)
	.filter((line) => line.startsWith("*") || line.startsWith("+"))
	.map((line) => line.slice(1).trim())
	.toReversed();

const modsFolderEntries = await Array.fromAsync(readDir(modsFolderPath));

const modFolderNames = new Set(modsFolderEntries
	.filter(({ isDirectory }) => isDirectory)
	.map(({ name }) => name));

/**
 * @type {Mod[]}
 */
const mods = [];

for (const modName of enabledMods) {
	/**
	 * @type {Mod}
	 */
	let mod = {
		id: null,
		files: [],
		name: modName,
		requirements: [],
		summary: null,
		tags: []
	};

	console.info(`Parsing ${modName}...`);

	if (modFolderNames.has(modName)) {
		const modFolderPath = join(modsFolderPath, modName);

		mod = await parseMod(modFolderPath);
	}
	else if (
		isVanillaMod({
			game,
			mod
		})
	) {
		mod = parseVanillaMod({
			game,
			mod
		});
	}

	mods.push(mod);
}

await parseLootLists();

const parseOutputFileContent = JSON.stringify(mods, null, "\t");

await writeTextFile(parseOutputFilePath, parseOutputFileContent);
