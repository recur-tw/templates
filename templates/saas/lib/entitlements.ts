// Server-side access control. Always gate premium features here, on the
// server — client-side checks are for UX only and can be bypassed.
import { recur } from './recur'
import { PLANS, type Plan } from './plans'

export interface ActivePlan {
  plan: Plan
  /** Normalized entitlement status */
  status: 'active' | 'trialing' | 'past_due' | 'canceled'
  /** End of the current billing period (ISO 8601), if available */
  currentPeriodEnd: string | null
}

/**
 * Returns the highest active plan for this customer, or null if they have
 * no access. PLANS is ordered highest tier first.
 */
export async function getActivePlan(email: string): Promise<ActivePlan | null> {
  const { entitlements } = await recur.entitlements.list({ customer: { email } })

  for (const plan of PLANS) {
    const entitlement = entitlements.find((e) => e.product === plan.slug)
    if (!entitlement) continue

    // check() confirms access and returns billing-period details.
    const { allowed, subscription } = await recur.entitlements.check({
      product: plan.slug,
      customer: { email },
    })
    if (allowed) {
      return {
        plan,
        status: entitlement.status,
        currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
      }
    }
  }
  return null
}

/**
 * Guard for API routes / server actions: throws a Response(403) when the
 * customer has no access to the given product.
 */
export async function requireEntitlement(email: string, product: string): Promise<void> {
  const { allowed } = await recur.entitlements.check({ product, customer: { email } })
  if (!allowed) {
    throw new Response(JSON.stringify({ error: 'subscription_required', product }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
