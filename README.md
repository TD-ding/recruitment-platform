# Recruitment Platform 招聘平台

一个全栈招聘网站，包含求职者前端、企业端和管理员后台。

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS + Vite
- **后端**: Node.js + Express + TypeScript
- **数据库**: SQLite
- **认证**: JWT

## 目录结构

```
recruitment-platform/
├── backend/              # 后端 API 服务
│   ├── src/
│   │   ├── routes/       # API 路由 (auth, jobs, companies, resumes, applications, admin)
│   │   ├── middleware/   # 中间件 (auth, errorHandler)
│   │   ├── models/       # 数据模型 (database)
│   │   └── app.ts        # 入口文件
│   └── package.json
├── frontend/             # 求职者 + 企业前端
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   │   └── employer/ # 企业端页面
│   │   ├── components/   # 公共组件
│   │   ├── context/      # React Context
│   │   ├── api.ts        # API 客户端
│   │   └── types.ts      # TypeScript 类型
│   └── package.json
├── admin-frontend/       # 管理员后台
│   ├── src/
│   │   └── pages/        # 管理页面 (Dashboard, Users, JobReview, CompanyReview, Settings)
│   └── package.json
├── docs/                 # 文档
├── .env.example          # 环境变量示例
├── .gitignore
└── .dockerignore
```

## 功能模块

### 求职者端
- 职位搜索（关键词、城市、分类、经验筛选）
- 职位详情查看
- 公司详情查看
- 简历管理（创建、编辑、删除、设默认）
- 投递职位
- 投递记录追踪

### 企业端
- 企业信息管理
- 发布/删除职位
- 查看收到的简历
- 简历状态管理（查看、面试、录用、拒绝）

### 管理员后台
- 数据统计仪表盘
- 用户管理
- 职位审核
- 企业审核
- 系统设置

## 如何运行

### 后端
```bash
cd backend
npm install
npm run dev
```
服务运行在 http://localhost:3001

### 求职者/企业前端
```bash
cd frontend
npm install
npm run dev
```
访问 http://localhost:5173

### 管理员后台
```bash
cd admin-frontend
npm install
npm run dev
```
访问 http://localhost:5174

## API 接口

| 模块 | 路径 | 说明 |
|------|------|------|
| 认证 | `/api/auth/*` | 注册、登录、获取当前用户 |
| 职位 | `/api/jobs/*` | 搜索、详情、CRUD |
| 公司 | `/api/companies/*` | 详情、创建/更新、获取公司职位 |
| 简历 | `/api/resumes/*` | CRUD |
| 投递 | `/api/applications/*` | 投递、查看、状态更新 |
| 管理 | `/api/admin/*` | 统计、用户、审核、设置 |
