/*
	eslint-disable

	import-x/unambiguous,
	unicorn/no-empty-file,
	unicorn/prevent-abbreviations
	--
	jsdoc
*/

/**
 * @import { IsNever } from "./permutation.doc/_exports.js"
 */

/**
 * @template T
 * @template [K=T]
 * @typedef {(
 * 	IsNever<T> extends true
 * 		? []
 * 		: K extends K
 * 			? [K, ...Permutation<Exclude<T, K>>]
 * 			: never
 * )} Permutation
 */
