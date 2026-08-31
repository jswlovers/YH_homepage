import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

// /assistant/chat 이하 페이지와 채팅 API는 로그인 세션 쿠키가 있어야만 통과시킨다.
// 비밀번호 확인 자체는 /api/assistant/login에서 처리하고, 여기서는 발급된 세션
// 토큰의 서명/만료만 검사한다. Next.js의 proxy(구 middleware)는 항상 Node.js
// 런타임에서 실행되므로 verifySessionToken의 crypto(createHmac) 사용이 그대로 된다.
export const config = {
  matcher: ["/assistant/chat/:path*", "/api/assistant/chat/:path*"],
};

export function proxy(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (verifySessionToken(token)) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/assistant", req.url);
  return NextResponse.redirect(loginUrl);
}
