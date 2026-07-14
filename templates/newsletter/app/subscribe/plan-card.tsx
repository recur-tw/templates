'use client'

import { useProducts } from 'recur-tw'
import { NEWSLETTER_PRODUCT_SLUG } from '@/lib/config'

const PERIOD_LABELS: Record<string, string> = {
  WEEKLY: '/ 週',
  MONTHLY: '/ 月',
  YEARLY: '/ 年',
}

// Shows the live price of the newsletter product from Recur.
export function PlanCard() {
  const { data: products, isLoading } = useProducts({ type: 'SUBSCRIPTION' })

  if (isLoading) return <p className="text-neutral-500">載入方案中…</p>

  const product = products?.find((p) => p.slug === NEWSLETTER_PRODUCT_SLUG)
  if (!product) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-600">
        找不到訂閱方案 — 到 <a href="https://app.recur.tw" className="underline">app.recur.tw</a> 建立
        slug 為 <code>{NEWSLETTER_PRODUCT_SLUG}</code> 的 SUBSCRIPTION 產品
        (或修改 <code>lib/config.ts</code>)。
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-6">
      <p className="text-3xl font-bold">
        NT${(product.price / 100).toLocaleString('zh-TW')}
        <span className="text-base font-normal text-neutral-500">
          {' '}
          {PERIOD_LABELS[product.billingPeriod ?? ''] ?? ''}
        </span>
      </p>
      {product.trialDays ? (
        <p className="mt-1 text-sm text-green-700">免費試用 {product.trialDays} 天</p>
      ) : null}
    </div>
  )
}
