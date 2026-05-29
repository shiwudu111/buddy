# 当前任务：发布与同步流程稳定化：release plan 预检

## 状态

实现和验证完成，等待 Review Gate 与用户确认提交。

## 目标

- 给 `tools/release-sync.mjs` 增加 `--plan`。
- `--plan` 只读展示 root/client/server 的路径、分支、状态、最新提交、远端对齐、sync/check 命令。
- 更新 release smoke checklist。

## 允许文件

- `tools/release-sync.mjs`
- `docs/client/07-联调与测试/release-smoke-checklist.md`
- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`

## 验证

- `node --check tools/release-sync.mjs`：通过。
- `node tools\release-sync.mjs --plan`：真实 PowerShell 权限下通过。
- 当前 root 有本轮未提交改动，因此 `--plan` 正确显示 `Decision: blocked or needs review`。
- 待 Review Gate。
