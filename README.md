# Recruitment Platform 招聘平台

一个全栈招聘网站，包含求职者前端、企业端和管理员后台。

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS + Vite
- **后端**: Node.js + Express + TypeScript
- **数据库**: SQLite
- **认证**: JWT

## 功能模块

### 求职者端
- 职位搜索（关键词、城市、分类、经验筛选）
- 职位详情 + 收藏
- 公司详情查看
- 简历管理（创建、编辑、删除、设默认）
- 投递职位 + 投递记录追踪
- 收藏职位
- 通知系统

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
npm run seed  # 创建管理员账户
npm run dev
```

### 前端
```bash
cd frontend
npm install
npm run dev
```

### 管理员后台
```bash
cd admin-frontend
npm install
npm run dev
```

### Docker
```bash
docker compose up --build
```

## 默认管理员

- 邮箱: admin@recruitment.com
- 密码: admin123

## 详细文档

- [前端文档](docs/frontend.md)
- [后端文档](docs/backend.md)
- [管理员前端文档](docs/admin-frontend.md)
- [部署文档](docs/deployment.md)
