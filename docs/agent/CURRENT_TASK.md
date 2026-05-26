# Current Task

## 任务名

Buddy Agent 架构文档收口任务。

## 目标

- 标记 Agent 架构文档任务完成。
- 将 agent 文档任务与 Main 日记事件闭环遗留改动彻底分开。
- 准备一个只包含 agent 架构文档的 root commit。
- 不修改 `buddy-client/` 或 `buddy-server/` 业务代码。

## 允许文件

- `AGENTS.md`
- `PLAN.md`
- `docs/agent/STATE.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/DECISIONS.md`
- `docs/agent/HANDOFF.md`
- `docs/agent/CHECKLISTS.md`
- `docs/agent/SUBAGENTS.md`

## 不做事项

- 不改 `buddy-client/` 业务代码。
- 不改 `buddy-server/` 业务代码。
- 不提交 `buddy-client/.tmp/`。
- 不提交 `docs/contracts/diary.md`。
- 不提交 Main 日记事件闭环相关文件。
- 不运行破坏性 `reset` / `revert`。

## 当前阶段

Agent 架构文档已完成，处于 commit 前用户确认阶段。

## 本轮完成

- `PLAN.md` 已标记 Agent 架构文档任务完成。
- `CURRENT_TASK.md` 已切换为本轮收口状态。
- `HANDOFF.md` 已记录本轮完成内容、未提交遗留和下一轮恢复顺序。
- agent 架构文档与 Main 日记事件闭环遗留文件已明确分离。

## 明确属于下一轮的遗留

- root：`docs/contracts/README.md`、`docs/contracts/diary.md`
- client：`assets/scripts/services/PetService.ts`、未跟踪 `.tmp/`
- server：`src/routes/pet.ts`、`tests/api.test.ts`

## 下一步

等待用户确认 git add 文件清单。确认后只暂存 agent 架构文档文件，不暂存 contracts、client、server 或 `.tmp/`。
