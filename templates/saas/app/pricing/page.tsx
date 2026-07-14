import { getSession } from '@/lib/session'
import { PricingCards } from '@/components/recur/pricing-cards'

export default async function PricingPage() {
  const session = await getSession()

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">方案與定價</h1>
        <p className="mt-2 text-neutral-600">選擇適合你的方案,隨時可以升級或取消。</p>
      </div>
      <PricingCards customerEmail={session?.email} />
    </div>
  )
}
