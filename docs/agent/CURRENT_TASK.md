# CURRENT TASK

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
