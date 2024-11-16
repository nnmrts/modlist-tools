import { join, relative } from "@std/path";
import { parse } from "@std/ini";
import { walk } from "@std/fs";

const {
	cwd,
	env,
	openKv,
	readTextFile,
	readDir,
	writeTextFile
} = Deno;

const pathsFileName = "paths.json";

const pathsFilePath = join(cwd(), pathsFileName);

const pathsFileContent = await readTextFile(pathsFilePath);

const {
	modlist: modlistFilePath,
	plugins: pluginsFilePath,
	mods: modsFolderPath,
	parseOutput: parseOutputFilePath
} = JSON.parse(pathsFileContent);

const modlistFileContent = await readTextFile(modlistFilePath);

const enabledMods = modlistFileContent
	.split(/\r?\n/)
	.filter(line => line.startsWith("*") || line.startsWith("+"))
	.map(line => line.slice(1).trim())
	.toReversed();

const pluginsFileContent = await readTextFile(pluginsFilePath);

const enabledPlugins = pluginsFileContent
	.split(/\r?\n/)
	.filter(line => line.startsWith("*"))
	.map(line => line.slice(1).trim());

const modsFolderEntries = await Array.fromAsync(readDir(modsFolderPath));

const modFolderNames = modsFolderEntries
	.filter(({ isDirectory }) => isDirectory)
	.map(({ name }) => name);

const nexusmodsApiUrl = `https://api.nexusmods.com/v1/games/${game}/mods`;

const modsWithPlugins = [];

const kv = await openKv();

const game = env.get("GAME");

for (const modName of enabledMods) {
	const modObject = {
		name: modName,
		files: [],
		tags: []
	}

	if (modFolderNames.includes(modName)) {
		const modFolderPath = join(modsFolderPath, modName);
		const modFolderWalkEntries = await Array.fromAsync(walk(modFolderPath, { skip: [/\.ini$/] }));

		const modFilePaths = modFolderWalkEntries
			.filter(({ isFile }) => isFile)
			.map(({ path }) => ({path: relative(modFolderPath, path), tags: []}));

		modObject.files = modFilePaths;

		const metaFilePath = join(modFolderPath, "meta.ini");

		try {
			const metaFileContent = await readTextFile(metaFilePath);

			const {
				General: {
					modid: modId
				}
			} = parse(metaFileContent);

			const modInfoUrl = `${nexusmodsApiUrl}/${modId}.json`;

			const {value: cachedModInfo} = await kv.get(["cache", game, modId]);

			if (cachedModInfo === null) {
				const modInfoResponse = await fetch(
					modInfoUrl,
					{
						headers: new Headers({
							"accept": "application/json",
							"apikey": env.get("NEXUSMODS_API_KEY")
						})
					}
				);
	
				if (modInfoResponse.ok) {
					const modInfo = await modInfoResponse.json();
	
					const {
						summary
					} = modInfo;
	
					modObject.summary = summary;
				}
			}
			else {
				modObject.summary = cachedModInfo.summary;
			}

			
		}
		catch {
			// do nothing
		}
	}

	modsWithPlugins.push(modObject);
}

const parseOutputFileContent = JSON.stringify(modsWithPlugins, null, "\t");

await writeTextFile(parseOutputFilePath, parseOutputFileContent);
