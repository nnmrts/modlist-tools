import {
	join
} from "@std/path";

import {
	game,
	isVanillaMod,
	modlistFilePath,
	modsFolderPath,
	parseOutputFilePath,
	parseOutputModifiedFilePath
} from "./_common/_exports.js";
import {
	parseLootLists,
	parseMod,
	parseVanillaMod
} from "./parse/_exports.js";

/**
 * @import { Mod } from "./_common/_exports.js";
 */

const {
	errors: {
		NotFound
	},
	readDir,
	readTextFile,
	stat,
	writeTextFile
} = Deno;

const modlistFileContent = await readTextFile(modlistFilePath);

const rawMods = modlistFileContent
	.split(/\r?\n/u)
	.filter((line) => (
		(
			line.startsWith("*") || line.startsWith("+") || line.startsWith("-")
		) &&
		!line.endsWith("_separator")
	))
	.map((line) => ({
		enabled: !line.startsWith("-"),
		name: line.slice(1).trim()
	}))
	.toReversed();

const modsFolderEntries = await Array.fromAsync(readDir(modsFolderPath));

const modFolderNames = new Set(modsFolderEntries
	.filter(({ isDirectory }) => isDirectory)
	.map(({ name }) => name));

/**
 * @type {Mod[]}
 */
const mods = [];

for (const { enabled, name } of rawMods) {
	/**
	 * @type {Mod}
	 */
	let mod = {
		id: null,
		enabled,
		files: [],
		name,
		requirements: [],
		summary: null,
		tags: []
	};

	console.info(`Parsing ${name}...`);

	if (modFolderNames.has(name)) {
		const modFolderPath = join(modsFolderPath, name);

		mod = {
			...mod,
			...(await parseMod(modFolderPath))
		};
	}
	else if (
		isVanillaMod({
			game,
			mod
		})
	) {
		mod = {
			...mod,
			...parseVanillaMod({
				game,
				mod
			})
		};
	}

	mods.push(mod);
}

await parseLootLists();

const parseOutputFileContent = JSON.stringify(mods, null, "\t");

await writeTextFile(parseOutputFilePath, parseOutputFileContent);

try {
	await stat(parseOutputModifiedFilePath);
}
catch (error) {
	if (error instanceof NotFound) {
		await writeTextFile(parseOutputModifiedFilePath, parseOutputFileContent);
	}
}
