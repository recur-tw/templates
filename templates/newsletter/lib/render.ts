// Server-side rendering of Tiptap JSON to HTML. The extension list must
// match components/editor/tiptap-editor.tsx, or saved content will render
// differently than it looked in the editor.
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import type { JSONContent } from '@tiptap/core'

export function renderPostHTML(content: JSONContent): string {
  return generateHTML(content, [StarterKit, Image])
}
