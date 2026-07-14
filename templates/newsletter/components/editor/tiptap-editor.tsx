'use client'

// Tiptap rich-text editor (dev-only writing UI). Extensions here must stay
// in sync with lib/render.ts so saved content renders identically for
// readers.
import { useRef } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import type { JSONContent } from '@tiptap/core'

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm ${active ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'}`}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInput = useRef<HTMLInputElement>(null)

  const uploadImage = async (file: File) => {
    const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'content-type': file.type },
      body: file,
    })
    const data = await response.json()
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error(data.error)
      window.alert(data.error ?? '上傳失敗')
      return
    }
    editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-neutral-200 p-2">
      <ToolbarButton title="標題 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton title="標題 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>
      <ToolbarButton title="粗體" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        B
      </ToolbarButton>
      <ToolbarButton title="斜體" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton title="行內程式碼" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
        {'<>'}
      </ToolbarButton>
      <ToolbarButton title="項目清單" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • 列表
      </ToolbarButton>
      <ToolbarButton title="編號清單" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. 列表
      </ToolbarButton>
      <ToolbarButton title="引言" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        ❝
      </ToolbarButton>
      <ToolbarButton title="程式碼區塊" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        {'{ }'}
      </ToolbarButton>
      <ToolbarButton title="插入圖片(上傳到 R2)" onClick={() => fileInput.current?.click()}>
        🖼 圖片
      </ToolbarButton>
      <ToolbarButton title="復原" onClick={() => editor.chain().focus().undo().run()}>
        ↩
      </ToolbarButton>
      <ToolbarButton title="重做" onClick={() => editor.chain().focus().redo().run()}>
        ↪
      </ToolbarButton>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void uploadImage(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

export function TiptapEditor({
  initialContent,
  onChange,
}: {
  initialContent: JSONContent | null
  onChange: (content: JSONContent) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: initialContent ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none min-h-96 p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  })

  if (!editor) return <div className="p-4 text-neutral-500">載入編輯器…</div>

  return (
    <div className="rounded-lg border border-neutral-200">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
