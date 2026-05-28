# PLAN.md

## 当前任务

Agent 账本编码修复与下一轮任务重置。

本轮只修复父级任务账本，不修改 `buddy-client/` 或 `buddy-server/` 业务代码。触发原因是 `PLAN.md`、`docs/agent/CURRENT_TASK.md`、`docs/agent/HANDOFF.md` 出现乱码，继续推进功能会重新引入 PLAN 失真风险。

## Task Packet

```text
Task Name: Agent 账本编码修复与下一轮任务重置
Goal: 修复 root 任务账本乱码，恢复可读中文，并准备下一轮开发入口。
Repos: root
Allowed Files:
  root: PLAN.md
  root: docs/agent/CURRENT_TASK.md
  root: docs/agent/HANDOFF.md
Out of Scope:
  不修改 buddy-client 业务代码。
  不修改 buddy-server 业务代码。
  不新增功能。
  不提交、不推送、不运行 WSL 同步。
Backend Impact: 无。
Client Impact: 无。
Contract Impact: 无。
Validation:
  1. root/client/server git status -sb
  2. root git diff --stat
  3. 人工核对账本文档为可读中文
Commit Plan: 本轮先不提交，等用户确认。
Risks:
  1. 旧 HANDOFF 历史已出现乱码，本轮只恢复关键交接事实，不逐字恢复所有历史流水。
  2. 后续每轮必须继续执行 State Refresh -> Task Packet -> Gate 流程。
```

## 当前真实状态

- root `E:\buddy`：`main`，已对齐 `origin/main`，本轮开始前 clean。
- client `E:\buddy\buddy-client`：`develop`，已对齐 `origin/develop`，本轮开始前 clean。
- server `E:\buddy\buddy-server`：`develop`，已对齐 `origin/develop`，本轮开始前 clean。
- 用户已确认上一轮 Cocos 人工验收通过。
- Release Smoke 已通过：client WSL check 正常，server health check 返回 `{"status":"ok","message":"Buddy API Server"}`。

## 已完成主线

1. Agent 架构文档与可见进度规则已建立。
2. Main 日记事件闭环已完成。
3. MVP API / 服务层冒烟链路已固化。
4. Cocos 项目导入与资源冲突已收口。
5. UI 主链路收口已完成：聊天入口、家长中心、父母绑定查看孩子宠物/周报、家长中心三栏 UI 与交互。
6. 三仓库已提交并推送。
7. WSL 同步和 Release Smoke 已通过。

## 下一轮建议任务

### 1. 家长中心组件化拆分

目标：把上一轮集中在 `MainController.ts` 的家长中心 UI 和三栏交互拆成更小的模块，降低后续维护成本。

建议范围：

- `buddy-client/assets/scripts/ui/main/MainController.ts`
- 新增 `buddy-client/assets/scripts/ui/main/parent/ParentDashboardPanel.ts`
- 新增 `buddy-client/assets/scripts/ui/main/parent/ParentColumnLayout.ts`
- 新增 `buddy-client/assets/scripts/ui/main/parent/ParentDashboardTypes.ts`

验收：

- `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。
- Cocos 人工复验家长中心三栏点击、拉伸/压缩、刷新、退出。
- 不改变 API 契约，不修改 server。

### 2. 家长中心数据产品化

目标：在组件化稳定后，补足更完整的家长视角数据洞察，例如趋势、上周对比、成长目标说明。

建议先 Contract First，再决定是否需要 server 字段。

### 3. 文档与验收记录补齐

目标：把已通过的 Cocos 人工验收和 Release Smoke 结果写入固定 checklist，减少后续重复口头确认。

## 当前执行建议

先完成本轮账本修复并让用户确认。确认后，下一轮优先进入“家长中心组件化拆分”，不要继续在 `MainController.ts` 中堆大块 UI 逻辑。
