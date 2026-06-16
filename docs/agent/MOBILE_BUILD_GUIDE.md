# 手机端测试包构建指南

## 目标

构建一个连接 Cloud Staging API 的手机端测试包，用于执行 `MOBILE_SMOKE_CHECKLIST.md` 的一日主链路人工验收。

## 当前推荐方式

使用构建期 API base 配置。

不要修改 `API_CONFIG.baseUrl` 默认值；默认值仍应保持：

```ts
http://localhost:3000/api/v1
```

构建云端测试包前，写入 Cloud API base：

```powershell
cd E:\buddy\buddy-client
npm run api:cloud
```

确认生成文件：

```powershell
Get-Content .\assets\scripts\core\build-config.generated.ts
```

期望内容：

```ts
export const BUILD_API_BASE_URL = "http://101.133.130.137/api/v1";
```

## Cocos 构建

当前不强行使用命令行构建参数，避免误猜 Cocos Creator 3.8.7 的平台配置。建议先走 Cocos Creator GUI：

1. 用 Cocos Creator 3.8.7 打开 `E:\buddy\buddy-client`。
2. 打开构建发布面板。
3. 选择目标手机平台。
4. 确认构建输出目录。
5. 执行构建。
6. 安装到手机或模拟器。

如果构建过程中 Cocos 自动修改 `settings/v2/packages/*.json`，需要单独判断是否属于构建配置；不要默认提交。

## 构建后恢复本地开发

构建完成后，立即清空构建期 API base：

```powershell
cd E:\buddy\buddy-client
npm run api:local
```

确认生成文件恢复：

```ts
export const BUILD_API_BASE_URL = "";
```

## 手机端验收入口

手机端测试包安装后，按以下顺序验收：

1. 确认应用可打开。
2. 注册或登录学生账号。
3. 创建或进入宠物主页。
4. 观察 dashboard 是否从云端返回。
5. 按 `docs/agent/MOBILE_SMOKE_CHECKLIST.md` 逐项验收。

## 通过标准

- 手机端测试包不请求 `localhost:3000`。
- 手机端主链路能访问 Cloud API。
- 登录、宠物主页、作业、奖励、背包、日记、聊天、家长绑定均可验收。
- 构建后已执行 `npm run api:local`，仓库恢复为本地默认状态。

## 常见风险

1. 忘记执行 `npm run api:cloud`
   - 现象：手机端请求 `localhost:3000`，必然失败。
   - 处理：重新执行 `npm run api:cloud` 后重新构建。

2. 构建后忘记执行 `npm run api:local`
   - 现象：本地开发意外继续走云端。
   - 处理：执行 `npm run api:local`，确认生成文件为空。

3. Cocos 自动修改 settings
   - 现象：`settings/v2/packages/*.json` 出现在 git status。
   - 处理：先汇报并判断是否属于本轮构建配置，不要直接提交。

4. 手机端无法访问云端
   - 检查 Cloud API 是否健康。
   - 检查手机网络是否可访问 `http://101.133.130.137/`。
   - 如果后续改 HTTPS 或域名，需要更新构建期 API base。
