// Webhook idempotency store. Recur may deliver the same event more than
// once (retries), so handlers must deduplicate by event id.
//
// TODO(customize): This in-memory store is fine for a single-instance demo
// but resets on restart and does not work across serverless instances.
// In production, back it with your database or a KV store — keep the same
// two-function interface and nothing else needs to change.
const processed = new Map<string, number>()
const MAX_ENTRIES = 10_000

export function hasProcessed(eventId: string): boolean {
  return processed.has(eventId)
}

export function markProcessed(eventId: string): void {
  if (processed.size >= MAX_ENTRIES) {
    // Drop the oldest entry (Map preserves insertion order).
    const oldest = processed.keys().next().value
    if (oldest) processed.delete(oldest)
  }
  processed.set(eventId, Date.now())
}
