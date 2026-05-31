# 后端文档

## API 接口

### 认证 `/api/auth`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/register` | 注册 | 无 |
| POST | `/login` | 登录 | 无 |
| GET | `/me` | 获取当前用户 | 需登录 |
| PUT | `/me` | 更新用户资料 | 需登录 |

### 职位 `/api/jobs`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/` | 搜索职位（公开） | 无 |
| GET | `/employer/mine` | 我发布的职位 | 企业 |
| GET | `/:id` | 职位详情 | 无 |
| POST | `/` | 创建职位 | 企业 |
| PUT | `/:id` | 更新职位 | 企业 |
| DELETE | `/:id` | 删除职位 | 企业 |

### 公司 `/api/companies`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/employer/mine` | 我的公司 | 企业 |
| POST | `/` | 创建/更新公司 | 企业 |
| GET | `/:id` | 公司详情 | 无 |
| GET | `/:id/jobs` | 公司的职位 | 无 |

### 简历 `/api/resumes`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/` | 我的简历 | 求职者 |
| GET | `/:id` | 简历详情 | 求职者 |
| POST | `/` | 创建简历 | 求职者 |
| PUT | `/:id` | 更新简历 | 求职者 |
| DELETE | `/:id` | 删除简历 | 求职者 |

### 投递 `/api/applications`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/` | 投递职位 | 求职者 |
| GET | `/mine` | 我的投递 | 求职者 |
| GET | `/employer` | 收到的简历 | 企业 |
| PUT | `/:id/status` | 更新状态 | 企业 |

### 收藏 `/api/favorites`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/` | 收藏职位 | 求职者 |
| GET | `/` | 我的收藏 | 求职者 |
| DELETE | `/:job_id` | 取消收藏 | 求职者 |
| GET | `/check/:job_id` | 检查收藏状态 | 求职者 |

### 通知 `/api/notifications`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/` | 我的通知 | 需登录 |
| GET | `/unread-count` | 未读数 | 需登录 |
| PUT | `/:id/read` | 标记已读 | 需登录 |
| PUT | `/read-all` | 全部已读 | 需登录 |

### 管理 `/api/admin`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/stats` | 统计数据 | 管理员 |
| GET | `/users` | 用户列表 | 管理员 |
| DELETE | `/users/:id` | 删除用户 | 管理员 |
| GET | `/jobs/pending` | 待审职位 | 管理员 |
| PUT | `/jobs/:id/status` | 审核职位 | 管理员 |
| GET | `/companies/pending` | 待审企业 | 管理员 |
| PUT | `/companies/:id/status` | 审核企业 | 管理员 |
| GET | `/settings` | 获取设置 | 管理员 |
| PUT | `/settings` | 更新设置 | 管理员 |

## 数据模型

### users
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增ID |
| email | TEXT UNIQUE | 邮箱 |
| password | TEXT | bcrypt加密 |
| role | TEXT | seeker/employer/admin |
| name | TEXT | 姓名 |
| phone | TEXT | 手机号 |
| avatar | TEXT | 头像 |

### companies
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增ID |
| user_id | INTEGER FK UNIQUE | 关联用户 |
| name | TEXT | 公司名称 |
| description | TEXT | 描述 |
| industry | TEXT | 行业 |
| size | TEXT | 规模 |
| location | TEXT | 所在地 |
| website | TEXT | 官网 |
| status | TEXT | pending/approved/rejected |

### jobs
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增ID |
| company_id | INTEGER FK | 关联公司 |
| title | TEXT | 职位名称 |
| description | TEXT | 描述 |
| requirements | TEXT | 要求 |
| salary_min/max | INTEGER | 薪资范围(K) |
| location | TEXT | 地点 |
| category | TEXT | 分类 |
| experience | TEXT | 经验要求 |
| education | TEXT | 学历要求 |
| status | TEXT | pending/approved/rejected/closed |

## 错误格式

```json
{ "error": "错误描述" }
```

HTTP 状态码：400(参数错误)、401(未认证)、403(无权限)、404(不存在)、409(冲突)、500(服务器错误)
