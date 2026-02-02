# WhenWeFree (一起有空)

通过填写个人空闲时间，智能找出多人共同可用的时间段，让排会议和约时间更高效。


![image-20260126220256671](./README.assets/image-20260126220256671.png)

## 技术栈

- Node.js: 24 lts and above
- Frontend: Next.js 14 (App Router) + React 18 + TypeScript
- UI Framework: Material-UI (MUI) + Tailwind CSS
- Database: PostgreSQL with Prisma ORM
- Authentication: Cookie-based sessions + Google OAuth 2.0
- Utilities: date-fns for timezone handling, google-auth-library for OAuth

## 功能特性
✅ 创建活动并生成可分享链接  
- ✅ 参与者填写个人可用时间（支持拖拽选择）  
- ✅ 以热力图形式展示各时间段可用人数  
- ✅ 自动计算并推荐共同可用时间段  
- ✅ 支持不同时区的统一处理  
- ✅ 用户认证系统
  - 邮箱密码注册/登录
  - Google OAuth 登录（可选配置）
- ✅ 用户 Dashboard（管理个人创建的活动）
- ✅ 响应式布局，适配桌面端与移动端
- ✅ HarmonyOS Sans 字体支持*（管理个人创建的活动）
- 响应式布局，适配桌面端与移动端

## 快速开始
推荐使用 pnpm：

```bash
pnpm install
```

或使用 npm：


### 1. 安装依赖

```bash
npm install --legacy-peer-deps
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并配置你的数据库：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/whenwefree?schema=public"

# Google OAuth（可选）
# 如果不需要 Google 登录，可以注释掉以下三行
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
# GOOGLE_CLIENT_SECRET=your-client-secret
# GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

注意：
- 如果未配置 Google OAuth，点击 Google 登录按钮时会提示"Google 登录功能暂未开放"
- 用户仍然可以使用邮箱密码方式注册和登录

### 3. 配置 Google OAuth（可选）

如果需要启用 Google 登录功能：

1. 按照 [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) 的详细步骤配置 Google Cloud Console
2. 在 `.env` 文件中取消注释 Google OAuth 相关配置并填入真实的凭据
3. 重启开发服务器

### 4. 初始化数据库

```bash
npx prisma generate
npx prisma db push
pnpm run dev
# 或
```

或者使用 migrations：

```bash
npx prisma migrate dev --name init
```

### 5. 启动开发服务器

```bash
npm run dev
```
项目结构如下：
```
login/             # 登录页面
│   │   ├── dashboard/         # 用户仪表盘
│   │   ├── new/               # 创建活动
│   │   ├── e/[eventId]/       # 活动详情和结果
│   │   └── api/               # API Routes
│   │       └── auth/          # 认证相关 API
│   ├── components/            # React 组件
│   │   ├── EventForm.tsx      # 活动创建表单
│   │   ├── ParticipantForm.tsx # 参与者填写表单
│   │   ├── TimeGrid.tsx       # 时间网格选择器
│   │   ├── ResultsView.tsx    # 结果展示
│   │   └── ThemeRegistry.tsx  # Material-UI 主题
│   ├── contexts/              # React Context
│   │   └── AppContext.tsx     # 应用全局状态
│   ├── lib/                   # 工具库
│   │   ├── auth.ts            # 认证工具
│   │   ├── prisma.ts          # Prisma 客户端
│   │   └── timeUtils.ts       # 时间计算工具
│   └── types/                 # TypeScript 类型定义
├── prisma/
│   ├── schema.prisma          # 数据库模型
│   └── migrations/            # 数据库迁移
└── public/                    # 静态资源
    └── font/                  # HarmonyOS Sans 字体选择器
│   │   ├── ResultsView.tsx    # 结果展示
│   │   └── ThemeRegistry.tsx  # Material-UI 主题
│   ├── lib/                   # 工具库，推荐使用 Supabase 或 Neon）
├── prisma/
│   └── schema.prisma          # 数据库模型
└── public/                    # 静态资源
```

## 部署

### Vercel (推荐)

1. 推送代码到 GitHub
```
pnpm run build
pnpm start
```

## 常见问题

### Google 登录相关

Q: Google 登录按钮点击后提示"Google 登录功能暂未开放"？
A: 这是因为未配置 Google OAuth 凭据。参考 [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) 配置后即可使用。

Q: 不想使用 Google 登录，如何禁用？
A: 保持 `.env` 文件中 Google OAuth 相关配置为注释状态即可。用户仍可使用邮箱密码方式登录。

### 数据库相关

Q: 如何连接远程数据库？
A: 修改 `.env` 中的 `DATABASE_URL`，推荐使用 Supabase、Neon 或 Railway 等云数据库服务。

## 相关文档

- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - Google OAuth 详细配置指南
- [.env.example](./.env.example) - 环境变量配置示例- `DATABASE_URL`（PostgreSQL 连接字符串）
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`（Google OAuth 客户端 ID）
   - `GOOGLE_CLIENT_SECRET`（Google OAuth 客户端密钥）
   - `GOOGLE_REDIRECT_URI`（生产环境的回调 URL）
