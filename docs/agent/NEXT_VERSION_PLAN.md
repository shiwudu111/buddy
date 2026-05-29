# 下一版本规划

## 版本目标

下一版本目标：把 Buddy 从“本地 MVP 主链路可用”推进到“云端可运行、手机端可体验、学生端可连续使用一天”的 MVP Beta。

这版不再把目标分散成很多小方向，而是锁定三个主目标：

1. 服务器云端迁移。
2. 客户端可提交，手机端可以体验测试，支持热更新。
3. 学生端主链路体验优化，目标满足用户一日内完整体验。

## 版本命名建议

- 当前阶段：MVP Alpha 收口后
- 下一版本：MVP Beta 0.1
- 版本关键词：Cloud / Mobile / One-Day Loop

## 目标一：服务器云端迁移

### 目标

让 `buddy-server` 从 WSL 本地维护环境迁移到可长期运行的云端环境，并保证客户端、测试脚本和运维流程都能稳定访问。

### 关键结果

- 云端环境可以运行 Bun / Hono / Prisma / PostgreSQL。
- 云端服务有固定域名或固定公网入口。
- HTTPS / CORS / API Base URL 策略明确。
- 云端数据库 migration 流程明确。
- 健康检查、日志查看、重启方式明确。
- MVP smoke 可以指向云端环境运行。

### 建议任务拆分

1. 云端部署方案选择。
   - 明确云服务器、容器或平台服务。
   - 明确 PostgreSQL 是云数据库还是同机数据库。
   - 输出部署决策文档。

2. 环境变量与密钥整理。
   - 整理 `.env.example`。
   - 明确 JWT、数据库、CORS、上传目录、端口等配置。
   - 不把真实密钥提交到 Git。

3. 云端部署脚本与启动方式。
   - 固化 install / migrate / generate / start / restart。
   - 明确日志路径。
   - 明确如何回滚。

4. 云端 smoke。
   - `GET /` health check。
   - `node tools\smoke-mvp-flow.mjs` 支持云端 `BUDDY_API_BASE_URL`。
   - server `bun test` 是否继续跑本地集成测试，另设云端 smoke。

### 验收门槛

- 云端 `GET /` 返回 ok。
- 云端 MVP smoke 全通过。
- 本地 WSL 环境仍可保留为开发/回归环境。
- `docs/agent/HANDOFF.md` 记录云端入口、部署命令、回滚方式。

### 提交建议

- root：`docs(deploy): plan server cloud migration`
- server：`chore(deploy): add cloud deployment baseline`

## 目标二：客户端可提交、手机端可体验测试、支持热更新

### 目标

让 `buddy-client` 从 Cocos 编辑器内可运行，推进到手机端可以安装体验、可以连接后端、后续资源/脚本更新路径清晰。

### 关键结果

- 明确 Android / iOS 优先级，建议先 Android 测试包。
- 客户端 API Base URL 可以区分本地、WSL、云端。
- Cocos 构建流程可复现。
- 手机端安装包可体验登录、主链路、家长链路。
- 热更新方案有版本号、manifest、资源地址、回滚策略。

### 建议任务拆分

1. Cocos 构建基线。
   - 固定 Creator 版本：3.8.7。
   - 明确 build profile、输出目录、忽略目录。
   - 记录从空环境到打包的步骤。

2. 移动端 API 配置。
   - 客户端不硬编码本地 `localhost`。
   - 明确 dev / staging / production API Base URL。
   - 手机端连云端，编辑器可连 WSL 或云端。

3. Android 体验包。
   - 先产出 Android 测试包。
   - 人工验收：注册登录、建宠、作业、背包、日记、聊天、家长绑定/查看。

4. 热更新基线。
   - 明确是否使用 Cocos AssetManager。
   - 生成 manifest 与版本文件。
   - 明确热更新资源存放位置和 CDN / 静态资源服务。
   - 明确失败兜底：更新失败仍能进入当前包内版本。

### 验收门槛

- 手机端能打开并连接云端 API。
- MVP 主链路在手机端人工通过。
- 热更新方案至少完成一次测试资源更新。
- `release-smoke-checklist.md` 增加手机端验收结果记录。

### 提交建议

- client：`chore(build): add mobile build baseline`
- client：`feat(update): add hot update baseline`
- root：`docs(release): add mobile smoke checklist`

## 目标三：学生端主链路体验优化，一日内完整体验

### 目标

让学生用户在一天内可以自然完成完整闭环：打开应用、查看宠物、完成作业、获得奖励、使用背包、查看日记、聊天互动、隔一段时间回来继续照顾。

### 一日体验闭环

1. 早上打开应用。
   - 能看到宠物状态、今日提示、基础口粮或状态变化。

2. 完成一次作业。
   - 能清楚知道提交成功、获得了什么奖励。

3. 打开背包。
   - 能看到奖励物品，知道可用于什么。

4. 使用口粮。
   - 宠物状态变化清楚，失败时原因清楚。

5. 查看日记。
   - 能看到作业、奖励、使用口粮这些真实事件。

6. 发送聊天。
   - 能得到反馈，不误解为影响成长。

7. 晚些时候再次回来。
   - return greeting / timeContext 表现自然。
   - 离线衰减口径清楚，不吓人。

### 建议任务拆分

1. 学生端首页状态摘要。
   - 强化今日目标、宠物状态、背包提示。
   - 不新增后端字段，先用已有 dashboard。

2. 作业奖励体验 polish。
   - 提交成功后明确下一步。
   - 重复提交、无图片、网络失败提示清楚。

3. 背包与日记联动 polish。
   - 使用物品后引导查看日记。
   - 日记空状态、加载失败、缓存记录提示清楚。

4. 一日体验手工验收清单。
   - 按时间线记录用户从早到晚的完整路径。
   - 与 MVP smoke 区分：MVP smoke 验 API，手工清单验体验。

### 验收门槛

- Cocos 编辑器人工验收通过。
- 手机端人工验收通过。
- client `tsc` 通过。
- MVP smoke 通过。
- 不伪造库存、不直接改正式 pet 状态、不写 `diaryDays`。

### 提交建议

- client：`polish(main): improve one-day student loop`
- root：`docs(test): add one-day student experience checklist`

## 推荐执行顺序

1. 服务器云端迁移。
   - 先有稳定云端 API，手机端体验才有真实目标。

2. 客户端手机端测试包。
   - 接云端 API，产出第一版可安装体验包。

3. 热更新基线。
   - 在可安装包基础上做资源/版本更新测试。

4. 学生端一日体验优化。
   - 在手机端真实体验里 polish，而不是只在编辑器里猜。

## 每阶段通用验收门槛

- root/client/server `git status -sb` 清楚。
- release 前先跑 `node tools\release-sync.mjs --plan`。
- client 改动必须跑 `bunx tsc --noEmit --ignoreDeprecations 6.0`。
- server 或契约改动必须跑 `bun test`。
- 主链路相关改动必须跑 `node tools\smoke-mvp-flow.mjs`。
- runtime 代码改动后必须跑对应 WSL sync/check。
- 手机端和 Cocos UI 改动必须人工验收。

## 不做事项

- 不在云端迁移任务里重构业务。
- 不在移动端打包任务里重做学生端 UI。
- 不在热更新任务里引入复杂发布平台。
- 不在学生端体验优化里新增复杂养成系统。

## 风险

- 云端迁移会引入域名、HTTPS、CORS、数据库安全和日志运维问题。
- 手机端不能使用 `localhost`，API Base URL 必须先处理。
- 热更新如果没有版本和回滚规则，容易把测试包更新坏。
- 学生端一日体验需要真实手机体验，不能只看编辑器。

## 下一步建议

下一轮优先执行目标一的第一步：服务器云端迁移方案与环境清单。先输出部署决策和环境变量清单，再动 server 脚本。
