# Current Task

## 任务名

Main 日记事件闭环收口任务。

## 目标

- 让后端 `dashboard.recent_events` 返回最近 5 条真实事件。
- 让客户端 Main 日记预览优先消费 dashboard `recent_events`。
- 保留打开日记页后通过 `/pets/:petId/events` 刷新完整事件列表的能力。
- 补齐 root diary 契约文档并通过 Review/Test Gate。

## 允许文件

- root：`PLAN.md`、`docs/agent/CURRENT_TASK.md`、`docs/agent/HANDOFF.md`、`docs/contracts/README.md`、`docs/contracts/diary.md`
- server：`src/routes/pet.ts`、`tests/api.test.ts`
- client：`assets/scripts/services/PetService.ts`

## 不做事项

- 不新增数据库表。
- 不做 Prisma migration。
- 不改变认证方式。
- 不提交 `buddy-client/.tmp/`。
- 不扩展新的日记编辑、筛选、分页 UI。
- 不改无关 Main 面板或无关 server 路由。

## 当前阶段

恢复任务并进入 Contract/Review 准备阶段。

## 当前已知遗留

- root：`docs/contracts/README.md`、`docs/contracts/diary.md`
- client：`assets/scripts/services/PetService.ts`、未跟踪 `.tmp/`
- server：`src/routes/pet.ts`、`tests/api.test.ts`

## 验证命令

- server：在 `buddy-server/` 运行 `bun test`
- client：在 `buddy-client/` 运行 `bunx tsc --noEmit --ignoreDeprecations 6.0`
- review：分别检查 root / client / server `git status -sb`，确认 `.tmp/` 不进入提交。

## 下一步

1. 复核 diary contract 与 server/client 字段一致。
2. 如需修正，只在允许文件内做最小补丁。
3. 同步 server WSL runtime 后运行 `bun test`。
4. 运行 client TypeScript 检查。
5. 通过后准备分仓提交，但提交前先汇报给用户确认。
