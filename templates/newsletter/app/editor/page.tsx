import Link from 'next/link'
import { listPosts } from '@/lib/posts'
import { NewPostForm } from './new-post-form'

// Dev-only writing dashboard. In production the save/upload APIs are
// disabled — publishing happens via git push.
export default function EditorIndexPage() {
  const posts = listPosts()
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">編輯器</h1>
      {!isDev && (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          編輯器只在本機開發模式(<code>pnpm dev</code>)可用。發佈文章請在本機撰寫後 git push。
        </p>
      )}

      {isDev && <NewPostForm />}

      <ul className="mt-8 space-y-3">
        {posts.map((post) => (
          <li key={post.slug} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4">
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-sm text-neutral-500">
                /posts/{post.slug} · {post.publishedAt} {post.premium && '· 💎 付費'}
              </p>
            </div>
            {isDev && (
              <Link href={`/editor/${post.slug}`} className="text-sm underline">
                編輯
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
