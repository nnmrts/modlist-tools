import sortList from "../_common/sort-list.js";

import { listFormatter } from "./merge-list/_exports.js";

const separator = " - ";

/**
 *
 * @param arrayOfLevels
 * @example
 */
const groupLevels = (arrayOfLevels) => {};

/**
 *
 * @param {readonly string[]} list
 * @example
 */
const mergeList = (list) => {
	if (!list.some((string) => string.includes(separator))) {
		return list;
	}

	return [
		...list
			.filter((string) => !string.includes(separator)),
		...[
			...Map.groupBy(
				list
					.filter((string) => string.includes(separator))
					.map((string) => string.split(new RegExp(`${separator}(.*)`, "s")).slice(0, -1)),
				(levels) => levels[0]
			)
		]
			.map(([topLevel, groupedItems]) => {
				const mergedGroupedItems = mergeList(
					groupedItems.map((levels) => levels[1])
				);

				const formattedMergedGroupedItems = mergedGroupedItems
					.join(" | ");

				return [
					topLevel,
					mergedGroupedItems.length > 1
						? `(${formattedMergedGroupedItems})`
						: formattedMergedGroupedItems

				]
					.join(separator);
			})
	];
};

export default mergeList;
