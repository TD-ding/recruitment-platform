# 部署文档

## 前置条件

- Node.js 18+
- npm 9+
- Docker & Docker Compose（可选）

## 安装步骤

### 1. 克隆项目
```bash
git clone https://github.com/TD-ding/recruitment-platform.git
cd recruitment-platform
```

### 2. 后端
```bash
cd backend
npm install
cp ../.env.example .env
npm run seed  # 创建管理员账户
npm run dev
```

### 3. 前端
```bash
cd frontend
npm install
npm run dev
```

### 4. 管理员后台
```bash
cd admin-frontend
npm install
npm run dev
```

## 配置

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| PORT | 3001 | 后端端口 |
| JWT_SECRET | recruitment-platform-secret-key | JWT密钥（生产环境必须修改） |
| DB_PATH | ./data/recruitment.db | SQLite数据库路径 |
| UPLOAD_DIR | ./uploads | 上传文件目录 |

## Docker 部署

```bash
docker compose up --build -d
```

- 后端: http://localhost:3001
- 前端: http://localhost:5173
- 管理员: http://localhost:5174

## 默认管理员

- 邮箱: admin@recruitment.com
- 密码: admin123

**生产环境请务必修改密码和 JWT_SECRET**
