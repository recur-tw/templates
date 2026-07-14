# Recur SaaS Starter

訂閱制 SaaS 範本,已完整串接 [Recur](https://recur.tw) 金流:結帳、webhook、伺服器端權限閘門、客戶自助訂閱管理。換上你的產品邏輯就能上線。

## 功能

- **方案與定價頁** — 從 Recur 讀取產品列表,Hosted Checkout 結帳(本機開發也能完整跑通)
- **Dashboard 付費牆** — 伺服器端用 entitlements API 判斷存取權,含試用中 / 扣款失敗 / 已取消等狀態提示
- **帳戶頁** — 一鍵開啟 Recur Customer Portal(取消訂閱、更新卡片、帳單記錄)
- **Webhook 端點** — HMAC 驗簽 + 事件冪等處理,七種常用事件的 handler 骨架
- **Demo 登入** — email 即登入(無密碼),清楚標示如何換成正式 auth

## 快速開始

### 1. 取得專案

```bash
npm create recur-tw@latest my-app -- --template saas
# 或
npx degit recur-tw/templates/templates/saas my-app
cd my-app && pnpm install
```

### 2. 設定環境變數

```bash
cp .env.example .env.local
```

到 [app.recur.tw](https://app.recur.tw) → Settings → Developers 取得金鑰,填入:

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY` | `pk_test_xxx`(前端用) |
| `RECUR_SECRET_KEY` | `sk_test_xxx`(僅後端,勿外洩) |
| `RECUR_WEBHOOK_SECRET` | Settings → Webhooks 新增端點後取得 |
| `AUTH_SECRET` | 選填(正式環境必填):`openssl rand -hex 32` |

### 3. 在 Recur 建立產品

到 Dashboard → Products 建立兩個 **SUBSCRIPTION** 產品,slug 分別設為 `starter-plan` 和 `pro-plan`(或改 `lib/plans.ts` 對應你自己的 slug)。

### 4. 啟動

```bash
pnpm dev
```

打開 http://localhost:3000 → 登入(任意 email)→ 到定價頁用測試卡完成一筆結帳 → Dashboard 解鎖。

### 5. 測試 Webhook(本機)

```bash
ngrok http 3000
# 到 Recur Dashboard → Settings → Webhooks 新增端點:
# https://xxxx.ngrok.io/api/webhooks/recur
```

## 部署

推上你自己的 GitHub repo 後:

- **Vercel**:匯入 repo → 設定四個環境變數 → Deploy
- **Zeabur**:新增服務 → 選 repo → 設定環境變數

部署後記得到 Recur Dashboard 把 webhook 端點改成正式網址,並換成 `pk_live_` / `sk_live_` 金鑰。

## 客製化

所有客製化點都有標記,一次找齊:

```bash
grep -rn "TODO(customize)" --include="*.ts" --include="*.tsx" .
```

架構說明與換用正式 auth(better-auth / next-auth / Clerk)的方法見 [AGENTS.md](AGENTS.md)。

## License

MIT
