import ChatUI from "@/components/ChatUI";

// 이 라우트는 middleware.ts가 세션 쿠키를 검사해 비로그인 접근을 /assistant로 리다이렉트한다.
export default function AssistantChatPage() {
  return <ChatUI />;
}
