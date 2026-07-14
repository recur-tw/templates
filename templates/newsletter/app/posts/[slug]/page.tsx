import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/posts'
import { getSession } from '@/lib/session'
import { getAccess } from '@/lib/entitlements'
import { renderPostHTML } from '@/lib/render'

// Premium posts are gated server-side: content HTML is only produced when
// Recur's entitlements API confirms access. Nothing premium reaches the
// client for non-subscribers.
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  let canRead = !post.premium
  let signedIn = false
  if (post.premium) {
    const session = await getSession()
    signedIn = Boolean(session)
    if (session) {
      const access = await getAccess(session.email)
      canRead = access.allowed
    }
  }

  return (
    <article className="mx-auto max-w-2xl">
      <header>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <time>{post.publishedAt}</time>
          {post.premium && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">💎 訂閱者限定</span>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{post.title}</h1>
        {post.description && <p className="mt-2 text-lg text-neutral-600">{post.description}</p>}
      </header>

      {canRead ? (
        <div
          className="prose prose-neutral mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: renderPostHTML(post.content) }}
        />
      ) : (
        <div className="mt-10 rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
          <h2 className="text-xl font-semibold">這是訂閱者限定文章</h2>
          <p className="mt-2 text-neutral-600">訂閱後即可閱讀全部內容,隨時可以取消。</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/subscribe"
              className="rounded-md bg-neutral-900 px-5 py-2.5 text-white hover:bg-neutral-700"
            >
              訂閱解鎖
            </Link>
            {!signedIn && (
              <Link
                href="/login"
                className="rounded-md border border-neutral-300 px-5 py-2.5 hover:bg-white"
              >
                已訂閱?登入
              </Link>
            )}
          </div>
        </div>
      )}
    </article>
  )
}
