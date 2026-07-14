import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Providers } from './providers'
import { getSession } from '@/lib/session'
import { signOut } from './login/actions'

// TODO(customize): Product name and description.
export const metadata: Metadata = {
  title: 'Acme SaaS — Recur Starter',
  description: '訂閱制 SaaS 範本,使用 Recur 金流',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <html lang="zh-TW">
      <body>
        <Providers customerEmail={session?.email}>
          <header className="border-b border-neutral-200">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold">
                {/* TODO(customize): Logo / product name */}
                Acme SaaS
              </Link>
              <div className="flex items-center gap-6 text-sm">
                <Link href="/pricing" className="hover:underline">
                  方案與定價
                </Link>
                {session ? (
                  <>
                    <Link href="/dashboard" className="hover:underline">
                      Dashboard
                    </Link>
                    <Link href="/account" className="hover:underline">
                      帳戶
                    </Link>
                    <form action={signOut}>
                      <button type="submit" className="text-neutral-500 hover:underline">
                        登出
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700"
                  >
                    登入
                  </Link>
                )}
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
