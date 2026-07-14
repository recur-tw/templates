'use client'

// Dev-only post editing form: metadata fields + Tiptap content + save.
import { useState } from 'react'
import type { JSONContent } from '@tiptap/core'
import type { Post } from '@/lib/posts'
import { TiptapEditor } from './tiptap-editor'

export function PostEditor({ initial }: { initial: Post }) {
  const [title, setTitle] = useState(initial.title)
  const [description, setDescription] = useState(initial.description)
  const [premium, setPremium] = useState(initial.premium)
  const [publishedAt, setPublishedAt] = useState(initial.publishedAt)
  const [content, setContent] = useState<JSONContent>(initial.content)
  const [status, setStatus] = useState<string | null>(null)

  const save = async () => {
    setStatus('儲存中…')
    const response = await fetch('/api/posts', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug: initial.slug, title, description, premium, publishedAt, content }),
    })
    const data = await response.json()
    setStatus(response.ok ? `已儲存 ✓ (content/posts/${initial.slug}.json — 記得 git commit)` : `儲存失敗:${data.error}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm text-neutral-500">/posts/{initial.slug}</p>
        <div className="flex items-center gap-3">
          {status && <span className="text-sm text-neutral-500">{status}</span>}
          <button
            onClick={save}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
          >
            儲存
          </button>
        </div>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="文章標題"
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-2xl font-bold"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="摘要(顯示在列表和付費牆上)"
        rows={2}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
      <div className="flex items-center gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} />
          付費文章(需訂閱才能閱讀)
        </label>
        <label className="flex items-center gap-2">
          發佈日期
          <input
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="rounded-md border border-neutral-300 px-2 py-1"
          />
        </label>
      </div>

      <TiptapEditor initialContent={content} onChange={setContent} />
    </div>
  )
}
