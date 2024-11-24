const listFormatter = new Intl.ListFormat(
	"en-US",
	{
		style: "short",
		type: "conjunction"
	}
);

export default listFormatter;
