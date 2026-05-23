# Auth 契约

## 状态

- 当前状态：生效
- 客户端依赖：登录、注册、会话恢复、角色分流
- 后端 owner：`src/routes/auth.ts`、`src/controllers/auth.ts`
- 客户端 owner：`assets/scripts/network/ApiClient.ts`、登录相关 UI / service

## 通用约定

- Base URL：`/api/v1`
- 认证方式：`Authorization: Bearer <token>`
- 角色枚举：`CHILD | PARENT`
- User DTO 字段：`id`、`username`、`role`、`childId`、`petId`

## `POST /api/v1/auth/register`

### 请求

```json
{
  "username": "student123",
  "password": "SecurePass123",
  "role": "CHILD"
}
```

### 成功响应

```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "uuid",
      "username": "student123",
      "role": "CHILD",
      "childId": null,
      "petId": null
    },
    "token": "jwt"
  }
}
```

## `POST /api/v1/auth/login`

### 请求

```json
{
  "username": "student123",
  "password": "SecurePass123"
}
```

### 成功响应

响应结构与 register 一致。登录成功后的真实角色以后端返回的 `data.user.role` 为准。

## `GET /api/v1/auth/me`

### 请求头

```http
Authorization: Bearer <token>
```

### 成功响应

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "student123",
    "role": "CHILD",
    "childId": null,
    "petId": "uuid"
  }
}
```

## 失败响应

```json
{
  "success": false,
  "message": "错误描述"
}
```

## 验证清单

- 注册后返回 `user` 与 `token`。
- 登录后返回结构与注册一致。
- `GET /auth/me` 使用 token 能返回当前用户。
- 客户端角色分流只信任 `data.user.role`。
- 无效 token 返回未认证错误，不应返回伪用户。
