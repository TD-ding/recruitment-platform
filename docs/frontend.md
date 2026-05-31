# 前端文档

## 架构

前端采用 React + TypeScript + Tailwind CSS，使用 Vite 构建。项目包含两个独立前端应用：

- **frontend** (端口 5173): 求职者端 + 企业端
- **admin-frontend** (端口 5174): 管理员后台

## 页面

### 求职者端
| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 搜索框 + 热门职位 |
| 职位列表 | `/jobs` | 筛选搜索 + 分页 |
| 职位详情 | `/jobs/:id` | 详情 + 投递 + 收藏 |
| 公司详情 | `/companies/:id` | 公司信息 + 在招职位 |
| 登录 | `/login` | 邮箱密码登录 |
| 注册 | `/register` | 求职者/企业注册 |
| 个人中心 | `/profile` | 修改姓名/手机 |
| 我的简历 | `/resumes` | CRUD |
| 投递记录 | `/applications` | 状态追踪 |
| 我的收藏 | `/favorites` | 收藏的职位 |
| 通知 | `/notifications` | 系统通知 |

### 企业端
| 页面 | 路由 | 说明 |
|------|------|------|
| 控制台 | `/employer` | 统计概览 |
| 职位管理 | `/employer/jobs` | 发布/删除职位 |
| 收到的简历 | `/employer/applications` | 查看投递 + 状态管理 |
| 公司信息 | `/employer/company` | 编辑公司信息 |

### 管理员后台
| 页面 | 路由 | 说明 |
|------|------|------|
| 仪表盘 | `/` | 数据统计 |
| 用户管理 | `/users` | 查看/删除用户 |
| 职位审核 | `/jobs` | 审核待审职位 |
| 企业审核 | `/companies` | 审核待审企业 |
| 系统设置 | `/settings` | 站点设置 |

## 组件

- `Navbar` - 导航栏，根据角色显示不同菜单
- `Footer` - 页脚
- `Loading` - 加载状态
- `EmptyState` - 空数据提示

## 数据流

- `AuthContext` 管理登录状态和用户信息
- `api.ts` 封装 axios，自动附加 token，401 自动跳转登录
- 所有数据通过 REST API 获取

## 安全

- JWT token 存储在 localStorage
- API 请求自动附带 Bearer token
- 路由守卫 `PrivateRoute` 按角色限制访问
