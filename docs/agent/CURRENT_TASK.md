# 当前任务：Agent 账本编码修复与下一轮任务重置

## 状态

已完成，等待用户确认。

## 触发原因

本轮 State Refresh 发现：

- root/client/server 三仓库均为 clean，且对齐远端。
- `PLAN.md` 出现乱码。
- `docs/agent/CURRENT_TASK.md` 出现乱码，并且仍停留在上一轮 UI 收口阶段。
- `docs/agent/HANDOFF.md` 大量历史内容出现乱码。

这会导致后续任务入口不可信，因此本轮先修复 agent 账本，不进入业务代码。

## 本轮目标

1. 恢复 `PLAN.md`、`CURRENT_TASK.md`、`HANDOFF.md` 为可读中文。
2. 明确上一轮 UI 主链路、Release Smoke、三仓库推送同步已完成。
3. 将下一轮开发入口指向“家长中心组件化拆分”。
4. 不修改 `buddy-client/` 和 `buddy-server/` 业务代码。

## 允许文件

- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`

## 不允许

- 不改 `buddy-client/` 业务代码。
- 不改 `buddy-server/` 业务代码。
- 不新增功能。
- 不提交 `.tmp/`。
- 不运行破坏性 `reset` / `revert`。
- 不提交、不推送、不 WSL 同步，除非用户后续明确确认。

## 验证

- root/client/server `git status -sb`
- root `git diff --stat`
- 人工核对文档内容可读、任务唯一、下一步明确

## 下一步

本轮完成并经用户确认后，建议启动：

`家长中心组件化拆分任务`

优先目标是把上一轮家长中心 UI 和三栏交互从 `MainController.ts` 中拆出去，形成更稳定的后续开发基础。
