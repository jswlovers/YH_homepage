import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "yh_assistant_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7일

function getSecret(): string {
  const secret = process.env.ASSISTANT_SESSION_SECRET;
  if (!secret) {
    throw new Error("ASSISTANT_SESSION_SECRET 환경변수가 설정되지 않았습니다.");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/** 로그인 성공 시 발급하는 세션 토큰(만료시각 + HMAC 서명)을 만든다. */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

/** 쿠키로 받은 토큰이 우리가 발급한 것이고 아직 만료 전인지 확인한다. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SEC = Math.floor(SESSION_TTL_MS / 1000);
