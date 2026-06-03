# Buddy Agent Handoff

## 2026-06-03 - 手机端测试包 Cloud API 构建配置

### 本轮背景

客户端已经支持 runtime API base override，但手机端测试包不方便手动设置 `BUDDY_API_BASE_URL`。本轮选择“测试包构建期写入 cloud base”方案，避免新增隐藏 UI，也不改变本地开发默认地址。

### 本轮实现

#### client

- 新增 `tools/set-api-base.mjs`
  - `npm run api:cloud` 写入 Cloud API base。
  - `npm run api:local` 清空构建期 API base。
- 新增 `assets/scripts/core/build-config.generated.ts`
  - 默认内容为空字符串。
  - 测试包构建前可写入 Cloud API base。
- 更新 `assets/scripts/core/config.ts`
  - 在 runtime override 后读取 `BUILD_API_BASE_URL`。
  - 默认仍回落到 `API_CONFIG.baseUrl`。
- 更新 `package.json`
  - 新增 `api:cloud`
  - 新增 `api:local`

### 使用方式

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

### 验证

- `npm run api:cloud` 通过。
- `npm run api:local` 通过。
- `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。

### 注意事项

- 提交前应保持 `build-config.generated.ts` 为空值：

```ts
export const BUILD_API_BASE_URL = "";
```

- 不要把 Cloud IP 改成 `API_CONFIG.baseUrl` 默认值。
- 不要提交 `.env.production`、token、JWT_SECRET、数据库密码。
- 本地 Windows 访问 `localhost:3000` 的问题暂时属于 WSL mirrored 网络/代理环境问题，不作为本轮阻塞。

### 下一步

进入手机端一日主链路人工验收准备：

1. 注册/登录。
2. 创建或进入宠物主页。
3. dashboard 刷新。
4. 提交作业获得奖励。
5. 背包显示奖励。
6. 使用背包物品。
7. 日记显示事件。
8. 聊天发送消息。
9. 家长侧绑定和查看。
