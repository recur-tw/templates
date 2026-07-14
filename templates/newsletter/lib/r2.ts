// Cloudflare R2 image uploads via S3-compatible signed requests (aws4fetch —
// no AWS SDK needed). Optional: without the R2_* env vars the editor still
// works, only image upload is disabled.
//
// Setup (Cloudflare dashboard → R2):
// 1. Create a bucket and enable public access (or attach a custom domain)
// 2. Create an API token with Object Read & Write for that bucket
// 3. Fill R2_* variables in .env.local (see .env.example)
import { AwsClient } from 'aws4fetch'

export function r2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL
  )
}

/** Uploads a file to R2 and returns its public URL. */
export async function uploadToR2(key: string, body: ArrayBuffer, contentType: string): Promise<string> {
  const client = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  })
  const endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/${key}`

  const response = await client.fetch(endpoint, {
    method: 'PUT',
    headers: { 'content-type': contentType },
    body,
  })
  if (!response.ok) {
    throw new Error(`R2 upload failed: ${response.status} ${await response.text()}`)
  }
  return `${process.env.R2_PUBLIC_URL!.replace(/\/$/, '')}/${key}`
}
