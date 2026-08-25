# ai-toolkit

Asset A — 主攻的 AI 配套微工具站（见 `../global-site-profit-plan/` 的作战计划）。

## Quick start

```bash
npm install
npm run dev
```

## 域名

已注册 **llmtoolkit.dev**（Cloudflare Registrar），`config.ts` / `astro.config.mjs` / `robots.txt` 已接线。

## 部署

已通过 wrangler 直传部署到 Cloudflare Pages（wrangler 已登录）：

```bash
npm run build
wrangler pages deploy dist --project-name llmtoolkit --branch main
```

- 生产域名：https://llmtoolkit.dev（已绑定，2026-08-25 验证 200）
- 代码托管：https://github.com/LuanRochaCosta/llmtoolkit（推送需 LuanRochaCosta 凭据；远程 URL 已嵌入用户名）
- 域名绑定完成后无需再动；每次更新 = build + deploy 两条命令

## IndexNow（已配置）

- Key：`04274b99048d971504b8b93fa05a68d4`（验证文件 `public/04274b99048d971504b8b93fa05a68d4.txt`，内容同 key）
- 首次全量提交已完成（2026-08-26，HTTP 202 已受理）
- 新页面/重要更新后重新提交：

```powershell
$body = @{ host = "llmtoolkit.dev"; key = "04274b99048d971504b8b93fa05a68d4"; keyLocation = "https://llmtoolkit.dev/04274b99048d971504b8b93fa05a68d4.txt"; urlList = @("<要提交的URL>") } | ConvertTo-Json
Invoke-WebRequest -Uri "https://api.indexnow.org/indexnow" -Method POST -ContentType "application/json; charset=utf-8" -Body $body
```

## 数据维护纪律（核心差异化资产）

`src/data/models.ts` 是全站最值钱的文件。规则：

- 每行价格必须带 `source` 和 `lastChecked`
- 对照官方 pricing 页核对后把 `verified` 置为 `true`
- 每月 1 日全量核对一次（这也自动刷新页面的 dateModified，是 GEO 信号）
- 2026-08-25 首轮核验完成：12 行中 11 行溯源至官方 pricing 页（OpenAI/Anthropic/Google），1 行（Gemini 3.1 Flash-Lite）标注 `verified: false`

## 路线图

- [x] Tool 1: AI Token Counter（`js-tiktoken` 客户端精确计数 + 估算标注）
- [ ] Tool 2: LLM Pricing Comparison（models.ts 渲染 + 排序）
- [ ] Tool 3: Context Window Comparison
- [ ] Tool 4: LLM API Cost Calculator
- [ ] Tool 5: Token ↔ Words Converter
- [ ] FAQ schema + 每工具页 FAQ 块
- [ ] AdSense（10+ 页后申请）
