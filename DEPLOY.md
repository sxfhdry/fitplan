# 部署到 HTTPS，让手机能安装并收到通知

目标：拿到一个 `https://` 地址，手机打开后「添加到主屏幕」，通知才能用。

> 为什么必须 HTTPS：浏览器只允许安全上下文（HTTPS 或 localhost）注册 Service Worker、发通知。
> 手机通过局域网 `http://电脑IP:8123` 打开只能打卡，收不到通知。

以下三个方案选一个即可，**方案 A 不需要安装任何软件**。

---

## 方案 A：GitHub 网页上传（零安装，推荐）

1. 打开 <https://github.com/new>
   - Repository name 填 `fitplan`
   - 选 **Public**（免费版 Pages 需要公开仓库）
   - 不要勾选任何初始化选项，点 **Create repository**

2. 解压 `fitplan-github-upload.zip`，得到这些文件和文件夹：

   ```
   index.html  styles.css  app.js  manifest.json  sw.js
   icon-180.png  icon-192.png  icon-512.png  .nojekyll
   README.md  DEPLOY.md  .github/workflows/pages.yml
   ```

3. 回到刚建好的仓库页面，点 **Add file → Upload files**，
   把解压出来的**全部文件和文件夹**一起拖进去（`.github` 文件夹也要拖，里面是自动部署配置），
   底部点 **Commit changes**。

   > 如果 `.github` 文件夹拖不进去，用另一种方式：
   > 仓库页 **Add file → Create new file**，文件名填 `.github/workflows/pages.yml`，
   > 把本文件同级 `pages.yml` 的内容整段粘贴进去，提交即可。

4. 仓库 **Settings → Pages**，在 **Build and deployment → Source** 里选 **GitHub Actions**（不要选 Deploy from a branch）。

5. 仓库顶部的 **Actions** 标签里会出现一次 `Deploy to GitHub Pages` 运行，
   等它变成绿色对勾（约 30–60 秒）。

6. 访问地址：

   ```
   https://你的用户名.github.io/fitplan/
   ```

   手机打开这个网址 → 安装到主屏幕 → 允许通知，就完成了。

以后改了计划内容，只要在网页上重新上传改动的文件，Actions 会自动重新发布。

---

## 方案 B：命令行一键（装一次工具）

想以后更新只跑一条命令的话，装两个官方工具（一次性）：

```powershell
winget install --id Git.Git -e
winget install --id GitHub.cli -e
```

装完**新开一个终端**，登录一次：

```powershell
gh auth login
```

选 `GitHub.com` → `HTTPS` → `Login with a web browser`，浏览器里授权。

然后在 `fitplan` 目录里运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy.ps1
```

脚本会自动：初始化仓库 → 创建 GitHub 仓库 → 推送 → 打开 Pages（GitHub Actions 模式）→ 打印你的网址。

---

## 方案 C：Cloudflare Pages（拖拽 zip，也免费）

1. 打开 <https://dash.cloudflare.com/>，注册/登录后进入 **Workers & Pages → Create → Pages → Upload assets**
2. 项目名填 `fitplan`，把 `fitplan-github-upload.zip` 直接拖进去，Deploy
3. 得到 `https://fitplan.pages.dev`（自定义域名也行）

Cloudflare Pages 对 zip 上传和静态站点支持很好，适合不想用 GitHub 的情况。

---

## 部署完成后

- **安卓 Chrome**：打开网址 → 菜单「安装应用」→ 允许通知 → 到点会弹系统通知。
- **iPhone**：Safari → 分享 → 添加到主屏幕。注意 iOS 不支持网页内直接弹通知，
  请在 App 里用「提醒 → 导出 .ics」，导入系统日历获得锁屏提醒。
- **电脑**：`https://` 地址同样可用，通知也会生效。
- 数据仍然只存在你自己的浏览器里，服务器上只有静态页面，没有任何个人数据。

## 验证清单

- [ ] `https://…/manifest.json` 能打开，`name` 显示「减脂 · 备考 计划表」
- [ ] `https://…/sw.js` 能打开
- [ ] 页面加载后「提醒」页状态是「还没开启」，点「开启通知」允许
- [ ] 点「发送测试提醒」能收到系统通知
- [ ] 手机上「添加到主屏幕」后，图标是全屏打开、没有地址栏
