import { chain } from "@radashi-org/radashi";

import { sortList } from "./_common/_exports.js";
import {
	formatList,
	mergeList
} from "./convert-tags-to-category/_exports.js";

/**
 *
 * @param {readonly string[]} tags
 * @example
 */
const convertTagsToCategory = (tags) => chain(
	sortList,
	mergeList,
	formatList
)(tags);

export default convertTagsToCategory;
