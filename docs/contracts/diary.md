# Diary 契约

## 状态

- 当前状态：生效
- 客户端依赖：学生端 Main 日记页、Main 首屏日记预览
- 后端 owner：`src/routes/pet.ts`
- 客户端 owner：`assets/scripts/services/PetService.ts`、`assets/scripts/ui/main/MainJournalPanel.ts`

## 当前冻结规则

- `dashboard.recent_events` 只用于学生端 Main 首屏或日记页打开前的预览缓存。
- 完整日记事件仍以 `GET /api/v1/pets/:petId/events` 为准。
- 客户端不得伪造正式事件；只能展示后端返回事件，或在接口失败时保留已有缓存。
- 事件按 `timestamp` 倒序展示。

## 事件结构

```ts
{
  id?: string;
  kind: string;
  title: string;
  detail: string;
  timestamp: string;
}
```

## `GET /api/v1/pets/:petId/dashboard`

### 成功响应中的日记预览字段

```json
{
  "success": true,
  "data": {
    "recent_events": [
      {
        "id": "event-id",
        "kind": "reward",
        "title": "完成作业",
        "detail": "完成数学作业，获得逻辑饼干 ×1",
        "timestamp": "2026-05-25T06:00:00.000Z"
      }
    ]
  }
}
```

## `GET /api/v1/pets/:petId/events?limit=20`

### 成功响应

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event-id",
        "kind": "homework",
        "title": "完成作业",
        "detail": "MATH 90分",
        "timestamp": "2026-05-25T06:00:00.000Z"
      }
    ]
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

- dashboard 返回 `recent_events` 数组，最多用于最近事件预览。
- `/events` 返回完整事件数组，字段包含 `kind`、`title`、`detail`、`timestamp`。
- 作业奖励和库存使用产生的真实事件能进入日记链路。
- 客户端 Main 进入后可先展示 dashboard 预览事件，打开日记页后再刷新完整事件。
