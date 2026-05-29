# 当前任务：后端一致性与测试加固：学生端与家长侧响应契约

## 状态

实现和测试完成，等待 Review Gate 与用户确认提交。

## 目标

- 补齐 `docs/contracts/parent.md`。
- 更新 `docs/contracts/pet.md`、`docs/contracts/homework.md`、`docs/contracts/diary.md` 中学生端主链路字段。
- 在契约索引中登记 parent 契约。
- 加固 `buddy-server/tests/api.test.ts` 对学生端与家长侧响应字段的断言。
- 优先不改运行时代码；如果测试暴露真实缺口，再最小修复后端。

## 允许文件

- `buddy-server/tests/api.test.ts`
- `docs/contracts/README.md`
- `docs/contracts/pet.md`
- `docs/contracts/homework.md`
- `docs/contracts/diary.md`
- `docs/contracts/parent.md`
- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`

## 验证

- `buddy-server`: `bun test` 通过，57 pass / 0 fail，250 个断言。
- 待 Review Gate。
