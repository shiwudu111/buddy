# 当前任务：继续拆 MainController：家长中心三栏 section

## 状态

实现完成，等待 Review Gate 与 Cocos 人工复验。

## 已完成

- 新增 `buddy-client/assets/scripts/ui/main/parent/ParentSectionPanels.ts`。
- 新增 `ParentSectionPanels.ts.meta`。
- `MainController.ts` 的宠物成长、成长洞察、学习分析三栏内部渲染已迁出。
- Controller 继续保留数据请求、状态管理、格式化和业务回调。
- Client TypeScript 检查通过。

## 未做

- 未修改 server。
- 未修改 API 契约。
- 未提交、未推送、未 WSL 同步。

## 验证

- `bunx tsc --noEmit --ignoreDeprecations 6.0`：通过。
- 待 Review Gate。
- 待 Cocos 人工复验。
