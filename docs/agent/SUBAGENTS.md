# Buddy Subagents

## 目标

Buddy 子 agent 用来降低主控上下文压力，并把跨仓库任务拆成可审计、可回收的小块。子 agent 不是自动乱跑的并行机器人；它们必须由 Buddy Coordinator 明确启动、明确授权、明确回收。

## 总原则

- Coordinator 负责拆任务、授权、汇总和最终判断。
- 子 agent 默认只读，除非用户明确要求并且 Coordinator 明确分配写入范围。
- 子 agent 不直接提交、不推送、不运行 WSL 同步。
- 子 agent 必须报告：范围、读取文件、结论、风险、建议。
- 子 agent 返回后，Coordinator 必须先发用户可见回执，再继续下一步。

## 子 agent 类型

### Server Explorer

用途：只读检查 `buddy-server`。

允许：

- 阅读 `src/**`
- 阅读 `tests/**`
- 阅读 `prisma/schema.prisma`
- 阅读 `package.json`

禁止：

- 修改文件
- 运行破坏性命令
- 提交或推送

典型问题：

- dashboard 是否返回契约字段？
- `/events`、`/logs`、inventory、homework reward 是否一致？
- server 测试断言是否覆盖真实链路？

### Client Explorer

用途：只读检查 `buddy-client`。

允许：

- 阅读 `assets/scripts/**`
- 阅读 `package.json`、`tsconfig.json`
- 阅读本地 client 文档

禁止：

- 修改文件
- 提交 `.tmp/`
- 伪造后端状态建议

典型问题：

- API 类型是否匹配契约？
- `PetService` / `HomeworkService` 是否只使用后端快照？
- Main 面板是否把表现态写进正式日记或库存？

### Contract Explorer

用途：检查 `docs/contracts/` 与 client/server 代码是否一致。

允许：

- 阅读 `docs/contracts/**`
- 阅读相关 client/server API 类型、route、测试

禁止：

- 修改业务代码
- 自行扩展契约范围

典型问题：

- 本轮新增字段是否记录？
- 错误码和响应结构是否和测试一致？
- 客户端 fallback 边界是否清楚？

### Worker Subagent

用途：在用户明确允许时执行一个小范围实现。

硬规则：

- 必须有 disjoint write set。
- 必须知道自己不是唯一改动者。
- 不得 revert 他人改动。
- 必须列出修改文件。
- 不得提交或推送。

## 调用模板

### 只读 server smoke test

```text
你是 Buddy Server Explorer 子 agent。只读，不要修改任何文件。
任务：检查 E:\buddy\buddy-server 当前未提交改动中 <files> 是否符合 <contract/task>。
请输出：结论、证据、风险、建议。
```

### 只读 client smoke test

```text
你是 Buddy Client Explorer 子 agent。只读，不要修改任何文件。
任务：检查 E:\buddy\buddy-client 当前未提交改动中 <files> 是否符合 <contract/task>。
请输出：结论、证据、风险、建议。
```

### Worker 实现任务

```text
你是 Buddy Worker 子 agent。你不是唯一改动者，不要 revert 他人改动。
写入范围：<exact files/directories>
禁止修改：<exact files/directories>
任务：<small scoped implementation>
验证：<command or static check>
最终必须列出修改文件和验证结果。
```

## Coordinator 回收规则

- 子 agent 启动后，Coordinator 继续做非重叠工作。
- 等待子 agent 前必须说明正在等待哪个结论。
- 子 agent 返回后，Coordinator 先发可见回执，再整合判断。
- 如果子 agent 结论冲突，Coordinator 以代码证据和契约为准，并记录到 `HANDOFF.md`。
- 只读 explorer 默认等待上限为 120 秒。
- 超时未返回时，Coordinator 不继续空等；必须记录超时、关闭或搁置该子 agent，并由主线程或另一个更窄任务补查。
- 子 agent 超时本身要进入流程评估。

## Smoke Test 记录

2026-05-25：

- 已启动 Server Explorer：检查 `buddy-server/src/routes/pet.ts` 与 `tests/api.test.ts` 的 `recent_events` 实现。
- 已启动 Client Explorer：检查 `buddy-client/assets/scripts/services/PetService.ts` 的日记预填逻辑。
- 两者均为只读，不允许修改文件。
- Client Explorer 已返回：当前 `PetService` 方向可接受，风险是 `/events` 失败时“上次记录”文案可能不够准确。
- Server Explorer 120 秒等待超时，需要后续以更窄任务或主线程补查。
