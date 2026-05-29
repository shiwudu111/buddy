# Pet 契约

## 状态

- 当前状态：生效
- 客户端依赖：首次宠物创建、Main 宠物状态、互动、背包 / 喂养联动
- 后端 owner：`src/routes/pet.ts`、`src/services/pets/**`
- 客户端 owner：`assets/scripts/services/PetService.ts`、`assets/scripts/network/ApiClient.ts`

## 当前冻结规则

- MVP 当前冻结的是“创建宠物”，不是正式选蛋 / 孵化系统。
- `eggType`、`species`、`rarity`、`hatchSeed` 不是当前正式响应承诺。
- Pet 对外核心字段：`pet_id`、`name`、`level`、`hunger`、`energy`、`mood`、`cleanliness`、`experience`、`stage`、`status`、`display_status`。
- 客户端不得自行伪造正式宠物数值。
- Main 首屏以 `GET /api/v1/pets/:petId/dashboard` 为主数据源。
- 背包消耗以 `/inventory/use` 返回为准，客户端不得本地扣库存。

## `POST /api/v1/pets`

### 请求

```json
{
  "name": "Buddy"
}
```

### 成功响应

```json
{
  "success": true,
  "data": {
    "pet_id": "uuid",
    "name": "Buddy",
    "level": 1,
    "hunger": 100,
    "energy": 100,
    "mood": 100,
    "cleanliness": 100,
    "experience": 0,
    "stage": "STAGE_1",
    "status": true,
    "display_status": "idle"
  }
}
```

## `GET /api/v1/pets/:petId`

### 成功响应

```json
{
  "success": true,
  "data": {
    "pet_id": "uuid",
    "name": "Buddy",
    "level": 1,
    "hunger": 100,
    "energy": 100,
    "mood": 100,
    "cleanliness": 100,
    "experience": 0,
    "stage": "STAGE_1",
    "status": true,
    "display_status": "idle"
  }
}
```

## `GET /api/v1/pets/:petId/dashboard`

### 成功响应核心字段

```json
{
  "success": true,
  "data": {
    "pet": {
      "pet_id": "uuid",
      "name": "Buddy",
      "level": 1,
      "hunger": 100,
      "energy": 100,
      "mood": 100,
      "cleanliness": 100,
      "experience": 0,
      "stage": "STAGE_1",
      "status": true,
      "display_status": "idle",
      "lastDecayAt": "2026-05-29T00:00:00.000Z"
    },
    "foods": [
      {
        "food_type": "meal_box",
        "food_quality": "normal",
        "count": 1
      }
    ],
    "inventory": [
      {
        "itemType": "food",
        "food_type": "meal_box",
        "food_quality": "normal",
        "count": 1
      }
    ],
    "dailyBasicFood": {
      "granted": true,
      "item": {
        "itemType": "food",
        "food_type": "meal_box",
        "food_quality": "normal",
        "count": 1
      }
    },
    "offlineDecay": {
      "applied": false,
      "elapsedHours": 0,
      "message": "离线不足 1 小时，状态未变化。"
    },
    "timeContext": {
      "serverNow": "2026-05-29T00:00:00.000Z",
      "timezone": "Asia/Shanghai",
      "localDate": "2026-05-29",
      "dayPeriod": "morning",
      "lastSeenAt": null,
      "returnGreeting": {
        "shouldShow": false,
        "text": "",
        "reason": "none"
      }
    },
    "recent_events": []
  }
}
```

响应头应包含 `Cache-Control: no-store`，避免 Main 首屏拿到陈旧状态。

## `POST /api/v1/pets/:petId/inventory/use`

### 请求

```json
{
  "itemType": "food",
  "food_type": "logic_cookie",
  "food_quality": "premium"
}
```

### 成功响应

```json
{
  "success": true,
  "data": {
    "pet": {
      "pet_id": "uuid",
      "hunger": 100,
      "mood": 100,
      "cleanliness": 100,
      "lastDecayAt": "2026-05-29T00:00:00.000Z"
    },
    "inventory": [],
    "foods": [],
    "logs": [
      {
        "kind": "inventory_food_use",
        "title": "使用口粮",
        "detail": "已使用优质逻辑饼干",
        "timestamp": "2026-05-29T00:00:00.000Z"
      }
    ],
    "offlineDecay": {
      "applied": false,
      "elapsedHours": 0,
      "message": "离线不足 1 小时，状态未变化。"
    }
  }
}
```

## `PATCH /api/v1/pets/:petId/resources`

### 请求

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

### 成功响应

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

## 失败响应

```json
{
  "success": false,
  "message": "错误描述"
}
```

## 验证清单

- 无宠物学生可创建宠物并进入主链路。
- 获取宠物状态返回客户端渲染所需核心字段。
- 资源更新成功后，客户端只使用后端返回值刷新正式状态。
- 资源更新失败时，客户端不扣库存、不改宠物正式状态。
- 任何孵化 / 稀有度表现不得被解释为当前正式后端契约。
