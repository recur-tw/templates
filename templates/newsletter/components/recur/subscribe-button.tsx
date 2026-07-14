'use client'

import { useRouter } from 'next/navigation'
import { useRecur } from 'recur-tw'
import { NEWSLETTER_PRODUCT_SLUG } from '@/lib/config'

// Hosted Checkout: works on any domain including localhost. Success lands
// back on the homepage; access itself is granted by Recur and checked
// server-side when rendering premium posts.
export function SubscribeButton({ customerEmail }: { customerEmail?: string }) {
  const router = useRouter()
  const { redirectToCheckout, isCheckingOut } = useRecur()

  const handleClick = async () => {
    if (!customerEmail) {
      router.push('/login')
      return
    }
    await redirectToCheckout({
      productSlug: NEWSLETTER_PRODUCT_SLUG,
      successUrl: `${window.location.origin}/?subscribed=1`,
      cancelUrl: `${window.location.origin}/subscribe`,
      customerEmail,
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isCheckingOut}
      className="rounded-md bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-700 disabled:opacity-50"
    >
      {isCheckingOut ? '處理中…' : customerEmail ? '訂閱' : '登入後訂閱'}
    </button>
  )
}
