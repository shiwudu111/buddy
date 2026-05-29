# Buddy Agent Handoff

## 2026-05-29 手动操作记录：cloud staging 准备

操作者：用户手动执行，Codex 未参与。

已做：
- 在 buddy-server 创建分支 deploy/cloud-staging-v1。
- 准备处理云端部署相关内容：CORS 环境变量、.env.production.example、部署文档、smoke 文档。
- 暂未修改业务接口。

不要碰：
- buddy-client 业务代码。
- pet / inventory / homework / diary 主链路。
- 已完成的每日基础粮食和 timeContext 逻辑。

下一步：
- 先检查 git status。
- 只在 buddy-server 内推进云端部署准备。

## 2026-05-29 - 全链路测试与下一版本规划

### 触发原因

用户要求全链路测试一次，没有问题则进入下一项。

### 全链路测试结果

- `node tools\release-sync.mjs --plan`：通过，三仓库 clean、remote aligned、Decision 为 ready。
- `buddy-client`: `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。
- `buddy-server`: `bun test` 通过，57 pass / 0 fail，250 个断言。
- `root`: `node tools\smoke-mvp-flow.mjs` 通过，12 个步骤 PASS。
- client WSL sync/check 通过：`tmp_absent`、`docs_absent`。
- server WSL sync/check 通过：无 pending migration，Prisma generate 成功，服务健康。

### 当前进入任务

第 6 项：版本提交规划 / 下一版本大目标。

### 用户指定的下一版本三目标

1. 服务器云端迁移。
2. 客户端可提交，手机端可以体验测试，支持热更新。
3. 学生端主链路体验优化，目标满足用户一日内完整体验。

### 目标一当前推进

- 已开始“服务器云端迁移方案与环境清单”。
- 本轮只写 root 文档，不改 `buddy-server` 运行代码。
- 关键风险：当前 server CORS 在 `src/index.ts` 硬编码本地来源，云端迁移前应改为环境变量配置。

### 边界

- 本轮只写 root 文档。
- 不改 `buddy-client`。
- 不改 `buddy-server`。
- 不做新功能。

---

## 2026-05-29 - 发布与同步流程稳定化：release plan 预检

### 触发原因

第 4 项后端一致性与测试加固已提交、推送并完成 server WSL sync/check。用户要求进入第 5 项。

### 本轮目标

- 给 `tools/release-sync.mjs` 增加只读 `--plan`。
- 让 release 前状态检查标准化：三仓库路径、分支、状态、最新提交、远端对齐、sync/check 命令一次输出。
- 更新 Release Smoke Checklist，把 `--plan` 放到标准流程第一步。

### 当前边界

- 不改 `buddy-client`。
- 不改 `buddy-server`。
- 不提交、不推送、不同步，除非用户确认。
- `--plan` 不执行写操作。

### 待验证

- `node --check tools/release-sync.mjs` 已通过。
- `node tools\release-sync.mjs --plan` 已在真实 PowerShell 权限下通过。
- 当前 root 有本轮未提交改动，因此 `--plan` 正确显示 `Decision: blocked or needs review`。
- 三仓库 `git status -sb`。

### 本轮已完成

- `tools/release-sync.mjs` 新增 `--plan`。
- `--plan` 使用只读 git 检查 root/client/server 的路径、分支、状态、最新提交和远端对齐。
- `--plan` 输出对应 runtime repo 的 sync/check 命令。
- Release Smoke Checklist 已把 `--plan` 放入标准流程第一步。

---

## 2026-05-29 - 后端一致性与测试加固：学生端与家长侧响应契约

### 触发原因

第 3 项学生端主链路体验 polish 已提交、推送并同步 WSL。用户要求进入第 4 项：后端一致性与测试加固。

### 本轮目标

- 补齐学生端与家长侧接口契约，降低 UI 与后端字段理解偏差。
- 加固 server 集成测试，对 dashboard、作业奖励、库存使用、日记事件、`/parent/pet/:childId` 和 `/parent/report/weekly` 的核心字段做稳定断言。

### 当前边界

- 不改 `buddy-client`。
- 不新增接口。
- 不做 migration。
- 不改变认证方式。
- 优先只补文档和测试；如果测试暴露后端真实缺口，再最小修运行时代码。

### 待验证

- `buddy-server`: `bun test` 已通过，57 pass / 0 fail，250 个断言。
- 三仓库 `git status -sb`。

### 本轮已完成

- 新增 `docs/contracts/parent.md`。
- 更新 `docs/contracts/README.md`。
- 更新 `docs/contracts/pet.md`、`docs/contracts/homework.md`、`docs/contracts/diary.md`。
- 加固 `buddy-server/tests/api.test.ts` 学生端与家长侧响应字段断言。
- 未修改 `buddy-client`。
- 未修改后端运行时代码。

---

## 2026-05-29 - 学生端主链路体验 polish

### 触发原因

root/client 已推送完成后，按后续规划进入第 3 项：学生端主链路体验 polish。

### 本轮已完成

- `MainController.ts` 优化作业奖励反馈：奖励进入背包、使用后可在日记查看记录。
- `MainController.ts` 优化背包使用反馈：使用成功后提示宠物状态已刷新，并引导查看日记。
- `MainController.ts` 优化日记同步失败提示：区分缓存记录和网络异常，避免误判为同步成功。
- `MainBagPanel.ts` 将口粮选择表头从技术字段改为中文。
- `MainBagPanel.ts` 优化无可用口粮时的作业奖励引导。

### 验证结果

- `buddy-client`: `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。
- `root`: `node tools/smoke-mvp-flow.mjs` 通过，12 个步骤 PASS。

### 当前未做

- 未修改 `buddy-server`。
- 未修改 API 契约。
- 未提交本轮 client/root 改动。
- 未推送。
- 未运行 WSL 同步。
- 待用户 Cocos 人工复验学生端作业、背包、日记主链路。

### 下一步

1. Review Gate 检查 root/client/server status 和 diff。
2. 用户 Cocos 复验。
3. 通过后分仓提交 client 和 root。
4. 推送后运行 client WSL sync/check。

---

## 2026-05-29 - 家长中心三栏 section 拆分

### 触发原因

第 1 项主链路回归资产固化完成并提交推送后，按后续规划进入第 2 项：继续拆 `MainController.ts`。

### 本轮已完成

- 新增 `ParentSectionPanels.ts`，承接家长中心三栏内部渲染：宠物成长、成长洞察、学习分析。
- 新增 `ParentSectionPanels.ts.meta`。
- `MainController.ts` 改为向 section 模块传入数据、格式化函数和点击回调。
- 保持 UI 行为、交互规则和 API 契约不变。

### 验证结果

- `buddy-client`: `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。

### 当前未做

- 未修改 `buddy-server`。
- 未修改 API 契约。
- 未提交本轮 client/root 改动。
- 未推送。
- 未运行 WSL 同步。
- 待用户 Cocos 人工复验家长中心三栏。

### 下一步

1. Review Gate 检查三仓库状态和 diff。
2. 用户 Cocos 复验。
3. 通过后分仓提交 client 和 root。

---

## 2026-05-29 - 主链路回归资产固化

### 触发原因

用户确认后续规划顺序，并要求按规划执行后续开发。本轮执行第 1 项：主链路回归资产固化。

### 本轮已完成

- 重写 MVP Cocos UI 真实点击验收清单为可读中文版本。
- 新增 Release Smoke Checklist，固化 root/client/server status、client tsc、server test、WSL sync/check、MVP smoke、Cocos 人工验收记录模板。
- 增强 `tools/smoke-mvp-flow.mjs` 的失败定位：输出当前步骤、Base URL、WSL smoke 推荐命令。

### 边界

- 未修改 client/server 业务代码。
- 未修改 API 契约。
- Windows 是研发修改调试区。
- WSL 是最终运行维护和 smoke 验证区。

### 下一步

1. 运行 smoke 验证。
2. Review Gate 检查三仓库状态。
3. 用户确认后提交 root。
4. 下一轮进入第 2 项：继续拆 `MainController.ts`。

---

## 2026-05-28 - 家长中心组件化拆分

### 触发原因

用户确认先提交 root 账本文档，然后开始下一轮开发任务：家长中心组件化拆分。

### 本轮已完成

- root 账本文档已先行提交：`94048d8 docs(agent): repair task ledger`。
- 新增 `buddy-client/assets/scripts/ui/main/parent/ParentDashboardTypes.ts`，集中家长中心类型。
- 新增 `buddy-client/assets/scripts/ui/main/parent/ParentColumnLayout.ts`，集中三栏宽度、位置和动画进度算法。
- 新增 `buddy-client/assets/scripts/ui/main/parent/ParentDashboardPanel.ts`，承接家长中心顶层面板、顶部摘要区和三栏编排。
- `MainController.ts` 保留数据请求和细节渲染，主面板编排改为调用新模块。
- 新增三个 Cocos TypeScript `.meta` 文件。

### 验证结果

- `buddy-client`: `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。

### 当前未做

- 未修改 `buddy-server`。
- 未修改 API 契约。
- 未新增家长侧功能。
- 未提交本轮 client/root 改动。
- 未推送。
- 未运行 WSL 同步。
- 待用户 Cocos 人工复验家长中心三栏点击、拉伸/压缩、刷新、退出。

### 下一步

1. Review Gate：检查 root/client/server status 和 diff。
2. 用户 Cocos 复验。
3. 通过后分仓提交：client -> root。

---

## 2026-05-28 - Agent 账本编码修复

### 触发原因

用户要求开始下一轮任务。按 Buddy 流程执行 State Refresh 后发现：

- root `E:\buddy`：`main`，对齐 `origin/main`，clean。
- client `E:\buddy\buddy-client`：`develop`，对齐 `origin/develop`，clean。
- server `E:\buddy\buddy-server`：`develop`，对齐 `origin/develop`，clean。
- `PLAN.md`、`docs/agent/CURRENT_TASK.md`、`docs/agent/HANDOFF.md` 出现乱码。

由于任务账本是 Coordinator 的事实来源，账本乱码会造成 PLAN 失真风险。本轮暂停功能开发，先修复账本。

### 本轮处理

- 重写 `PLAN.md` 为可读中文。
- 重写 `docs/agent/CURRENT_TASK.md` 为可读中文。
- 重写 `docs/agent/HANDOFF.md` 为可读中文。
- 保留关键交接事实，不逐字恢复已经乱码的历史流水。

### 当前已完成事实

- Agent 架构文档与可见进度规则已建立。
- Main 日记事件闭环已完成。
- MVP API / 服务层冒烟链路已固化。
- Cocos 项目导入与资源冲突已收口。
- UI 主链路收口已完成：
  - Main 聊天入口。
  - 家长账号进入家长中心。
  - 家长绑定孩子。
  - 家长查看孩子宠物。
  - 家长查看周报。
  - 家长中心三栏主视觉。
  - 三栏点击拉伸/压缩交互。
- 用户已确认 Cocos 人工验收通过。
- 三仓库已提交并推送：
  - root `main`: `f9055b2 docs(agent): record mvp ui handoff`
  - client `develop`: `3d8bb14 feat(main): refine parent dashboard flow`
  - server `develop`: `7bfbda1 feat(parent): expose child status details`
- Release Smoke 已通过：
  - client WSL check 正常。
  - server health check 返回 `{"status":"ok","message":"Buddy API Server"}`。

### 当前未做

- 未修改 `buddy-client/` 业务代码。
- 未修改 `buddy-server/` 业务代码。
- 未提交。
- 未推送。
- 未运行 WSL 同步。

### 下一轮建议

优先执行“家长中心组件化拆分任务”。

原因：

- 上一轮家长中心 UI 已经通过人工验收，但大量逻辑仍集中在 `MainController.ts`。
- 如果继续直接在 `MainController.ts` 堆 UI，会让后续视觉调整、数据洞察、父母端功能都变慢。
- 组件化拆分不应改变用户可见行为，适合作为下一轮低风险结构任务。

建议 Task Packet：

```text
Task Name: 家长中心组件化拆分
Goal: 将家长中心 UI 和三栏交互从 MainController.ts 中拆成独立模块，保持现有行为不变。
Repos: buddy-client, root
Allowed Files:
  buddy-client/assets/scripts/ui/main/MainController.ts
  buddy-client/assets/scripts/ui/main/parent/ParentDashboardPanel.ts
  buddy-client/assets/scripts/ui/main/parent/ParentColumnLayout.ts
  buddy-client/assets/scripts/ui/main/parent/ParentDashboardTypes.ts
  root/PLAN.md
  root/docs/agent/CURRENT_TASK.md
  root/docs/agent/HANDOFF.md
Out of Scope:
  不改 server。
  不改 API 契约。
  不新增家长侧新功能。
  不重做视觉风格。
Validation:
  buddy-client: bunx tsc --noEmit --ignoreDeprecations 6.0
  Cocos 人工复验家长中心三栏点击、拉伸/压缩、刷新、退出。
Commit Plan:
  client develop：refactor(main): split parent dashboard panel
  root main：docs(agent): record parent dashboard refactor handoff
```

### 注意事项

- Windows 是研发修改调试区。
- WSL 是最终运行维护和 smoke 验证区。
- WSL 使用 mirrored networking；Windows 侧 localhost 失败时，应以 WSL 内 smoke 和 health check 为最终判断。
- `buddy-client/.tmp/` 禁止提交。
- Cocos 自动生成的 settings 变化需要单独判断，不能混入无关业务提交。
