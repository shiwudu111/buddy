# PLAN.md

## 当前任务

Agent 账本编码修复与下一阶段任务重置。

本轮只修复父级 root 账本文档，不改 `buddy-client` 或 `buddy-server` 业务代码，不碰云服务器、RDS、Nginx、systemd，不提交、不推送，等待用户确认。

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
Task Name: Agent 账本编码修复与下一阶段任务重置
Goal: 恢复 root 账本为可读中文，并明确下一阶段开发目标，避免 PLAN 失真。
Repos: root
Allowed Files:
  PLAN.md
  docs/agent/CURRENT_TASK.md
  docs/agent/HANDOFF.md
Out of Scope:
  不改 buddy-client
  不改 buddy-server
  不碰云服务器 / RDS / Nginx / systemd
  不做新业务功能
  不提交、不推送，除非用户确认
Backend Impact: 无
Client Impact: 无
Contract Impact: 无
Validation:
  root/client/server git status -sb
  git diff --stat
  人工检查三份文档可读
Commit Plan:
  等用户确认后再提交 root
Risks:
  旧账本曾出现乱码，后续每轮任务开始必须先读账本并确认可读。
```

## 下一阶段建议

下一阶段建议做一个小闭环任务：云端事件文案一致性修复。

原因：

- 这是 Cloud Staging + Cocos 人工验收直接暴露的问题。
- 范围小，适合作为云端后续开发的第一轮稳定任务。
- 可以同时验证 server 变更、测试、云端部署、Cocos 复验的节奏。

建议目标：

1. 基础口粮事件文案不要写死“小橘”，改为当前宠物名或通用文案。
2. `/events` feed detail 不再暴露 `normal meal_box` 等技术字段，改为中文可读文案。
3. 补 server 测试，确认 dashboard `recent_events` 与 `/events` 文案一致。
4. 不改 API 契约字段结构，不做数据库 migration。

## 当前不做

- 不做 HTTPS。
- 不做域名切换。
- 不做手机端测试包配置入口。
- 不处理登录 401 后是否进入 Main 的客户端问题。
- 不轮换 JWT_SECRET。
- 不提交密钥、token、`.env.production` 或数据库密码。
