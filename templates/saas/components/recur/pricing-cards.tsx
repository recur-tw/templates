'use client'

import { useRouter } from 'next/navigation'
import { useProducts, useRecur, type Product } from 'recur-tw'
import { PLANS } from '@/lib/plans'

function formatPrice(price: number): string {
  // Recur amounts are in the smallest currency unit: 29900 = NT$299.
  return `NT$${(price / 100).toLocaleString('zh-TW')}`
}

const PERIOD_LABELS: Record<string, string> = {
  WEEKLY: '/ 週',
  MONTHLY: '/ 月',
  YEARLY: '/ 年',
}

export function PricingCards({ customerEmail }: { customerEmail?: string }) {
  const router = useRouter()
  const { data: products, isLoading } = useProducts({ type: 'SUBSCRIPTION' })
  const { redirectToCheckout, isCheckingOut } = useRecur()

  if (isLoading) {
    return <p className="text-center text-neutral-500">載入方案中…</p>
  }

  if (!products?.length) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-600">
        <p className="font-medium">還沒有可購買的方案</p>
        <p className="mt-2 text-sm">
          到 <a href="https://app.recur.tw" className="underline">app.recur.tw</a> → Products
          建立 SUBSCRIPTION 產品,slug 需對應 <code>lib/plans.ts</code> 中的設定
          (預設:<code>starter-plan</code>、<code>pro-plan</code>)。
        </p>
      </div>
    )
  }

  const handleCheckout = async (product: Product) => {
    if (!customerEmail) {
      router.push('/login')
      return
    }
    // Hosted Checkout: redirects to checkout.recur.tw and back. Works on any
    // domain including localhost. For embedded/modal checkout on a
    // registered production domain, see the recur-checkout skill.
    await redirectToCheckout({
      productId: product.id,
      successUrl: `${window.location.origin}/dashboard?welcome=1`,
      cancelUrl: `${window.location.origin}/pricing`,
      customerEmail,
    })
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {products.map((product) => {
        const plan = PLANS.find((p) => p.slug === product.slug)
        return (
          <div key={product.id} className="rounded-lg border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold">{plan?.name ?? product.name}</h2>
            <p className="mt-2 text-3xl font-bold">
              {formatPrice(product.price)}
              <span className="text-base font-normal text-neutral-500">
                {' '}
                {PERIOD_LABELS[product.billingPeriod ?? ''] ?? ''}
              </span>
            </p>
            {product.trialDays ? (
              <p className="mt-1 text-sm text-green-700">免費試用 {product.trialDays} 天</p>
            ) : null}
            <ul className="mt-4 space-y-2 text-sm text-neutral-600">
              {(plan?.features ?? []).map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(product)}
              disabled={isCheckingOut}
              className="mt-6 w-full rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {isCheckingOut ? '處理中…' : customerEmail ? '訂閱' : '登入後訂閱'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
