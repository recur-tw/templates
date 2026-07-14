// Recur webhook endpoint. Do NOT rename this path — docs, the README, and
// the Recur dashboard configuration all point to /api/webhooks/recur.
import { NextRequest, NextResponse } from 'next/server'
import { recur } from '@/lib/recur'
import { hasProcessed, markProcessed } from '@/lib/webhook-store'

export async function POST(request: NextRequest) {
  // Signature verification needs the raw body — read text() before parsing.
  const payload = await request.text()
  const signature = request.headers.get('x-recur-signature')

  let event
  try {
    event = recur.webhooks.verify(payload, signature, process.env.RECUR_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Idempotency: Recur retries deliveries, so the same event can arrive
  // more than once.
  if (hasProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  console.log('Recur webhook:', { id: event.id, type: event.type })

  switch (event.type) {
    case 'checkout.completed':
      await handleCheckoutCompleted(event.data)
      break
    case 'subscription.activated':
      await handleSubscriptionActivated(event.data)
      break
    case 'invoice.paid':
      await handleInvoicePaid(event.data)
      break
    case 'subscription.payment_failed':
      await handlePaymentFailed(event.data)
      break
    case 'subscription.cancelled':
      await handleSubscriptionCancelled(event.data)
      break
    case 'subscription.expired':
    case 'subscription.revoked':
      await handleAccessEnded(event.data)
      break
    case 'invoice.refunded':
      await handleInvoiceRefunded(event.data)
      break
    default:
      console.log('Unhandled Recur event type:', event.type)
  }

  markProcessed(event.id)
  return NextResponse.json({ received: true })
}

// ---------------------------------------------------------------------------
// Event handlers.
//
// This template reads access state live from Recur's entitlements API
// (lib/entitlements.ts), so none of these handlers are required for gating
// to work. Use them for side effects: emails, provisioning, analytics, or
// mirroring subscription state into your own database.
// ---------------------------------------------------------------------------

async function handleCheckoutCompleted(data: Record<string, unknown>) {
  // TODO(customize): Send a welcome email, start onboarding, track conversion.
}

async function handleSubscriptionActivated(data: Record<string, unknown>) {
  // TODO(customize): Provision resources for the new subscriber.
}

async function handleInvoicePaid(data: Record<string, unknown>) {
  // TODO(customize): Renewal payment succeeded — update billing records /
  // extend usage quotas.
}

async function handlePaymentFailed(data: Record<string, unknown>) {
  // TODO(customize): Notify the user their payment failed (dunning email).
  // The entitlement stays in 'past_due' during the grace period.
}

async function handleSubscriptionCancelled(data: Record<string, unknown>) {
  // TODO(customize): Send a cancellation confirmation / exit survey.
  // The customer keeps access until the end of the billing period.
}

async function handleAccessEnded(data: Record<string, unknown>) {
  // TODO(customize): Clean up resources after access has fully ended
  // (subscription expired or revoked).
}

async function handleInvoiceRefunded(data: Record<string, unknown>) {
  // TODO(customize): Adjust internal records for the refunded invoice.
}
