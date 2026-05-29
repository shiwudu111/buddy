# PLAN.md

## 当前任务

继续拆 MainController：家长中心三栏 section。

本轮执行后续规划第 2 项，把家长中心从“能维护”推进到“好维护”。当前拆分目标是把宠物成长、成长洞察、学习分析三栏内部渲染从 `MainController.ts` 中拆出，保持 UI 行为不变。

## Task Packet

```text
Task Name: 继续拆 MainController：家长中心三栏 section
Goal: 把 ParentPetGrowthPanel、ParentHomeworkAnalysisPanel、ParentInsightPanel 从 MainController.ts 拆进 parent/ 模块，保持 UI 行为不变。
Repos: buddy-client, root
Allowed Files:
  buddy-client/assets/scripts/ui/main/MainController.ts
  buddy-client/assets/scripts/ui/main/parent/*
  root/PLAN.md
  root/docs/agent/CURRENT_TASK.md
  root/docs/agent/HANDOFF.md
Out of Scope:
  不改 server。
  不改 API 契约。
  不改视觉效果和交互规则。
Backend Impact: 无。
Client Impact: 仅结构拆分。
Contract Impact: 无。
Validation:
  buddy-client: bunx tsc --noEmit --ignoreDeprecations 6.0
  root/client/server git status -sb
  Cocos 人工复验三栏
Commit Plan: 本轮先不提交，等用户确认。
```

## 本轮完成项

- 新增 `ParentSectionPanels.ts`，承接宠物成长、成长洞察、学习分析三栏内部渲染。
- 新增对应 `.meta` 文件。
- `MainController.ts` 删除三栏 section 渲染实现，改为传入数据和回调调用新模块。
- `bunx tsc --noEmit --ignoreDeprecations 6.0` 已通过。

## 下一步

1. Review Gate 检查三仓库状态和 diff。
2. 用户 Cocos 复验家长中心三栏。
3. 通过后分仓提交 client 和 root。
