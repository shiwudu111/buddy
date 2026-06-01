# CURRENT TASK

## 2026-06-01 当前任务：云端事件文案一致性修复

### 任务目标

修复 Cloud Staging + Cocos 验收暴露的事件文案问题：基础口粮文案不再写死“小橘”，`/events` feed detail 不再暴露技术字段。

### 允许文件

- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`
- `buddy-server/src/routes/pet.ts`
- `buddy-server/tests/api.test.ts`

### 不允许

- 不改 `buddy-client`。
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

## 本轮完成

- `buddy-server/src/routes/pet.ts` 增加食品质量和食品名称中文文案映射。
- feed 事件 detail 改为中文可读文案。
- 基础口粮事件 detail 改为通用宠物文案。
- `buddy-server/tests/api.test.ts` 补充持久事件文案断言。
- 已同步 Windows server 代码到本机 WSL 运行区，并重启本地 server。
- `buddy-server`: `bun test` 通过，57 pass / 0 fail。

## 当前遗留问题

1. 曾出现过登录 401 后仍 `LoadScene Main` 的现象，需要后续单独复现和修复。
2. 手机端如果无法方便设置 storage，需要后续做测试包 API base 配置入口。

## 下一步建议

- Review Gate：检查 root/server diff 和状态。
- 用户确认后分仓提交 root 与 server。
- 后续如需云端生效，再走 server 部署/健康检查/Cocos cloud override 复验。
