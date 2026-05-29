# 当前任务：家长中心组件化拆分

## 状态

实现完成，等待 Review Gate 与 Cocos 人工复验。

## 本轮目标

将家长中心 UI 和三栏交互从 `MainController.ts` 中拆出独立模块，保持现有行为不变。

## 已完成

- 新增 `buddy-client/assets/scripts/ui/main/parent/ParentDashboardTypes.ts`。
- 新增 `buddy-client/assets/scripts/ui/main/parent/ParentColumnLayout.ts`。
- 新增 `buddy-client/assets/scripts/ui/main/parent/ParentDashboardPanel.ts`。
- 新增对应 Cocos `.meta` 文件。
- 更新 `MainController.ts`：家长中心入口改为调用 `renderParentDashboardPanel`；三栏布局计算改为调用 `resolveParentColumnLayout`。
- Client TypeScript 检查通过。

## 未做

- 未修改 server。
- 未修改 API 契约。
- 未新增家长侧功能。
- 未提交、未推送、未 WSL 同步。

## 验证

- `bunx tsc --noEmit --ignoreDeprecations 6.0`：通过。
- 待检查三仓库状态。
- 待用户 Cocos 人工复验。
