# Current Task

## 任务名

Release/Sync 工具收口验证

## 目标

- 将常用的 status / push / WSL sync / post-sync check 固化为 root CLI。
- 复用 `buddy-client/tools/sync-windows-to-wsl.sh` 与 `buddy-server/tools/sync-windows-to-wsl.sh`，不复制同步逻辑。
- 明确 `E:\buddy\buddy-client` 与 `E:\buddy\buddy-server` 是正式路径，旧 `E:\buddy-client` / `E:\buddy-server` 仅作为备份。
- 记录 `.git` 仍指向旧备份目录的路径风险。
- 通过全链路命令验证工具是否可以收口。

## 允许文件

- `tools/release-sync.mjs`
- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`

## 不做事项

- 不修改 `buddy-client/` 业务代码。
- 不修改 `buddy-server/` 业务代码。
- 不迁移 `.git` 元数据。
- 不删除旧备份目录。
- 不运行破坏性 `reset` / `revert`。

## 验证方式

- `node tools/release-sync.mjs --help`
- `node tools/release-sync.mjs --repo client --status`
- `node tools/release-sync.mjs --repo server --status`
- `node tools/release-sync.mjs --repo client --sync --check`
- `node tools/release-sync.mjs --repo server --check`

## 当前阶段

风险已记录，工具已修正为正式路径；正在进行全链路验证。
