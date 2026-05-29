# 当前任务：服务器云端迁移方案与环境清单

## 状态

目标一的云端迁移方案和环境清单已完成整理；server CORS/env 前置改造已在 buddy-server 的 deploy/cloud-staging-v1 分支完成并推送。当前等待 root 文档 Review Gate 和提交。

## 目标

- 明确 `buddy-server` 云端迁移路线。
- 明确云端环境变量和机器环境。
- 明确部署、migration、generate、restart、health check 和回滚要求。
- 记录 CORS 环境化已完成的 server 分支和提交。
## 允许文件

- `docs/agent/NEXT_VERSION_PLAN.md`
- `docs/server/CLOUD-MIGRATION-PLAN.md`
- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`

## 验证

- root/client/server 状态检查。
- 文档内容自检。
- 待 Review Gate。
