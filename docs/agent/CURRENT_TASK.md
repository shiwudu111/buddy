# CURRENT TASK

## 2026-06-18 当前任务：作业图片上传结构稳固化与相册权限授权

### 任务目标

在 0.0.62 已验证相册选择、上传、提交成功的基础上，继续加固图片上传结构，并补齐 Android 首次访问相册的人工授权流程。

### 当前事实

- 本轮只修改 `buddy-client` 与 root 任务文档。
- 原问题原因：作业图片选择只走 Web DOM `<input type=file>`，原生手机包没有 DOM。
- 已新增 `HomeworkImagePickerService`，封装 Web / Android 原生图片选择。
- 已新增 `NativeCapabilityService`，统一封装 native bridge 与权限查询 / 请求入口。
- `MainController` 只保留薄调用，不承载 Android 桥接和 base64 解码细节。
- Android `AppActivity` 已新增系统相册选择桥，优先 `ACTION_PICK`，再 fallback 到 `ACTION_OPEN_DOCUMENT` / `ACTION_GET_CONTENT`。
- 上传仍走 `/homeworks/uploads`，为后续服务端 / AI 判断图片内容保留后端 URL 链路。
- 已为后续语音输入预留麦克风权限状态、请求和请求结果查询；本轮不实现录音。
- 已新增 Android native multipart fallback：当 Cocos 原生环境没有 `FormData` 时，客户端手工拼 multipart body，通过 XHR 上传到 `/homeworks/uploads`。
- 0.0.62 真机日志确认：
  - `localHotUpdateVersion=0.0.62`
  - `remoteVersion=0.0.62`
  - `homework.imagePicker.native.start`
  - `api.homeworkUpload.multipart.start`
  - `api.xhr.request.ok POST /homeworks/uploads status=200`
  - `main.homework.submit.success`
- 二次加固：
  - 新增 `HomeworkImageUploadService`，图片上传策略从 `ApiClient` 移出。
  - `HomeworkImagePickerService` 返回结构化 `PickedHomeworkImage`，显式区分 `web` 与 `android-native`。
  - Android native 图片上传直接使用 bytes multipart + XHR，不再先触发不可用的 `FormData`。
  - `photoLibrary` 权限改为真实原生权限请求，首次使用相册前应弹系统授权。

### Allowed Files

- `buddy-client/assets/scripts/services/HomeworkImagePickerService.ts`
- `buddy-client/assets/scripts/services/HomeworkImagePickerService.ts.meta`
- `buddy-client/assets/scripts/services/NativeCapabilityService.ts`
- `buddy-client/assets/scripts/services/NativeCapabilityService.ts.meta`
- `buddy-client/assets/scripts/services/HomeworkImageUploadService.ts`
- `buddy-client/assets/scripts/services/HomeworkImageUploadService.ts.meta`
- `buddy-client/assets/scripts/network/ApiClient.ts`
- `buddy-client/assets/scripts/ui/homework/HomeworkCenterCoordinator.ts`
- `buddy-client/assets/scripts/ui/main/MainController.ts`
- `buddy-client/native/engine/android/app/AndroidManifest.xml`
- `buddy-client/native/engine/android/app/src/com/cocos/game/AppActivity.java`
- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`

### Validation

```powershell
cd E:\buddy\buddy-client
bunx tsc --noEmit --ignoreDeprecations 6.0
git diff --stat
git status -sb
```

还需要分别检查：

- `E:\buddy`
- `E:\buddy\buddy-client`
- `E:\buddy\buddy-server`

### 验证状态

- TypeScript 检查已通过。
- 0.0.62 真机已验证相册选择、图片上传、作业提交、奖励发放和库存同步成功。
- 二次加固代码已通过 TypeScript 检查并提交到 `buddy-client/develop`。
- 仍需重新构建 Android APK；本轮修改了 `AndroidManifest.xml` 与 `AppActivity.java`，仅热更无法带入原生权限声明和 Java 桥。
- APK 重建后需生成并上传 staging 热更 `0.0.63`，再真机验证权限弹窗与上传提交链路。
