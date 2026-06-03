# Buddy Agent Handoff

## 2026-06-03 - Cloud Staging 客户端接入阶段收口

### 已完成内容

#### Cloud Staging 后端

- 公网 API base: `http://101.133.130.137/api/v1`
- server commit: `56b2d0f fix(events): use readable event copy`
- 已完成：
  - UTF-8 中文 smoke。
  - dashboard recent_events 中文验证。
  - `/events?limit=20` 中文验证。
  - 基础口粮文案去除“小橘”写死。
  - feed detail 去除 `normal meal_box` 等技术字段。

#### Cloud CORS

- 已允许 Cocos 预览来源：
  - `http://localhost:7456`
  - `http://127.0.0.1:7456`

#### Client API base override

- 默认仍为：
  - `http://localhost:3000/api/v1`
- 支持 override：
  - `globalThis.BUDDY_API_BASE_URL`
  - 浏览器 `localStorage["BUDDY_API_BASE_URL"]`
  - Cocos `sys.localStorage["BUDDY_API_BASE_URL"]`
- client commits:
  - `6dc564d feat(api): add cloud staging base override`
  - `8a1c391 feat(api): read override from cocos storage`

#### 登录失败跳转修复

- client commit: `1dfd935 fix(login): clear stale resume state before auth`
- 人工验收：
  - 错误密码返回 401。
  - 页面停留登录页。
  - 显示“用户名或密码错误”。
  - 不进入 Main。

#### UTF-8 文档防线

- root commit: `0fb8220 docs(agent): add utf8 doc guardrails`
- 新增工具：
  - `tools/read-utf8-doc.ps1`
  - `tools/check-utf8-docs.mjs`
- 规则：
  - 不再用裸 `Get-Content` 判断中文文档是否乱码。
  - PowerShell 显示乱码但 Node UTF-8 检查正常时，不重写文档。

### 本轮正在收口

- 更新 root 账本到当前真实状态。
- 修正 client WSL 同步脚本默认 `SOURCE_DIR` 为 `/mnt/e/buddy/buddy-client`。

### 本轮没有做

- 没有改 client 业务逻辑。
- 没有改 server。
- 没有改云服务器配置。
- 没有改 RDS。
- 没有做 HTTPS。
- 没有做正式域名切换。
- 没有处理 WSL mirrored 网络。

### 当前环境风险

1. Windows 本地访问 `localhost:3000` 失败。
   - WSL 内部 server 正常。
   - 根因是 WSL mirrored 网络回退到 None，以及代理变量把 localhost 转到 `127.0.0.1:7897`。
   - 用户决定下次重启电脑后再处理。
2. 手机端测试包还没有正式 Cloud API 配置入口。
   - 下一阶段需要设计方案。

### 下一轮建议任务

Task Name: 手机端测试包配置方案

建议先输出方案，不直接改代码：

1. 比较三种方式：
   - 构建期注入 Cloud API base。
   - 隐藏调试入口设置 API base。
   - 平台 storage 写入 `BUDDY_API_BASE_URL`。
2. 选一个最小可验证方案。
3. 准备手机端一日主链路验收清单。
