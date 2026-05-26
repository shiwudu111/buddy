# Buddy Agent Checklists

## State Refresh

- [ ] root `git status -sb`
- [ ] client `git status -sb`
- [ ] server `git status -sb`
- [ ] root `git diff --stat`
- [ ] client `git diff --stat`
- [ ] server `git diff --stat`
- [ ] 检查 `buddy-client/.tmp/`
- [ ] 检查 `PLAN.md` 是否是当前任务
- [ ] 检查 `docs/agent/CURRENT_TASK.md`
- [ ] 检查最近 `docs/agent/HANDOFF.md`

## Task Packet

- [ ] Task Name
- [ ] Goal
- [ ] Repos
- [ ] Allowed Files
- [ ] Out of Scope
- [ ] Backend Impact
- [ ] Client Impact
- [ ] Contract Impact
- [ ] Validation
- [ ] Commit Plan
- [ ] Risks

## Contract Gate

- [ ] endpoint / method
- [ ] request shape
- [ ] success response shape
- [ ] failure response shape
- [ ] 兼容字段
- [ ] 废弃字段
- [ ] 前端 fallback 边界
- [ ] 后端事务要求
- [ ] 测试场景

## Server Gate

- [ ] 只修改 `buddy-server/`
- [ ] 测试与实现同步
- [ ] 无无关迁移
- [ ] `bun test` 已运行
- [ ] 失败已汇报并定位
- [ ] API 变化已同步契约

## Client Gate

- [ ] 只修改 `buddy-client/`
- [ ] 不伪造库存
- [ ] 不伪造 pet 状态
- [ ] 不把表现气泡写入日记
- [ ] `.tmp/` 未暂存
- [ ] TypeScript 检查已运行

## Review Gate

- [ ] 三仓库 status 已检查
- [ ] diff --stat 已检查
- [ ] 允许文件已核对
- [ ] contracts 已同步
- [ ] PLAN.md 已同步
- [ ] 测试结果已记录
- [ ] 无 `.tmp/` 暂存

## Visible Progress Gate

- [ ] 每次工具调用返回后已先发用户可见回执
- [ ] 回执包含结果、阶段状态、下一步动作
- [ ] 长命令已提前说明预计耗时和观察方式
- [ ] 超过 90 秒的任务已拆分或使用日志/轮询
- [ ] 测试成功已立即汇报
- [ ] 测试失败已立即汇报失败命令、失败原因和修复方向
- [ ] checklist 状态与真实执行阶段一致
- [ ] 任一阶段接近 3 分钟无结论时已主动汇报
- [ ] 用户 5 分钟无更新失败规则已被纳入判断

## Subagent Gate

- [ ] 用户或 Task Packet 明确授权使用子 agent
- [ ] State Refresh 已完成
- [ ] 子 agent 类型已明确
- [ ] 子 agent 读/写范围已明确
- [ ] 默认只读，除非明确授权 Worker 写入
- [ ] Worker 子 agent 有 disjoint write set
- [ ] 子 agent 不提交、不推送、不运行 WSL 同步
- [ ] Coordinator 启动子 agent 后继续做非重叠工作
- [ ] 子 agent 返回后已先发用户可见回执
- [ ] 子 agent 超过等待上限时已记录超时并停止空等
- [ ] 子 agent 结论已进入最终汇总或 HANDOFF

## Release / Sync Gate

- [ ] server commit hash
- [ ] client commit hash
- [ ] root commit hash
- [ ] push 状态
- [ ] client WSL sync 状态
- [ ] server WSL sync 状态
- [ ] migration 状态
- [ ] Prisma generate 状态
- [ ] health check 状态
