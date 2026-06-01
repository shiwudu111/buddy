# CURRENT TASK

## 2026-06-01 当前任务：Agent 账本编码修复与下一阶段任务重置

### 任务目标

恢复父级 root 账本文档为可读中文，并明确下一阶段开发目标，避免后续任务因为 PLAN / HANDOFF 乱码而失真。

### 允许文件

- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`

### 不允许

- 不改 `buddy-client`。
- 不改 `buddy-server`。
- 不碰云服务器、RDS、Nginx、systemd。
- 不轮换 JWT_SECRET。
- 不提交 `.env.production`、token、JWT_SECRET、数据库密码。
- 不提交、不推送，除非用户确认。

## 当前已完成事实

- Cloud Staging V1 最小云端后端环境已跑通。
- 公网入口暂为 `http://101.133.130.137/`。
- `buddy-server` 已部署在阿里云轻量应用服务器。
- RDS PostgreSQL 16 已通过内网互通连接。
- systemd 服务 `buddy-server.service` 已运行。
- Nginx 已把 80 端口反代到 `127.0.0.1:3000`。
- `deploy/cloud-staging-v1` 当前关键提交为 `b1c400a fix(prisma): make homework date migration replayable`。
- UTF-8 cloud smoke 已完成：register、login、create pet、dashboard、logs/events 均通过。
- 中文宠物名、dashboard `recent_events`、`/events?limit=20` 中文文案均已确认正常。
- 上一次 `????` 属于请求编码问题，不是后端真实存储问题。
- 客户端 Cloud Staging API base override 已完成并推送。
- Cocos 预览本地模式和云端模式均已人工验证通过。
- Cloud CORS 已允许 `http://localhost:7456` 与 `http://127.0.0.1:7456`。

## 当前遗留问题

1. 基础口粮事件文案仍写死“小橘”，应改为当前宠物名或通用文案。
2. `/events` 的 feed detail 仍暴露 `normal meal_box` 等技术字段，应改为中文可读文案。
3. 曾出现过登录 401 后仍 `LoadScene Main` 的现象，需要后续单独复现和修复。
4. 手机端如果无法方便设置 storage，需要后续做测试包 API base 配置入口。

## 下一阶段建议

下一阶段建议进入：云端事件文案一致性修复。

建议边界：

- 优先改 `buddy-server`。
- 不改数据库 schema，不做 Prisma migration。
- 不改 API 字段结构。
- 不改认证方式。
- 如需客户端映射文案，只做最小兼容，不扩大 UI。

建议验证：

- `buddy-server`: `bun test`
- 云端部署后 health check。
- Cocos 预览 cloud override 下复验 dashboard、recent_events、events、背包使用。
