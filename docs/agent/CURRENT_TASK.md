# CURRENT TASK

## 2026-06-03 当前任务：补账本 + 修 client WSL 同步默认路径

### 任务目标

1. 更新 root 账本，记录 Cloud Staging 客户端接入、云端文案、登录失败跳转、UTF-8 防线、手机端 API override fallback 的真实完成状态。
2. 修正 `buddy-client/tools/sync-windows-to-wsl.sh` 默认 `SOURCE_DIR`，避免继续指向旧备份目录 `/mnt/e/buddy-client`。
3. 为下一阶段“手机端测试包配置方案”准备干净起点。

### 当前已完成事实

- Cloud Staging V1 后端已部署并可通过 `http://101.133.130.137/api/v1` 访问。
- UTF-8 中文 smoke 已完成，中文宠物名、dashboard、recent_events、events 均正常。
- Cloud CORS 已允许：
  - `http://localhost:7456`
  - `http://127.0.0.1:7456`
- 云端事件文案一致性已修复并部署：
  - server commit: `56b2d0f fix(events): use readable event copy`
- 客户端 Cloud API base override 已完成：
  - 默认仍为 `http://localhost:3000/api/v1`
  - 支持 `globalThis.BUDDY_API_BASE_URL`
  - 支持浏览器 `localStorage["BUDDY_API_BASE_URL"]`
  - 支持 Cocos `sys.localStorage["BUDDY_API_BASE_URL"]`
  - client commit: `8a1c391 feat(api): read override from cocos storage`
- 登录失败跳转逻辑已修复：
  - client commit: `1dfd935 fix(login): clear stale resume state before auth`
- UTF-8 文档防线已建立：
  - root commit: `0fb8220 docs(agent): add utf8 doc guardrails`
  - 安全读取脚本：`tools/read-utf8-doc.ps1`
  - 检查脚本：`tools/check-utf8-docs.mjs`

### 当前遗留风险

1. 本地 Windows 访问 `localhost:3000` 暂时失败。
   - WSL 内部 `curl --noproxy '*' http://127.0.0.1:3000/` 返回 OK。
   - Windows 访问失败来自 WSL mirrored 网络启动失败并回退到 None，以及 WSL 代理变量干扰。
   - 用户决定下次重启电脑后再处理。
2. 手机端测试包还没有正式配置入口。
   - 当前只完成了 API base resolver 能力。
   - 下一阶段需要决定构建期注入、隐藏调试入口或平台 storage 写入方案。

### 本轮允许文件

- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`
- `buddy-client/tools/sync-windows-to-wsl.sh`

### 本轮不做

- 不改 `buddy-client` 业务代码。
- 不改 `buddy-server`。
- 不碰云服务器、RDS、Nginx、systemd。
- 不处理 WSL mirrored 网络。
- 不做 HTTPS。
- 不做正式域名切换。

### 下一步

完成本轮后进入：手机端测试包配置方案。
