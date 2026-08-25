# ai-toolkit

Asset A — 主攻的 AI 配套微工具站（见 `../global-site-profit-plan/` 的作战计划）。

## Quick start

```bash
npm install
npm run dev
```

## 域名

已注册 **llmtoolkit.dev**（Cloudflare Registrar），`config.ts` / `astro.config.mjs` / `robots.txt` 已接线。

## 上线 checklist（Cloudflare Pages）

1. `git init` + push 到 GitHub 仓库（私有即可）
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → 选仓库
3. 构建命令 `npm run build`，输出目录 `dist`，Node 兼容性选最新
4. Custom domain 绑定（域名在 Cloudflare Registrar 时零配置）
5. Google Search Console：DNS TXT 验证 → 提交 `sitemap-index.xml`
6. Bing Webmaster Tools：导入 GSC → 拿 IndexNow key，部署时生成 `/_generated/indexnow-key.txt`
7. Cloudflare Web Analytics：开启（免费、无 cookie）

## 数据维护纪律（核心差异化资产）

`src/data/models.ts` 是全站最值钱的文件。规则：

- 每行价格必须带 `source` 和 `lastChecked`
- 对照官方 pricing 页核对后把 `verified` 置为 `true`
- 每月 1 日全量核对一次（这也自动刷新页面的 dateModified，是 GEO 信号）
- 当前数据全部来自二手来源、`verified: false`，**上线前必须逐行核对**

## 路线图

- [x] Tool 1: AI Token Counter（`js-tiktoken` 客户端精确计数 + 估算标注）
- [ ] Tool 2: LLM Pricing Comparison（models.ts 渲染 + 排序）
- [ ] Tool 3: Context Window Comparison
- [ ] Tool 4: LLM API Cost Calculator
- [ ] Tool 5: Token ↔ Words Converter
- [ ] FAQ schema + 每工具页 FAQ 块
- [ ] AdSense（10+ 页后申请）
