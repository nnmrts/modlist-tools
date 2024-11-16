import { listFormatter } from "./format-list/_exports.js";

/**
 *
 * @param {readonly string[]} list
 * @example
 */
const formatList = (list) => listFormatter.formatToParts(list)
	.map(({ type, value }) => {
		if (type === "literal" && value === ", & ") {
			return " & ";
		}

		return value;
	})
	.join("");

export default formatList;
