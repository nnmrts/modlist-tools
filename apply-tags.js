import {
	join
} from "@std/path";

import {
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

const parseOutputFileContent = await readTextFile(parseOutputFilePath);

const parseOutput = JSON.parse(parseOutputFileContent);

const parseOutputModifiedFileContent = await readTextFile(parseOutputModifiedFilePath);

const parseOutputModified = JSON.parse(parseOutputModifiedFileContent);

const mods = parseOutput.map((mod) => ({
	...mod,
	tags: parseOutputModified.find(({ name }) => name === mod.name)?.tags ?? []
}));

await writeTextFile(parseOutputFilePath, JSON.stringify(mods, null, "\t"));
