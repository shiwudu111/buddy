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
  "subject": "MATH",
  "content": "今天完成了口算 2 页"
}
```

### 成功响应

```json
{
  "success": true,
  "data": {
    "expReward": 10
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
    "chinese": { "submitted": false },
    "math": { "submitted": true, "score": 90 },
    "english": { "submitted": false }
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
- 今日状态按 `chinese`、`math`、`english` 返回。
- 提交成功后的宠物奖励和库存刷新不得由客户端伪造。
