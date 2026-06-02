# CURRENT TASK

## 2026-06-02 当前状态：Cloud Staging 客户端接入收口完成

### 已完成

- Cloud Staging V1 后端已部署并可通过 `http://101.133.130.137/api/v1` 访问。
- UTF-8 中文 smoke 已完成，中文宠物名、dashboard、recent_events、events 均正常。
- 客户端已支持临时 Cloud API base override：
  - 默认仍为 `http://localhost:3000/api/v1`。
  - 可通过 `globalThis.BUDDY_API_BASE_URL` 或 `localStorage["BUDDY_API_BASE_URL"]` 临时切换。
- Cloud CORS 已允许 Cocos 预览来源：
  - `http://localhost:7456`
  - `http://127.0.0.1:7456`
- 云端事件文案一致性已修复并部署：
  - 基础口粮事件不再写死“小橘”。
  - `/events` feed detail 不再暴露 `normal meal_box` 等技术字段。
- Cocos 预览人工复验已通过：
  - dashboard recent_events 文案正确。
  - `/events?limit=20` 文案正确。
- 登录失败跳转逻辑已复验并修复：
  - 错误密码返回 401 后停留登录页。
  - 页面显示“用户名或密码错误”。
  - 不再因为旧的可恢复会话状态误进 Main。

### 最新提交

- client `develop`: `1dfd935 fix(login): clear stale resume state before auth`
- server `deploy/cloud-staging-v1`: `56b2d0f fix(events): use readable event copy`
- root `main`: `8aeab55 docs(agent): close event copy validation`

### 当前仓库状态

- root: clean，分支 `main`。
- client: clean，分支 `develop`，已 push，已同步到 WSL。
- server: clean，分支 `deploy/cloud-staging-v1`，已部署到 Cloud Staging。

### 当前遗留风险

1. `buddy-client/tools/sync-windows-to-wsl.sh` 默认 source 曾指向旧路径 `/mnt/e/buddy-client`。
   - 本轮已用 `SOURCE_DIR=/mnt/e/buddy/buddy-client` 显式重跑同步。
   - 后续应单独修复脚本默认路径，避免再次误用旧备份目录。
2. WSL 只读检查偶发 `WSL/Service/E_ACCESS_DENIED`。
   - 本轮同步命令本身成功。
   - 暂记为 WSL 服务偶发权限噪声，后续继续观察。
3. 手机端测试包还缺少方便设置 Cloud API base 的入口。
   - 当前 override 更适合 Cocos 预览和浏览器 localStorage。
   - 手机端体验测试前需要设计测试包配置方式。

### 下一步建议任务

Task Name: 手机端 Cloud API 体验测试准备

Goal:

- 明确手机端测试包如何使用 Cloud API base。
- 不改变本地开发默认 API。
- 不把云 IP 做成长期生产硬编码。
- 准备手机端一日主链路验收清单。

Allowed Files:

- 待下一轮 Task Packet 确认。

Out of Scope:

- 不做 HTTPS。
- 不做正式域名切换。
- 不改云服务器 systemd / Nginx / RDS / 安全组。
- 不改 server 业务逻辑。
- 不扩大 UI 重构。
