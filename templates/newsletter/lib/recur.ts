// Server-side Recur SDK singleton. Server code only — never import this
// from a client component (it would leak the secret key).
import { Recur } from 'recur-tw/server'

if (!process.env.RECUR_SECRET_KEY) {
  throw new Error('RECUR_SECRET_KEY is not set. Copy .env.example to .env.local and fill it in.')
}

export const recur = new Recur(process.env.RECUR_SECRET_KEY)
