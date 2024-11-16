import { chain } from "@radashi-org/radashi";

import { formatList, sortList } from "./convert-tags-to-category/_exports.js";

/**
 *
 * @param {readonly string[]} tags
 * @example
 */
const convertTagsToCategory = (tags) => chain(
	sortList,
	formatList
)(tags);

export default convertTagsToCategory;
