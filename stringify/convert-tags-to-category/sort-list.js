import { collator } from "./sort-list/_exports.js";

/**
 *
 * @param {readonly string[]} list
 * @example
 */
const sortList = (list) => list.toSorted(collator.compare);

export default sortList;
