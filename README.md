# WhenWeFree (一起有空)

通过填写个人空闲时间，智能找出多人共同可用的时间段，让排会议和约时间更高效。


![image-20260126220256671](./README.assets/image-20260126220256671.png)

## 技术栈

- Node.js: 24 lts and above
- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript
- **UI Framework**: Material-UI + Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Utilities**: date-fns for timezone handling, nanoid for token generation

## 功能特性

- 创建活动并生成可分享链接  
- 参与者填写个人可用时间（支持拖拽选择）  
- 以热力图形式展示各时间段可用人数  
- 自动计算并推荐共同可用时间段  
- 支持不同时区的统一处理  
- 响应式布局，适配桌面端与移动端

## 快速开始

### 1. 安装依赖

```bash
npm install --legacy-peer-deps
```

### 2. 配置数据库

复制 `.env.example` 到 `.env` 并配置你的 PostgreSQL 数据库：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```
DATABASE_URL="postgresql://username:password@localhost:5432/whenwefree?schema=public"
```

### 3. 初始化数据库

```bash
npx prisma generate
npx prisma db push
```

或者使用 migrations：

```bash
npx prisma migrate dev --name init
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
WhenWeFree/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页
│   │   ├── new/               # 创建活动
│   │   ├── e/[eventId]/       # 活动详情和结果
│   │   └── api/               # API Routes
│   ├── components/            # React 组件
│   │   ├── EventForm.tsx      # 活动创建表单
│   │   ├── ParticipantForm.tsx # 参与者填写表单
│   │   ├── TimeGrid.tsx       # 时间网格选择器
│   │   ├── ResultsView.tsx    # 结果展示
│   │   └── ThemeRegistry.tsx  # Material-UI 主题
│   ├── lib/                   # 工具库
│   │   ├── prisma.ts          # Prisma 客户端
│   │   ├── timeUtils.ts       # 时间计算工具
│   │   └── tokenUtils.ts      # Token 生成
│   └── types/                 # TypeScript 类型定义
├── prisma/
│   └── schema.prisma          # 数据库模型
└── public/                    # 静态资源
```

## 部署

### Vercel (推荐)

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量 `DATABASE_URL`
4. 部署

### 自托管

```bash
npm run build
npm start
```

## License

MIT
