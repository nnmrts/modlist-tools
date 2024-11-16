import { walk } from "@std/fs";
import { parse } from "@std/ini";
import { join, relative } from "@std/path";

import {
	getCachedNexusModsMod, isVanillaMod, parseVanillaMod, setCachedNexusModsMod
} from "./parse/_exports.js";

/**
 * @import { Mod } from "./_common/_exports.js";
 */

const {
	cwd,
	env,
	readDir,
	readTextFile,
	writeTextFile
} = Deno;

const game = env.get("GAME");
const apiKey = env.get("NEXUS_MODS_API_KEY");

if (game === undefined) {
	throw new Error("GAME environment variable is not set.");
}

if (apiKey === undefined) {
	throw new Error("NEXUS_MODS_API_KEY environment variable is not set.");
}

const pathsFileName = "paths.json";

const pathsFilePath = join(cwd(), pathsFileName);

const pathsFileContent = await readTextFile(pathsFilePath);

const {
	modlist: modlistFilePath,
	mods: modsFolderPath,
	parseOutput: parseOutputFilePath,
	plugins: pluginsFilePath
} = JSON.parse(pathsFileContent);

const modlistFileContent = await readTextFile(modlistFilePath);

const enabledMods = modlistFileContent
	.split(/\r?\n/u)
	.filter((line) => line.startsWith("*") || line.startsWith("+"))
	.map((line) => line.slice(1).trim())
	.toReversed();

const pluginsFileContent = await readTextFile(pluginsFilePath);

const disabledPlugins = new Set(
	pluginsFileContent
		.split(/\r?\n/u)
		.filter((line) => !line.startsWith("*"))
		.map((line) => line.slice(1).trim())
);

const modsFolderEntries = await Array.fromAsync(readDir(modsFolderPath));

const modFolderNames = new Set(modsFolderEntries
	.filter(({ isDirectory }) => isDirectory)
	.map(({ name }) => name));

const nexusModsApiUrl = `https://api.nexusmods.com/v1/games/${game}/mods`;

/**
 * @type {Mod[]}
 */
const mods = [];

for (const modName of enabledMods) {
	/**
	 * @type {Mod}
	 */
	let mod = {
		files: [],
		name: modName,
		summary: null,
		tags: []
	};

	console.info(`Parsing ${modName}...`);

	if (modFolderNames.has(modName)) {
		const modFolderPath = join(modsFolderPath, modName);
		const modFolderWalkEntries = await Array.fromAsync(walk(modFolderPath, { skip: [/\.ini$/u] }));

		const modFilePaths = modFolderWalkEntries
			.filter(({ isFile }) => isFile)
			.map(({ path }) => ({
				enabled: !disabledPlugins.has(path),
				path: relative(modFolderPath, path),
				tags: []
			}));

		mod.files = modFilePaths;

		const metaFilePath = join(modFolderPath, "meta.ini");

		try {
			const metaFileContent = await readTextFile(metaFilePath);

			const {
				General: {
					modid: modIdString
				}
			} = /** @type {{General: {modid: string}}} */ (parse(metaFileContent));

			const modId = Number(modIdString);

			const nexusModsModUrl = `${nexusModsApiUrl}/${modId}.json`;

			const cachedNexusModsMod = await getCachedNexusModsMod({
				game,
				modId
			});

			if (cachedNexusModsMod === null) {
				const nexusModsModResponse = await fetch(
					nexusModsModUrl,
					{
						headers: new Headers({
							accept: "application/json",
							apikey: apiKey
						})
					}
				);

				if (nexusModsModResponse.ok) {
					const nexusModsMod = await nexusModsModResponse.json();

					await setCachedNexusModsMod({
						game,
						mod: nexusModsMod,
						modId
					});

					const {
						summary
					} = nexusModsMod;

					mod.summary = summary;
				}
			}
			else {
				mod.summary = cachedNexusModsMod.summary;
			}
		}
		catch {
			// do nothing
		}
	}
	else if (isVanillaMod({
		game,
		mod
	})) {
		mod = parseVanillaMod({
			game,
			mod
		});
	}

	mods.push(mod);
}

const parseOutputFileContent = JSON.stringify(mods, null, "\t");

await writeTextFile(parseOutputFilePath, parseOutputFileContent);
