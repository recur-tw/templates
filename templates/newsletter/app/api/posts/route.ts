// Dev-only editor API: saves a post to content/posts/<slug>.json.
// Publishing to production happens via git (commit + push), so this route is
// disabled outside `next dev` — the deployed filesystem is read-only anyway.
import { NextRequest, NextResponse } from 'next/server'
import { savePost, isValidSlug, type Post } from '@/lib/posts'

export async function PUT(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'The editor only works in development. Publish posts with git push.' },
      { status: 403 }
    )
  }

  const body = (await request.json()) as Partial<Post>
  if (!body.slug || !isValidSlug(body.slug)) {
    return NextResponse.json({ error: 'Invalid slug (use lowercase letters, digits, hyphens)' }, { status: 400 })
  }
  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!body.content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  savePost({
    slug: body.slug,
    title: body.title.trim(),
    description: body.description?.trim() ?? '',
    premium: Boolean(body.premium),
    publishedAt: body.publishedAt ?? new Date().toISOString().slice(0, 10),
    content: body.content,
  })

  return NextResponse.json({ ok: true })
}
