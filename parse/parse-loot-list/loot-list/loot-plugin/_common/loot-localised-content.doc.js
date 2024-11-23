/*
	eslint-disable

	import-x/unambiguous,
	unicorn/no-empty-file,
	unicorn/prevent-abbreviations
	--
	jsdoc
*/

/**
 * The localised content data structure is a key-value string map.
 *
 * @typedef {object} LootLocalisedContent
 * @property {string} text
 * The CommonMark message content string.
 * @property {string} lang
 * The language that `text` is written in, given as a code of the form `ll` or `ll_CC`, where `ll` is an ISO 639-1 language code and `CC` is an ISO 3166 country code. For example,
 *
 * | Language               | Code   |
 * |------------------------|--------|
 * | Bulgarian              | bg     |
 * | Chinese (Simplified)   | zh_CN  |
 * | Czech                  | cs     |
 * | Danish                 | da     |
 * | English                | en     |
 * | Finnish                | fi     |
 * | French                 | fr     |
 * | German                 | de     |
 * | Italian                | it     |
 * | Japanese               | ja     |
 * | Korean                 | ko     |
 * | Polish                 | pl     |
 * | Portuguese             | pt_PT  |
 * | Portuguese (Brazil)    | pt_BR  |
 * | Russian                | ru     |
 * | Spanish                | es     |
 * | Swedish                | sv     |
 * | Ukrainian              | uk_UA  |
 */
