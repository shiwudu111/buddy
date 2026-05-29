# PLAN.md

## 当前任务

发布与同步流程稳定化：release plan 预检。

本轮执行后续规划第 5 项，目标是让每次提交、推送、WSL 同步、健康检查都标准化。当前切口是给 release 工具增加只读 `--plan` 预检，一次性查看三仓库状态、分支、远端对齐和后续命令。

## Task Packet

```text
Task Name: 发布与同步流程稳定化：release plan 预检
Goal: 让 release 前状态检查从人工多命令变成一个只读工具入口，减少漏检查和路径混淆。
Repos: root
Allowed Files:
  root/tools/release-sync.mjs
  root/docs/client/07-联调与测试/release-smoke-checklist.md
  root/PLAN.md
  root/docs/agent/CURRENT_TASK.md
  root/docs/agent/HANDOFF.md
Out of Scope:
  不改 buddy-client。
  不改 buddy-server。
  不提交、不推送、不同步，除非用户确认。
Backend Impact: 无。
Client Impact: 无。
Contract Impact: 无。
Validation:
  root: node --check tools/release-sync.mjs
  root: node tools/release-sync.mjs --plan
  root/client/server git status -sb
Commit Plan: 本轮先不提交，等用户确认。
```

## 本轮完成项

- `tools/release-sync.mjs` 新增 `--plan` 只读预检。
- `--plan` 输出 root/client/server 的路径、分支、状态、最新提交、远端对齐和 sync/check 建议命令。
- `--plan` 在脏工作区会给出 `Decision: blocked or needs review`。
- `docs/client/07-联调与测试/release-smoke-checklist.md` 已把 `--plan` 加为标准流程第一步。
- `node --check tools/release-sync.mjs` 已通过。
- `node tools\release-sync.mjs --plan` 已在真实 PowerShell 权限下通过。

## 下一步

1. Review Gate 检查三仓库状态和 diff。
2. 用户确认后提交 root。
3. 推送 root。
