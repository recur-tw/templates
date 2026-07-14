import { getSession } from '@/lib/session'
import { getAccess } from '@/lib/entitlements'
import { SITE } from '@/lib/config'
import { SubscribeButton } from '@/components/recur/subscribe-button'
import { PlanCard } from './plan-card'

export default async function SubscribePage() {
  const session = await getSession()
  const access = session ? await getAccess(session.email) : { allowed: false }

  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-3xl font-bold">訂閱 {SITE.name}</h1>
      <p className="mt-3 text-neutral-600">{SITE.description}</p>

      {access.allowed ? (
        <p className="mt-8 rounded-md border border-green-200 bg-green-50 p-4 text-green-800">
          你已經是訂閱者了,感謝支持!所有 💎 文章都已解鎖。
        </p>
      ) : (
        <div className="mt-8">
          <PlanCard />
          {/* TODO(customize): List what subscribers get. */}
          <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm text-neutral-600">
            <li>✓ 每週一封深度文章,直送信箱</li>
            <li>✓ 解鎖全部訂閱者限定內容</li>
            <li>✓ 隨時可自助取消</li>
          </ul>
          <div className="mt-6">
            <SubscribeButton customerEmail={session?.email} />
          </div>
        </div>
      )}
    </div>
  )
}
