# Release Smoke Checklist

## 目标

每次分仓提交、推送、WSL 同步后，用同一套最小检查确认当前版本可以继续开发或交付。

## 环境边界

- Windows：研发、修改、Cocos 调试区。
- WSL：最终运行维护和 smoke 验证区。
- WSL 使用 mirrored networking；Windows 侧 localhost 失败时，不直接判定业务失败。
- 旧备份目录 `E:\buddy-client` 和 `E:\buddy-server` 不作为操作路径。

## 标准顺序

1. root status：`git status -sb`
2. client status：`git status -sb`
3. server status：`git status -sb`
4. client TypeScript：`bunx tsc --noEmit --ignoreDeprecations 6.0`
5. server tests：`bun test`，仅 server 改动或契约改动时必跑。
6. 分仓提交。
7. 分仓推送。
8. WSL sync。
9. post-sync check。
10. smoke 记录写入 handoff。

## Root Push

```powershell
cd E:\buddy
git push origin main
```

已知提示：`git: 'credential-manager-core' is not a git command` 可能出现。如果后续仍显示 `main -> main` 且退出码为 0，则视为 push 成功。

## Client Release Smoke

```powershell
cd E:\buddy
node tools\release-sync.mjs --repo client --sync --check
```

通过标准：sync 退出码为 0，check 输出 `tmp_absent` 和 `docs_absent`。

## Server Release Smoke

```powershell
cd E:\buddy
node tools\release-sync.mjs --repo server --sync --check
```

通过标准：sync 退出码为 0，health check 返回 `{"status":"ok","message":"Buddy API Server"}`。

## MVP API Smoke

推荐在 WSL 内执行：

```powershell
wsl.exe -d Ubuntu-24.04 -- sh -lc "cd /mnt/e/buddy && BUDDY_API_BASE_URL=http://localhost:3000/api/v1 node tools/smoke-mvp-flow.mjs"
```

覆盖路径：child register、child login、create pet、dashboard refresh、submit homework reward、use inventory reward、diary events、chat send、parent register、parent bind child、parent view child pet、parent weekly report。

## 结果模板

```text
Release Smoke Result:
Date:
Root commit:
Client commit:
Server commit:
Client tsc:
Server bun test:
Client sync/check:
Server sync/check:
MVP smoke:
Cocos manual check:
Known warnings:
Decision: pass / blocked
Next action:
```

## 阻塞判定

以下情况必须停下：client TypeScript 失败、server test 失败、client sync 后出现 `.tmp` 或 `docs`、server health check 不返回 ok、MVP smoke 业务步骤失败、git status 出现未解释的脏文件。
