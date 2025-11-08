# 部署指南 - Cloudflare Pages

## 方式一：通过 Cloudflare Pages Dashboard 部署

### 步骤：

1. **准备 Git 仓库**
   - 将代码推送到 GitHub、GitLab 或 Bitbucket

2. **登录 Cloudflare Pages**
   - 访问 [Cloudflare Pages](https://pages.cloudflare.com/)
   - 登录你的 Cloudflare 账号

3. **创建新项目**
   - 点击 "Create a project"
   - 选择你的 Git 提供商并授权
   - 选择包含番茄钟应用的仓库

4. **配置构建设置**
   ```
   Project name: pomodoro-app (或你喜欢的名字)
   Production branch: main (或你的主分支名称)
   Build command: npm run build
   Build output directory: dist
   Environment variables: (无需设置)
   ```

5. **高级设置（可选）**
   - Node 版本: 18 或更高
   - 可以在 Environment variables 中设置 `NODE_VERSION=18`

6. **开始部署**
   - 点击 "Save and Deploy"
   - 等待构建完成（通常 1-2 分钟）
   - 部署成功后会获得一个 `.pages.dev` 域名

## 方式二：使用 Wrangler CLI 部署

### 前置要求：
- 安装 Node.js 18 或更高版本
- 安装 Wrangler CLI

### 步骤：

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **部署到 Cloudflare Pages**
   ```bash
   wrangler pages deploy dist
   ```

5. **后续部署**
   每次更新代码后，只需运行：
   ```bash
   npm run build
   wrangler pages deploy dist
   ```

## 自定义域名

部署成功后，你可以：

1. 在 Cloudflare Pages 项目设置中添加自定义域名
2. Cloudflare 会自动为你的域名配置 SSL 证书
3. DNS 记录会自动配置（如果域名在 Cloudflare 管理）

## 环境变量

当前应用不需要任何环境变量，所有数据都存储在用户的浏览器 localStorage 中。

## 验证部署

部署成功后，访问你的 URL，确认：

- ✅ 页面正常加载
- ✅ 番茄钟功能正常工作
- ✅ 正计时功能正常工作
- ✅ 日历功能正常显示
- ✅ 主题切换正常工作
- ✅ 数据持久化正常（刷新页面后数据仍存在）
- ✅ 桌面通知正常工作（需授权）

## 故障排除

### 构建失败
- 检查 Node.js 版本是否为 18 或更高
- 确保所有依赖都在 `package.json` 中正确列出
- 查看构建日志中的具体错误信息

### 页面空白
- 检查浏览器控制台是否有错误
- 确认 `dist` 目录包含 `index.html` 和 `assets` 文件夹
- 确保 `_redirects` 文件正确配置

### 404 错误
- 确认 `public/_redirects` 文件存在
- 检查 Cloudflare Pages 项目的 "Functions" 设置

## 持续部署

Cloudflare Pages 支持自动部署：

- 每次推送到主分支，自动触发构建和部署
- Pull Request 会创建预览部署
- 可以在项目设置中配置部署钩子

## 性能优化

Cloudflare Pages 自动提供：

- 全球 CDN 分发
- 自动 HTTPS
- HTTP/2 和 HTTP/3 支持
- 自动资源压缩
- 缓存优化

无需额外配置即可获得出色的性能！
