# 真实联调契约

更新日期：2026-04-01

## 冻结规则

- User DTO 固定为 `id`、`username`、`role`、`childId`、`petId`。
- 因为冻结后的 User DTO 只暴露一个 `childId`，所以当前一个家长只能绑定一个孩子。
- Pet 对外字段固定为 `hunger`、`mood`、`experience`、`status`。
- 作业状态接口为 `GET /api/v1/homeworks/status`。
- 业务日期使用 `Asia/Shanghai` 自然日；周范围按周一到周日计算。
- 家长绑定请求支持 `child_username` 或 `child_id`。

## Auth

### POST `/api/v1/auth/register`

请求：

```json
{
  "username": "student123",
  "password": "SecurePass123",
  "role": "CHILD"
}
```

响应：

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

### POST `/api/v1/auth/login`

响应结构与 register 一致。

### GET `/api/v1/auth/me`

响应：

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

## Pets

### POST `/api/v1/pets`

请求：

```json
{
  "name": "Buddy"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "pet_id": "uuid",
    "name": "Buddy",
    "level": 1,
    "hunger": 100,
    "mood": 100,
    "experience": 0,
    "stage": "STAGE_1",
    "status": true
  }
}
```

### GET `/api/v1/pets/:petId`

响应：

```json
{
  "success": true,
  "data": {
    "pet_id": "uuid",
    "name": "Buddy",
    "level": 1,
    "hunger": 100,
    "mood": 100,
    "experience": 0,
    "stage": "STAGE_1",
    "status": true
  }
}
```

### PATCH `/api/v1/pets/:petId/resources`

请求：

```json
{
  "fullness_delta": 15,
  "mood_delta": 5,
  "growth_delta": 0,
  "reason": "manual_feed"
}
```

允许的 `reason` 值：

- `manual_feed`
- `manual_play`
- `homework_reward`
- `daily_decay`
- `system_adjust`

响应：

```json
{
  "success": true,
  "data": {
    "hunger": 100,
    "mood": 100,
    "experience": 10,
    "status": true,
    "events": []
  }
}
```

## Homework

### POST `/api/v1/homeworks/submit`

请求：

```json
{
  "subject": "MATH",
  "content": "今天完成了口算 2 页"
}
```

同一天重复提交返回 `409`。

### GET `/api/v1/homeworks/history?page=1&limit=10`

响应：

```json
{
  "success": true,
  "data": {
    "list": [],
    "total": 0,
    "page": 1,
    "limit": 10
  }
}
```

### GET `/api/v1/homeworks/status`

响应：

```json
{
  "success": true,
  "data": {
    "chinese": { "submitted": false },
    "math": { "submitted": true, "score": 90 },
    "english": { "submitted": false }
  }
}
```

## Parent

### POST `/api/v1/parent/bind`

请求：

```json
{
  "child_username": "student123"
}
```

或：

```json
{
  "child_id": "uuid"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "childId": "uuid",
    "childNickname": "student123"
  }
}
```

以下冲突返回 `409`：

- 当前家长已经绑定孩子
- 该孩子已经绑定其他家长

### GET `/api/v1/parent/pet/:childId`

响应：

```json
{
  "success": true,
  "data": {
    "childId": "uuid",
    "childNickname": "student123",
    "pet": {
      "name": "Buddy",
      "level": 1,
      "hunger": 100,
      "mood": 100,
      "experience": 30,
      "status": true
    },
    "today_homework": {
      "chinese": null,
      "math": { "score": 90 },
      "english": null
    }
  }
}
```

### GET `/api/v1/parent/report/weekly?child_id=:childId`

响应：

```json
{
  "success": true,
  "data": {
    "week": "2026-03-30 ~ 2026-04-05",
    "childId": "uuid",
    "childNickname": "student123",
    "total_homework": 5,
    "average_score": 86,
    "subject_breakdown": {
      "chinese": { "count": 2, "avg": 88 },
      "math": { "count": 2, "avg": 84 },
      "english": { "count": 1, "avg": 86 }
    },
    "pet_status_summary": {
      "alive": true,
      "hunger": 90,
      "mood": 95
    }
  }
}
```

## 错误结构

```json
{
  "success": false,
  "message": "错误描述"
}
```

## 关键状态码

- `400`：参数错误
- `401`：未认证或 token 无效
- `403`：无权限
- `404`：资源不存在
- `409`：重复创建、重复提交或绑定冲突
