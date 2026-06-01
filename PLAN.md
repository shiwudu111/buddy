# PLAN.md

## 当前任务

云端事件文案一致性修复。

本轮修复云端验收暴露的事件文案问题：基础口粮事件不再写死“小橘”，`/events` feed detail 不再暴露 `normal meal_box`、`premium logic_cookie` 等技术字段。

## 当前事实

- root `main`、client `develop`、server `deploy/cloud-staging-v1` 当前均已对齐远端且工作区 clean。
- Cloud Staging V1 最小云端后端环境已跑通。
- 公网 API 入口暂为 `http://101.133.130.137/`。
- `buddy-server` 已部署在阿里云轻量应用服务器。
- RDS PostgreSQL 16 已通过内网互通连接。
- systemd 服务 `buddy-server.service` 已运行。
- Nginx 80 端口反代到 `127.0.0.1:3000`。
- server 当前云端部署关键提交为 `b1c400a fix(prisma): make homework date migration replayable`。
- UTF-8 cloud smoke 已确认：register、login、create pet、dashboard、logs/events 中文链路正常。
- 客户端 Cloud Staging API base override 已完成、验证、提交并推送。
- Cocos 预览本地和云端两种模式均已通过人工验证。
- Cloud CORS 已允许 `http://localhost:7456` 与 `http://127.0.0.1:7456`。

## 本轮 Task Packet

```text
Task Name: 云端事件文案一致性修复
Goal: 统一 dashboard/recent_events、/events、diary logs 的用户可见事件文案。
Repos: buddy-server, root
Allowed Files:
  buddy-server/src/routes/pet.ts
  buddy-server/tests/api.test.ts
  PLAN.md
  docs/agent/CURRENT_TASK.md
  docs/agent/HANDOFF.md
Out of Scope:
  不改 buddy-client
  不碰云服务器 / RDS / Nginx / systemd
  不改数据库 schema
  不做 Prisma migration
  不改 API 字段结构
  不提交、不推送，除非用户确认
Backend Impact: 调整事件 title/detail 文案生成，字段结构不变。
Client Impact: 无
Contract Impact: 暂不改字段契约；文案约定由测试覆盖。
Validation:
  root/client/server git status -sb
  buddy-server: bun test
  git diff --stat
Commit Plan:
  server: fix(events): use readable event copy
  root: docs(agent): record event copy consistency fix
Risks:
  tests/api.test.ts 命中 localhost:3000 运行时，测试前必须同步并重启 WSL 本地 server。
```

## 本轮完成

- `buddy-server/src/routes/pet.ts` 新增事件文案 helper。
- 基础口粮事件文案改为“今日基础口粮已送达，记得照顾宠物哦。”
- feed 事件文案改为中文食品名，不再暴露 `normal`、`premium`、`meal_box`、`logic_cookie` 等技术字段。
- `buddy-server/tests/api.test.ts` 增加持久事件文案断言。
- 已同步本机 WSL 运行区并重启本地 server。
- `buddy-server`: `bun test` 通过，57 pass / 0 fail。

## 当前不做

- 不处理登录 401 后是否进入 Main 的客户端问题。
- 不做 HTTPS。
- 不做域名切换。
- 不做手机端测试包配置入口。
- 不部署云端，除非用户确认。
- 不轮换 JWT_SECRET。
- 不提交密钥、token、`.env.production` 或数据库密码。
