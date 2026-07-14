// Demo session: an HMAC-signed httpOnly cookie holding the user's email.
// Recur identifies customers by email, so this is all the template needs.
//
// TODO(customize): Swap this for your real auth (better-auth, next-auth,
// Clerk, ...). Keep the contract: `getSession()` returns `{ email }` or
// null. Nothing else in the template depends on how auth is implemented.
// See AGENTS.md → "Swapping in real auth".
import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'demo_session'

function secret(): string {
  const s = process.env.AUTH_SECRET
  if (s) return s
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET must be set in production. Generate one with: openssl rand -hex 32')
  }
  return 'insecure-dev-secret'
}

function sign(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('hex')
}

export function encodeSession(email: string): string {
  const payload = Buffer.from(email, 'utf8').toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function decodeSession(token: string): { email: string } | null {
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const expected = sign(payload)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  return { email: Buffer.from(payload, 'base64url').toString('utf8') }
}

export async function getSession(): Promise<{ email: string } | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return decodeSession(token)
}
