# PLAN.md

## 当前任务

当前无进行中的业务任务。上一任务“手机端作业提交页相册选择修复”已完成。

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

1. 等待下一轮任务。
2. 若继续扩展作业图片 AI 判断，优先在后端基于上传后的图片 URL / 文件存储链路扩展，不在客户端离线伪造判断。
3. 若继续做语音输入，复用 `NativeCapabilityService` 权限入口，不要把 Android 反射逻辑散落到页面控制器。
