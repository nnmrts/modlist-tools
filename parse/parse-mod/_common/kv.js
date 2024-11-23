const {
	openKv
} = Deno;

const kv = await openKv("kv.sqlite");

export default kv;
