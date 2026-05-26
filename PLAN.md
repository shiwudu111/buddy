# PLAN.md

## 当前任务

Main 日记事件闭环收口任务。

## Task Packet

```text
Task Name: Main 日记事件闭环收口任务
Goal: 完成 dashboard.recent_events 到 Main 日记预览的跨端闭环，并保留日记页通过 /events 拉取完整事件列表的能力。
Repos: root, buddy-server, buddy-client
Allowed Files:
  root: PLAN.md, docs/agent/CURRENT_TASK.md, docs/agent/HANDOFF.md, docs/contracts/README.md, docs/contracts/diary.md
  server: src/routes/pet.ts, tests/api.test.ts
  client: assets/scripts/services/PetService.ts
Out of Scope:
  不新增数据库表；不做 Prisma migration；不改变认证方式；不提交 buddy-client/.tmp/；不扩展新的日记编辑、筛选、分页 UI；不改无关 Main 面板。
Backend Impact: GET /api/v1/pets/:petId/dashboard 正式返回最近 5 条真实 recent_events；GET /api/v1/pets/:petId/events 保持完整事件接口。
Client Impact: PetService.refreshDashboard() 消费 dashboard.recent_events 并预填 Main 日记缓存；打开日记页仍优先调用 /events 刷新完整事件。
Contract Impact: docs/contracts/diary.md 记录 dashboard.recent_events 与 /pets/:petId/events 事件结构；docs/contracts/README.md 增加 diary 索引。
Validation:
  server: bun test
  client: bunx tsc --noEmit --ignoreDeprecations 6.0
  review: root/client/server git status -sb；确认 .tmp 未提交；确认契约字段与代码一致。
Commit Plan:
  1. buddy-server: feat(pets): surface dashboard recent events
  2. buddy-client: feat(main): prefill diary from dashboard events
  3. root: docs(contracts): add diary events contract
Risks:
  server tests 调用 localhost:3000，需要 WSL runtime 与 Windows 当前状态对齐；client .tmp 仍未跟踪，必须排除；root 当前 ahead 1 的 agent commit 尚未 push。
```

## 当前状态

- server 已有遗留改动：`src/routes/pet.ts`、`tests/api.test.ts`。
- client 已有遗留改动：`assets/scripts/services/PetService.ts`，另有未跟踪 `.tmp/` 需要排除。
- root 已有 diary contract 遗留：`docs/contracts/README.md`、`docs/contracts/diary.md`。
- root `main` 当前领先远端 1 个 agent 架构文档 commit。

## 已观察到的实现方向

- server 已抽出 `getPetEventsForUser(userId, limit)`，`/events` 与 dashboard 可复用同一事件聚合逻辑。
- dashboard 已准备返回 `recent_events: recentEvents`。
- server 测试已覆盖 dashboard `recent_events` 数组与 homework/reward 事件。
- client `PetService` 已准备优先调用 `/events` 加载完整日记；dashboard payload 中有 `recent_events` 时会写入 `mainEvents`，并预填 `diaryDays`。
- diary 契约已描述事件结构、dashboard 预览字段和完整 `/events` 响应。

## 下一步

1. 复核并补齐契约字段与代码一致性。
2. 如需微调，只在允许文件内做最小修正。
3. 同步 server 到 WSL 并运行 `bun test`。
4. 运行 client `bunx tsc --noEmit --ignoreDeprecations 6.0`。
5. Review Gate：三仓库 status、diff、`.tmp/`、contracts 一致性。
6. 通过后等待用户确认，再按 server -> client -> root 分仓提交。
