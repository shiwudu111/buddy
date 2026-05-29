# PLAN.md

## 当前任务

服务器云端迁移方案与环境清单。

下一版本三大目标已经明确。当前进入目标一的第一步：只写云端迁移方案和环境清单，不改 server 运行代码，为后续 CORS 环境化、部署脚本和云端 smoke 做准备。

## Task Packet

```text
Task Name: 服务器云端迁移方案与环境清单
Goal: 明确 buddy-server 云端迁移路线、环境变量、机器环境、部署/健康检查/回滚要求。
Repos: root
Allowed Files:
  root/docs/agent/NEXT_VERSION_PLAN.md
  root/docs/server/CLOUD-MIGRATION-PLAN.md
  root/PLAN.md
  root/docs/agent/CURRENT_TASK.md
  root/docs/agent/HANDOFF.md
Out of Scope:
  不改 buddy-client。
  不改 buddy-server。
  不做新功能。
  不提交、不推送，除非用户确认。
Backend Impact: 无。
Client Impact: 无。
Contract Impact: 无。
Validation:
  root/client/server git status -sb
  文档内容自检：迁移路线、环境变量、部署命令、验收门槛和风险是否清楚
Commit Plan: 本轮先不提交，等用户确认。
```

## 本轮完成项

- 全链路测试已通过：
  - `node tools\release-sync.mjs --plan`：ready for release actions。
  - client `bunx tsc --noEmit --ignoreDeprecations 6.0`：通过。
  - server `bun test`：57 pass / 0 fail，250 个断言。
  - root `node tools\smoke-mvp-flow.mjs`：12 个步骤 PASS。
  - client WSL sync/check：`tmp_absent`、`docs_absent`。
  - server WSL sync/check：migrate 无 pending，generate 成功，服务健康。
- 已新增下一版本规划文档，围绕三个目标：
  - 服务器云端迁移。
  - 客户端可提交，手机端可以体验测试，支持热更新。
  - 学生端主链路体验优化，目标满足用户一日内完整体验。
- 已新增 `docs/server/CLOUD-MIGRATION-PLAN.md`，记录云端迁移方案与环境清单。

## 下一步

1. Review Gate 检查三仓库状态和 diff。
2. 用户确认后提交 root。
