# Buddy Agent Handoff

### 2026-05-27 - Release/Sync 工具路径风险记录

触发原因：
- 用户要求把推送和 WSL 对齐流程固化为 root 工具，并提醒已有 WSL 对齐工具。
- 执行中确认 `E:\buddy\buddy-client` 与 `E:\buddy\buddy-server` 是当前正式仓库路径，旧的 `E:\buddy-client` / `E:\buddy-server` 只作为备份，不应再作为默认操作路径。

本轮已记录风险：
- `E:\buddy\buddy-client\.git` 当前仍指向 `E:\buddy-client\.git`。
- `E:\buddy\buddy-server\.git` 当前仍指向 `E:\buddy-server\.git`。
- 这会导致 Git / agent / 工具误把旧备份目录识别成真实仓库根，产生路径误判、safe.directory、权限和同步源混淆。

本轮工具修正：
- `tools/release-sync.mjs` 的 client/server `cwd` 固定使用 `E:\buddy\buddy-client` 与 `E:\buddy\buddy-server`。
- helper 调用已有 WSL sync 脚本时显式传入 `SOURCE_DIR=/mnt/e/buddy/buddy-client` 或 `SOURCE_DIR=/mnt/e/buddy/buddy-server`，避免既有脚本默认使用旧 `/mnt/e/buddy-client` / `/mnt/e/buddy-server`。
- 工具说明中明确旧根目录只能视为备份，不作为操作路径。

遗留建议：
- 后续单独做“子仓库 Git 元数据去旧路径依赖”任务，确认如何安全迁移 `.git` 元数据到 `E:\buddy\buddy-client\.git` 与 `E:\buddy\buddy-server\.git`。
- 该迁移涉及 Git 元数据和备份目录，不应混入普通业务任务或工具任务。

### 2026-05-27 - 子仓库实体化迁移完成

触发原因：
- 用户要求修复 `E:\buddy\buddy-client\.git` 和 `E:\buddy\buddy-server\.git` 仍指向旧备份目录 `.git` 的遗留风险。

真实根因：
- `E:\buddy\buddy-client` 与 `E:\buddy\buddy-server` 不只是 `.git` 指向旧目录，而是整个目录本身都是 Junction：
  - `E:\buddy\buddy-client` -> `E:\buddy-client`
  - `E:\buddy\buddy-server` -> `E:\buddy-server`

本轮已完成：
- 将旧目录内容复制为 `E:\buddy\buddy-client.real-20260527-154641` 与 `E:\buddy\buddy-server.real-20260527-154641`。
- 删除 `E:\buddy` 下两个 Junction 本身。
- 将 `.real-*` 实体目录改名为正式目录：
  - `E:\buddy\buddy-client`
  - `E:\buddy\buddy-server`
- 旧目录 `E:\buddy-client` 与 `E:\buddy-server` 保留为备份，未删除。
- 将 `E:/buddy/buddy-client` 与 `E:/buddy/buddy-server` 加入 Git `safe.directory`。

验证结果：
- `E:\buddy\buddy-client` 与 `E:\buddy\buddy-server` 当前均为实体目录，不再是 ReparsePoint/Junction。
- `git rev-parse --show-toplevel` 分别返回：
  - `E:/buddy/buddy-client`
  - `E:/buddy/buddy-server`
- `node tools/release-sync.mjs --repo client --status` 通过。
- `node tools/release-sync.mjs --repo server --status` 通过。
- client `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。
- `node tools/release-sync.mjs --repo client --sync --check` 通过，WSL 目标无 `.tmp` / `docs`。
- `node tools/release-sync.mjs --repo server --check` 通过，返回 `{"status":"ok","message":"Buddy API Server"}`。

继续观察：
- WSL 命令偶尔输出 networking 相关乱码/警告，但本轮 sync/check 退出码为 0，server 健康。按用户要求继续观察，暂不作为阻塞项处理。

### 2026-05-27 - Root 工具与统一节奏收口

本轮已完成：
- 新增 `tools/release-sync.mjs`，统一 root/client/server 的 status、push、WSL sync、post-sync check 入口。
- 新增 `tools/smoke-mvp-flow.mjs`，固化 MVP API 主链路冒烟脚本。
- 新增 `docs/client/07-联调与测试/mvp-client-click-smoke-checklist.md`，记录 Cocos UI 真实点击验收清单。
- 更新 `PLAN.md` 与 `docs/agent/CURRENT_TASK.md`，将当前节奏切到 Release/Sync 工具收口验证。
- `smoke-mvp-flow.mjs` 增加 Windows localhost 访问 WSL server 失败时的明确 WSL 运行提示，避免误判为业务链路失败。

运行边界：
- Windows 端是项目研发、修改、调试区域。
- WSL 端是运行维护和最终 smoke 验证区域。
- WSL 使用 mirrored networking 配置，并开启 `hostAddressLoopback=true`；如果 Windows 侧 `localhost` 访问 WSL server 失败，不直接判定业务失败，应在 WSL 内运行最终 smoke。

验证结果：
- `node tools/release-sync.mjs --repo client --status` 通过。
- `node tools/release-sync.mjs --repo server --status` 通过。
- `node tools/release-sync.mjs --repo server --check` 通过。
- Windows 侧直接运行 `node tools/smoke-mvp-flow.mjs` 因 Windows -> WSL localhost 映射失败而失败，但已输出明确 WSL 运行提示。
- WSL 内运行 `BUDDY_API_BASE_URL=http://localhost:3000/api/v1 node tools/smoke-mvp-flow.mjs` 通过，覆盖注册/登录、宠物、dashboard、作业奖励、背包使用、日记事件、聊天、家长绑定与周报。

当前结论：
- MVP 后端与客户端服务层主链路已贯通。
- 后续任务可以按固定节奏推进：State Refresh -> Task Packet -> Contract First -> Server/Client 实现 -> Test Gate -> Review Gate -> 分仓提交 -> WSL Sync -> Handoff。
- WSL networking 噪声继续观察；只要命令退出码和健康检查通过，不作为当前阻塞项。

## 最近交接

### 2026-05-26 - 固化 MVP 冒烟工具与 Cocos UI 点击清单

触发原因：

- 用户要求把本次冒烟脚本固化成工具，避免后续临时手写脚本误判；随后再做 Cocos UI 的真实点击验收清单。

本轮已做：

- 新增 `tools/smoke-mvp-flow.mjs`。
  - 覆盖 child 注册 / 登录、创建宠物、dashboard、math 作业奖励、背包使用、日记事件、chat、parent 注册绑定查看、weekly report。
  - 使用作业响应里的实际库存项调用 `/inventory/use`，避免手写参数和真实响应错位。
  - 支持 `BUDDY_API_BASE_URL` 和账号相关环境变量。
- 新增 `docs/client/07-联调与测试/mvp-client-click-smoke-checklist.md`。
  - 记录 9 步 Cocos UI 点击验收路径。
  - 明确 API 冒烟与真实 UI 点击验收的边界。
- 更新 `PLAN.md` 和 `docs/agent/CURRENT_TASK.md`，将当前任务切换为工具固化与点击清单。

下一步：

1. 运行 WSL server health check。
2. 运行 `node tools/smoke-mvp-flow.mjs`。
3. 检查 root/client/server `git status -sb`。
4. 等待用户确认是否提交 root 工具和文档。

验证结果：

- WSL server health check：通过。
- `node tools/smoke-mvp-flow.mjs`：通过，最终 `passed: true`。
- client/server 工作区：clean。
- root 工作区：仅包含本轮 root 工具、点击清单和任务账本改动。

Cocos UI 点击验收状态：

- 已检查当前环境，未找到 `CocosCreator.exe`、`CocosCreator`、`Creator` 或 `cocos` 命令。
- `buddy-client` 没有可直接打开的 Web build 产物。
- `docs/client/*.html` 是静态设计壳，不等同于真实 Cocos 运行时。
- 因此本轮无法自动执行真实 UI 点击，只能交付人工点击验收清单；若要自动化，需要提供 Cocos Creator 可执行路径、Web build 输出目录或本地 preview 命令。

### 2026-05-26 - MVP 客户端主链路冒烟验收

触发原因：

- 用户要求开始“MVP 客户端主链路冒烟验收任务”，路径为登录/注册 -> 宠物主页 -> dashboard -> 作业奖励 -> 背包 -> 日记 -> 聊天 -> 家长侧。

本轮已做：

- 更新 `PLAN.md` 与 `docs/agent/CURRENT_TASK.md`，将当前任务切换为 MVP 客户端主链路冒烟验收。
- 确认 WSL server 在线：`http://localhost:3000/` 返回 `{"status":"ok","message":"Buddy API Server"}`。
- 运行真实 API 主链路冒烟，覆盖：
  - child 注册 / 登录
  - 创建宠物
  - dashboard 刷新
  - 提交 math 作业获得 `logic_cookie`
  - 使用背包奖励物品
  - `/pets/:petId/events` 返回 homework / reward 事件
  - chat 发送消息
  - parent 注册、绑定 child、查看 child pet、查看 weekly report
- 运行 client TypeScript 检查：`bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。
- 静态核对客户端入口：`AuthService`、`PetService`、`HomeworkService`、`ChatService`、`ParentService`、`MainController`、Login UI、Homework UI、Main bag/journal 入口均存在。

冒烟结果：

- API / 服务链路：通过。
- client TypeScript：通过。
- Cocos UI 实机点击链路：未自动执行，仍需人工或后续浏览器/模拟器验收。

过程发现：

- 初版冒烟脚本在背包使用处失败过，后续定位不是产品链路硬断点；使用作业响应中的实际库存项作为输入后，全链路通过。
- 这说明后续自动 smoke 脚本应保存为稳定工具，避免手写脚本误判。

下一步建议：

1. 将本轮 smoke 脚本固化为 server 或 root 工具，例如 `tools/smoke-mvp-flow.*`。
2. 再做 Cocos UI 手动验收清单，覆盖真实点击路径。
3. 若要继续实现功能，优先补“家长侧 UI 入口/展示确认”或“Main 日记失败文案 polish”，不要再扩大后端契约。

### 2026-05-26 - 切换到 MVP 主链路审计

触发原因：

- 用户指出第三步应为“做 MVP 主链路，而不是分散做功能”，并反馈界面长时间停在“正在思考”。
- 根因不是技术阻塞，而是收到“好的”后没有立即输出 Task Packet 或执行状态检查，违反可见进度规则。

本轮已做：

- 立即执行 State Refresh，确认 root / client / server 均为 clean。
- 确认旧的 `PLAN.md` / `CURRENT_TASK.md` 仍停留在已完成的 Main 日记事件闭环任务，这是后续推进的真实阻塞点。
- 更新 `PLAN.md`，切换为“MVP 主链路审计任务”。
- 更新 `docs/agent/CURRENT_TASK.md`，记录第三步只读审计范围和不做事项。

当前约束：

- 本轮只做 MVP 主链路审计，不写 client/server 业务代码。
- 先输出登录、dashboard、作业奖励、背包消耗、日记、家长侧、聊天/表现层的完成度和缺口。
- 下一轮实现任务必须由用户确认后再执行。

下一步建议：

1. 只读审计 root contracts 和 handoff。
2. 只读审计 server routes/tests。
3. 只读审计 client services/state/UI 入口。
4. 输出 MVP 链路现状表。
5. 给出下一轮最小实现任务。

### 2026-05-26 - 恢复 Main 日记事件闭环收口任务

触发原因：

- Agent 架构文档已完成 root commit，用户要求进入第二步：恢复 Main 日记事件闭环任务。

本轮已做：

- 复核 root / client / server `git status -sb`。
- 复核 root `git diff --stat`。
- 读取 diary contract、client `PetService.ts` diff、server `pet.ts` / `api.test.ts` diff。
- 更新 `PLAN.md`，切换当前任务为 Main 日记事件闭环收口。
- 更新 `docs/agent/CURRENT_TASK.md`，记录允许文件、验证命令和下一步。

当前遗留范围：

- root：`docs/contracts/README.md`、`docs/contracts/diary.md`
- client：`assets/scripts/services/PetService.ts`、未跟踪 `.tmp/`
- server：`src/routes/pet.ts`、`tests/api.test.ts`

下一步建议：

1. 复核 diary contract 与 server/client 字段一致。
2. 如需修正，只在允许文件内做最小补丁。
3. 同步 server WSL runtime 后运行 `bun test`。
4. 运行 client `bunx tsc --noEmit --ignoreDeprecations 6.0`。
5. Review Gate 通过后，等待用户确认再按 server -> client -> root 分仓提交。

验证进展：

- server WSL sync / Prisma generate / backend restart / health check 已通过。
- `buddy-server` 已运行 `bun test`：57 pass / 0 fail / 218 expect() calls。
- `buddy-client` 已运行 `bunx tsc --noEmit --ignoreDeprecations 6.0`：通过，无错误输出。
- `buddy-client/.tmp/` 仍未跟踪，提交时必须继续排除。
- `MainController.ts` 中日记同步失败文案仍可后续优化为“当前显示最近记录”，但该文件不在本轮允许文件内，本轮未修改。

### 2026-05-26 - Buddy Agent 架构文档收口

触发原因：

- 用户要求执行“Buddy Agent 架构文档收口任务”，只处理父级 agent 文档，不继续写业务代码。
- 目标是标记 Agent 架构文档完成，并把该任务与 Main 日记事件闭环遗留改动彻底分开。

本轮已做：

- 复核 root / client / server `git status -sb`。
- 复核 root `git diff --stat`。
- 更新 `PLAN.md`，将当前任务标记为 Agent 架构文档收口，并明确 commit 范围。
- 更新 `docs/agent/CURRENT_TASK.md`，将状态切换为“Agent 架构文档已完成，等待用户确认提交”。
- 更新本 `HANDOFF.md`，记录本轮完成内容、未提交遗留和下一轮恢复顺序。

本轮未做：

- 未修改 `buddy-client/` 业务代码。
- 未修改 `buddy-server/` 业务代码。
- 未提交任何仓库。
- 未暂存 `docs/contracts/README.md` 或 `docs/contracts/diary.md`。
- 未暂存 `buddy-client/.tmp/`。
- 未运行破坏性 `reset` / `revert`。

建议本轮 root commit 只包含：

- `AGENTS.md`
- `PLAN.md`
- `docs/agent/STATE.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/DECISIONS.md`
- `docs/agent/HANDOFF.md`
- `docs/agent/CHECKLISTS.md`
- `docs/agent/SUBAGENTS.md`

明确不属于本轮 commit 的遗留：

- root：`docs/contracts/README.md`、`docs/contracts/diary.md`
- client：`assets/scripts/services/PetService.ts`、未跟踪 `.tmp/`
- server：`src/routes/pet.ts`、`tests/api.test.ts`

下一轮恢复顺序：

1. 切换 `PLAN.md` / `CURRENT_TASK.md` 到“Main 日记事件闭环收口任务”。
2. 复核 diary contract：`docs/contracts/README.md`、`docs/contracts/diary.md`。
3. 复核 server 改动并重新跑 `bun test`。
4. 复核 client `PetService.ts` 改动并跑 `bunx tsc --noEmit --ignoreDeprecations 6.0`。
5. 通过 Review/Test Gate 后按 server -> client -> root 分仓提交。
6. 如 server/client 运行时代码提交完成，执行对应 WSL sync 和健康检查。

### 2026-05-25 - 子 agent 架构落地

触发原因：

- 用户指出“架构应包含子 agent”，之前只落地了 Mode 规则，未落地真实子 agent 调用方式。

已做：

- 启动两个只读 explorer 子 agent：
  - Server Explorer：检查 `buddy-server` 当前 `recent_events` 实现与测试。
  - Client Explorer：检查 `buddy-client` 当前 `PetService` 日记预填逻辑。
- 新增 `docs/agent/SUBAGENTS.md`。
- 在 `AGENTS.md` 增加 Subagent 架构规则。
- 在 `CHECKLISTS.md` 增加 Subagent Gate。
- 将 `PLAN.md` / `CURRENT_TASK.md` 切换到本轮子 agent 架构落地任务。

Smoke test 结果：

- Client Explorer 已返回，认为 `PetService` 当前方向可接受。
- Client Explorer 风险提示：如果 `/events` 失败，日记页保留 dashboard 摘要时，“同步失败，当前为上次记录”文案可能不够准确。
- Server Explorer 120 秒等待超时，暴露出子 agent 需要超时回收策略。
- 已把 120 秒只读 explorer 等待上限和超时记录规则写入 `SUBAGENTS.md`。

约束：

- 本轮子 agent 只读。
- 不修改 client/server 业务代码。
- 不提交 `.tmp/`。

### 2026-05-25 - 可见进度协议修复

触发原因：

- 用户观察到任务在第三步超过 5 分钟没有可见更新，判定本轮 agent 优化失败。

真实后台状态：

- server WSL sync 已完成。
- `bun test` 后续已跑通：57 pass / 0 fail。
- 但工具返回后没有立即发送用户可见回执，导致界面继续显示“正在思考”，用户侧合理判断为卡住。

根因：

- 原规范只写了“超过 5 分钟无结论要汇报”，没有规定“每次工具调用返回后必须先汇报结果”。
- 进度 checklist 和用户可见消息没有绑定。
- 测试成功结果没有被当作必须立即汇报的事件。

修复项：

- `AGENTS.md` 增加“可见进度硬规则”和“长命令策略”。
- `CHECKLISTS.md` 增加 `Visible Progress Gate`。
- `PLAN.md` / `CURRENT_TASK.md` 切换到当前流程修复任务。

下一步建议：

1. 先完成本轮规则修复核对。
2. 再恢复 Main 日记事件闭环任务。
3. 恢复后必须在每个工具结果后立即发回执，尤其是测试成功/失败结果。

### 2026-05-25 - Main 日记事件闭环流程测试启动

已完成 State Refresh，并将 `PLAN.md` / `CURRENT_TASK.md` 切换到当前测试任务。

当前任务：

- 完成 dashboard `recent_events` 到 client 日记预填的跨端闭环。
- 修复 server 测试失败。
- 通过 Review/Test Gate 后分仓提交并 WSL 对齐。

当前已知风险：

- `bun test` 曾失败 2 个 `recent_events` 断言。
- `buddy-client/.tmp/` 未跟踪，必须排除。
- root 同时包含 agent 基础设施和 diary 契约改动，提交前需要核对范围。

### 2026-05-25

本轮目标是建立 Buddy Agent 工作规范文档，不继续改 client/server 业务代码。

已做：

- 重写父级 `AGENTS.md`，加入 Coordinator + Modes、闸门、三仓库边界和防堵塞规则。
- 重写父级 `PLAN.md`，让当前任务唯一指向 agent 工作规范与状态账本。
- 新增 `docs/agent/STATE.md`、`CURRENT_TASK.md`、`DECISIONS.md`、`HANDOFF.md`、`CHECKLISTS.md`。

未做：

- 未修复 Main 日记事件闭环测试失败。
- 未提交任何仓库。
- 未运行 client/server 业务验证。
- 未清理上一轮遗留改动。

当前已知未提交状态：

- root：`AGENTS.md`、`PLAN.md`、`docs/contracts/README.md`、`docs/contracts/diary.md`、`docs/agent/*`
- client：`assets/scripts/services/PetService.ts`、未跟踪 `.tmp/`
- server：`src/routes/pet.ts`、`tests/api.test.ts`

下一步建议：

1. 先运行 Review/Test Mode 的状态清单。
2. 决定是否继续 Main 日记事件闭环。
3. 若继续，先重建 Task Packet，再修 server 测试失败。
