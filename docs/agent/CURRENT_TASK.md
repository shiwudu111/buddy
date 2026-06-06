# CURRENT TASK

## 2026-06-06 当前任务：收口热更日志任务，准备点击登录闪崩定位

### 已完成任务

1. OSS HTTPS staging 热更链路已跑通。
2. 登录页前置可视热更检查页已接入。
3. 手机端开发日志面板已接入，支持查看、触摸滚动、清热更、查热更、复制完整日志。
4. Android 剪贴板桥已加入 `AppActivity`，复制日志可粘贴到微信。
5. 热更包生成和 OSS 上传脚本已加入，已验证 `0.0.11`。
6. 下载日志已节流，避免复制日志被大量 downloading 事件淹没。

### 当前事实

- staging base 暂用阿里云 OSS HTTPS 直链：
  - `https://buddy-hotupdate-zhzhwd1290.oss-cn-shanghai.aliyuncs.com/buddy-hot-update/staging/`
- `HotUpdateService` 在原生环境下使用 Cocos AssetsManager 检查并下载热更。
- 登录页启动时先显示热更检查页，再进入登录恢复流程。
- `DevActionLogger` 保留最近动作日志，并支持日志面板 header 和完整复制。
- `LoginController` 将热更版本摘要注册到日志面板顶部。
- `generate-hot-update-manifest.mjs` 从 `build/android/data` 生成热更资源和 manifest。
- `set-hot-update-url.mjs` 写入 APK 内置的 project manifest URL。
- `upload-hot-update-oss.mjs` 上传热更目录到 OSS staging/prod/dev 路径。

### 验证状态

- `bunx tsc --noEmit --ignoreDeprecations 6.0` 已通过。
- 手机端热更状态已复制确认：`local=0.0.11 remote=0.0.11 failed=0`。
- 日志复制已确认可输出完整 manifest URL。

### 当前收口

- 提交并推送 `buddy-client` 本轮热更 / 日志代码。
- 提交并推送 root agent 文档更新。
- 不提交 `buddy-client/.tmp`、`buddy-client/hello.txt`、父级 `.tools/`。

### 下一阶段

下一阶段唯一任务：定位并修复手机端“点击登录”闪崩。

建议入口：

1. 用当前日志面板复现点击登录前后的日志。
2. 优先收集 `login.*`、`api.request.*`、`runtime.error`、`runtime.unhandledRejection`。
3. 若应用直接进程退出，补 adb logcat 或 Android crash 日志。
