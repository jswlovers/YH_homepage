"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function ChatUI() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "요청에 실패했습니다.");
      setMessages([...next, { role: "assistant", content: data.reply }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/assistant/logout", { method: "POST" });
    router.push("/assistant");
    router.refresh();
  }

  return (
    <div className="mx-auto flex h-[85vh] max-w-2xl flex-col px-6">
      <div className="flex items-center justify-between border-b border-neutral-200 py-4 dark:border-neutral-800">
        <h1 className="font-serif text-2xl">디자인 어시스턴트</h1>
        <button onClick={logout} className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
          로그아웃
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        {messages.length === 0 && (
          <p className="text-sm text-neutral-500">
            컬렉션 컨셉, 무드보드, 소재·컬러 제안 등 무엇이든 물어보세요.
          </p>
        )}
        <div className="flex flex-col gap-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "self-end bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "self-start bg-neutral-100 dark:bg-neutral-800"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="self-start rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-400 dark:bg-neutral-800">
              생각 중...
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {error && <p className="pb-2 text-sm text-red-600">{error}</p>}

      <div className="flex gap-2 border-t border-neutral-200 py-4 dark:border-neutral-800">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder="메시지를 입력하세요 (Shift+Enter로 줄바꿈)"
          className="flex-1 resize-none rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
        />
        <button
          onClick={send}
          disabled={loading || input.trim().length === 0}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
        >
          보내기
        </button>
      </div>
    </div>
  );
}
