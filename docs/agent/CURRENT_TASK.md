# CURRENT TASK

## 2026-06-03 当前任务：手机端测试包 Cloud API 构建配置

### 任务目标

1. 用构建期生成配置的方式，为手机测试包写入 Cloud API base。
2. 默认本地开发地址仍保持 `http://localhost:3000/api/v1`。
3. 不新增隐藏 UI，不做正式环境系统，不改 server。

### 当前方案

采用“构建期写入”：

- `npm run api:cloud`
  - 写入 `http://101.133.130.137/api/v1`
  - 用于构建手机端云端测试包前。
- `npm run api:local`
  - 清空构建期 API base。
  - 用于构建完成后或回到本地开发前。

### 当前已实现

- 新增 `buddy-client/tools/set-api-base.mjs`。
- 新增 `buddy-client/assets/scripts/core/build-config.generated.ts`。
- `config.ts` 读取顺序为：
  1. `globalThis.BUDDY_API_BASE_URL`
  2. 浏览器 `localStorage["BUDDY_API_BASE_URL"]`
  3. Cocos `sys.localStorage["BUDDY_API_BASE_URL"]`
  4. 构建期 `BUILD_API_BASE_URL`
  5. 默认 `API_CONFIG.baseUrl`
- `package.json` 新增：
  - `api:cloud`
  - `api:local`

### 验证状态

- `npm run api:cloud` 已验证可写入 Cloud API base。
- `npm run api:local` 已验证可清空生成值。
- `bunx tsc --noEmit --ignoreDeprecations 6.0` 已通过。

### 本轮不做

- 不改 `buddy-server`。
- 不碰云服务器、RDS、Nginx、systemd。
- 不做 HTTPS。
- 不做正式域名切换。
- 不新增隐藏测试配置 UI。
- 不处理本地 WSL mirrored 网络。

### 下一步

1. 检查 root/client/server 状态。
2. 检查生成文件提交前是否保持 local 空值。
3. 输出手机端一日主链路验收清单。
4. 等用户确认后提交。
