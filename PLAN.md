# PLAN.md

## 当前任务

后端一致性与测试加固：学生端与家长侧响应契约。

本轮执行后续规划第 4 项，目标是降低之后联调时“前后端各说各话”的概率。当前覆盖学生端主链路和家长中心：补齐 `pet` / `homework` / `parent` 契约，并加固 dashboard、作业奖励、库存使用、日记事件、家长宠物视图与周报的稳定结构测试。

## Task Packet

```text
Task Name: 后端一致性与测试加固：学生端与家长侧响应契约
Goal: 固化学生端主链路和家长中心依赖的响应字段，避免 UI 与后端字段理解偏差返工。
Repos: buddy-server, root
Allowed Files:
  buddy-server/tests/api.test.ts
  root/docs/contracts/README.md
  root/docs/contracts/pet.md
  root/docs/contracts/homework.md
  root/docs/contracts/diary.md
  root/docs/contracts/parent.md
  root/PLAN.md
  root/docs/agent/CURRENT_TASK.md
  root/docs/agent/HANDOFF.md
Out of Scope:
  不改 client。
  不新增接口。
  不做数据库 migration。
  不改变认证方式。
Backend Impact: 先补测试；只有测试暴露真实缺口时才最小修后端。
Client Impact: 无。
Contract Impact: 新增 parent 契约文档，补契约索引。
Validation:
  buddy-server: bun test
  root/client/server git status -sb
Commit Plan: 本轮先不提交，等用户确认。
```

## 本轮完成项

- 新增 `docs/contracts/parent.md`，固化家长绑定、孩子宠物视图、周报接口契约。
- 更新 `docs/contracts/README.md`，登记 parent 契约。
- 更新 `docs/contracts/pet.md`，补齐 dashboard、库存使用、dailyBasicFood、timeContext、recent_events 契约。
- 更新 `docs/contracts/homework.md`，补齐作业提交奖励、库存、日志和今日状态结构。
- 更新 `docs/contracts/diary.md`，明确 dashboard 预览与完整事件接口都属于学生端日记链路。
- 加固 `buddy-server/tests/api.test.ts` 家长侧断言：
  - 孩子宠物视图必须包含 `level`、`hunger`、`mood`、`energy`、`health`、`cleanliness`、`experience`、`stage`、`status`。
  - `energy` 与兼容字段 `health` 保持一致。
  - `today_homework` 稳定包含 `chinese`、`math`、`english`。
  - 周报必须包含 `childNickname`、`subject_breakdown` 和 `pet_status_summary`。
- 加固 `buddy-server/tests/api.test.ts` 学生端断言：
  - dashboard 的 `pet`、`foods`、`inventory`、`dailyBasicFood`、`timeContext`、`recent_events` 字段稳定。
  - 作业提交成功必须返回 `submission`、`reward`、`foods`、`inventory`、`logs`。
  - 库存使用必须返回 `pet`、`inventory`、`foods`、`logs`、`offlineDecay`。
  - 日记事件必须包含 `kind`、`title`、`detail`、`timestamp`。
- `bun test` 已通过：57 pass / 0 fail，250 个断言。

## 下一步

1. Review Gate 检查三仓库状态和 diff。
2. 用户确认后分仓提交 server 和 root。
3. 推送后运行 server WSL sync/check。
