// Dev-only image upload: streams the file to Cloudflare R2 and returns its
// public URL for the editor to embed. Optional — without R2_* env vars the
// route answers 501 with setup instructions.
import { NextRequest, NextResponse } from 'next/server'
import { r2Configured, uploadToR2 } from '@/lib/r2'

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml']

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Uploads only work in development.' }, { status: 403 })
  }
  if (!r2Configured()) {
    return NextResponse.json(
      { error: 'R2 is not configured. Fill the R2_* variables in .env.local (see .env.example).' },
      { status: 501 }
    )
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: `Unsupported image type: ${contentType}` }, { status: 415 })
  }

  const body = await request.arrayBuffer()
  if (body.byteLength === 0 || body.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: `Image must be 1 byte – ${MAX_BYTES / 1024 / 1024} MB` }, { status: 413 })
  }

  const original = request.nextUrl.searchParams.get('filename') ?? 'image'
  const safe = original.toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '')
  const key = `images/${Date.now()}-${safe || 'image'}`

  try {
    const url = await uploadToR2(key, body, contentType)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('R2 upload error:', error)
    return NextResponse.json({ error: 'Upload failed — check R2 credentials and bucket.' }, { status: 502 })
  }
}
