// Creates a Recur Customer Portal session for the signed-in user, so they
// can self-manage subscriptions, payment methods, and billing history.
import { NextRequest, NextResponse } from 'next/server'
import { RecurAPIError } from 'recur-tw/server'
import { recur } from '@/lib/recur'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const portalSession = await recur.portal.sessions.create({
      email: session.email,
      returnUrl: `${request.nextUrl.origin}/account`,
      locale: 'zh-TW',
    })
    return NextResponse.json({ url: portalSession.url })
  } catch (error: unknown) {
    if (error instanceof RecurAPIError && error.statusCode === 404) {
      // User has never purchased anything — nothing to manage yet.
      return NextResponse.json({ error: 'no_customer' }, { status: 404 })
    }
    console.error('Portal session error:', error)
    return NextResponse.json({ error: 'portal_failed' }, { status: 500 })
  }
}
