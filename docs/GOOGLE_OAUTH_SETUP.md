# Google OAuth 配置指南

## 1. 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 在左侧菜单中，选择 **API 和服务** > **凭据**

## 2. 配置 OAuth 同意屏幕

1. 点击 **OAuth 同意屏幕**
2. 选择 **外部** 用户类型（或选择内部，如果仅限组织使用）
3. 填写必需信息：
   - **应用名称**: When We Free
   - **用户支持电子邮件**: 您的邮箱
   - **应用徽标**: （可选）
   - **授权网域**: 您的域名（例如：example.com）
   - **开发者联系信息**: 您的邮箱
4. 点击 **保存并继续**
5. **作用域** 页面：保持默认（无需添加敏感作用域）
6. **测试用户** 页面：添加测试用户邮箱（开发阶段）
7. 完成配置

## 3. 创建 OAuth 2.0 客户端 ID

1. 回到 **凭据** 页面
2. 点击 **创建凭据** > **OAuth 客户端 ID**
3. 应用类型选择 **Web 应用**
4. 填写信息：
   - **名称**: When We Free Web Client
   - **已获授权的 JavaScript 来源**:
     - `http://localhost:3000` (开发环境)
     - `https://yourdomain.com` (生产环境)
   - **已获授权的重定向 URI**:
     - `http://localhost:3000/api/auth/google/callback` (开发环境)
     - `https://yourdomain.com/api/auth/google/callback` (生产环境)
5. 点击 **创建**
6. 复制 **客户端 ID** 和 **客户端密钥**

## 4. 配置环境变量

在项目根目录创建 `.env.local` 文件（如果还没有），添加以下内容：

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# 生产环境时改为：
# GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

将 `your-client-id` 和 `your-client-secret` 替换为您从 Google Cloud Console 复制的实际值。

## 5. 重启开发服务器

```bash
pnpm run dev
```

## 6. 测试 Google 登录

1. 访问 http://localhost:3000/login
2. 点击 "使用 Google 登录" 按钮
3. 选择您的 Google 账号
4. 授权应用访问
5. 登录成功后会跳转到 Dashboard

## 注意事项

### 开发环境
- 使用 `http://localhost:3000` 作为授权来源
- 确保测试用户已添加到 OAuth 同意屏幕

### 生产环境
- 必须使用 HTTPS
- 更新环境变量为生产域名
- 需要提交应用进行 Google 审核（如果需要公开使用）

### 安全建议
- **永远不要** 将 `.env.local` 文件提交到 Git
- 在 `.gitignore` 中添加 `.env*.local`
- 在生产环境中使用环境变量管理服务
- 定期轮换客户端密钥

## 故障排除

### 错误: "redirect_uri_mismatch"
- 检查 Google Cloud Console 中配置的重定向 URI 是否与环境变量中的完全一致
- 确保包含协议（http/https）和端口号

### 错误: "idpiframe_initialization_failed"
- 检查是否正确设置了授权的 JavaScript 来源
- 清除浏览器缓存和 Cookie

### Google 按钮不显示
- 检查 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 是否正确设置
- 打开浏览器开发者工具查看控制台错误
- 确认 Google Identity Services 脚本已加载

## 相关文档

- [Google Identity Platform](https://developers.google.com/identity)
- [Google Sign-In for Websites](https://developers.google.com/identity/sign-in/web)
- [OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
