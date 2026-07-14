import Link from 'next/link'

// TODO(customize): Replace this landing page with your product's marketing
// content. It has no Recur wiring — safe to rewrite entirely.
export default function HomePage() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">你的訂閱制 SaaS,已接好金流</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-600">
        這是 Recur SaaS starter:結帳、webhook、權限閘門、客戶自助管理都已串接完成,
        換上你的產品邏輯就能上線。
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/pricing"
          className="rounded-md bg-neutral-900 px-5 py-2.5 text-white hover:bg-neutral-700"
        >
          查看方案
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md border border-neutral-300 px-5 py-2.5 hover:bg-neutral-50"
        >
          進入 Dashboard
        </Link>
      </div>
    </div>
  )
}
