# Pet 契约

## 状态

- 当前状态：生效
- 客户端依赖：首次宠物创建、Main 宠物状态、互动、背包 / 喂养联动
- 后端 owner：`src/routes/pet.ts`、`src/services/pets/**`
- 客户端 owner：`assets/scripts/services/PetService.ts`、`assets/scripts/network/ApiClient.ts`

## 当前冻结规则

- MVP 当前冻结的是“创建宠物”，不是正式选蛋 / 孵化系统。
- `eggType`、`species`、`rarity`、`hatchSeed` 不是当前正式响应承诺。
- Pet 对外核心字段：`pet_id`、`name`、`level`、`hunger`、`mood`、`experience`、`stage`、`status`。
- 客户端不得自行伪造正式宠物数值。

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
    "mood": 100,
    "experience": 0,
    "stage": "STAGE_1",
    "status": true
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
    "mood": 100,
    "experience": 0,
    "stage": "STAGE_1",
    "status": true
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
