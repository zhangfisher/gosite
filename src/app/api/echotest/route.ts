export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
	const buf = await req.arrayBuffer();
	const text = new TextDecoder().decode(buf);
	return new Response(JSON.stringify({ len: text.length, text }), {
		status: 200,
		headers: { "content-type": "application/json" },
	});
}
