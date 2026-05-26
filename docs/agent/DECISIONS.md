# Buddy Decisions

## 产品与状态决策

- 客户端不得伪造库存。
- 客户端不得直接修改正式 pet 状态。
- 日记只读后端 `logs/events`。
- 宠物生命感气泡属于会话表现层，不写入 `mainEvents` 或 `diaryDays`。
- 作业产出奖励，背包消耗奖励。
- 每日基础粮食不占用作业奖励。
- `timeContext` 只服务表现层，不改变 pet 状态规则。
- `bath/wash/clean` 暂不作为阻塞项，除非当前任务明确纳入。

## 工程决策

- 父级 `E:\buddy` 只做协调、文档、契约和 agent 账本。
- `buddy-client` 和 `buddy-server` 保持独立 Git 仓库。
- 跨端接口变化必须先更新 `docs/contracts/`。
- server/client/root 必须分仓提交。
- 涉及运行时代码后，推送完成必须执行 WSL 对齐。

## 模块所有权

- dashboard contract：Contract Mode
- pet state：Server Mode + Client `PetService`
- inventory：Server `pet-foods` + Client `PetService`
- diary：Server `logs/events` + Client `MainJournalPanel`
- homework reward：Server homework + Client `HomeworkService`
- pet life：Client Main life runtime + Server `timeContext`

