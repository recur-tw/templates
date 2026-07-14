import { signIn } from './actions'

// Demo sign-in page: email only, no password. See lib/session.ts for how to
// swap in real auth.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-2xl font-bold">登入</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Demo 登入:輸入 email 即可,不需密碼。這個 email 會作為 Recur 的客戶身分。
      </p>
      <form action={signIn} className="mt-6 space-y-4">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-md border border-neutral-300 px-3 py-2"
        />
        {error === 'invalid_email' && (
          <p className="text-sm text-red-600">Email 格式不正確,請再試一次。</p>
        )}
        <button
          type="submit"
          className="w-full rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700"
        >
          登入
        </button>
      </form>
    </div>
  )
}
