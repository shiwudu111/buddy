# PLAN.md

## 当前任务

Buddy Agent 架构文档收口任务。

## Task Packet

```text
Task Name: Buddy Agent 架构文档收口任务
Goal: 标记 Agent 架构文档任务完成，把 agent 文档任务与 Main 日记事件闭环遗留改动彻底分开，并准备一个只包含 agent 架构文档的 root commit。
Repos: root
Allowed Files:
  root: AGENTS.md, PLAN.md, docs/agent/CURRENT_TASK.md, docs/agent/CHECKLISTS.md, docs/agent/HANDOFF.md, docs/agent/STATE.md, docs/agent/DECISIONS.md, docs/agent/SUBAGENTS.md
Out of Scope:
  不修改 buddy-client 业务代码；不修改 buddy-server 业务代码；不提交 buddy-client/.tmp/；不提交 docs/contracts/diary.md；不提交 Main 日记事件闭环相关文件；不运行破坏性 reset / revert。
Backend Impact: 无。本轮不触碰 buddy-server。
Client Impact: 无。本轮不触碰 buddy-client。
Contract Impact: 无。本轮不提交 docs/contracts/README.md 或 docs/contracts/diary.md。
Validation: root/client/server git status；root git diff --stat；人工核对待 add 文件只包含 agent 架构文档。
Commit Plan: 先不提交，等待用户确认。建议 root commit 仅包含 AGENTS.md、PLAN.md、docs/agent/*。
Risks: root 仍有 docs/contracts/README.md 与 docs/contracts/diary.md 的日记契约遗留；client/server 仍有 Main 日记事件闭环业务改动；提交时必须按文件精确 add。
```

## 完成状态

- Agent 架构文档任务已完成收口。
- `AGENTS.md` 已包含 Coordinator + Modes、三仓库边界、contracts-first、test-gate、review-gate、release-sync-gate、可见进度规则和子 agent 规则。
- `docs/agent/STATE.md` 已记录三仓库结构、验证命令、不可提交内容和当前风险。
- `docs/agent/CURRENT_TASK.md` 已切换为本轮文档收口状态。
- `docs/agent/DECISIONS.md` 已固化产品决策：前端不伪造库存、不直接改 pet、不写 diaryDays、作业产出背包消耗、bath 暂不阻塞。
- `docs/agent/HANDOFF.md` 已记录本轮完成内容、遗留内容和下一轮恢复顺序。
- `docs/agent/CHECKLISTS.md` 已包含 State、Contract、Server、Client、Review、Visible Progress、Subagent、Release/Sync 检查清单。
- `docs/agent/SUBAGENTS.md` 已记录子 agent 类型、授权边界、调用模板、回收规则和 smoke test 结果。

## 明确排除在本次提交外

- `docs/contracts/README.md`
- `docs/contracts/diary.md`
- `buddy-client/assets/scripts/services/PetService.ts`
- `buddy-client/.tmp/`
- `buddy-server/src/routes/pet.ts`
- `buddy-server/tests/api.test.ts`

这些文件属于下一轮“Main 日记事件闭环收口任务”或未跟踪临时目录，不属于本轮 agent 架构文档 commit。

## 下一步

1. 等待用户确认本轮 root commit 文件清单。
2. 用户确认后，只 add：
   - `AGENTS.md`
   - `PLAN.md`
   - `docs/agent/STATE.md`
   - `docs/agent/CURRENT_TASK.md`
   - `docs/agent/DECISIONS.md`
   - `docs/agent/HANDOFF.md`
   - `docs/agent/CHECKLISTS.md`
   - `docs/agent/SUBAGENTS.md`
3. 提交建议 message：`docs(agent): add coordinator workflow`
4. 提交完成后，恢复“Main 日记事件闭环收口任务”，按 server test -> client tsc -> contracts review -> 分仓提交 -> WSL sync 的顺序推进。
