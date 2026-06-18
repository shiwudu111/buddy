# CURRENT TASK

## 2026-06-17 当前任务：手机端作业提交页相册选择修复

### 任务目标

修复手机端提交作业页面点击“选择图片”没有效果的问题，让用户可以打开手机相册选择作业照片，并继续通过后端上传接口保存图片 URL。

### 当前事实

- 本轮只修改 `buddy-client` 与 root 任务文档。
- 原问题原因：作业图片选择只走 Web DOM `<input type=file>`，原生手机包没有 DOM。
- 已新增 `HomeworkImagePickerService`，封装 Web / Android 原生图片选择。
- 已新增 `NativeCapabilityService`，统一封装 native bridge 与权限查询 / 请求入口。
- `MainController` 只保留薄调用，不承载 Android 桥接和 base64 解码细节。
- Android `AppActivity` 已新增系统相册选择桥，优先 `ACTION_PICK`，再 fallback 到 `ACTION_OPEN_DOCUMENT` / `ACTION_GET_CONTENT`。
- 上传仍走 `/homeworks/uploads`，为后续服务端 / AI 判断图片内容保留后端 URL 链路。
- 已为后续语音输入预留麦克风权限状态、请求和请求结果查询；本轮不实现录音。

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
- Android 完整 APK 构建尚未执行；因为改了 `AppActivity.java`，后续必须重新构建安装 APK 才能真机验证相册选择。
