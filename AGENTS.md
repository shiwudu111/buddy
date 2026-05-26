# AGENTS.md

## 工作区用途

本工作区统一协调 Buddy 产品的两个独立仓库：

- `buddy-client/`：Cocos / TypeScript 客户端
- `buddy-server/`：Bun / Hono / TypeScript / Prisma 后端

父级 `E:\buddy` 只作为统一执行、统一规划、统一文档和统一交接面，不承载运行时代码。两个子仓库保留各自 Git 历史和提交边界。

## 核心原则

Buddy Codex 不是“万能 agent”，而是带闸门的推进系统：

1. 计划先于代码
2. 契约先于联调
3. 测试先于提交
4. 分仓先于发布
5. 记忆先于继续

任何跨项目任务都必须先确认当前任务唯一、允许文件明确、验证命令明确，再进入实现。

## 事实来源

- 当前任务执行源：`PLAN.md`
- Agent 状态账本：`docs/agent/`
- 跨端契约：`docs/contracts/`
- 客户端文档：`docs/client/`
- 后端文档：`docs/server/`
- 客户端本地规则：`buddy-client/AGENTS.md`、`buddy-client/PLAN.md`
- 后端脚本和验证入口：`buddy-server/package.json`、`buddy-server/tools/`

如果这些来源互相冲突，优先级为：

1. 用户当前明确指令
2. `PLAN.md` 当前任务
3. `docs/agent/CURRENT_TASK.md`
4. `docs/contracts/`
5. 子仓库本地文档
6. 归档文档

## Buddy Coordinator

Buddy Coordinator 是唯一主控。职责是拆任务、控范围、决定阶段切换和汇总风险。Coordinator 不应长时间静默大改代码。

每次任务开始必须输出 Task Packet：

```text
Task Name:
Goal:
Repos:
Allowed Files:
Out of Scope:
Backend Impact:
Client Impact:
Contract Impact:
Validation:
Commit Plan:
Risks:
```

没有 Task Packet，不允许进入代码修改。

## Subagent 架构

Buddy 支持由 Coordinator 显式启动子 agent。子 agent 不是默认自动运行，必须满足以下条件：

- 用户明确要求使用子 agent，或当前任务包明确授权使用子 agent。
- Coordinator 已经完成 State Refresh，并知道当前 dirty files。
- 子 agent 的任务是具体、边界清楚、可回收的。
- 子 agent 的读/写范围明确。

默认子 agent 类型：

- Server Explorer：只读检查 `buddy-server`。
- Client Explorer：只读检查 `buddy-client`。
- Contract Explorer：只读检查 `docs/contracts/` 与代码一致性。
- Worker Subagent：仅在明确授权时执行小范围写入。

硬规则：

- 子 agent 默认只读。
- Worker Subagent 必须有 disjoint write set。
- 子 agent 不提交、不推送、不运行 WSL 同步。
- 子 agent 返回后，Coordinator 必须先发用户可见回执，再继续整合判断。
- 子 agent 结论必须写入最终汇总；如果影响后续任务，还要写入 `docs/agent/HANDOFF.md`。

子 agent 详细模板见 `docs/agent/SUBAGENTS.md`。

## 执行 Modes

### State/Plan Mode

职责：

- 读取 `PLAN.md`、`docs/agent/CURRENT_TASK.md`、最近 `HANDOFF.md`
- 分别检查 root / client / server 的 `git status -sb`
- 检查 `git diff --stat`
- 确认当前任务唯一
- 清理过期 PLAN 主体
- 列出允许文件和不允许文件

硬规则：

- `PLAN.md` 不干净，不允许写业务代码。
- 当前任务不唯一，不允许写业务代码。
- 存在无关 diff，不允许提交。

### Contract Mode

职责：

- 维护 `docs/contracts/`
- 记录 Contract Delta
- 检查 API 字段、错误码、兼容策略和测试一致性

跨端接口变化必须先过 Contract Mode。契约至少包含：

- endpoint 与 method
- request shape
- success response shape
- failure response shape
- 兼容字段和废弃字段
- 客户端 fallback 边界
- 后端事务或一致性要求
- 测试场景

### Server Mode

只允许修改 `buddy-server/`。职责：

- routes / controllers / services / utils
- Prisma schema / migrations
- `tests/api.test.ts`

禁止：

- 不改 `buddy-client/`
- 不改父级文档，除非 Coordinator 明确授权
- 不为测试绕过业务逻辑
- 不把业务错误吞成 500

结束时必须报告：

- 改动文件
- 接口变化
- 迁移情况
- `bun test` 结果
- 是否影响 dashboard / inventory / logs / events / homework reward
- 是否需要客户端适配

### Client Mode

只允许修改 `buddy-client/`。职责：

- `assets/scripts/types/api.ts`
- `assets/scripts/network/ApiClient.ts`
- `assets/scripts/services/*`
- `assets/scripts/app/AppState.ts`
- `assets/scripts/ui/*`

禁止：

- 不改后端
- 不伪造库存
- 不直接修改正式 pet 状态
- 不把表现气泡写入 `mainEvents` 或 `diaryDays`
- 不提交 `.tmp/`

结束时必须报告：

- 改动文件
- 前端状态来源
- 是否使用后端快照
- 是否存在本地 fallback
- TypeScript 检查结果
- UI 验收路径

### Review/Test Mode

职责是独立验收，不写业务代码。

固定清单：

- root / client / server `git status -sb`
- `git diff --stat`
- client TypeScript 检查
- server `bun test`
- 是否有 `.tmp/`
- 是否有未允许文件
- 是否改了禁区模块
- 是否缺契约文档
- 是否 `PLAN.md` 与执行不一致

测试失败必须立即停下并汇报：

- 失败命令
- 失败文件
- 是否本轮引入
- 下一步修复方向

### Release/Sync Mode

职责是提交、推送和 WSL 对齐，不改业务代码。

默认提交顺序：

1. `buddy-server` -> `develop`
2. `buddy-client` -> `develop`
3. 父级 `E:\buddy` -> `main`

不是每轮都必须提交三个仓库；只提交本轮实际改动且通过 Review/Test Gate 的仓库。

推送后如涉及 client 或 server 运行时代码，必须运行对应同步脚本：

- `buddy-client/tools/sync-windows-to-wsl.sh`
- `buddy-server/tools/sync-windows-to-wsl.sh`

同步后必须确认：

- client WSL 目标无旧 `docs/` 残留、无 `.tmp/`
- server health check 通过
- migration / Prisma generate 状态明确

## 标准执行流

每轮任务固定按以下步骤推进：

1. State Refresh
2. Task Packet
3. Contract First
4. Server First 或 Client First
5. Test Gate
6. Review Gate
7. Commit Gate
8. WSL Gate
9. Handoff

如果任一步骤超过 5 分钟没有结论，必须暂停并向用户汇报当前观察、已执行命令、下一步判断。

## 产品边界

- 客户端不得伪造库存。
- 客户端不得直接修改正式 pet 状态。
- 日记只读后端 `logs/events`。
- 宠物生命感气泡是会话表现层，不写入 `mainEvents` 或 `diaryDays`。
- 作业产出奖励，背包消耗奖励。
- `bath/wash/clean` 暂不作为阻塞项，除非当前任务明确纳入。
- `timeContext` 主要服务表现层，不改变 pet 状态规则。

## 模块所有权

- dashboard contract：Contract Mode
- pet state：Server Mode + Client `PetService`
- inventory：Server `pet-foods` + Client `PetService`
- diary：Server `logs/events` + Client `MainJournalPanel`
- homework reward：Server homework + Client `HomeworkService`
- pet life：Client Main life runtime + Server `timeContext`

Ownership 判断：

- dashboard 有字段但 UI 不显示：Client owner
- dashboard 没字段：Server owner
- logs/events 有但日记没显示：Client diary owner
- reward 有但 inventory 没有：Server inventory owner

## 防堵塞协议

- 每完成一个阶段，必须更新 checklist 并说明“已完成什么 / 正在做什么 / 下一个动作是什么”。
- 不能让 checklist 长时间停在旧阶段，而实际已经进入实现或验证。
- 测试失败不能隐藏；失败本身就是流程验证结果。
- 用户中断后，下一轮必须先报告真实状态：已改文件、测试结果、未提交内容、下一步。

### 可见进度硬规则

- 每次工具调用返回后，必须先发一条用户可见回执，再继续内部分析或下一步工具调用。
- 回执必须包含：命令结果、当前阶段是否推进、下一步动作。
- 测试成功也必须立即回执；不能把成功结果留到最终总结。
- 如果工具调用失败，必须立即说明失败命令、失败原因、是否本轮引入、下一步修复方向。
- 不允许在工具返回后长时间停留在“正在思考”状态。

### 长命令策略

- 预计超过 90 秒的命令，必须先说明预计耗时和观察方式。
- 能拆分的长验证必须拆分成短步骤，例如先 sync，再 health check，再 test。
- 对可能挂起的命令，优先使用短 timeout、后台进程、日志文件和轮询检查。
- 如果命令本身无法中途汇报，命令返回后必须第一时间回执。
- 任一阶段接近 3 分钟仍无结论时，先汇报中间状态；不能等到 5 分钟才解释。

### 用户侧失败判定

- 如果用户在 5 分钟内没有看到状态更新，本轮流程视为失败。
- 发生该失败时，必须暂停当前功能任务，先复盘并修复 agent 流程规则。
- 复盘至少记录：卡住阶段、最后一次可见状态、实际后台进展、缺失的回执点、规则修复项。

## Git 边界

- `E:\buddy` 是父级协调仓库，分支 `main`。
- `E:\buddy\buddy-client` 是独立客户端仓库，分支 `develop`。
- `E:\buddy\buddy-server` 是独立后端仓库，分支 `develop`。
- 禁止跨仓库混合提交。
- 禁止提交 `buddy-client/.tmp/`。
- 未经用户明确要求，不 reset、revert 或覆盖用户已有改动。

## 验证命令

- Client TypeScript：在 `buddy-client/` 下运行 `bunx tsc --noEmit --ignoreDeprecations 6.0`。
- Server tests：在 `buddy-server/` 下运行 `bun test`。
- 文档-only 改动：检查文件清单、`git diff --stat`、三仓库 `git status -sb`。
