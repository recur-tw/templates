import { notFound } from 'next/navigation'
import { getPost, isValidSlug, type Post } from '@/lib/posts'
import { PostEditor } from '@/components/editor/post-editor'

// Dev-only: edit an existing post or start a new one at this slug.
export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!isValidSlug(slug)) notFound()

  if (process.env.NODE_ENV !== 'development') {
    return (
      <p className="mx-auto max-w-2xl rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        編輯器只在本機開發模式可用。
      </p>
    )
  }

  const existing = getPost(slug)
  const initial: Post = existing ?? {
    slug,
    title: '',
    description: '',
    premium: false,
    publishedAt: new Date().toISOString().slice(0, 10),
    content: { type: 'doc', content: [{ type: 'paragraph' }] },
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PostEditor initial={initial} />
    </div>
  )
}
