const collator = new Intl.Collator(
	"en-US",
	{
		caseFirst: "upper",
		ignorePunctuation: false,
		localeMatcher: "best fit",
		numeric: true,
		sensitivity: "variant",
		usage: "sort"
	}
);

export default collator;
