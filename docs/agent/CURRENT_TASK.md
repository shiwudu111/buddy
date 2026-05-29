# 当前任务：学生端主链路体验 polish

## 状态

实现完成，等待 Review Gate 与 Cocos 人工复验。

## 已完成

- `MainController.ts` 优化作业奖励、背包使用、日记同步失败的主链路反馈。
- `MainBagPanel.ts` 优化背包空状态文案和口粮选择表头。
- 未改后端，未改契约，未伪造库存或宠物状态。
- Client TypeScript 检查通过。
- MVP smoke 通过。

## 未做

- 未修改 server。
- 未修改 API 契约。
- 未提交、未推送、未 WSL 同步。

## 验证

- `bunx tsc --noEmit --ignoreDeprecations 6.0`：通过。
- `node tools/smoke-mvp-flow.mjs`：通过，12 个步骤 PASS。
- 待 Review Gate。
- 待 Cocos 人工复验学生端作业、背包、日记主链路。
