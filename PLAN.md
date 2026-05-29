# PLAN.md

## 当前任务

主链路回归资产固化。

本轮按后续迭代规划执行第 1 项：把已经通过的 MVP 主链路验收、Release Smoke、WSL/Windows 运行边界固化成可重复使用的资产。默认只修改 root 文档和 root 工具，不修改 client/server 业务代码。

## Task Packet

```text
Task Name: 主链路回归资产固化
Goal: 固化 MVP 主链路回归清单、Release Smoke 模板，并增强 smoke 脚本失败定位。
Repos: root
Allowed Files:
  tools/smoke-mvp-flow.mjs
  docs/client/07-联调与测试/mvp-client-click-smoke-checklist.md
  docs/client/07-联调与测试/release-smoke-checklist.md
  docs/agent/CURRENT_TASK.md
  docs/agent/HANDOFF.md
  PLAN.md
Out of Scope:
  不改 buddy-client 业务代码。
  不改 buddy-server 业务代码。
  不改 API 契约。
  不提交、不推送，除非用户确认。
Backend Impact: 无。
Client Impact: 无。
Contract Impact: 无。
Validation:
  1. node tools/smoke-mvp-flow.mjs，必要时按 WSL 方式运行
  2. root/client/server git status -sb
  3. 人工核对文档为可读中文
Commit Plan: 本轮先不提交，等用户确认。
Risks:
  Windows localhost 与 WSL mirrored 网络可能误判，所以文档和脚本提示必须明确 WSL 是最终 smoke 区。
```

## 本轮完成项

- 重写 MVP Cocos UI 真实点击验收清单为当前可读中文版本。
- 新增 Release Smoke Checklist。
- 增强 `tools/smoke-mvp-flow.mjs` 的步骤输出和失败定位。

## 下一步

1. 运行 smoke 验证。
2. Review Gate 检查三仓库状态。
3. 用户确认后提交 root。
4. 下一轮进入规划第 2 项：继续拆 `MainController.ts`。
