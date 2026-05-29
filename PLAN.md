# PLAN.md

## 当前任务

家长中心组件化拆分。

上一轮家长中心 UI 与三栏交互已经通过 Cocos 人工验收，但实现集中在 `MainController.ts`。本轮目标是先做低风险结构拆分：把家长中心面板编排、三栏布局算法和类型从 Controller 中拆出，保持用户可见行为不变。

## Task Packet

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
Backend Impact: 无。
Client Impact: 仅结构拆分，家长中心行为保持不变。
Contract Impact: 无。
Validation:
  1. buddy-client: bunx tsc --noEmit --ignoreDeprecations 6.0
  2. root/client/server git status -sb
  3. Cocos 人工复验家长中心三栏点击、拉伸/压缩、刷新、退出
Commit Plan: 本轮先不提交，等用户确认。
Risks:
  1. 新增 Cocos TS 文件需要携带 .meta。
  2. 本轮只拆边界，不继续扩大 UI 或数据产品功能。
```

## 本轮已完成

- 新增 `ParentDashboardTypes.ts`，集中家长中心类型。
- 新增 `ParentColumnLayout.ts`，集中三栏宽度、位置、动画进度计算。
- 新增 `ParentDashboardPanel.ts`，承接家长中心顶层面板、顶部摘要区、三栏编排。
- `MainController.ts` 保留数据请求、状态和细节渲染能力，但主面板编排已改为调用新模块。
- `bunx tsc --noEmit --ignoreDeprecations 6.0` 已通过。

## 下一步

1. Review Gate：检查 root/client/server 状态和 diff。
2. 用户在 Cocos 中复验家长中心：刷新、退出、三栏点击、拉伸/压缩。
3. 通过后再分仓提交：client 提交组件化拆分，root 提交任务账本。
