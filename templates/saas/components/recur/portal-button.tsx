'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Opens the Recur Customer Portal, where subscribers manage their
// subscription, payment method, and billing history themselves.
export function PortalButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/portal', { method: 'POST' })
      const data = await response.json()

      if (data.error === 'no_customer') {
        router.push('/pricing')
        return
      }
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? 'portal_failed')
      }

      window.location.href = data.url
    } catch (err) {
      console.error('Failed to open portal:', err)
      setError('無法開啟訂閱管理頁面,請稍後再試。')
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {isLoading ? '載入中…' : '管理訂閱與付款方式'}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
