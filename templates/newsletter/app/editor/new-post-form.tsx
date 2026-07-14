'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function NewPostForm() {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const valid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)

  return (
    <form
      className="mt-6 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) router.push(`/editor/${slug}`)
      }}
    >
      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="new-post-slug(小寫、數字、連字號)"
        className="flex-1 rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm"
      />
      <button
        type="submit"
        disabled={!valid}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-40"
      >
        新文章
      </button>
    </form>
  )
}
