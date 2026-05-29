# Homework 契约

## 状态

- 当前状态：生效
- 客户端依赖：作业提交、作业历史、今日作业状态、奖励联动
- 后端 owner：`src/routes/homework.ts`、`src/controllers/homework.ts`、`src/services/homework/**`
- 客户端 owner：`assets/scripts/services/HomeworkService.ts`、`assets/scripts/network/ApiClient.ts`

## 当前冻结规则

- 作业主链路优先保证提交、历史、今日状态和奖励联动稳定。
- 业务日期使用 `Asia/Shanghai` 自然日。
- 同一天重复提交按后端规则返回冲突，不由客户端伪造成功。

## `POST /api/v1/homeworks/submit`

### 请求

```json
{
  "subject": "math",
  "imageUrl": "/uploads/homeworks/test-math.png",
  "note": "今天完成了口算 2 页",
  "petId": "pet-id"
}
```

### 成功响应

```json
{
  "success": true,
  "data": {
    "id": "homework-id",
    "subject": "MATH",
    "score": 80,
    "feedback": "提交成功，继续加油！",
    "submission": {
      "id": "homework-id",
      "subject": "math",
      "qualityLevel": "good",
      "rewardStatus": "granted"
    },
    "reward": {
      "items": [
        {
          "itemType": "food",
          "food_type": "logic_cookie",
          "food_quality": "premium",
          "count": 1
        }
      ],
      "message": "完成数学作业，获得逻辑饼干 ×1"
    },
    "foods": [
      {
        "food_type": "logic_cookie",
        "food_quality": "premium",
        "count": 1
      }
    ],
    "inventory": [
      {
        "itemType": "food",
        "food_type": "logic_cookie",
        "food_quality": "premium",
        "count": 1
      }
    ],
    "logs": [
      {
        "kind": "mood",
        "title": "完成作业",
        "detail": "完成数学作业，获得逻辑饼干 ×1",
        "timestamp": "2026-05-29T00:00:00.000Z"
      }
    ],
    "qualityLevel": "good",
    "rewardStatus": "granted"
  }
}
```

### 冲突响应

同一天重复提交返回 `409`，响应仍使用统一失败结构。

## `GET /api/v1/homeworks/history?page=1&limit=10`

### 成功响应

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

## `GET /api/v1/homeworks/status`

### 成功响应

```json
{
  "success": true,
    "data": {
    "dailyReward": {
      "limit": 3,
      "used": 1,
      "remaining": 2
    },
    "subjects": {
      "chinese": { "submitted": false, "rewardAvailable": true },
      "math": {
        "submitted": true,
        "score": 90,
        "rewardAvailable": false,
        "reason": "SUBJECT_ALREADY_REWARDED"
      },
      "english": { "submitted": false, "rewardAvailable": true },
      "general": { "submitted": false, "rewardAvailable": true }
    },
    "chinese": { "submitted": false },
    "math": { "submitted": true, "score": 90 },
    "english": { "submitted": false },
    "general": { "submitted": false }
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

- 正常提交返回真实成功。
- 空内容或非法内容返回真实失败。
- 同日重复提交返回冲突。
- 历史接口分页字段稳定。
- 今日状态按 `subjects.chinese/math/english/general` 与兼容字段 `chinese/math/english/general` 返回。
- 提交成功后的宠物奖励和库存刷新不得由客户端伪造。
- 提交成功后必须返回奖励、库存和日志字段，供 Main 背包与日记链路消费。
