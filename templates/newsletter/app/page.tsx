import Link from 'next/link'
import { SITE } from '@/lib/config'
import { listPosts } from '@/lib/posts'

export default function HomePage() {
  const posts = listPosts().filter((p) => p.publishedAt <= new Date().toISOString().slice(0, 10))

  return (
    <div className="mx-auto max-w-2xl">
      {/* TODO(customize): Newsletter hero — name/pitch live in lib/config.ts */}
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{SITE.name}</h1>
        <p className="mt-3 text-lg text-neutral-600">{SITE.description}</p>
        <Link
          href="/subscribe"
          className="mt-6 inline-block rounded-md bg-neutral-900 px-5 py-2.5 text-white hover:bg-neutral-700"
        >
          訂閱電子報
        </Link>
      </section>

      <section className="mt-4 space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="block rounded-lg border border-neutral-200 p-5 hover:bg-neutral-50"
          >
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <time>{post.publishedAt}</time>
              {post.premium && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">💎 訂閱者限定</span>
              )}
            </div>
            <h2 className="mt-1 text-xl font-semibold">{post.title}</h2>
            {post.description && <p className="mt-1 text-neutral-600">{post.description}</p>}
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
            還沒有文章 — 本機執行 <code>pnpm dev</code> 後到 /editor 撰寫第一篇。
          </p>
        )}
      </section>
    </div>
  )
}
