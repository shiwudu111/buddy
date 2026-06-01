# CURRENT TASK

## 2026-06-01 当前任务：客户端临时 Cloud Staging API base override

### 已确认事实

- Root 账本提交 `8854edd docs(agent): record cloud staging handoff` 已推送到 `origin/main`。
- UTF-8 Cloud Smoke 已完成：register、login、create pet、dashboard、logs/events 均通过。
- 中文宠物名 `云端小橘_1780319737005` 在 create pet 与 dashboard 中返回正确。
- dashboard `recent_events` 与 `/events?limit=20` 中文文案正常。
- 上一次 `????` 属于请求编码问题，不是后端真实存储问题。
- 客户端中文显示仍需 Cocos 预览和手机端实测。

### 本轮目标

- 给 `buddy-client` 增加临时 Cloud Staging API base override 能力。
- 默认 API base 仍保持 `http://localhost:3000/api/v1`。
- 允许 Cocos 预览阶段通过 `globalThis.BUDDY_API_BASE_URL` 或 `localStorage["BUDDY_API_BASE_URL"]` 临时切到云端 API。

### 本轮边界

- 不改 `buddy-server`。
- 不改云服务器 systemd / Nginx / RDS / 安全组。
- 不改 API 契约。
- 不做 HTTPS。
- 不做域名正式切换。
- 不写入 `.env.production`、token、JWT_SECRET、数据库密码。

### 2026-06-01 验证进展

- 客户端 API base override 已在 Cocos 预览中生效，请求打到 `http://101.133.130.137/api/v1`。
- Cloud CORS 已允许 `http://localhost:7456` 和 `http://127.0.0.1:7456`。
- Cocos 预览云端注册、登录、创建中文宠物、dashboard、recent_events、events 已通过。
- 背包使用每日基础口粮已通过，inventory/foods 清空正常，事件写入正常。
- 作业图片上传、语文作业提交、奖励进入背包、作业状态和历史刷新已通过。

### 当前遗留

- 基础口粮事件文案仍写死“小橘”，后续应改为当前宠物名或通用文案。
- `/events` 中 feed detail 仍含 `normal meal_box` 技术字段，后续应统一中文可读文案。
- 曾出现过登录 401 后仍 `LoadScene Main` 的现象，后续需要单独复现和修复。
- Cocos 自动生成的 `settings/v2/packages/*.json` 改动不属于本轮提交，需要单独判断或撤出本轮。

## 当前状态

Cloud Staging V1 最小云端后端环境已跑通，处于阶段收口完成后的下一步准备阶段。

已完成：

* 阿里云轻量应用服务器初始化。
* RDS PostgreSQL 16 创建并通过内网互通连接。
* RDS 白名单限制为轻量服务器私网 IP。
* buddy-server 部署到 `/opt/buddy-server/current`。
* systemd 服务 `buddy-server.service` 已常驻运行。
* Nginx 80 端口已反向代理到 `127.0.0.1:3000`。
* 公网健康检查 `http://101.133.130.137/` 通过。
* `deploy/cloud-staging-v1` 已修复 migration 空库重放问题，当前提交为 `b1c400a`。
* Cloud Smoke V1 基础链路已通过：register、login、auth/me、create pet、dashboard、dailyBasicFood、timeContext、logs、homeworks/status、inventory/use。

## 当前不做

* 不修改 client/server 业务代码。
* 不开放公网 3000。
* 不开放公网 5432。
* 不把数据库密码、JWT_SECRET、token 写入文档。
* 不在备案和域名完成前强行配置正式 HTTPS 域名。

## 下一步

1. 轮换云端 `JWT_SECRET` 并重启 `buddy-server`。
2. 做 UTF-8 中文 smoke，确认中文宠物名和中文日志在客户端是否正常。
3. 客户端最小切云端 API 测试，临时使用 `http://101.133.130.137`。
4. 继续推进备案、域名解析、后续 HTTPS。
