# PLAN.md

## 当前任务

Release/Sync 工具收口验证。

## Task Packet

```text
Task Name: Release/Sync 工具收口验证
Goal: 将常用的分仓 status / push / WSL sync / post-sync check 固化为 root CLI，减少后续重复口头流程和 token 消耗。
Repos: root
Allowed Files:
  root: tools/release-sync.mjs, PLAN.md, docs/agent/CURRENT_TASK.md, docs/agent/HANDOFF.md
Out of Scope:
  不修改 buddy-client 业务代码；不修改 buddy-server 业务代码；不迁移 .git 元数据；不删除旧备份目录；不运行破坏性 reset / revert。
Backend Impact: 无业务影响。server check 只调用健康检查；server sync 仍复用既有脚本。
Client Impact: 无业务影响。client sync 仍复用既有脚本。
Contract Impact: 无。
Validation:
  1. node tools/release-sync.mjs --help
  2. node tools/release-sync.mjs --repo client --status
  3. node tools/release-sync.mjs --repo server --status
  4. node tools/release-sync.mjs --repo client --sync --check
  5. node tools/release-sync.mjs --repo server --check
Commit Plan: 本轮先验证，不自动提交；等用户确认后再提交 root 工具和任务账本。
Risks:
  E:\buddy\buddy-client\.git 与 E:\buddy\buddy-server\.git 仍指向旧备份目录的 .git，需要后续单独迁移或修复。
```

## 本轮交付

- `tools/release-sync.mjs`：root release/sync helper。
- `docs/agent/HANDOFF.md`：记录旧路径 Git 元数据风险。

## 运行方式

```powershell
node tools\release-sync.mjs --repo client --status
node tools\release-sync.mjs --repo client --push --sync --check
node tools\release-sync.mjs --repo server --push --sync --check
node tools\release-sync.mjs --repo root --push
```

## 下一步

1. 完成全链路验证。
2. 根据验证结果判断是否收口。
3. 等待用户确认是否提交 root 工具与任务账本。
