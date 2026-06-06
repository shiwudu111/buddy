# PLAN.md

## 当前任务

下一阶段：点击登录闪崩定位。

上一阶段 OSS HTTPS staging 热更、可视热更检查页、手机端开发日志、OSS 上传脚本已完成并准备收口提交。

本轮目标是在现有开发期热更骨架基础上，把“局域网临时热更测试”升级为“接近真实用户环境的 OSS HTTPS staging 热更测试”。当前 9117wan.cn 未查到 ICP 备案记录，暂不配置中国内地 CDN，先使用阿里云 OSS HTTPS 直链作为 staging base，后续可切换为 CDN 域名。

## 当前事实

- root `main` 有 agent 文档改动。
- client `develop` 有本轮热更、日志、OSS 上传脚本相关改动，准备提交并推送。
- server 无本轮改动。
- 手机端已验证 `0.0.11` 热更链路：`local=0.0.11 remote=0.0.11 failed=0`。
- 已确认首次带热更能力 APK 必须完整构建并安装；后续 TS / 普通资源可走热更。
- OSS Bucket 已创建并完成最小验证：
  - Bucket: `buddy-hotupdate-zhzhwd1290`
  - Region: 华东2（上海）
  - staging path: `buddy-hot-update/staging/`
  - `hello.txt` OSS HTTPS 直链可访问 / 下载。
- staging manifest URL 暂定为：
  - `https://buddy-hotupdate-zhzhwd1290.oss-cn-shanghai.aliyuncs.com/buddy-hot-update/staging/project.manifest`
- 开发期热更只覆盖 TS / JS / 普通资源，不覆盖 Android 原生工程、权限、Gradle、包名、ABI、so 库。
- 当前下一阶段不继续扩展热更能力，聚焦“点击登录闪崩”的最小复现、日志采集和修复。

## 本轮 Task Packet

```text
Task Name: OSS HTTPS 真实网络热更测试方案
Goal:
  1. 把临时局域网热更切换为 OSS HTTPS staging base。
  2. 支持 dev / staging / prod 三套集中配置，测试包默认 staging。
  3. 保留 APK 构建前写入稳定 project.manifest 地址。
  4. 增强失败容错：失败次数、>=3 次暂停自动检查、清缓存、手动重试。
  5. 增强 HotUpdate 日志和真机测试清单。
Repos: buddy-client, root
Allowed Files:
  buddy-client/assets/scripts/app/AppState.ts
  buddy-client/assets/scripts/core/DevActionLogger.ts
  buddy-client/assets/scripts/core/DevActionLogger.ts.meta
  buddy-client/assets/scripts/core/build-config.generated.ts
  buddy-client/assets/scripts/core/config.ts
  buddy-client/assets/scripts/network/ApiClient.ts
  buddy-client/assets/scripts/services/AuthService.ts
  buddy-client/assets/scripts/services/HomeworkService.ts
  buddy-client/assets/scripts/services/HotUpdateService.ts
  buddy-client/assets/scripts/services/HotUpdateService.ts.meta
  buddy-client/assets/scripts/services/PetService.ts
  buddy-client/assets/scripts/ui/login/LoginAuthCoordinator.ts
  buddy-client/assets/scripts/ui/login/LoginController.ts
  buddy-client/assets/scripts/ui/main/MainController.ts
  buddy-client/package.json
  buddy-client/docs/hot-update-test-checklist.md
  buddy-client/tools/generate-hot-update-manifest.mjs
  buddy-client/tools/set-api-base.mjs
  buddy-client/tools/set-hot-update-url.mjs
  PLAN.md
  docs/agent/CURRENT_TASK.md
  docs/agent/HANDOFF.md
Out of Scope:
  不改 buddy-server
  不配置阿里云控制台
  不写上传 OSS 自动化
  不引入 AccessKey
  不做生产级热更灰度 / 弹窗阻塞
  不改 Android 原生工程
  不提交 buddy-client/.tmp 或 buddy-client/hello.txt
Backend Impact: 无
Client Impact:
  热更环境配置、失败恢复、日志、开发测试方法。
Contract Impact: 无 API 契约变化
Validation:
  buddy-client: bunx tsc --noEmit --ignoreDeprecations 6.0
  buddy-client: node tools/set-hot-update-url.mjs staging
  buddy-client: node tools/generate-hot-update-manifest.mjs --env staging --version 0.0.1 --source build/android-001/data --out .tmp/hot-update-test
  root: node tools/check-utf8-docs.mjs PLAN.md docs/agent/CURRENT_TASK.md docs/agent/HANDOFF.md
Commit Plan:
  暂不提交，先完成验证和手机端下一步操作交接。
Risks:
  9117wan.cn 未备案，当前不走中国内地 CDN。
  staging 先使用 OSS HTTPS 直链。
  热更失败必须记录并继续登录。
```

## 开发期热更使用方式

首次启用前，测试包默认写入 staging：

```powershell
cd E:\buddy\buddy-client
npm run hot-update:url -- staging
```

然后在 Cocos 中重新构建并安装一次 APK。后续只改 TS / 普通资源时，先生成新的 `build/android-001/data`，再生成 staging 热更包：

```powershell
cd E:\buddy\buddy-client
npm run hot-update:manifest -- --env staging --version 0.0.2 --source build/android-001/data --out E:\release\buddy-hot-update\staging
```

版本号每次递增，例如 `0.0.1` -> `0.0.2` -> `0.0.3`。

## 下一步

1. 实现 dev / staging / prod 热更环境脚本。
2. 增强失败次数、暂停自动检查、清缓存、手动重试。
3. 新增热更真机测试清单。
4. 跑 TypeScript、manifest 生成和 Review Gate。
