'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { encodeSession, SESSION_COOKIE } from '@/lib/session'

// Demo sign-in: no password, no email verification. The email becomes the
// Recur customer identity. See lib/session.ts for how to swap in real auth.
export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect('/login?error=invalid_email')
  }

  const store = await cookies()
  store.set(SESSION_COOKIE, encodeSession(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  redirect('/dashboard')
}

export async function signOut() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect('/')
}
