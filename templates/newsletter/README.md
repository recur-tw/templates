# Recur Newsletter Starter

付費電子報範本,已完整串接 [Recur](https://recur.tw) 金流:訂閱牆、伺服器端內容閘門、customer portal、webhook。搭配 Tiptap 編輯器與 Cloudflare R2 圖片上傳,無需資料庫。

## 功能

- **文章系統** — 內容存 `content/posts/*.json`(git 版本控制),免資料庫;免費/付費文章混排
- **Tiptap 編輯器**(本機開發限定)— 標題、清單、引言、程式碼區塊、圖片;儲存即寫入檔案,git push 即發佈
- **圖片上傳** — Cloudflare R2(S3 相容簽名,走輕量 `aws4fetch`);未設定 R2 時其他功能不受影響
- **訂閱牆** — 付費文章伺服器端閘門(未訂閱者連 HTML 都拿不到),Hosted Checkout 訂閱
- **帳戶頁** — Recur Customer Portal 自助管理(取消、換卡、帳單)
- **Webhook 端點** — `recur.webhooks.verify()` 驗簽 + 事件冪等

## 快速開始

### 1. 取得專案

```bash
npm create recur-tw@latest my-newsletter -- --template newsletter
```

### 2. 設定環境變數

```bash
cp .env.example .env.local
```

| 變數 | 必填 | 說明 |
|------|------|------|
| `NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY` | ✅ | `pk_test_xxx`([app.recur.tw](https://app.recur.tw) → Settings → Developers) |
| `RECUR_SECRET_KEY` | ✅ | `sk_test_xxx`(僅後端) |
| `RECUR_WEBHOOK_SECRET` | ✅ | Settings → Webhooks 新增端點後取得 |
| `AUTH_SECRET` | 正式環境 | `openssl rand -hex 32` |
| `R2_*`(5 個) | 選填 | 編輯器圖片上傳用,見 `.env.example` 內說明 |

### 3. 在 Recur 建立產品

Dashboard → Products 建立一個 **SUBSCRIPTION** 產品,slug 設為 `newsletter`(或改 `lib/config.ts`)。

### 4. 啟動與寫作

```bash
pnpm dev
```

- 讀者端:http://localhost:3000 (兩篇範例文章,`premium-sample` 可測試付費牆)
- 寫作:導覽列「✍ 編輯器」→ 撰寫 → 儲存 → `git commit` + `git push` 即發佈

## 發佈流程(免資料庫的設計)

編輯器只在 `pnpm dev` 運作,文章儲存為 `content/posts/<slug>.json`。部署後檔案系統是唯讀的,所以「發佈」就是 git push——內容跟程式碼一起版本控制、一起部署,不需要任何資料庫或 CMS 服務。

## 部署

推上 GitHub 後在 Vercel / Zeabur 匯入,設定環境變數即可。記得將 Recur webhook 端點指向 `https://<你的網域>/api/webhooks/recur`,並換用 `pk_live_` / `sk_live_` 金鑰。

## 客製化

```bash
grep -rn "TODO(customize)" --include="*.ts" --include="*.tsx" .
```

架構說明見 [AGENTS.md](AGENTS.md)。

## License

MIT
