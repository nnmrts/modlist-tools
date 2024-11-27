import {
	parseOutputFilePath,
	parseOutputModifiedFilePath
} from "./_common/_exports.js";

const {
	readTextFile,
	writeTextFile
} = Deno;

const parseOutputFileContent = await readTextFile(parseOutputFilePath);

const parseOutput = JSON.parse(parseOutputFileContent);

const parseOutputModifiedFileContent = await readTextFile(parseOutputModifiedFilePath);

const parseOutputModified = JSON.parse(parseOutputModifiedFileContent);

const mods = parseOutputModified.map((mod) => ({
	...mod,
	enabled: parseOutput.find(({ name }) => name === mod.name)?.enabled ?? false
}));

await writeTextFile(parseOutputModifiedFilePath, JSON.stringify(mods, null, "\t"));
