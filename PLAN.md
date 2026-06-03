# PLAN.md

## 当前任务

补账本 + 修 client WSL 同步默认路径。

本轮目标是把 Cloud Staging 客户端接入收口后的真实状态写回 root 账本，并修正 `buddy-client/tools/sync-windows-to-wsl.sh` 的默认 `SOURCE_DIR`，避免后续同步误用旧备份目录 `/mnt/e/buddy-client`。

## 当前事实

- root `main`、client `develop`、server `deploy/cloud-staging-v1` 当前工作区 clean。
- Cloud Staging V1 后端已跑通，公网 API base 暂为 `http://101.133.130.137/api/v1`。
- Cloud CORS 已允许 Cocos 预览来源 `http://localhost:7456` 与 `http://127.0.0.1:7456`。
- server 云端事件文案一致性已修复并部署：
  - server commit: `56b2d0f fix(events): use readable event copy`
- client Cloud API override 已完成：
  - client commit: `6dc564d feat(api): add cloud staging base override`
  - client commit: `1dfd935 fix(login): clear stale resume state before auth`
  - client commit: `8a1c391 feat(api): read override from cocos storage`
- root UTF-8 文档防线已完成：
  - root commit: `0fb8220 docs(agent): add utf8 doc guardrails`
- Cocos 预览云端模式人工验收已通过。
- 本地 `localhost:3000` 当前失败属于 WSL mirrored 网络回退到 None + 代理变量问题，不是 buddy-server 代码问题；用户决定下次重启电脑后再处理。

## 本轮 Task Packet

```text
Task Name: 补账本 + 修 client WSL 同步默认路径
Goal:
  1. 更新 root PLAN/CURRENT_TASK/HANDOFF，记录当前真实完成状态。
  2. 修正 client WSL 同步脚本默认 SOURCE_DIR 为 /mnt/e/buddy/buddy-client。
Repos: root, buddy-client
Allowed Files:
  PLAN.md
  docs/agent/CURRENT_TASK.md
  docs/agent/HANDOFF.md
  buddy-client/tools/sync-windows-to-wsl.sh
Out of Scope:
  不改 buddy-client 业务代码
  不改 buddy-server
  不碰云服务器 / RDS / Nginx / systemd
  不做 HTTPS
  不做正式域名切换
  不处理 WSL mirrored 网络
Validation:
  root: node tools/check-utf8-docs.mjs PLAN.md docs/agent/CURRENT_TASK.md docs/agent/HANDOFF.md
  client: sh/bash 语法检查或脚本 dry path 检查
  root/client/server: git status -sb
Commit Plan:
  root: docs(agent): record mobile api prep handoff
  client: fix(sync): default to workspace client path
Risks:
  PowerShell 直接 Get-Content 可能显示乱码；必须使用 tools/read-utf8-doc.ps1 或 Node UTF-8 检查。
```

## 下一步

完成本轮后，进入：手机端测试包配置方案。

建议先做方案，不直接大改：

1. 明确手机端测试包如何写入或选择 `BUDDY_API_BASE_URL`。
2. 比较构建期注入、隐藏调试入口、平台 storage 写入三种方案。
3. 准备手机端一日主链路验收清单。
