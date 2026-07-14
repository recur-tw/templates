'use client'

import { RecurProvider } from 'recur-tw'

export function Providers({
  children,
  customerEmail,
}: {
  children: React.ReactNode
  customerEmail?: string
}) {
  return (
    <RecurProvider
      config={{
        publishableKey: process.env.NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY!,
      }}
      customer={customerEmail ? { email: customerEmail } : undefined}
    >
      {children}
    </RecurProvider>
  )
}
