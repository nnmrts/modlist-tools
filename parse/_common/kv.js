const {
	openKv
} = Deno;

const kv = await openKv();

export default kv;
