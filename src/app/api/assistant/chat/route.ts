import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `당신은 패션 디자이너인 사용자의 개인 비서입니다.
컬렉션 컨셉 구체화, 무드보드/레퍼런스 아이디어, 소재·컬러·실루엣 제안,
트렌드 리서치, 룩북/쇼 노트 초안 작성 등 디자인 작업 전반을 돕습니다.
답변은 한국어로, 실무에 바로 쓸 수 있게 구체적으로 합니다.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "서버에 ANTHROPIC_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const messages: ChatMessage[] | undefined = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages가 필요합니다." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929",
      max_tokens: 1536,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("[assistant/chat] Anthropic API 호출 실패:", err);
    return NextResponse.json({ error: "AI 응답 생성에 실패했습니다." }, { status: 502 });
  }
}
