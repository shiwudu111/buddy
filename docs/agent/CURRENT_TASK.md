# CURRENT TASK

## 2026-06-16 当前任务：文档事实源收编与 Lite Flow 防分裂规则

### 任务目标

修复 root 与 `buddy-client` 之间的当前任务源分裂，明确 Buddy Coordinator 的唯一主控关系，并把省 token 的读取策略落到流程文档中。

### 当前事实

- root `PLAN.md` 是唯一当前任务执行源。
- root `docs/agent/` 是唯一 Agent 状态账本。
- root `docs/contracts/` 是唯一跨端契约源。
- `buddy-client/AGENTS.md` 需要降级为本仓局部执行边界，不得覆盖 root Coordinator。
- `buddy-client/PLAN.md` 需要降级为客户端 backlog / archive，不得继续使用任务标题声明主控入口。
- 本轮不修改业务代码、不处理 Cocos settings 噪音、不清理 `.tmp/`、不提交、不推送。

### Allowed Files

- `AGENTS.md`
- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`
- `buddy-client/AGENTS.md`
- `buddy-client/PLAN.md`

### Validation

```powershell
node tools/check-utf8-docs.mjs AGENTS.md PLAN.md docs/agent/CURRENT_TASK.md docs/agent/HANDOFF.md buddy-client/AGENTS.md buddy-client/PLAN.md
git diff --stat
git status -sb
```

还需要分别检查：

- `E:\buddy`
- `E:\buddy\buddy-client`
- `E:\buddy\buddy-server`

### 下一步

本轮文档收编完成后，先重新 State Refresh，再由 root `PLAN.md` 写入新的唯一产品任务。

已知历史事实：

- 手机端“点击登录”闪崩已完成定位和修复。
- 根因与美术调参页有关；渲染时排除美术调参页后，手机端不再闪崩。
