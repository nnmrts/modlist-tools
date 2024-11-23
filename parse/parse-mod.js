/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import { walk } from "@std/fs";
import { parse } from "@std/ini";
import {
	basename, join, relative
} from "@std/path";

import { JSDOM } from "jsdom";

import {
	game,
	nexusModsApiKey,
	pluginsFilePath
} from "../_common/environment.js";

import { getCachedNexusModsMod, setCachedNexusModsMod } from "./parse-mod/_exports.js";

/**
 * @import { Mod } from "../_common/mod.doc.js";
 */

const {
	readTextFile
} = Deno;

const pluginsFileContent = await readTextFile(pluginsFilePath);

const disabledPlugins = new Set(
	pluginsFileContent
		.split(/\r?\n/u)
		.filter((line) => !line.startsWith("*"))
		.map((line) => line.slice(1).trim())
);

const nexusModsApiUrl = `https://api.nexusmods.com/v1/games/${game}/mods`;
const nexusModsBaseUrl = `https://www.nexusmods.com/${game}/mods`;

/**
 *
 * @param {string} modFolderPath
 * @example
 */
const parseMod = async (modFolderPath) => {
	const modName = basename(modFolderPath);

	/**
	 * @type {Mod}
	 */
	const mod = {
		id: null,
		files: [],
		name: modName,
		requirements: [],
		summary: null,
		tags: []
	};

	const modFolderWalkEntries = await Array.fromAsync(walk(modFolderPath, { skip: [/\.ini$/u] }));

	const modFiles = modFolderWalkEntries
		.filter(({ isFile }) => isFile)
		.map(({ path }) => ({
			enabled: !disabledPlugins.has(path),
			path: relative(modFolderPath, path),
			requirements: [],
			tags: []
		}));

	mod.files = modFiles;

	const metaFilePath = join(modFolderPath, "meta.ini");

	try {
		const metaFileContent = await readTextFile(metaFilePath);

		const {
			General: {
				modid: modIdString
			}
		} = /** @type {{General: {modid: string}}} */ (parse(metaFileContent));

		const modId = Number(modIdString);

		mod.id = modId;

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

				const nexusModsModHtmlResponse = await fetch(
					`${nexusModsBaseUrl}/${modId}`,
					{
						headers: new Headers({
							accept: "text/html",
							apikey: nexusModsApiKey
						})
					}
				);

				if (nexusModsModHtmlResponse.ok) {
					const nexusModsModHtml = await nexusModsModHtmlResponse.text();

					const {
						window: {
							document: parsedNexusModsModHtml
						}
					} = new JSDOM(nexusModsModHtml);

					const accordionElement = parsedNexusModsModHtml
						.querySelector(".container.tab-description > .accordionitems > dl.accordion");

					const hasRequirements = (
						accordionElement !== null &&
						(
							accordionElement
								.querySelector("dt")
								?.textContent
								?.trim() === "Requirements"
						) &&
						(
							accordionElement
								.querySelector("dd > div > h3")
								?.textContent
								?.trim() === "Nexus requirements"
						)
					);

					if (hasRequirements) {
						const nexusRequirementsElement = /** @type {HTMLDivElement} */ (
							accordionElement
								.querySelector("dd > div")
						);

						const tableRows = nexusRequirementsElement.querySelectorAll("table > tbody > tr");

						nexusModsMod.requirements = [...tableRows]
							.map((tableRow) => {
								const requiredModLinkElement = /** @type {HTMLAnchorElement} */ (
									tableRow
										.querySelector("td.table-require-name > a")
								);

								const requiredModId = Number(
									requiredModLinkElement
										.href
										.replace(`${nexusModsBaseUrl}/`, "")
								);

								const requiredModNotes = tableRow
									.querySelector("td.table-require-notes")
									?.textContent;

								return {
									id: requiredModId,
									notes: requiredModNotes || null
								};
							});
					}
					else {
						nexusModsMod.requirements = [];
					}

					await setCachedNexusModsMod({
						game,
						mod: nexusModsMod,
						modId
					});

					const {
						requirements,
						summary
					} = nexusModsMod;

					mod.summary = summary;
					mod.requirements = requirements;
				}
			}
		}
		else {
			mod.summary = cachedNexusModsMod.summary;
		}
	}
	catch (error) {
		console.error(error);
		// do nothing
	}

	return mod;
};

export default parseMod;
