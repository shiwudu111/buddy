# Parent 契约

## 状态

- 当前状态：生效
- 客户端依赖：家长中心、孩子绑定、孩子宠物概览、本周学习分析
- 后端 owner：`src/routes/parent.ts`
- 客户端 owner：`assets/scripts/ui/main/parent/*`、`assets/scripts/ui/main/MainController.ts`

## 当前冻结规则

- 家长账号只能绑定一个孩子；这是当前 User DTO 的冻结边界。
- 家长只能查看已绑定孩子的数据。
- 家长侧只读孩子宠物和学习数据，不直接修改孩子宠物状态。
- 宠物体力字段当前由后端 `pet.health` 映射为响应中的 `energy`，同时保留 `health` 作为兼容字段。
- 周报按上海自然周统计。

## `POST /api/v1/parent/bind`

### 请求

支持按用户名或孩子 ID 绑定：

```json
{
  "child_username": "student123"
}
```

或：

```json
{
  "child_id": "child-user-id"
}
```

### 成功响应

```json
{
  "success": true,
  "message": "Bound student123 successfully",
  "data": {
    "childId": "child-user-id",
    "childNickname": "student123"
  }
}
```

### 失败响应

- `400`：缺少 `child_username` / `child_id`。
- `403`：非家长账号尝试绑定。
- `404`：孩子账号不存在。
- `409`：家长已绑定其他孩子，或孩子已被其他家长绑定。

## `GET /api/v1/parent/pet/:childId`

### 成功响应

```json
{
  "success": true,
  "data": {
    "childId": "child-user-id",
    "childNickname": "student123",
    "pet": {
      "name": "团团",
      "level": 1,
      "hunger": 100,
      "mood": 100,
      "energy": 100,
      "health": 100,
      "cleanliness": 100,
      "experience": 0,
      "stage": "STAGE_1",
      "status": true
    },
    "today_homework": {
      "chinese": null,
      "math": { "score": 80 },
      "english": null
    }
  }
}
```

### 失败响应

- `403`：家长未绑定该孩子，或无权查看。
- `404`：孩子还没有宠物。

## `GET /api/v1/parent/report/weekly?child_id=:childId`

### 成功响应

```json
{
  "success": true,
  "data": {
    "week": "2026-05-25 ~ 2026-05-31",
    "childId": "child-user-id",
    "childNickname": "student123",
    "total_homework": 1,
    "average_score": 80,
    "subject_breakdown": {
      "chinese": { "count": 0, "avg": 0 },
      "math": { "count": 1, "avg": 80 },
      "english": { "count": 0, "avg": 0 }
    },
    "pet_status_summary": {
      "alive": true,
      "hunger": 100,
      "mood": 100,
      "energy": 100,
      "cleanliness": 100,
      "stage": "STAGE_1"
    }
  }
}
```

### 失败响应

- `400`：缺少 `child_id`。
- `403`：家长未绑定该孩子，或无权查看周报。

## 验证清单

- 家长绑定成功后，登录 DTO 中 `childId` 与绑定结果一致。
- 孩子宠物视图包含 `hunger`、`mood`、`energy`、`health`、`cleanliness`、`experience`、`stage`、`status`。
- 今日作业字段稳定包含 `chinese`、`math`、`english`。
- 周报字段稳定包含 `total_homework`、`average_score`、`subject_breakdown`、`pet_status_summary`。
- 周报每个科目都返回 `{ count, avg }`。
