# 当前任务：主链路回归资产固化

## 状态

实现中，等待验证。

## 本轮目标

把已经通过的 MVP 主链路验收、Release Smoke 和 WSL/Windows 运行边界固化成可重复使用的资产。

## 已完成

- 重写 `docs/client/07-联调与测试/mvp-client-click-smoke-checklist.md`。
- 新增 `docs/client/07-联调与测试/release-smoke-checklist.md`。
- 增强 `tools/smoke-mvp-flow.mjs`：
  - 每个步骤开始时输出当前阶段。
  - 失败时输出 `Current step` 和 `Base URL`。
  - 失败提示固定包含 WSL smoke 推荐命令。
  - 作业奖励未返回可用背包物品时明确停止。

## 未做

- 未修改 `buddy-client/` 业务代码。
- 未修改 `buddy-server/` 业务代码。
- 未提交、未推送、未 WSL 同步。

## 验证

- 待运行 `node tools/smoke-mvp-flow.mjs` 或 WSL smoke。
- 待检查 root/client/server status。
