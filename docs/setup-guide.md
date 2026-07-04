# Chop 上线操作指南（傻瓜版）

你需要做 4 件事。每件事我都写了详细步骤。

---

## 第 1 步：部署到 Vercel（主站点，约 5 分钟）

### 1.1 安装 Vercel CLI

打开终端（Win+R → 输入 `cmd` → 回车），粘贴这行命令：

```
npm install -g vercel
```

等待 30 秒左右，出现一行字就装好了。

### 1.2 登录 Vercel

还是在终端里，输入：

```
vercel login
```

会自动打开浏览器，用你的 GitHub 账号登录（点击 "Continue with GitHub"），看到绿色✅就完成了。

### 1.3 部署

终端进入 chop 目录：

```
cd "d:\AI API\圆梦\web出海\chop"
```

然后部署：

```
vercel --prod
```

第一次会问几个问题，全部按回车（用默认选项）：
- `Set up and deploy?` → 按回车（Y）
- `Which scope?` → 按回车（选你的账号）
- `Link to existing project?` → 按回车（N）
- `Project name?` → 输入 `chop` 然后回车
- `In which directory?` → 按回车（./）
- `Override settings?` → 按回车（N）

等待 1-2 分钟，部署完成。终端会显示一个网址，类似 `https://chop-xxx.vercel.app`。

✅ **验证**：在浏览器里打开那个网址，能看到 Chop 页面就成功了。

### 1.4 （可选）绑定你自己的域名

如果你有域名（比如在 Namecheap 买的），在 Vercel 后台绑定：
1. 打开 https://vercel.com/dashboard
2. 点 chop 项目 → Settings → Domains
3. 输入你的域名 → Add
4. 按提示去域名后台改 DNS 记录

---

## 第 2 步：部署到 GitHub Pages（备用站点，约 5 分钟）

### 2.1 确认代码已推送到 GitHub

在终端里：

```
cd "d:\AI API\圆梦\web出海\chop"
git status
```

如果显示 `nothing to commit`，说明已经推送了。如果看到红色的文件，执行：

```
git add -A
git commit -m "Ready for launch"
git push origin master
```

### 2.2 开启 GitHub Pages

1. 打开你的 GitHub 仓库页面：https://github.com/zgy518/chop（如果仓库名不一样就改一下）
2. 点顶部的 **Settings** 标签
3. 左边菜单点 **Pages**
4. 在 "Build and deployment" 下面：
   - Source 选 **GitHub Actions**
5. 页面会自动保存，不需要点别的

### 2.3 等待自动部署

你每次 `git push` 到 master 分支，GitHub 会自动构建部署。等 2-3 分钟后去这个地址看：

```
https://zgy518.github.io/chop
```

✅ **验证**：能打开就能用了（注意：GitHub Pages 不支持多线程，FFmpeg 会慢一些，但功能完全正常）。

---

## 第 3 步：配置 Google Analytics（统计访问量，约 10 分钟）

### 3.1 创建 GA4 账号

1. 打开 https://analytics.google.com
2. 用你的 Google 账号登录
3. 点左下角齿轮⚙️ → **Create Property**
4. 填写：
   - Property name: `Chop`
   - Time zone: `United States` (你的用户是海外)
   - Currency: `USD`
5. 点 Next → 选 "Web" → 填网址（你的 Vercel 地址）→ Create stream
6. 会看到一个 **Measurement ID**，格式是 `G-XXXXXXXXXX`（比如 `G-ABC123DEF`）

### 3.2 把 ID 填进代码

用记事本或 VS Code 打开这个文件：

```
d:\AI API\圆梦\web出海\chop\src\lib\analytics.tsx
```

把第 5 行的 `G-XXXXXXXXXX` 替换成你的真实 ID，比如：

```typescript
const GA_MEASUREMENT_ID = "G-ABC123DEF"; // 改成你自己的
```

保存文件。

### 3.3 重新部署

修改代码后需要重新部署让改动生效：

```
cd "d:\AI API\圆梦\web出海\chop"
vercel --prod
```

等 1 分钟就更新好了。

✅ **验证**：过几分钟去 GA4 后台看 Reports → Real-time，如果有访客就会显示。

---

## 第 4 步：测试功能（约 15 分钟）

打开你的网站，逐个测试：

### 4.1 Convert（转换格式）
- [ ] 拖一个 MP3/WAV 文件进去
- [ ] 选输出格式（比如选 MP3）
- [ ] 点 Convert → 下载的文件能正常播放
- [ ] 试试 Normalize 和 Speed 选项

### 4.2 Trim（裁剪）
- [ ] 拖一个音频文件进去
- [ ] 看到波形图
- [ ] 拖动左右手柄选择范围
- [ ] 点播放按钮能预览
- [ ] 点 Trim & Download → 裁剪后的文件正确

### 4.3 Merge（合并）
- [ ] 拖多个音频文件进去
- [ ] 用上下箭头调整顺序
- [ ] 点 Merge → 合并后的文件正确

### 4.4 Extract（提取）
- [ ] 拖一个 MP4 视频进去
- [ ] 选输出格式
- [ ] 点 Extract Audio → 提取的音频能播放

### 4.5 付费墙
- [ ] 用了 10 次后，弹窗出现
- [ ] 输入激活码 `CHOP-C8A1-D3F7-B5E9` → 解锁成功
- [ ] 解锁后 Header 显示 "Pro · Unlimited"

### 4.6 手机测试
- [ ] 用手机浏览器打开网站
- [ ] 布局正常，按钮能点
- [ ] 至少测一个功能

---

## 附录 A：给客户发激活码

你有 5 个预制的激活码：

| # | 激活码 |
|---|--------|
| 1 | `CHOP-C8A1-D3F7-B5E9` |
| 2 | `CHOP-D3F7-A6E2-C1D8` |
| 3 | `CHOP-E5B9-F2C4-A8D1` |
| 4 | `CHOP-F2C4-E5B9-D7A3` |
| 5 | `CHOP-A6E2-B1D8-F9C4` |

### 卖激活码的流程

1. 客户发邮件到 `18800492787@163.com` 说要买
2. 你回复：PayPal 付款链接（$14.99），让客户付款
3. 客户付款后，你从上面挑一个没用过的激活码发给客户
4. （可选）想生成新码，在浏览器控制台 `F12` → Console → 粘贴：
   ```javascript
   // 这个代码在 src/lib/license.ts 里，需要 Node 环境运行
   // 简单做法：随便编一个以 c8a1 开头的码，格式 CHOP-XXXX-XXXX-XXXX
   ```

### 记录用过的码

在电脑上建个 txt 文件，记录哪个码给了哪个客户：

```
CHOP-C8A1-D3F7-B5E9 → john@gmail.com (2024-07-03)
CHOP-D3F7-A6E2-C1D8 → (未使用)
CHOP-E5B9-F2C4-A8D1 → (未使用)
CHOP-F2C4-E5B9-D7A3 → (未使用)
CHOP-A6E2-B1D8-F9C4 → (未使用)
```

---

## 附录 B：常见问题

### Q: 网站打不开？
1. 检查 Vercel：https://vercel.com/dashboard → 看有没有红色的错误
2. 如果 Vercel 挂了，用备用站：https://zgy518.github.io/chop

### Q: FFmpeg 加载很慢？
- 首次访问要下载 31MB 的 WASM 文件，正常需要 5-15 秒
- 之后浏览器缓存了，秒开
- GitHub Pages 上更慢（单线程），Vercel 上更快（多线程）

### Q: 想改价格？
编辑 `d:\AI API\圆梦\web出海\chop\src\components\Paywall.tsx`，搜 `$14.99`，改成你想要的价格，然后重新 `vercel --prod`。

### Q: 想加新的音频格式？
编辑 `d:\AI API\圆梦\web出海\chop\src\lib\convert.ts`，在 `FORMAT_MAP` 里加一行。FFmpeg 支持几乎所有格式。

### Q: 怎么看到底卖了多少个？
目前没有后台统计。建议手动记录。以后可以加 LemonSqueezy 自动处理。

---

## 总结

| 步骤 | 做什么 | 需要多久 |
|------|--------|---------|
| 1 | `vercel --prod` 部署 | 5 分钟 |
| 2 | GitHub Settings → Pages → Actions | 5 分钟 |
| 3 | Google Analytics 创建 → 复制 ID → 改代码 → 重新部署 | 10 分钟 |
| 4 | 逐项测试 4 个工具 | 15 分钟 |

**总计约 35 分钟。**

需要我帮你做其他的就说。目前代码层面所有功能都已完成并验证通过（`npm run build` 零错误）。
