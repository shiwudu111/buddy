# PLAN.md

## 当前任务

Buddy 文档事实源收编与 Lite Flow 防分裂规则。

## Goal

修复 root 与 `buddy-client` 之间的当前任务源分裂，明确后续唯一主控关系，并把省 token 的读取策略落到流程文档中。

## 当前事实

- root `PLAN.md` 是唯一当前任务执行源。
- root `docs/agent/` 是唯一 Agent 状态账本。
- root `docs/contracts/` 是唯一跨端契约源。
- `buddy-client/AGENTS.md` 的旧版主控表述已改为本仓局部规则。
- `buddy-client/PLAN.md` 的旧版任务清单需降级为 backlog / archive，不再作为主控入口。
- root 当前存在未跟踪 `.tools/`、`docs/agent/MOBILE_BUILD_GUIDE.md`、`docs/agent/MOBILE_SMOKE_CHECKLIST.md`，本轮不处理。
- client 当前存在 Cocos settings 噪音与 `.tmp/`，本轮不处理。
- server 当前无本轮改动；后续若涉及 server，需要先确认分支与任务范围。

## Lite Task Packet

```text
Task: Buddy 文档事实源收编与 Lite Flow 防分裂规则
Scope: root 流程文档与 buddy-client 本仓规则/计划降级
Allowed Files:
  AGENTS.md
  PLAN.md
  docs/agent/CURRENT_TASK.md
  docs/agent/HANDOFF.md
  buddy-client/AGENTS.md
  buddy-client/PLAN.md
Validation:
  node tools/check-utf8-docs.mjs AGENTS.md PLAN.md docs/agent/CURRENT_TASK.md docs/agent/HANDOFF.md buddy-client/AGENTS.md buddy-client/PLAN.md
  git diff --stat
  root / client / server git status -sb
Stop Conditions:
  发现业务代码需要修改
  发现需要删除或移动用户文件
  发现当前任务源仍不唯一
  UTF-8 检查失败
```

## Out of Scope

- 不修改业务代码。
- 不处理 `buddy-client` Cocos settings 噪音。
- 不清理或提交 `.tmp/`。
- 不修改 `buddy-server`。
- 不提交、不推送、不 WSL 同步。

## 下一步

完成本轮文档收编后，先重新 State Refresh，再由 root `PLAN.md` 写入新的唯一产品任务。

已知历史事实：

- 手机端“点击登录”闪崩已完成定位和修复。
- 根因与美术调参页有关；渲染时排除美术调参页后，手机端不再闪崩。
