# Buddy Agent Handoff

## 2026-06-01 - Agent 账本编码修复

### 本轮原因

进入下一阶段前执行 State Refresh，发现 `PLAN.md`、`docs/agent/CURRENT_TASK.md`、`docs/agent/HANDOFF.md` 读取结果出现明显乱码。由于这些文件是 Buddy Coordinator 的事实来源，若不先修复，会导致后续任务目标失真。

### 本轮处理

- 重写 `PLAN.md` 为可读中文。
- 重写 `docs/agent/CURRENT_TASK.md` 为可读中文。
- 重写 `docs/agent/HANDOFF.md` 为可读中文。
- 仅保留当前阶段需要的关键事实、边界和下一阶段建议。
- 未修改 `buddy-client`。
- 未修改 `buddy-server`。
- 未触碰云服务器、RDS、Nginx、systemd。
- 未提交、未推送。

## 2026-06-01 - 云端事件文案一致性修复

### 本轮原因

Cloud Staging + Cocos 人工验收发现两个用户可见文案问题：

- 基础口粮事件写死“小橘”。
- `/events` feed detail 暴露 `normal meal_box`、`premium logic_cookie` 等技术字段。

### 本轮处理

- `buddy-server/src/routes/pet.ts`
  - 新增食品质量中文映射。
  - 复用作业奖励食品名称映射生成 feed 事件文案。
  - 基础口粮文案改为“今日基础口粮已送达，记得照顾宠物哦。”
- `buddy-server/tests/api.test.ts`
  - 更新 diary logs 断言。
  - 扩大 persistent events 查询 limit，避免被历史事件窗口影响。
  - 增加 feed 事件不包含内部技术字段的断言。

### 验证结果

- 已同步到本机 WSL 运行区并重启本地 server。
- WSL 本地 server health check 通过。
- `buddy-server`: `bun test` 通过，57 pass / 0 fail，253 个断言。

### 未做

- 未修改 `buddy-client`。
- 未修改数据库 schema。
- 未做 Prisma migration。
- 未改 API 字段结构。
- 未碰云服务器、RDS、Nginx、systemd。
- 未部署云端。
- 未提交、未推送。

## 最近已完成阶段：Cloud Staging 客户端接入验证

### Root / Client 提交

- root `main`: `78cd153 docs(agent): record cloud client override validation`
- client `develop`: `6dc564d feat(api): add cloud staging base override`
- server `deploy/cloud-staging-v1`: `b1c400a fix(prisma): make homework date migration replayable`

### 关键结论

- 客户端默认 API base 仍为 `http://localhost:3000/api/v1`。
- 客户端支持临时 override：
  - `globalThis.BUDDY_API_BASE_URL`
  - `localStorage["BUDDY_API_BASE_URL"]`
- Cocos 预览中设置 `BUDDY_API_BASE_URL=http://101.133.130.137/api/v1` 后，请求已成功打到云端。
- Cloud CORS 已允许：
  - `http://localhost:7456`
  - `http://127.0.0.1:7456`
- Cocos 预览本地模式通过。
- Cocos 预览云端模式通过。
- UTF-8 中文宠物名、dashboard、recent_events、events 均正常。
- 背包使用每日基础口粮通过。
- 作业图片上传、语文作业提交、奖励进入背包、作业状态和历史刷新通过。

### 云端事实

- 公网入口暂为 `http://101.133.130.137/`。
- API base 暂为 `http://101.133.130.137/api/v1`。
- systemd 服务：`buddy-server.service`。
- Nginx 80 端口反代到 `127.0.0.1:3000`。
- 不开放公网 3000。
- 不开放公网 5432。
- RDS PostgreSQL 16 通过内网互通连接。

### 安全边界

- 不把 `.env.production`、数据库密码、JWT_SECRET、token 写入文档或提交。
- 不重置 RDS。
- 不轮换 JWT_SECRET，除非用户单独确认。
- 不把 PowerShell 中文乱码直接判定为后端存储问题。
- Windows `curl.exe -d "{\"...\"}"` 可能导致 JSON parse error；smoke 优先使用 Node、Invoke-RestMethod 或 JSON 文件。

## 当前 Backlog

1. 基础口粮事件文案写死“小橘”。
   - 当前宠物名为“星星”时，事件仍显示“记得照顾小橘哦”。
   - 建议改为当前宠物名，或使用通用文案。

2. `/events` feed detail 暴露技术字段。
   - 例如：`使用了 1 份 normal meal_box`。
   - 建议统一为中文可读文案，例如“使用了 1 份普通营养便当”。

3. 登录 401 后可能仍进入 Main。
   - 曾在 Cocos 控制台看到 `401 Unauthorized` 后出现 `LoadScene Main`。
   - 需要后续单独复现；如果成立，修复登录失败跳转逻辑。

4. 手机端测试包 API base 配置入口。
   - 当前 override 适合 Cocos 预览和浏览器 localStorage。
   - 手机端如果无法方便设置 storage，需要测试包配置入口。

## 下一阶段建议任务

Task Name: 云端事件文案一致性修复

Goal:

- 修复基础口粮事件文案写死“小橘”。
- 统一 `/events` feed detail 的中文展示。
- 保持 API 字段结构不变。
- 不做数据库 migration。

建议 Repo:

- `buddy-server`
- root 账本文档

建议允许文件：

- `buddy-server/src/routes/pet.ts` 或实际事件聚合/文案生成文件
- `buddy-server/tests/api.test.ts`
- `docs/contracts/diary.md` 如需补充文案约定
- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`

建议验证：

- `buddy-server`: `bun test`
- 云端部署后 health check。
- Cocos 预览 cloud override 下复验 dashboard、recent_events、events、背包使用。
