# Buddy Agent Handoff

## 2026-06-05 - OSS HTTPS 真实网络热更测试方案

### 本轮背景

手机端注册/登录后仍有闪崩。由于当前无法稳定导出 adb logcat，先使用应用内开发日志和手机截图定位。前序日志已经把问题缩小到进入 Main 后 dashboard 刷新附近。频繁重新构建 APK 成本较高，因此先补开发期热更骨架；当前 OSS 最小验证已完成，本轮继续把局域网临时热更升级为 OSS HTTPS staging 热更测试。

### 云资源状态

- Bucket: `buddy-hotupdate-zhzhwd1290`
- Region: 华东2（上海）
- 已创建路径：`buddy-hot-update/staging/`
- `hello.txt` OSS HTTPS 直链可访问 / 下载。
- 9117wan.cn 未查到 ICP 备案记录，暂不配置中国内地 CDN。
- staging base 暂用：
  - `https://buddy-hotupdate-zhzhwd1290.oss-cn-shanghai.aliyuncs.com/buddy-hot-update/staging/`

### 本轮实现

#### client

- 新增 `assets/scripts/core/DevActionLogger.ts`
  - 保存最近动作日志。
  - 对 password / token 等敏感字段脱敏。
  - 支持 `runtime.error` 与 `runtime.unhandledRejection` 兜底记录。
  - 支持 header provider，让日志面板顶部显示热更版本摘要。
- 新增 `assets/scripts/services/HotUpdateService.ts`
  - 原生环境使用 Cocos AssetsManager 检查、下载、更新。
  - 失败不阻塞登录流程。
  - 统一阶段日志：checking / upToDate / downloading / failed / updatedRestarting。
  - 缓存并暴露 local / remote 版本摘要。
- 更新登录和主页面链路
  - 登录页和主页面都有开发日志入口。
  - 注册、登录、API 请求、Main start、dashboard refresh、pet apply 等关键阶段均有 breadcrumb。
- 更新 `AppState`
  - `getPetId()` 改为纯 getter，不再写 localStorage。
  - userId -> petId 映射保留在 setCurrentUser / setPetId / hydrate 等明确写入时机。
- 更新 `PetService`
  - `refreshDashboard()` 可接收 petId override，减少 Main 初始化时重复状态读取。
- 更新热更与配置脚本
  - `tools/set-hot-update-url.mjs`
  - `tools/generate-hot-update-manifest.mjs`
  - `package.json` 新增 `hot-update:url` / `hot-update:manifest`

### 本轮继续实现

- dev / staging / prod 热更环境集中配置。
- `npm run hot-update:url -- staging` 写入 OSS HTTPS staging manifest。
- `npm run hot-update:manifest -- --env staging --version ...` 生成适合上传 OSS 的目录。
- 连续失败次数持久化，失败 >= 3 次暂停自动检查。
- 手动清除热更缓存与手动重新检查方法。
- 热更日志增强：manifestUrl、baseApkVersion、localHotUpdateVersion、remoteVersion、packageUrl、failedCount。
- 新增热更真机测试清单。

### 使用方式

首次启用热更前，需要重新构建并安装一次带热更能力的 APK。测试包默认写入 staging：

```powershell
cd E:\buddy\buddy-client
npm run hot-update:url -- staging
```

之后在 Cocos 里构建 / 生成 APK 并安装到手机。

后续 TS / 普通资源修复，可以生成热更包：

```powershell
cd E:\buddy\buddy-client
npm run hot-update:manifest -- --env staging --version 0.0.2 --source build/android-001/data --out E:\release\buddy-hot-update\staging
```

注意：当前不走 CDN，手机通过 OSS HTTPS 直链访问；后续 CDN 配好后只需要切换 manifest URL。

### 验证

接手后需重新确认：

- `bunx tsc --noEmit --ignoreDeprecations 6.0`
- `node tools/set-hot-update-url.mjs staging`
- `node tools/generate-hot-update-manifest.mjs --env staging --version 0.0.1 --source build/android-001/data --out .tmp/hot-update-test`
- `node tools/check-utf8-docs.mjs PLAN.md docs/agent/CURRENT_TASK.md docs/agent/HANDOFF.md`

### 注意事项

- 首个带热更能力 APK 仍必须完整构建并安装。
- 热更只适用于 TS / JS / 普通资源。
- Android 原生工程、权限、Gradle、包名、ABI、so、签名、SDK/NDK 配置仍必须重新打 APK。
- 不提交 `buddy-client/.tmp` 或 `buddy-client/hello.txt`。
- 生产级热更还缺灰度、回滚、坏包清理、失败恢复按钮，本轮只做开发期排查链路。

### 收口状态（2026-06-06）

- OSS staging 热更已验证到 `0.0.11`：
  - `local=0.0.11`
  - `remote=0.0.11`
  - `failed=0`
- 已新增热更包上传脚本：

```powershell
cd E:\buddy\buddy-client
npm.cmd run hot-update:upload -- --env staging --dir .tmp/hot-update-test
```

- 登录页前置热更检查页已接入。
- 手机端日志面板已可复制完整日志到微信。
- Android 原生剪贴板桥在 `native/engine/android/app/src/com/cocos/game/AppActivity.java`；该文件属于 APK 壳，不能靠热更更新。
- 下载日志已节流；进度 UI 仍实时更新，日志只保留关键进度点。
- 旧 APK 不会自动加载热更目录，必须安装包含 `HotUpdateSearchPaths` 启动逻辑的新 APK 后，热更 JS 才会在重启后生效。

### 下一步

下一阶段聚焦手机端“点击登录”闪崩，不继续扩展热更功能。

建议流程：

1. 用当前手机包打开日志面板。
2. 点击登录前先复制一次日志，记录 baseline。
3. 点击登录复现闪崩。
4. 若未直接崩溃，复制日志并重点看：
   - `login.*`
   - `auth.login.*`
   - `api.request.*`
   - `runtime.error`
   - `runtime.unhandledRejection`
5. 若进程直接退出，补 adb logcat / Android crash 日志；应用内日志可能来不及落盘。
