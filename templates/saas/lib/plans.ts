// TODO(customize): Replace with your own plans. Each slug must match a
// SUBSCRIPTION product's slug in your Recur dashboard (app.recur.tw →
// Products). Order matters: list higher tiers first so the dashboard shows
// the best active plan.
export interface Plan {
  /** Product slug in Recur dashboard */
  slug: string
  name: string
  features: string[]
}

export const PLANS: Plan[] = [
  {
    slug: 'pro-plan',
    name: 'Pro',
    features: ['所有 Starter 功能', '進階分析報表', '優先客服支援'],
  },
  {
    slug: 'starter-plan',
    name: 'Starter',
    features: ['核心功能', '每月 1,000 次 API 呼叫', '社群支援'],
  },
]
