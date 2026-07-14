import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getActivePlan } from '@/lib/entitlements'

// The dashboard is gated server-side: access is decided by Recur's
// entitlements API, never by client state.
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { welcome } = await searchParams
  const active = await getActivePlan(session.email)

  if (!active) {
    // Paywall: signed in but no active subscription.
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold">需要訂閱才能使用</h1>
        <p className="mt-3 text-neutral-600">
          你目前沒有有效的訂閱。選擇一個方案即可解鎖 Dashboard 的完整功能。
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-block rounded-md bg-neutral-900 px-5 py-2.5 text-white hover:bg-neutral-700"
        >
          查看方案
        </Link>
      </div>
    )
  }

  const { plan, status, currentPeriodEnd } = active
  const periodEnd = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString('zh-TW')
    : null

  return (
    <div>
      {welcome && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-green-800">
          🎉 訂閱成功!歡迎使用 {plan.name} 方案。
        </div>
      )}

      {status === 'trialing' && (
        <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-800">
          你正在試用 {plan.name} 方案{periodEnd && `,試用期至 ${periodEnd}`}。
        </div>
      )}

      {status === 'past_due' && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
          最近一次扣款失敗,請到<Link href="/account" className="underline">帳戶頁面</Link>
          更新付款方式,以免服務中斷。
        </div>
      )}

      {status === 'canceled' && (
        <div className="mb-6 rounded-md border border-neutral-200 bg-neutral-50 p-4 text-neutral-700">
          你已取消訂閱{periodEnd && `,仍可使用至 ${periodEnd}`}。
          <Link href="/pricing" className="underline">重新訂閱</Link>
        </div>
      )}

      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {session.email} · {plan.name} 方案
      </p>

      {/* TODO(customize): Replace with your product's actual features. */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 p-6">
          <h2 className="font-semibold">你的付費功能</h2>
          <p className="mt-2 text-sm text-neutral-600">
            這個區塊只有訂閱者看得到。把你的核心產品功能放在這裡。
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 p-6">
          <h2 className="font-semibold">用量統計</h2>
          <p className="mt-2 text-sm text-neutral-600">範例區塊 — 換成你的實際內容。</p>
        </div>
      </div>
    </div>
  )
}
