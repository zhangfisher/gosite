import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getAiChatManager } from "@/ai";

async function requireUser(): Promise<string | null> {
	const session = await auth.api.getSession({ headers: await headers() });
	return session?.user?.id ?? null;
}

/** 从 useChat 下发的一组成員消息中提取最后一条用户消息的纯文本 */
function extractUserPrompt(messages: unknown): string | null {
	if (!Array.isArray(messages)) return null;
	for (let i = messages.length - 1; i >= 0; i--) {
		const msg = messages[i] as { role?: string; parts?: Array<{ type?: string; text?: string }> };
		if (msg?.role !== "user") continue;
		const parts = msg.parts ?? [];
		const text = parts
			.filter((p) => p.type === "text" && typeof p.text === "string")
			.map((p) => p.text as string)
			.join("")
			.trim();
		return text || null;
	}
	return null;
}

export async function POST(request: Request) {
	const userId = await requireUser();
	if (!userId) {
		return NextResponse.json({ error: "未授权" }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "请求体无效" }, { status: 400 });
	}

	const obj = body as {
		conversationId?: string;
		messages?: unknown;
	};
	const conversationId = obj.conversationId;
	if (!conversationId || typeof conversationId !== "string") {
		return NextResponse.json({ error: "缺少 conversationId" }, { status: 400 });
	}
	const prompt = extractUserPrompt(obj.messages);
	if (!prompt) {
		return NextResponse.json({ error: "缺少用户消息内容" }, { status: 400 });
	}

	const manager = getAiChatManager();
	return manager.chat(
		{ conversationId, userId, prompt },
		request.signal,
	);
}
