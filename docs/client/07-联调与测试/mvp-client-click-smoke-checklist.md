# MVP 客户端真实点击验收清单

## 目标

验证 Cocos 客户端真实点击路径是否能贯通 Buddy MVP 主链路。API smoke 只能证明后端和客户端服务层可用；本清单用于验证真实 UI 节点、按钮、页面切换、状态提示和数据刷新。

## 当前基线

- 项目路径：`E:\buddy\buddy-client`
- Cocos Creator：`C:\ProgramData\cocos\editors\Creator\3.8.7\CocosCreator.exe`
- 打开命令：`& "C:\ProgramData\cocos\editors\Creator\3.8.7\CocosCreator.exe" --path "E:\buddy\buddy-client"`
- Windows 是研发修改调试区。
- WSL 是最终运行维护和 smoke 验证区。
- Windows 侧 localhost 失败时，不直接判定业务失败；最终以 WSL 内 health check 和 smoke 为准。

## 自动基线

Release Smoke 通过条件：

- server health check 返回 `{"status":"ok","message":"Buddy API Server"}`。
- `node tools/smoke-mvp-flow.mjs` 覆盖完整 API 主链路。
- client `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。
- client WSL sync check 返回 `tmp_absent` 和 `docs_absent`。

WSL smoke 推荐命令：

```powershell
wsl.exe -d Ubuntu-24.04 -- sh -lc "cd /mnt/e/buddy && BUDDY_API_BASE_URL=http://localhost:3000/api/v1 node tools/smoke-mvp-flow.mjs"
```

## 真实点击路径

### 1. 登录 / 注册

操作：注册新的学生账号，或使用已有学生账号登录。

期望：

- 注册或登录成功。
- 自动进入 Main，或可通过登录进入 Main。
- 失败时显示后端错误，不出现乱码。

当前状态：通过。

### 2. 创建或进入宠物主页

操作：首次进入 Main 时创建宠物；已有宠物时直接进入主页。

期望：

- Main 显示宠物名称、等级、心情、饥饿等核心状态。
- 无宠物时有明确创建入口。
- 创建后 dashboard 能刷新并展示后端状态。

当前状态：通过。

### 3. Dashboard 刷新

操作：在 Main 首屏等待自动同步，或触发刷新。

期望：

- 不出现长时间 loading。
- 成功时状态来自 dashboard。
- 失败时提示保留已有状态，不伪造成成功。

当前状态：通过。

### 4. 提交作业获得奖励

操作：打开作业中心，选择科目，上传或使用占位图片，提交。

期望：

- 提交成功。
- 展示奖励信息，例如 `logic_cookie / 逻辑饼干`。
- 成功后触发 dashboard 或背包刷新。
- 重复提交时显示明确错误。

当前状态：通过。

### 5. 背包显示奖励

操作：从作业结果页或 Main 背包入口进入背包。

期望：

- 背包显示作业奖励。
- 数量与后端一致。
- 不出现“作业已奖励但背包为空”的矛盾状态。

当前状态：通过。

### 6. 使用背包物品

操作：点击奖励食物并确认使用。

期望：

- 后端 `/inventory/use` 成功。
- 宠物状态刷新。
- 背包数量减少或消失。
- Main 反馈区显示真实使用结果。

当前状态：通过。

### 7. 日记显示事件

操作：打开日记页。

期望：

- 可先显示 dashboard 最近事件。
- 打开日记后刷新 `/events` 完整列表。
- 能看到作业、奖励、背包使用相关事件。
- 标题和详情分隔清晰，不出现乱码。

当前状态：通过。

### 8. 聊天发送消息

操作：打开 Main 聊天入口，发送一条消息。

期望：

- 消息发送成功。
- 聊天历史刷新。
- 后端失败时 fallback 文案不污染正式日记或库存。

当前状态：通过。

### 9. 家长侧绑定 / 查看

操作：注册或登录家长账号，绑定学生账号，查看孩子宠物和周报。

期望：

- PARENT 角色进入家长中心。
- 可绑定孩子。
- 可查看孩子宠物摘要。
- 可查看周报。
- 家长侧只读孩子数据，不直接修改孩子宠物状态。

当前状态：通过。

## 通过标准

- 以上 9 步都能通过真实 UI 点击完成。
- 每一步失败时都有明确错误提示或可定位日志。
- 客户端不伪造库存。
- 客户端不直接修改正式 pet 状态。
- 客户端不写入伪日记事件。
- API smoke 和 UI 点击验收结论一致。

## 阻塞边界

Codex 可以完成：检查路径、运行 health check、运行 WSL smoke、运行 client TypeScript、整理验收清单。

Codex 当前不能直接完成：在 Cocos 原生窗口里替用户点击按钮，或直接观察 Cocos 原生窗口视觉反馈。
