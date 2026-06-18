# Buddy Agent Handoff

## Latest Handoff Summary

- 当前任务：作业图片上传结构稳固化与相册权限授权。
- 唯一当前任务源：root `PLAN.md`。
- 唯一 Agent 状态账本：root `docs/agent/`。
- 子仓 `PLAN.md` 只能作为 backlog / archive / 局部草案，不得声明当前任务源。
- 已完成任务：手机端作业提交页相册选择与上传修复，0.0.62 真机确认上传和提交成功。
- 实现：`NativeCapabilityService` 统一 native bridge / 权限入口；`HomeworkImagePickerService` 封装 Web input 与 Android 系统相册选择；`MainController` 只保留薄调用。
- 二次加固：新增 `HomeworkImageUploadService`，上传策略从 `ApiClient` 移出；`PickedHomeworkImage` 显式区分 Web file 与 Android native bytes；Android 相册权限改为真实 runtime permission。
- 当前验证：TypeScript 已通过；二次加固已推送到 `buddy-client/develop`。
- server 修复：`/homeworks/dev/reset-today` 已改为 production 默认禁用、`ENABLE_DEV_HOMEWORK_RESET=true` 显式启用，提交已推送到 `buddy-server/deploy/cloud-staging-v1`。
- 当前待办：必须重新构建 Android APK，让 `AndroidManifest.xml` 和 `AppActivity.java` 生效；随后上传 staging `0.0.63` 并真机验证首次相册权限弹窗；云端 server 需要部署最新 `deploy/cloud-staging-v1` 并设置 `ENABLE_DEV_HOMEWORK_RESET=true`。
- 历史事实：手机端“点击登录”闪崩已完成；根因与美术调参页有关，渲染时排除美术调参页后不再闪崩。

## 2026-06-17 - 手机端作业提交页相册选择修复

### 本轮背景

手机端作业提交页点击“选择图片”没有效果。定位后发现现有选择图片逻辑只使用 Web DOM `<input type=file>`，原生手机包没有 DOM，因此无法打开手机相册。

### 本轮实现

- 新增 `assets/scripts/services/HomeworkImagePickerService.ts`
  - Web 环境继续使用 `<input type=file>`。
  - Android 原生环境通过反射调用 `AppActivity`。
  - Android 优先打开系统相册 `ACTION_PICK`，失败时 fallback 到 `ACTION_OPEN_DOCUMENT` / `ACTION_GET_CONTENT`。
  - Android 返回文件名、mime type 和图片内容，TS 构造 `File` / `Blob` 后复用现有上传流程。
- 新增 `assets/scripts/services/NativeCapabilityService.ts`
  - 统一封装 native bridge 调用。
  - 预留 `microphone` / `photoLibrary` 权限查询、请求和请求结果查询。
  - 后续语音输入应先接入该服务，不要直接在页面控制器里调用 Android 反射。
- `MainController` 改为只调用 `homeworkImagePickerService.pickImage()`，不承载 Android 桥接和 base64 解码细节。
- `HomeworkCenterCoordinator` 支持上传 `File | Blob`。
- `ApiClient.uploadHomeworkImage()` 为 FormData 文件字段补稳定文件名。
- `AppActivity.java` 新增作业图片选择桥和 Activity result 处理。

### 验证

- `bunx tsc --noEmit --ignoreDeprecations 6.0` 已通过。
- UTF-8 检查已覆盖新增/修改 TS 文件。
- Android 已重新构建。
- staging 热更 `0.0.62` 已上传并确认远端 `version.manifest`。
- 真机日志确认：
  - `localHotUpdateVersion=0.0.62`
  - `remoteVersion=0.0.62`
  - `homework.imagePicker.native.start`
  - `api.homeworkUpload.multipart.start`
  - `api.xhr.request.ok POST /homeworks/uploads status=200`
  - `main.homework.submit.success`

### 下一步

- 等待下一轮任务。
- 如后续接入 AI 判断图片内容，应在后端基于上传后的图片 URL / 文件存储链路扩展，不在客户端离线伪造判断。

## 2026-06-16 - 文档事实源收编与 Lite Flow 防分裂规则

### 本轮背景

root 与 `buddy-client` 同时存在 `AGENTS.md`、`PLAN.md`、`docs/`，且 `buddy-client/AGENTS.md` 旧版规则把本仓 `PLAN.md` 当作执行源，造成双主控风险。本轮先修流程阻塞，不进入业务代码。

### 本轮结果

- root `AGENTS.md` 新增 Truth Source Guard、Lite Flow 与触发式读取规则。
- root `PLAN.md` 收束为当前文档收编任务，并记录“点击登录闪崩”已是历史完成项。
- `docs/agent/CURRENT_TASK.md` 对齐本轮流程修复任务。
- `docs/agent/HANDOFF.md` 增加顶部 `Latest Handoff Summary`，后续默认不需要读全文。
- `buddy-client/AGENTS.md` 降级为客户端本仓执行边界。
- `buddy-client/PLAN.md` 降级为 `Client Local Backlog`，不再作为当前任务源。

### 验证

- UTF-8 检查通过：`AGENTS.md`、`PLAN.md`、`docs/agent/CURRENT_TASK.md`、`docs/agent/HANDOFF.md`、`buddy-client/AGENTS.md`、`buddy-client/PLAN.md`。
- Truth Guard 关键字扫描未发现子仓继续声明当前任务源。
- 本轮未修改业务代码。

### 遗留状态

- root 仍有既存未跟踪项：`.tools/`、`docs/agent/MOBILE_BUILD_GUIDE.md`、`docs/agent/MOBILE_SMOKE_CHECKLIST.md`。
- client 仍有既存 Cocos settings 噪音：`settings/v2/packages/cocos-service.json`、`settings/v2/packages/information.json`。
- client 仍有既存 `.tmp/`。
- 本轮未提交、未推送、未 WSL 同步。

### 下一步

下一阶段产品任务尚未重新指定。开始前先按新的 Truth Guard 做 State Refresh，并避免把既存 settings 噪音或 `.tmp/` 混入提交。

## 2026-06-11 - Main home 与 pet life diagnostics 收口

### 提交线索

- client `5022462 feat(main): close pet life diagnostics pass`
- client `92d6ad2 fix(main): improve phone landscape home layout`

### 已知结果

- Main 首页横屏布局做过手机端适配，重点改动在 `MainController.ts` 与 `MainStageRenderer.ts`。
- pet life diagnostics 收口，涉及 `config.ts`、`LoginController.ts`、`MainController.ts`、`MainLifeFeedback.ts`、`MainPetAnimator.ts`。
- 新增 `docs/main-art-replacement-inventory.md`，记录美术资源替换盘点。
- `buddy-client/PLAN.md` 当时仍保存 Main home closeout 任务；2026-06-16 已降级为本仓 backlog，不再作为当前任务源。

### 风险

- 该阶段改动量较大，特别是 `MainController.ts`。
- 后续若继续 Main 首页任务，应先读 root `PLAN.md`，再按需查看 client backlog 和相关提交。

## 2026-06-10 - 美术调参页 Android crash 修复与原生日志增强

### 提交线索

- client `e36fc5c fix(main): prevent Android crash from art debug entry`
- client `cc00eeb fix(main): improve native log and pet interactions`

### 已知结果

- 手机端“点击登录”闪崩已完成定位和修复。
- 根因与美术调参页有关；渲染时排除美术调参页后，手机端不再闪崩。
- 同日还增强了原生日志、运行时 UI 与宠物交互链路。

### 风险

- 该修复涉及 `LoginController.ts`、`MainController.ts`、`RuntimeUI.ts`、`ApiClient.ts`。
- 若后续再出现手机端闪崩，应先确认是否重新引入美术调参入口或相关渲染路径。

## 2026-06-08 至 2026-06-10 - 热更原生恢复链路加固

### 提交线索

- client `c1580ab fix(hot-update): restore native search paths`
- client `3508b74 fix(hot-update): harden native restore state`

### 已知结果

- 恢复 Cocos 原生 search paths，新增 `native/engine/common/Classes/Game.cpp`。
- 加固 `HotUpdateService` 原生恢复状态，避免热更恢复链路不稳定。
- 相关改动还触及 `ApiClient.ts`、`PetService.ts`、`LoginController.ts`、`MainController.ts`。

### 风险

- 这类改动涉及 APK 原生壳，不能只靠 TS 热更验证。
- 后续热更问题需要区分 APK 原生能力、search paths、manifest 与 TS 资源更新。

## 2026-06-06 - 热更日志与 OSS staging 工具收口

### 提交线索

- client `0d33470 feat(hot-update): add staging updater logs`
- root `b0465ad docs(agent): close hot update task`

### 已知结果

- 新增 `DevActionLogger` 与 `HotUpdateService`。
- 登录页与 Main 页接入开发日志入口。
- 新增 Android 剪贴板桥 `AppActivity.java`，支持复制日志。
- 新增热更 manifest、URL 写入、OSS 上传脚本。
- root agent 文档完成热更任务收口。

### 风险

- `AppActivity.java` 与后续 `Game.cpp` 属于 APK 原生壳，首次接入或修改后必须完整构建安装 APK。
- `buddy-client/.tmp` 与测试产物仍不得提交。

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
