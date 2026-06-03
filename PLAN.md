# PLAN.md

## 当前任务

手机端测试包 Cloud API 构建配置。

本轮选择“测试包构建期写入 cloud base”方案：构建测试包前用脚本生成 API base 配置，让手机测试包默认连接 Cloud Staging；仓库默认配置仍保持本地开发地址，不把云 IP 改成长期默认值。

## 当前事实

- root `main`、client `develop`、server `deploy/cloud-staging-v1` 本轮开始时均 clean。
- Cloud Staging API base 暂为 `http://101.133.130.137/api/v1`。
- client 默认 API 仍为 `http://localhost:3000/api/v1`。
- client runtime override 已支持：
  - `globalThis.BUDDY_API_BASE_URL`
  - 浏览器 `localStorage["BUDDY_API_BASE_URL"]`
  - Cocos `sys.localStorage["BUDDY_API_BASE_URL"]`
- Cocos 预览云端模式人工验收已通过。
- 本地 `localhost:3000` 访问问题属于 WSL mirrored 网络/代理问题，用户决定重启电脑后再处理。

## 本轮 Task Packet

```text
Task Name: 手机端测试包 Cloud API 构建配置
Goal:
  1. 提供构建前写入 Cloud API base 的脚本。
  2. 保持默认开发 API 不变。
  3. 形成测试包构建/还原步骤。
Repos: buddy-client, root
Allowed Files:
  buddy-client/assets/scripts/core/config.ts
  buddy-client/assets/scripts/core/build-config.generated.ts
  buddy-client/tools/set-api-base.mjs
  buddy-client/package.json
  PLAN.md
  docs/agent/CURRENT_TASK.md
  docs/agent/HANDOFF.md
Out of Scope:
  不改 buddy-server
  不碰云服务器 / RDS / Nginx / systemd
  不做 HTTPS
  不做正式域名切换
  不新增隐藏 UI 配置入口
Validation:
  buddy-client: npm run api:cloud
  buddy-client: npm run api:local
  buddy-client: bunx tsc --noEmit --ignoreDeprecations 6.0
  root: node tools/check-utf8-docs.mjs PLAN.md docs/agent/CURRENT_TASK.md docs/agent/HANDOFF.md
Commit Plan:
  client: feat(api): add build-time cloud base config
  root: docs(agent): record mobile build api config
Risks:
  生成文件必须在提交前保持 local 空值，避免仓库默认变成云端。
```

## 手机端测试包构建步骤

构建云端测试包前：

```powershell
cd E:\buddy\buddy-client
npm run api:cloud
```

构建完成或回到本地开发前：

```powershell
cd E:\buddy\buddy-client
npm run api:local
```

期望：

- `api:cloud` 会把 `assets/scripts/core/build-config.generated.ts` 写成 Cloud API base。
- `api:local` 会清空构建期 API base，让客户端回到默认本地或 runtime override。

## 下一步

本轮自动验证通过后，进入 Cocos 构建/手机端人工验收前检查。
