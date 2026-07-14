// Server-side access control. Premium posts are gated here, on the server —
// client-side checks are for UX only and can be bypassed.
import { recur } from './recur'
import { NEWSLETTER_PRODUCT_SLUG } from './config'

export interface Access {
  allowed: boolean
  /** Normalized entitlement status, when subscribed */
  status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'purchased'
  /** End of the current billing period (ISO 8601), if available */
  currentPeriodEnd?: string | null
}

/** Whether this reader can read premium posts. */
export async function getAccess(email: string): Promise<Access> {
  const { allowed, subscription } = await recur.entitlements.check({
    product: NEWSLETTER_PRODUCT_SLUG,
    customer: { email },
  })
  if (!allowed) return { allowed: false }

  const { entitlements } = await recur.entitlements.list({ customer: { email } })
  const entitlement = entitlements.find((e) => e.product === NEWSLETTER_PRODUCT_SLUG)
  return {
    allowed: true,
    status: entitlement?.status,
    currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
  }
}
