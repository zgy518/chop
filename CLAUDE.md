# Chop — Privacy-First Browser Audio Toolkit

## 项目信息

- **产品**：Chop — 纯浏览器端音频处理工具
- **定位**："Your audio never leaves your device"
- **目标用户**：海外英语市场的内容创作者（播客、YouTuber、TikToker）
- **变现**：免费 10 次/天 + $14.99 终身买断
- **部署**：Vercel（主）+ GitHub Pages（备）

## 技术栈

- Next.js 16 + TypeScript + Tailwind CSS v4
- FFmpeg.wasm（音频处理核心）
- Web Audio API（波形可视化 + 播放预览）
- JSZip（批量下载）
- localStorage（用量追踪 + License Key）

## 项目结构

```
chop/
├── CLAUDE.md
├── docs/              ← 需求/技术/设计/执行计划
├── dev-logs/          ← 每日开发日志
├── public/            ← robots.txt, sitemap.xml, ffmpeg-core/
├── src/
│   ├── app/           ← layout.tsx, page.tsx, globals.css, privacy/
│   ├── components/    ← 所有 React 组件
│   ├── lib/           ← 核心逻辑（ffmpeg, convert, trim, merge, extract, waveform, storage, license, analytics）
│   └── types/         ← TypeScript 类型定义
└── .github/workflows/ ← CI/CD
```

## 组件模式

- 所有状态集中在 `page.tsx`（`useState`），子组件纯展示/回调
- 每个组件有明确的 TypeScript props 接口
- 样式：Tailwind v4 `@theme inline`，zinc/indigo/emerald 调色板
- 按钮：`rounded-xl` + `transition-all duration-200` + `active:scale-[0.98]`
- 卡片：`rounded-2xl border border-zinc-200 bg-white`

## 约束

1. **零预算**：所有服务必须用免费层
2. **纯浏览器端**：核心计算在客户端完成
3. **英文界面**：目标用户是海外英语用户
4. **渐进开发**：每次只做一步，验证后再继续
5. **用户操作归用户**：注册账号、配置服务等由用户自己完成
6. **手术式修改**：只改必须改的，不顺手"优化"旁边代码
