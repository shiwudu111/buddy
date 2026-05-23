# Main 离线状态衰减数据库测试指南

## 目的

本文用于指导测试人员手动修改宠物数据库字段 `lastDecayAt`，然后通过 `dashboard` 接口验证离线状态衰减是否生效。

本轮联调的正式规则是：

- 后端根据 `lastDecayAt` 结算离线衰减。
- 前端不根据本地时间自行扣减。
- `updatedAt` 不作为衰减锚点。
- 衰减只按完整小时结算，最多结算 24 小时。
- 手动构造 `lastDecayAt` 时统一按 UTC 写入，避免数据库会话时区影响测试结果。

## 准备条件

- 后端已启动，地址为 `http://localhost:3000`
- 已有一个带宠物的学生账号
- 已知该账号的 `token`
- 已知该账号的 `petId`

如果还没有 `token` 和 `petId`，先登录：

```bash
curl -sS -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"账号3","password":"你的密码"}'
```

从返回里取出：

- `data.token`
- `data.user.petId`

## 查看当前状态

```bash
curl -sS "http://localhost:3000/api/v1/pets/$PET_ID/dashboard" \
  -H "Authorization: Bearer $TOKEN"
```

重点关注返回里的：

- `pet.hunger`
- `pet.mood`
- `pet.cleanliness`
- `pet.lastDecayAt`
- `offlineDecay.applied`
- `offlineDecay.elapsedHours`

## 修改数据库

推荐在 WSL 中执行 Prisma 命令，不需要单独安装 `psql`。

先进入后端目录：

```bash
cd /home/openclaw/.openclaw/workspace-cipher/buddy-server
```

注意：`lastDecayAt` 是后端衰减锚点。手动写入时请使用 `(NOW() AT TIME ZONE 'UTC') - INTERVAL ...`，不要直接使用 `NOW() - INTERVAL ...`，否则可能因为数据库会话时区导致后端判断为“离线不足 1 小时”。

### 场景 1：3 小时前

把宠物改成 3 小时前的衰减锚点：

```bash
bunx prisma db execute --schema prisma/schema.prisma --stdin <<'SQL'
UPDATE "Pet"
SET
  "hunger" = 80,
  "mood" = 70,
  "cleanliness" = 60,
  "lastDecayAt" = (NOW() AT TIME ZONE 'UTC') - INTERVAL '3 hours'
WHERE "id" = '这里换成你的 PET_ID';
SQL
```

再次请求 dashboard，预期：

- `hunger = 74`
- `mood = 67`
- `cleanliness = 57`
- `offlineDecay.applied = true`
- `offlineDecay.elapsedHours = 3`

衰减成功后，返回里的 `pet.lastDecayAt` 会被后端更新为当前结算时间，这是正常现象。判断是否成功主要看 `offlineDecay.applied`、`offlineDecay.elapsedHours` 和三个状态值是否按规则扣减。

### 场景 2：30 分钟前

```bash
bunx prisma db execute --schema prisma/schema.prisma --stdin <<'SQL'
UPDATE "Pet"
SET
  "hunger" = 80,
  "mood" = 70,
  "cleanliness" = 60,
  "lastDecayAt" = (NOW() AT TIME ZONE 'UTC') - INTERVAL '30 minutes'
WHERE "id" = '这里换成你的 PET_ID';
SQL
```

再次请求 dashboard，预期：

- 数值不变
- `offlineDecay.applied = false`
- `offlineDecay.elapsedHours = 0`

### 场景 3：48 小时前

```bash
bunx prisma db execute --schema prisma/schema.prisma --stdin <<'SQL'
UPDATE "Pet"
SET
  "hunger" = 100,
  "mood" = 100,
  "cleanliness" = 100,
  "lastDecayAt" = (NOW() AT TIME ZONE 'UTC') - INTERVAL '48 hours'
WHERE "id" = '这里换成你的 PET_ID';
SQL
```

再次请求 dashboard，预期：

- 最多按 24 小时结算
- `hunger = 52`
- `mood = 76`
- `cleanliness = 76`
- `offlineDecay.elapsedHours = 24`

### 场景 4：状态接近 0

```bash
bunx prisma db execute --schema prisma/schema.prisma --stdin <<'SQL'
UPDATE "Pet"
SET
  "hunger" = 1,
  "mood" = 1,
  "cleanliness" = 1,
  "lastDecayAt" = (NOW() AT TIME ZONE 'UTC') - INTERVAL '48 hours'
WHERE "id" = '这里换成你的 PET_ID';
SQL
```

再次请求 dashboard，预期：

- `hunger = 0`
- `mood = 0`
- `cleanliness = 0`
- 不会出现负数

## 连续请求验证

同一组脏数据只应结算一次。

操作：

1. 先把 `lastDecayAt` 改成 3 小时前。
2. 请求一次 `dashboard`。
3. 立刻再请求一次 `dashboard`。

预期：

- 第一次会衰减，并更新 `lastDecayAt`
- 第二次不会重复扣减
- 第二次返回的 `offlineDecay.applied = false`

## 结果判断

如果返回符合以下规则，说明本轮衰减逻辑正常：

- 只认 `lastDecayAt`
- 完整小时才结算
- 最多结算 24 小时
- 数值不会小于 0
- 连续请求不会重复扣减

## 常见问题

### 1. 返回 `未认证，请先登录`

说明请求没有带 `Authorization: Bearer <token>`。

### 2. `petId` 为空

说明登录返回里没有宠物，或取错了字段。请确认：

- `data.user.petId`
- 不是 `user.id`
- 不是家长账号的 `childId`

### 3. 数据库执行失败

请确认你是在 WSL 的后端目录里执行命令：

```bash
cd /home/openclaw/.openclaw/workspace-cipher/buddy-server
```

如果 WSL 里没有 `bunx`，先确认同步脚本是否已执行过，或者直接走后端一键同步脚本。

### 4. 手动改了 3 小时前，但接口返回 `offlineDecay.applied = false`

优先检查 SQL 是否用了 UTC 写法：

```sql
"lastDecayAt" = (NOW() AT TIME ZONE 'UTC') - INTERVAL '3 hours'
```

如果使用了 `NOW() - INTERVAL '3 hours'`，可能会因为数据库会话时区和后端解析口径不一致，导致后端认为还没有满 1 小时。

## 相关接口

- `GET /api/v1/pets/:petId/dashboard`
- `GET /api/v1/pets/:petId`
- `POST /api/v1/pets/:petId/feed`
- `POST /api/v1/pets/:petId/sleep`
- `POST /api/v1/pets/:petId/play`
- `POST /api/v1/pets/:petId/care`
