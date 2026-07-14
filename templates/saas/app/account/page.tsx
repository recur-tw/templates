import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getActivePlan } from '@/lib/entitlements'
import { PortalButton } from '@/components/recur/portal-button'

const STATUS_LABELS: Record<string, string> = {
  active: '使用中',
  trialing: '試用中',
  past_due: '扣款失敗(寬限期)',
  canceled: '已取消(期末停止)',
}

export default async function AccountPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const active = await getActivePlan(session.email)

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">帳戶設定</h1>
      <p className="mt-1 text-sm text-neutral-500">{session.email}</p>

      <section className="mt-8 rounded-lg border border-neutral-200 p-6">
        <h2 className="font-semibold">訂閱狀態</h2>
        {active ? (
          <>
            <p className="mt-2 text-sm text-neutral-600">
              目前方案:<strong>{active.plan.name}</strong>(
              {STATUS_LABELS[active.status] ?? active.status})
              {active.currentPeriodEnd && (
                <>
                  <br />
                  本期至:{new Date(active.currentPeriodEnd).toLocaleDateString('zh-TW')}
                </>
              )}
            </p>
            <div className="mt-4">
              <PortalButton />
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              取消訂閱、更新付款方式、查看帳單記錄都在訂閱管理頁面完成。
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-neutral-600">你目前沒有有效的訂閱。</p>
            <Link
              href="/pricing"
              className="mt-4 inline-block rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700"
            >
              查看方案
            </Link>
          </>
        )}
      </section>
    </div>
  )
}
