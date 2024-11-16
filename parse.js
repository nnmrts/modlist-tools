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
	build: {
		os
	},
	env,
	readDir,
	readTextFile,
	writeTextFile
} = Deno;

const {
	game,
	modlistRawFilePath,
	modsRawFolderPath,
	nexusModsApiKey,
	parseOutputRawFilePath,
	pluginsRawFilePath
} = Object.fromEntries(
	[
		["game", "GAME"],
		["nexusModsApiKey", "NEXUS_MODS_API_KEY"],
		["modlistRawFilePath", "MODLIST_FILE_PATH"],
		["modsRawFolderPath", "MODS_FOLDER_PATH"],
		["parseOutputRawFilePath", "PARSE_OUTPUT_FILE_PATH"],
		["pluginsRawFilePath", "PLUGINS_FILE_PATH"]
	]
		.map(([key, variable]) => {
			const value = env.get(variable);

			if (value === undefined) {
				throw new Error(`${variable} environment variable is not set.`);
			}

			return [key, value];
		})
);

const {
	modlistFilePath,
	modsFolderPath,
	parseOutputFilePath,
	pluginsFilePath
} = Object.fromEntries(
	Object.entries({
		modlistRawFilePath,
		modsRawFolderPath,
		parseOutputRawFilePath,
		pluginsRawFilePath
	})
		.map(([key, rawPath]) => {
			const normalKey = key
				.replace(/Raw(?=(?:File|Folder)Path$)/u, "");

			if (os === "windows") {
			// const shorthandMatches = rawPath.matchAll(/%(?<variable>[^%]+)%/gu);

				return [
					normalKey,
					rawPath
						.replaceAll(
							/%(?<variable>[^%]+)%/gu,
							(...replaceArguments) => {
								const { variable: environmentVariable } = replaceArguments.at(-1);

								if (environmentVariable === undefined) {
									throw new Error(`Environment variable ${environmentVariable} not found.`);
								}

								return environmentVariable;
							}
						)
				];
			}

			return [normalKey, rawPath];
		})
);

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
							apikey: nexusModsApiKey
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
