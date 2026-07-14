import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Providers } from './providers'
import { getSession } from '@/lib/session'
import { signOut } from './login/actions'
import { SITE } from '@/lib/config'

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.description,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="zh-TW">
      <body>
        <Providers customerEmail={session?.email}>
          <header className="border-b border-neutral-200">
            <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold">
                {SITE.name}
              </Link>
              <div className="flex items-center gap-5 text-sm">
                <Link href="/subscribe" className="hover:underline">
                  訂閱
                </Link>
                {isDev && (
                  <Link href="/editor" className="text-neutral-500 hover:underline">
                    ✍ 編輯器
                  </Link>
                )}
                {session ? (
                  <>
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
                  <Link href="/login" className="hover:underline">
                    登入
                  </Link>
                )}
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
          <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500">
            {SITE.name} · Powered by <a href="https://recur.tw" className="underline">Recur</a>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
