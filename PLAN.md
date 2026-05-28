# PLAN.md

## 当前任务

后续开发待办清单与执行顺序收口。

本轮只做父级规划，不修改 `buddy-client/` 或 `buddy-server/` 业务代码。

## Task Packet

```text
Task Name: Buddy 后续开发待办清单
Goal: 将后续工作按可执行顺序排成清单，作为后续每轮任务的统一入口。
Repos: root
Allowed Files:
  root: PLAN.md, docs/agent/CURRENT_TASK.md, docs/agent/HANDOFF.md
Out of Scope:
  不修改 buddy-client 业务代码。
  不修改 buddy-server 业务代码。
  不提交、不推送。
  不运行 WSL 同步。
Backend Impact: 无，本轮不改后端。
Client Impact: 无，本轮不改客户端。
Contract Impact: 无，本轮不改契约字段。
Validation:
  1. root/client/server git status -sb
  2. root git diff --stat
  3. 核对待办顺序是否符合 MVP 收口路线
Commit Plan: 本轮先不提交，等待用户确认。
Risks:
  1. 旧 PLAN/CURRENT_TASK 曾出现乱码和过期任务，后续必须以本文件当前任务为准。
  2. Windows 是研发修改区，WSL 是最终运行维护和 smoke 验证区。
  3. 任何超过 5 分钟无可见进度的执行都视为流程失败，需要先修复流程。
```

## 后续待办队列

### 1. MVP Cocos UI 真实点击验收

目标：确认当前 API/service 主链路是否已经在 Cocos UI 中真实可用。

当前状态：自动基线已完成，真实 Cocos 原生窗口点击待人工执行。

已完成：

- Server health check 通过。
- Client TypeScript 检查通过。
- WSL MVP smoke 通过。
- Cocos Creator 可执行文件存在。
- 点击验收清单已重建为可读中文。

阻塞边界：

- Codex 当前不能直接观察和操作 Cocos 原生窗口。
- 需要用户按清单人工点击并反馈结果，或提供 Web build / preview 自动化入口。

验收路径：

1. 登录/注册。
2. 创建或进入宠物主页。
3. dashboard 刷新。
4. 提交作业获得奖励。
5. 背包显示奖励。
6. 使用背包物品。
7. 日记显示事件。
8. 聊天发送消息。
9. 家长侧绑定、查看孩子、查看宠物或周报。

产出：

- 更新 `docs/client/07-联调与测试/mvp-client-click-smoke-checklist.md` 的真实验收记录。
- 标出 UI 已通、接口已通但 UI 未通、需要修复的阻塞项。

### 2. MVP 缺口清单与修复顺序

目标：把“离完整产品还差什么”拆成模块化缺口，不再散点推进。

当前初稿：

| 模块 | 当前状态 | Owner | 下一步 |
| --- | --- | --- | --- |
| 登录/账号 | UI 通过 | client | 保持；后续只补乱码文案 |
| 宠物主页 | UI 通过 | client | 保持；继续观察主页状态刷新 |
| dashboard | UI 通过 | client/server | 保持；后续补失败态文案 |
| 作业奖励 | UI 通过 | client/server | 保持；重复提交错误提示已验证 |
| 背包消耗 | UI 通过 | client/server | 保持；后续确认使用后局部刷新体验 |
| 日记事件 | UI 通过 | client/server | 保持；后续统一事件 detail 展示文案 |
| 聊天 | 已实现，待 Cocos 手动复验 | client | Main 顶部新增“聊天”入口，接入现有 ChatService/ChatConversationView |
| 家长侧 | 已实现，待 Cocos 手动复验 | client | PARENT 角色进入家长中心，提供绑定孩子账号、查看孩子宠物与周报入口 |
| Cocos UI/资源 | Cocos 可打开，资源冲突已修过 | client | 真实点击观察是否还有资源/窗口错误 |
| WSL 运行 | health 与 smoke 已通，仍有 networking 噪声 | WSL | 继续观察，不作为当前阻塞 |

当前定稿结论：

- 第 1-7 步真实 UI 验收通过。
- 第 8 步失败：客户端没有聊天入口，但服务层与 API smoke 已通过。
- 第 9 步失败：家长账号注册成功，但登录后进入学生端 Main，缺少家长侧绑定/查看入口。
- 下一轮最小修复任务应聚焦 client UI，不需要改 server 契约或数据库。

模块：

- 登录/账号。
- 宠物主页。
- dashboard。
- 作业奖励。
- 背包消耗。
- 日记事件。
- 聊天。
- 家长侧。
- Cocos UI/资源。
- WSL 运行、同步、健康检查。

产出：

- 每个模块的状态：已通 / 部分通 / 未通 / 阻塞。
- 每个缺口对应 owner：client / server / contract / docs / WSL。
- 下一轮最小修复任务。

### 3. UI 主链路收口

目标：优先修“用户真正点不通”的问题，而不是扩新功能。

优先检查：

- 加载态、空状态、错误态。
- 按钮重复点击防护。
- 接口失败后的提示。
- 作业奖励进入背包后的 UI 刷新。
- 使用物品后的 dashboard 和日记刷新。
- 家长侧入口和绑定反馈。

产出：

- 小范围 client 改动。
- `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。
- Cocos UI 路径复验。

### 4. Contract 补齐与文档去重

目标：保证前后端字段、文档和测试不再靠记忆对齐。

优先检查：

- `docs/contracts/auth.md`
- `docs/contracts/pet.md`
- `docs/contracts/homework.md`
- `docs/contracts/diary.md`
- `docs/contracts/README.md`

产出：

- 契约字段与 server/client 当前实现一致。
- 旧文档中冲突信息标记归档，不作为当前标准。

### 5. 自动化验收增强

目标：减少手写脚本和人工误判。

优先增强：

- `tools/smoke-mvp-flow.mjs` 增加更清晰的失败定位。
- 增加 WSL 默认运行说明。
- 将 Cocos 手工验收结果格式固定化。
- 必要时为 server/client 加最小回归测试。

产出：

- WSL 内 smoke 稳定通过。
- Windows localhost 失败时不误判业务失败。

### 6. 家长侧与学习闭环 MVP

目标：把当前“能调用接口”推进到“用户能理解和使用”。

范围：

- 家长绑定状态。
- 孩子/宠物展示。
- 周报或学习记录展示。
- 作业结果与奖励解释。

产出：

- contract first。
- server/client 小闭环。
- smoke + UI 验收。

### 7. 产品体验与宠物生命感

目标：在主链路稳定后，再增强表现层。

范围：

- 宠物 idle 表现。
- timeContext 表现。
- 生命感气泡。
- 轻量动画和反馈。

边界：

- 不写入正式 pet 状态。
- 不写入 `mainEvents` 或 `diaryDays`。
- 不影响背包、日记、作业真实业务链路。

## 当前执行建议

当前第 1 项已完成真实点击验收，第 2 项缺口清单已定稿。第 3 项 `UI 主链路收口` 已完成代码实现，聊天入口与家长侧入口待 Cocos 手动复验。

执行节奏固定为：

1. State Refresh。
2. Task Packet。
3. 读取现有 Cocos 点击验收清单。
4. 人工或半自动执行点击路径。
5. 记录阻塞项。
6. 输出第 2 项“缺口清单”的初稿。
7. 等用户确认后再进入代码修复。
