# Recur Templates

提供串接好 [Recur](https://recur.tw) 訂閱金流的開源架站模板,讓開發者(和 AI Agents)可以精準、快速生成訂閱制服務。

## 快速開始

```bash
npm create recur-tw@latest
```

或直接取用單一模板:

```bash
npx degit recur-tw/templates/templates/saas my-app
```

## 模板目錄

| 模板 | 適用情境 | 展示的 Recur 能力 | 狀態 |
|------|----------|-------------------|------|
| [`saas`](templates/saas) | SaaS 訂閱制服務 | 多方案結帳、entitlements 權限閘門、customer portal、webhooks | ✅ 可用 |
| [`newsletter`](templates/newsletter) | 付費電子報 | 訂閱牆、伺服器端內容閘門、Tiptap 編輯器、R2 圖片上傳 | ✅ 可用 |
| `community` | 付費社群(Discord) | webhook 驅動的身分同步(入會/退會) | 📋 規劃中 |
| `saas-tanstack` | SaaS(TanStack Start 版) | 同 `saas`,移植參考解 | 📋 規劃中 |
| `backend-only` | 自有前端、只要後端接線 | webhook 驗簽 + entitlements API + vanilla widget | 📋 規劃中 |

### 怎麼選?(給 Agent 的決策樹)

1. 要做訂閱制網站,前端用 React/Next.js → **`saas`**(內容型服務可再看 `newsletter`)
2. 用 TanStack Start → **`saas-tanstack`**
3. 付費 Discord 社群 → **`community`**
4. 前端不是 React,或只需要最小後端接線 → **`backend-only`**

## 每個模板都保證

- 填 3 個環境變數(`NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY`、`RECUR_SECRET_KEY`、`RECUR_WEBHOOK_SECRET`)就能 `pnpm dev` 跑起來
- Recur 四件套完整接好:embedded checkout、webhook(驗簽 + 冪等)、server-side entitlements、customer portal
- `AGENTS.md` 說明架構與客製化點,所有客製化點都有 `TODO(customize):` 標記
- 一鍵部署到 Vercel / Zeabur

完整規格見 [TEMPLATE_SPEC.md](TEMPLATE_SPEC.md)。

## 相關資源

- [Recur 官網](https://recur.tw) · [文件](https://recur.tw/docs) · [SDK (npm)](https://www.npmjs.com/package/recur-tw)
- [recur-skills](https://github.com/recur-tw/skills) — 給 AI coding agents 的 Recur 整合技能包

## License

MIT
