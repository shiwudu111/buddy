# MVP 客户端真实点击验收清单

## 目标

验证 Cocos 客户端真实点击路径是否能贯通 MVP 主链路。

API smoke 只能证明后端和客户端服务层链路可用；本清单用于验证真实 UI 节点、按钮、页面切换、状态提示和数据刷新。

## 本轮 Task Packet

```text
Task Name: MVP Cocos UI 真实点击验收
Goal: 确认已通过 API/service smoke 的 MVP 主链路，是否也能通过 Cocos UI 真实点击完成。
Repos: root, buddy-client
Allowed Files:
  root: PLAN.md, docs/agent/CURRENT_TASK.md, docs/agent/HANDOFF.md
  root docs: docs/client/07-联调与测试/mvp-client-click-smoke-checklist.md
Out of Scope:
  不修改 buddy-client 业务代码。
  不修改 buddy-server 业务代码。
  不提交、不推送。
  不运行 WSL 同步。
Backend Impact: 无，本轮只读验证。
Client Impact: 无，本轮不改客户端代码，只记录 UI 验收状态。
Contract Impact: 无。
Validation:
  1. server health check
  2. WSL 内 MVP smoke
  3. client TypeScript 检查
  4. Cocos UI 人工点击记录
Commit Plan: 本轮先不提交，等待用户确认。
Risks:
  Codex 当前不能直接观察和操作 Cocos 原生窗口，真实点击结果需要用户人工执行或提供截图/日志。
```

## 前置条件

- 正确工程路径：`E:\buddy\buddy-client`。
- Cocos Creator：`C:\ProgramData\cocos\editors\Creator\3.8.7\CocosCreator.exe`。
- WSL 后端服务健康：`http://localhost:3000/` 返回 `{"status":"ok","message":"Buddy API Server"}`。
- 最终 smoke 在 WSL 内执行，Windows 侧 localhost 失败不能直接判定业务失败。

## 2026-05-27 自动基线结果

- Server health check：通过。
- Client TypeScript：通过，命令为 `bunx tsc --noEmit --ignoreDeprecations 6.0`。
- WSL MVP smoke：通过。
- Client commit：`69eed33 fix(cocos): resolve project import asset conflict`。
- Server commit：`9f889a8 feat(pets): surface dashboard recent events`。
- Cocos Creator 可执行文件：存在。
- 真实 Cocos UI 点击：待人工执行并记录。

WSL smoke 覆盖结果：

- child register：通过。
- child login：通过。
- create pet：通过。
- dashboard refresh：通过，`foods=1`，`inventory=1`，`recentEvents=1`。
- submit homework reward：通过，奖励为 `logic_cookie`。
- use inventory reward：通过。
- diary events：通过，包含 homework 与 reward 事件。
- chat send：通过。
- parent register：通过。
- parent bind child：通过。
- parent view child pet：通过。
- parent weekly report：通过。

## 真实点击验收路径

### 1. 登录 / 注册

操作：

- 打开 Login 场景。
- 注册新的学生账号。
- 或使用已有学生账号登录。

预期：

- 注册或登录成功。
- 自动进入 Main，或可通过登录进入 Main。
- 失败时显示后端错误，不出现乱码。

结果：

- 状态：通过。
- 备注：2026-05-28，学生新账号注册/登录成功。此前网络请求失败的原因是 WSL server 未监听 Windows 可访问的 `localhost:3000`；重启 server 后 Windows smoke 与 Cocos 登录链路恢复。

### 2. 创建或进入宠物主页

操作：

- 首次进入 Main。
- 如果无宠物，创建宠物。
- 如果已有宠物，直接进入主页。

预期：

- Main 显示宠物名称、等级、心情、饥饿等核心状态。
- 无宠物时有明确创建入口。
- 创建后 dashboard 能刷新并展示后端状态。

结果：

- 状态：通过。
- 备注：2026-05-28，Cocos UI 可创建或进入宠物主页。

### 3. Dashboard 刷新

操作：

- 在 Main 首屏等待自动同步，或触发刷新。

预期：

- 不出现长时间 loading。
- 同步成功时状态来自 dashboard。
- 同步失败时提示保留已有状态，不伪造成成功。

结果：

- 状态：通过。
- 备注：2026-05-28，Main 首屏 dashboard 刷新正常。

### 4. 提交作业获得奖励

操作：

- 打开作业中心。
- 选择数学作业。
- 上传或使用当前占位图片路径。
- 提交。

预期：

- 提交成功。
- 展示奖励信息，例如 `logic_cookie / 逻辑饼干`。
- 成功后触发 dashboard 或背包刷新。

结果：

- 状态：通过。
- 备注：2026-05-28，数学作业提交成功，返回 `rewardStatus=granted`，奖励为 `logic_cookie / 逻辑饼干 ×1`；`/status` 更新为 math 已提交，`/history?page=1&limit=5` 返回 1 条记录。重复提交时返回 `DUPLICATE_SUBMISSION`，错误提示明确。

### 5. 背包显示奖励

操作：

- 从作业结果页进入背包。
- 或从 Main 顶部/底部背包入口进入。

预期：

- 背包中出现 `logic_cookie / 逻辑饼干`。
- 数量与后端一致。
- 不出现“作业已奖励但背包为空”的矛盾状态。

结果：

- 状态：通过。
- 备注：2026-05-28，作业提交响应中 `foods` 与 `inventory` 均包含 `logic_cookie`，数量为 1。

### 6. 使用背包物品

操作：

- 点击逻辑饼干。
- 确认使用。

预期：

- 后端 `/inventory/use` 成功。
- 宠物状态刷新。
- 背包数量减少或消失。
- Main 反馈区显示真实使用结果。

结果：

- 状态：通过。
- 备注：2026-05-28，背包中使用逻辑饼干成功，返回 pet 最新状态、空 inventory/foods，以及 `inventory_food_use` 日志。基础口粮使用也成功。

### 7. 日记显示事件

操作：

- 打开日记页。

预期：

- 可先显示 dashboard 最近事件。
- 打开日记后刷新 `/events` 完整列表。
- 能看到作业、奖励、背包使用相关事件。
- 标题和详情分隔清晰，不出现乱码。

结果：

- 状态：通过。
- 备注：2026-05-28，打开日记页调用 `/events?limit=100` 成功，能看到 feed、reward、homework 事件；包含作业奖励和背包使用事件。

### 8. 聊天发送消息

操作：

- 打开聊天入口。
- 发送一条消息。

预期：

- 消息发送成功。
- 聊天历史刷新。
- 后端失败时 fallback 文案不污染正式日记或库存。

结果：

- 状态：失败。
- 备注：2026-05-28，Main 页面没有聊天入口。API smoke 中 chat send 已通过，因此当前缺口判断为客户端 UI 入口/路由缺失，不是后端接口不可用。

### 9. 家长侧绑定 / 查看

操作：

- 回到 Login。
- 注册或登录家长账号。
- 绑定刚才的学生账号。
- 查看孩子宠物状态和周报。

预期：

- 绑定成功。
- 家长侧可查看孩子宠物摘要。
- 周报展示作业统计。
- 家长侧只读，不直接修改孩子宠物状态。

结果：

- 状态：失败。
- 备注：2026-05-28，家长账号注册成功，返回 role=`PARENT`、childId=null；但页面进入学生端页面，没有绑定刚才学生账号的入口。当前缺口判断为客户端家长侧登录后路由/页面入口/绑定 UI 缺失。

## 通过标准

- 以上 9 个步骤都能通过真实 UI 点击完成。
- 每一步失败时都有明确错误提示或可定位日志。
- 客户端不伪造库存。
- 客户端不直接修改正式 pet 状态。
- 客户端不写入伪日记事件。
- API smoke 和 UI 点击验收结论一致。

## 阻塞边界

当前 Codex 可以完成：

- 检查 Cocos Creator 路径。
- 检查项目路径。
- 运行 server health check。
- 在 WSL 内运行 MVP smoke。
- 运行 client TypeScript 检查。
- 整理验收清单与记录模板。

当前 Codex 不能直接完成：

- 在 Cocos 原生窗口里替用户点击按钮。
- 直接观察 Cocos 原生窗口的视觉反馈。

要完成真实点击验收，需要：

- 用户按本清单点击并反馈结果。
- 或提供 Cocos Web build / 可自动化 preview 入口。
- 或提供每一步截图和日志，由 Codex 继续判断缺口。
## 2026-05-28 UI 主链路修复记录

本节用于覆盖历史记录中的第 8 / 9 步最新状态。

### 第 8 步：聊天发送消息

状态：已实现，待 Cocos 手动复验。

已修复：

- Main 顶部导航新增“聊天”入口。
- 聊天面板复用现有 `ChatService` / `ChatConversationCoordinator` / `ChatConversationView`。
- 发送消息后使用现有聊天历史状态，不写入日记或库存。

复验步骤：

1. 打开 Main。
2. 点击顶部“聊天”。
3. 输入一条消息并发送。
4. 确认聊天历史和 Main 反馈更新。

### 第 9 步：家长侧绑定 / 查看

状态：已实现，待 Cocos 手动复验。

已修复：

- PARENT 角色进入 Main 时显示“家长中心”，不再显示学生宠物主页。
- 家长中心提供绑定孩子、查看孩子宠物、查看周报、退出登录。
- 家长侧只读孩子数据，不直接修改孩子宠物状态。

复验步骤：

1. 注册或登录家长账号。
2. 确认进入“家长中心”。
3. 输入孩子用户名或 childId 并绑定。
4. 点击“查看孩子宠物”。
5. 点击“查看周报”。

验证命令：

- `bunx tsc --noEmit --ignoreDeprecations 6.0` 已通过。
