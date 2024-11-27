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

const mods = parseOutput
	.map((mod) => Object.fromEntries(
		Object.entries(mod)
			.toSorted(([keyA], [keyB]) => keyA.localeCompare(keyB))
	))
	.toSorted(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));

await writeTextFile(parseOutputFilePath, JSON.stringify(mods, null, "\t"));

const modsModified = parseOutputModified.map((mod) => Object.fromEntries(
	Object.entries(mod)
		.toSorted(([keyA], [keyB]) => keyA.localeCompare(keyB))
))
	.toSorted(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));

await writeTextFile(parseOutputModifiedFilePath, JSON.stringify(modsModified, null, "\t"));
