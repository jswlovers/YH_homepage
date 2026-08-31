# YH Homepage

패션 디자인 포트폴리오 홈페이지. Next.js(App Router) + Tailwind CSS 기반.

- **공개 페이지 (`/`)**: 만든 디자인을 전시하고, 이메일로 문의를 받는 갤러리.
- **개인 비서 (`/assistant`)**: 비밀번호로 보호된 페이지. 로그인하면 `/assistant/chat`에서
  Claude(Anthropic API) 기반 AI 어시스턴트와 대화하며 컬렉션 컨셉, 무드보드, 소재/컬러
  제안 등 디자인 작업을 도움받을 수 있습니다.

## 시작하기

```bash
npm install
cp .env.local.example .env.local   # 값 채우기 (아래 "환경변수" 참고)
npm run dev
```

브라우저에서 http://localhost:3000 접속.

## 환경변수 (`.env.local`)

| 변수 | 설명 |
| --- | --- |
| `ASSISTANT_PASSWORD` | `/assistant` 로그인 비밀번호 |
| `ASSISTANT_SESSION_SECRET` | 로그인 세션 쿠키 서명용 비밀키 (임의의 긴 무작위 문자열) |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com)에서 발급한 API 키 |
| `ANTHROPIC_MODEL` | (선택) 사용할 모델 ID. 비워두면 기본값 사용 |

`.env.local`은 `.gitignore`에 포함되어 커밋되지 않습니다. 절대 `ANTHROPIC_API_KEY`를
클라이언트 코드나 공개 저장소에 노출하지 마세요 — 이 프로젝트는 서버(API 라우트)에서만
Anthropic API를 호출하도록 설계되어 있습니다.

## 갤러리 작품 추가하기

`src/lib/designs.ts`의 `designs` 배열을 편집하세요.

- 실제 사진: `public/designs/` 폴더에 이미지를 넣고 `image: "/designs/파일명.jpg"`로 지정
- 사진이 아직 없으면 `image`를 비워두면 자동으로 그라디언트 플레이스홀더가 표시됩니다.

문의 이메일 주소는 `src/app/page.tsx`의 `CONTACT_EMAIL` 상수를 실제 이메일로 바꾸세요.

## 배포

[Vercel](https://vercel.com)에 GitHub 저장소를 연결하면 가장 간단합니다.

1. Vercel에서 이 저장소(`jswlovers/YH_homepage`)를 Import
2. 프로젝트 설정 → Environment Variables에 위 환경변수 4개를 등록
3. Deploy

정적 내보내기(`next export`)는 사용하지 않습니다 — 비밀번호 로그인과 AI 챗 API 라우트가
서버(Node.js) 런타임이 필요하기 때문입니다. Vercel/서버가 있는 다른 호스팅(예: Node
서버가 가능한 곳)에 배포해야 합니다.

## 기술 스택

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) — `/assistant/chat` API에서 서버사이드로만 사용
- 로그인 세션: HMAC 서명 쿠키(별도 DB 없이 `ASSISTANT_SESSION_SECRET`으로 검증), `src/proxy.ts`(Next.js의 구 middleware)가 `/assistant/chat`과 `/api/assistant/chat`을 보호
