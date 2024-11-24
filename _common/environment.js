import {
	basename,
	dirname,
	join
} from "@std/path";

const {
	build: {
		os
	},
	env
} = Deno;

const {
	game,
	masterlistRawFilePath,
	modlistRawFilePath,
	modsRawFolderPath,
	nexusModsApiKey,
	parseOutputRawFilePath,
	pluginsRawFilePath,
	userlistRawFilePath
} = Object.fromEntries(
	[
		["game", "GAME"],
		["nexusModsApiKey", "NEXUS_MODS_API_KEY"],
		["modlistRawFilePath", "MODLIST_FILE_PATH"],
		["modsRawFolderPath", "MODS_FOLDER_PATH"],
		["parseOutputRawFilePath", "PARSE_OUTPUT_FILE_PATH"],
		["pluginsRawFilePath", "PLUGINS_FILE_PATH"],
		["masterlistRawFilePath", "MASTERLIST_FILE_PATH"],
		["userlistRawFilePath", "USERLIST_FILE_PATH"]
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
	masterlistFilePath,
	modlistFilePath,
	modsFolderPath,
	parseOutputFilePath,
	pluginsFilePath,
	userlistFilePath
} = Object.fromEntries(
	Object.entries({
		masterlistRawFilePath,
		modlistRawFilePath,
		modsRawFolderPath,
		parseOutputRawFilePath,
		pluginsRawFilePath,
		userlistRawFilePath
	})
		.map(([key, rawPath]) => {
			const normalKey = key
				.replace(/Raw(?=(?:File|Folder)Path$)/u, "");

			return os === "windows"
				? [
					normalKey,
					rawPath
						.replaceAll(
							/%(?<variable>[^%]+)%/gu,
							(...replaceArguments) => {
								const { variable: environmentVariable } = replaceArguments.at(-1);

								const environmentVariableValue = env.get(environmentVariable);

								if (environmentVariableValue === undefined) {
									throw new Error(`Environment variable ${environmentVariable} not found.`);
								}

								return environmentVariableValue;
							}
						)
				]
				: [normalKey, rawPath];
		})
);

const modlistOldFilePath = join(dirname(modlistFilePath), `old-${basename(modlistFilePath)}`);

const parseOutputModifiedFilePath = join(dirname(parseOutputFilePath), `modified-${basename(parseOutputFilePath)}`);

export {
	game,
	masterlistFilePath,
	modlistFilePath,
	modlistOldFilePath,
	modsFolderPath,
	nexusModsApiKey,
	parseOutputFilePath,
	parseOutputModifiedFilePath,
	pluginsFilePath,
	userlistFilePath
};
