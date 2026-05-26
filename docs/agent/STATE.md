# Buddy Agent State

## 稳定事实

- 父级工作区：`E:\buddy`
- 父级仓库分支：`main`
- 客户端仓库：`E:\buddy\buddy-client`
- 客户端分支：`develop`
- 后端仓库：`E:\buddy\buddy-server`
- 后端分支：`develop`
- 父级工作区只管理规划、文档、契约和 agent 账本，不承载运行时代码。
- `buddy-client/` 与 `buddy-server/` 是独立 Git 仓库，不能混合提交。

## 运行与验证

- Client TypeScript：在 `buddy-client/` 下运行 `bunx tsc --noEmit --ignoreDeprecations 6.0`。
- Server tests：在 `buddy-server/` 下运行 `bun test`。
- Client WSL 同步：`wsl.exe -d Ubuntu-24.04 -- sh /mnt/e/buddy-client/tools/sync-windows-to-wsl.sh`
- Server WSL 同步：`wsl.exe -d Ubuntu-24.04 -- sh /mnt/e/buddy-server/tools/sync-windows-to-wsl.sh`

## 不可提交内容

- `buddy-client/.tmp/`
- `node_modules/`
- Cocos 构建缓存：`library/`、`temp/`、`local/`、`build/`
- server 构建产物和日志：`dist/`、`*.log`、`server.err.log`、`server.out.log`

## 当前风险

- `PLAN.md` 曾出现旧任务主体和新任务补充混杂，后续必须先清理计划再改代码。
- Main 日记事件闭环任务存在未完成代码改动和失败测试，需要单独恢复。
- `MainController.ts` 规模较大，后续新增 Main 功能优先拆 panel / helper / service。
- `src/routes/pet.ts` 聚合了多条宠物链路，后续复杂逻辑应下沉到 service。
- `tests/api.test.ts` 覆盖广但较大，新增断言要注意事件产生时机。

