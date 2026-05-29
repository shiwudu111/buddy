# PLAN.md

## 当前任务

学生端主链路体验 polish。

本轮执行后续规划第 3 项，把学生端从“功能通”推进到“体验顺”。当前只收口学生端“作业奖励 -> 背包 -> 使用 -> 日记”的反馈文案、空状态提示和同步失败提示，不改后端、不改接口契约。

## Task Packet

```text
Task Name: 学生端主链路体验 polish
Goal: 让作业奖励、背包使用、日记同步失败这些关键反馈更清楚，减少人工验收时的误判。
Repos: buddy-client, root
Allowed Files:
  buddy-client/assets/scripts/ui/main/MainController.ts
  buddy-client/assets/scripts/ui/main/MainBagPanel.ts
  buddy-client/assets/scripts/ui/main/MainJournalPanel.ts
  root/PLAN.md
  root/docs/agent/CURRENT_TASK.md
  root/docs/agent/HANDOFF.md
Out of Scope:
  不改 server。
  不改 API 契约。
  不做大规模 UI 重构。
  不伪造库存、不直接修改正式 pet 状态、不写 diaryDays。
Backend Impact: 无。
Client Impact: 仅学生端主链路反馈文案和提示。
Contract Impact: 无。
Validation:
  buddy-client: bunx tsc --noEmit --ignoreDeprecations 6.0
  root: node tools/smoke-mvp-flow.mjs
  root/client/server git status -sb
  Cocos 人工复验学生端作业、背包、日记主链路
Commit Plan: 本轮先不提交，等用户确认。
```

## 本轮完成项

- `MainController.ts` 调整作业奖励、背包使用、日记同步失败的主链路反馈。
- `MainBagPanel.ts` 将口粮选择表头改为中文，并优化背包空状态引导。
- `bunx tsc --noEmit --ignoreDeprecations 6.0` 已通过。
- `node tools/smoke-mvp-flow.mjs` 已通过，12 个主链路步骤 PASS。

## 下一步

1. Review Gate 检查三仓库状态和 diff。
2. 用户 Cocos 复验学生端作业、背包、日记主链路。
3. 通过后分仓提交 client 和 root。
