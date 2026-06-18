# CURRENT TASK

## 2026-06-18 当前任务：无进行中的业务任务

### 任务目标

上一任务“手机端提交作业页面相册选择与上传修复”已完成并真机验证。等待下一轮任务。

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

### Allowed Files

- `buddy-client/assets/scripts/services/HomeworkImagePickerService.ts`
- `buddy-client/assets/scripts/services/HomeworkImagePickerService.ts.meta`
- `buddy-client/assets/scripts/services/NativeCapabilityService.ts`
- `buddy-client/assets/scripts/services/NativeCapabilityService.ts.meta`
- `buddy-client/assets/scripts/network/ApiClient.ts`
- `buddy-client/assets/scripts/ui/homework/HomeworkCenterCoordinator.ts`
- `buddy-client/assets/scripts/ui/main/MainController.ts`
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
- Android 已重新构建。
- staging 热更 `0.0.62` 已上传。
- 真机已验证相册选择、图片上传、作业提交、奖励发放和库存同步成功。
