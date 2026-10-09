# YH Homepage 운영 매뉴얼

이 문서는 YH Homepage의 설치, 실행, 보안 설정, 비밀키 설정, 배포 방법, 구조 이해를 위한 실사용 매뉴얼입니다.

## 1. 프로젝트 개요

이 프로젝트는 다음 두 가지 핵심 기능을 가진 Next.js 웹앱입니다.

- 공개 포트폴리오 페이지: `/`
  - 디자인 작품 목록을 전시
  - 이메일 문의 링크 제공
- 개인 비서 페이지: `/assistant`
  - 비밀번호 인증 후 접근 가능
  - `/assistant/chat`에서 Anthropic API 기반 AI 어시스턴트와 대화

핵심 구현 위치:

- 공개 페이지: `src/app/page.tsx`
- 로그인 페이지: `src/app/assistant/page.tsx`
- 채팅 페이지: `src/app/assistant/chat/page.tsx`
- 채팅 API: `src/app/api/assistant/chat/route.ts`
- 로그인 API: `src/app/api/assistant/login/route.ts`
- 로그아웃 API: `src/app/api/assistant/logout/route.ts`
- 세션 검증: `src/lib/session.ts`
- 보호 라우트: `src/proxy.ts`

## 2. 요구 사항

- Node.js 20 이상 권장
- npm
- Anthropic API 키
- `.env.local` 환경 변수 설정

## 3. 설치 및 실행

### 3.1 의존성 설치

```bash
npm install
```

### 3.2 환경 변수 설정

`.env.local.example`을 복사해 `.env.local`을 생성하고 실제 값으로 채웁니다.

```bash
cp .env.local.example .env.local
```

필수 변수:

```env
ASSISTANT_PASSWORD=your-password
ASSISTANT_SESSION_SECRET=long-random-secret
ANTHROPIC_API_KEY=sk-ant-xxxx
```

선택 변수:

```env
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

설명:

- `ASSISTANT_PASSWORD`: `/assistant` 접근용 비밀번호
- `ASSISTANT_SESSION_SECRET`: 세션 서명을 위한 secret key, 임의의 긴 문자열
- `ANTHROPIC_API_KEY`: Anthropic Console에서 발급한 키
- `ANTHROPIC_MODEL`: 비워두면 기본 모델 사용

> `.env.local`은 `.gitignore`에 포함되어 있으며 git 추적 대상이 아닙니다.

### 3.3 개발 서버 실행

```bash
npm run dev
```

브라우저에서 다음 주소에 접속합니다.

- http://localhost:3000

## 4. 로그인/인증 동작 원리

비밀번호 로그인은 `src/app/api/assistant/login/route.ts`에서 처리합니다.

- 요청으로 전달된 비밀번호를 `ASSISTANT_PASSWORD`와 비교
- 일치하면 세션 쿠키를 발급
- 쿠키는 `yh_assistant_session` 이름으로 저장됨

세션 토큰은 `src/lib/session.ts`에서 생성됩니다.

- payload는 만료 시각을 숫자 timestamp로 저장
- HMAC 서명으로 무결성 검증
- 만료 및 서명 검증을 모두 수행

보호 라우트는 `src/proxy.ts`에서 처리됩니다.

- `/assistant/chat/:path*` 경로 접근 시 쿠키 검증
- 세션이 없거나 만료되면 `/assistant`로 리다이렉트
- `/api/assistant/chat` 접근 시 401 JSON 응답 반환

로그아웃은 `/api/assistant/logout`에서 세션 쿠키를 삭제합니다.

## 5. AI 채팅 기능

### 경로

- 채팅 페이지: `/assistant/chat`
- API: `/api/assistant/chat`

### 동작 방식

1. 사용자가 채팅 UI를 통해 메시지를 입력
2. `/api/assistant/chat`가 메시지 배열을 수신
3. 서버에서 Anthropic SDK를 사용해 `messages.create()` 호출
4. 모델 응답의 text 블록을 조합해 JSON으로 반환

### 서버 설정

`src/app/api/assistant/chat/route.ts`에서 다음을 처리합니다.

- `ANTHROPIC_API_KEY` 누락 시 500 에러
- `messages`가 없으면 400 에러
- Anthropic API 실패 시 502 에러

System 프롬프트는 패션 디자이너 개인 비서 역할을 정의하며, 디자인 컨셉, 무드보드, 소재, 색상, 실루엣, 룩북 설명 등을 지원합니다.

## 6. 콘텐츠 관리

### 작품 추가

`src/lib/designs.ts`를 수정해 작품 데이터를 추가합니다.

예시 구조:

```ts
export const designs = [
  {
    id: "sample-1",
    title: "Sample Title",
    subtitle: "Concept",
    image: "/designs/filename.jpg",
    description: "설명",
  },
];
```

이미지 저장 위치:

- `public/designs/`

이미지가 없을 경우 `image`를 비워두면 그라디언트 플레이스홀더가 표시됩니다.

### 문의 이메일 수정

`src/app/page.tsx`의 `CONTACT_EMAIL` 값을 실제 메일 주소로 변경합니다.

## 7. 배포

### Vercel 배포

1. GitHub 저장소 연결
2. Vercel 프로젝트 생성
3. 환경 변수 등록
   - `ASSISTANT_PASSWORD`
   - `ASSISTANT_SESSION_SECRET`
   - `ANTHROPIC_API_KEY`
   - `ANTHROPIC_MODEL` (선택)
4. 프로젝트 배포

중요:

- 이 프로젝트는 서버 런타임이 필요한 기능을 사용합니다.
- 정적 내보내기(`next export`)는 권장하지 않습니다.
- Node.js 서버를 지원하는 호스팅 환경이 필요합니다.

## 8. 프로젝트 구조 요약

```text
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── assistant/
│   │   │       ├── chat/route.ts
│   │   │       ├── login/route.ts
│   │   │       └── logout/route.ts
│   │   ├── assistant/
│   │   │   ├── page.tsx
│   │   │   └── chat/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ChatUI.tsx
│   │   └── DesignCard.tsx
│   ├── lib/
│   │   ├── designs.ts
│   │   └── session.ts
│   └── proxy.ts
├── public/
│   └── designs/
├── .env.local.example
├── .gitignore
├── README.md
├── MANUAL.md
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 9. 자주 발생하는 문제

### 1) `/assistant/chat`에서 로그인 페이지로 이동함

- `ASSISTANT_SESSION_SECRET`이 설정되지 않았는지 확인
- 쿠키가 허용되는지 확인
- 브라우저에서 세션 쿠키가 삭제되지 않았는지 확인

### 2) Anthropic API 호출 실패

- `ANTHROPIC_API_KEY` 값이 올바른지 확인
- API 키 권한, 청구 상태, 모델 이름 확인
- 서버 로그에서 에러 메시지 확인

### 3) 비밀번호가 틀렸다고 나옴

- `ASSISTANT_PASSWORD`가 `.env.local`에 정확히 저장되었는지 확인
- 개발 서버 재시작 필요

### 4) 페이지가 정상적으로 로딩되지 않음

```bash
npm run build
```

명령으로 빌드 문제를 먼저 확인하세요.

## 10. 유지보수 팁

- 환경 변수는 `.env.local`에서 관리
- 로그인 관련 보안 로직은 `src/lib/session.ts`와 `src/proxy.ts`를 함께 확인
- 새 기능을 추가할 때에는 README와 본 매뉴얼 둘 다 최신 상태로 유지

## 11. 관련 문서

- `README.md` : 빠른 소개 및 실행 가이드
- `MANUAL.md` : 상세 운영 문서
