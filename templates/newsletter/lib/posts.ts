// File-based post store: each post is one JSON file in content/posts/,
// holding metadata plus Tiptap JSON content. Posts are versioned in git —
// you write locally with the /editor (dev only) and publish with git push.
// No database needed.
//
// TODO(customize): If you outgrow files (multiple authors, online editing),
// swap this module for a database — keep the same exported functions and
// nothing else in the template needs to change.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { JSONContent } from '@tiptap/core'

const POSTS_DIR = join(process.cwd(), 'content', 'posts')
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export interface PostMeta {
  slug: string
  title: string
  description: string
  /** Premium posts require an active subscription to read */
  premium: boolean
  /** ISO 8601 date; posts with a future date are hidden from the list */
  publishedAt: string
}

export interface Post extends PostMeta {
  content: JSONContent
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug)
}

export function getPost(slug: string): Post | null {
  if (!isValidSlug(slug)) return null
  const file = join(POSTS_DIR, `${slug}.json`)
  if (!existsSync(file)) return null
  return JSON.parse(readFileSync(file, 'utf8')) as Post
}

export function listPosts(): PostMeta[] {
  if (!existsSync(POSTS_DIR)) return []
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const { content: _content, ...meta } = JSON.parse(
        readFileSync(join(POSTS_DIR, f), 'utf8')
      ) as Post
      return meta
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/** Dev-only: called by the editor API route. */
export function savePost(post: Post): void {
  if (!isValidSlug(post.slug)) {
    throw new Error(`Invalid slug: ${post.slug} (use lowercase letters, digits, hyphens)`)
  }
  mkdirSync(POSTS_DIR, { recursive: true })
  writeFileSync(join(POSTS_DIR, `${post.slug}.json`), JSON.stringify(post, null, 2) + '\n')
}
