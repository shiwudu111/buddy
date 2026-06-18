# PLAN.md

## 当前任务

手机端作业图片上传结构稳固化与相册权限授权。

## Goal

修复手机端提交作业页面点击“选择图片”没有效果的问题，让用户可以像普通 App 一样打开手机相册，选择作业照片并上传到后端。

## 当前事实

- 三仓 State Refresh 时均为干净状态。
- 本轮只修改 `buddy-client`，不修改 `buddy-server`。
- 原问题原因：作业图片选择只走 Web DOM `<input type=file>`，原生手机包没有 DOM，因此点击后无有效相册入口。
- 新方案：客户端通过独立 `HomeworkImagePickerService` 选择图片。
- 原生能力通过 `NativeCapabilityService` 统一调用，避免页面控制器直接散落 native bridge。
- Web 环境继续使用 `<input type=file>`。
- Android 原生环境通过 `AppActivity` 打开系统相册 `ACTION_PICK`，失败时 fallback 到 `ACTION_OPEN_DOCUMENT` / `ACTION_GET_CONTENT`。
- 图片仍上传到后端 `/homeworks/uploads`，提交作业继续使用后端返回的图片 URL，后续可交给服务端 / AI 判断图片内容。
- 已为后续语音输入预留麦克风权限查询 / 请求 / 请求结果查询入口，但本轮不实现录音。
- 0.0.62 真机日志已验证：相册可打开，图片上传走 multipart fallback 成功，`POST /homeworks/submit` 成功，奖励与库存同步成功。
- 二次加固已提交到 `buddy-client/develop`：图片选择结果改为结构化 `PickedHomeworkImage`，上传策略移入 `HomeworkImageUploadService`，`ApiClient` 不再承载 Android 图片上传 fallback。
- Android 相册权限已改为真实 runtime permission：首次使用相册前通过 `NativeCapabilityService` 请求 `photoLibrary`，原生侧按系统版本请求 `READ_MEDIA_IMAGES` 或 `READ_EXTERNAL_STORAGE`。

## Lite Task Packet

```text
Task: 手机端作业提交页相册选择修复
Scope: buddy-client 作业图片选择、上传输入、Android 相册桥
Allowed Files:
  buddy-client/assets/scripts/services/HomeworkImagePickerService.ts
  buddy-client/assets/scripts/services/HomeworkImagePickerService.ts.meta
  buddy-client/assets/scripts/services/NativeCapabilityService.ts
  buddy-client/assets/scripts/services/NativeCapabilityService.ts.meta
  buddy-client/assets/scripts/network/ApiClient.ts
  buddy-client/assets/scripts/ui/homework/HomeworkCenterCoordinator.ts
  buddy-client/assets/scripts/ui/main/MainController.ts
  buddy-client/native/engine/android/app/src/com/cocos/game/AppActivity.java
  PLAN.md
  docs/agent/CURRENT_TASK.md
  docs/agent/HANDOFF.md
Validation:
  buddy-client: bunx tsc --noEmit --ignoreDeprecations 6.0
  buddy-client: git diff --stat
  root/client/server: git status -sb
Stop Conditions:
  需要修改后端上传契约
  需要新增 Android 权限或 Gradle 配置
  TypeScript 检查失败
  发现 MainController 继续承载大段图片选择逻辑
```

## Out of Scope

- 不修改后端。
- 不改变作业奖励、库存、宠物状态规则。
- 不伪造作业图片或库存。
- 不提交 `.tmp/`。
- 不处理无关 UI 重构。

## 验证状态

- `bunx tsc --noEmit --ignoreDeprecations 6.0` 已通过。
- Android 已重新构建。
- staging 热更已上传并验证远端 `version.manifest` 为 `0.0.62`。
- 真机日志确认 `local=0.0.62`、`remote=0.0.62`。
- 真机日志确认上传链路：
  - 标准 `FormData` 在 Android native 中不可用，日志为 `FormData is not defined`。
  - multipart fallback 启动：`api.homeworkUpload.multipart.start`。
  - 上传成功：`api.xhr.request.ok POST /homeworks/uploads status=200`。
  - 提交成功：`main.homework.submit.success`。

## 下一步

1. 重新构建 Android APK，确保新的 `AndroidManifest.xml` 权限声明和 `AppActivity.java` 权限桥进入安装包。
2. 基于新构建的 `build/android/data` 生成并上传 staging 热更 `0.0.63`。
3. 真机验证：首次点选择图片应出现系统相册权限弹窗；允许后应打开相册、上传图片并提交作业成功。
