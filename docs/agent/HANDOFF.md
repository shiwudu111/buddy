# Buddy Agent Handoff

## 2026-06-02 - Cloud Staging 客户端接入与登录收口

### 本轮完成

- 完成 Cloud API base override 后续验证。
- 完成云端事件文案一致性修复、部署和 Cocos 人工复验。
- 完成登录失败跳转逻辑复验与客户端修复。
- 完成 client 提交、push 和 WSL 同步。

### 关键事实

- Cloud API base: `http://101.133.130.137/api/v1`
- Cocos 预览 override 设置方式：

```js
localStorage.setItem("BUDDY_API_BASE_URL", "http://101.133.130.137/api/v1")
location.reload()
```

- 恢复本地 API：

```js
localStorage.removeItem("BUDDY_API_BASE_URL")
location.reload()
```

- Cocos 网络面板看到 `http://101.133.130.137/api/v1/...` 即代表云端 override 生效。
- 错误密码登录预期结果：
  - 请求返回 401。
  - 页面停留在登录页。
  - 显示“用户名或密码错误”。
  - 不进入 Main。

### 已提交内容

#### client

- Branch: `develop`
- Commit: `1dfd935 fix(login): clear stale resume state before auth`
- 内容：
  - 显式登录/注册提交前清理旧的可恢复会话标记。
  - 避免登录失败后仍可能通过旧状态进入 Main。
- 验证：
  - `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。
  - Cocos 预览错误密码人工复验通过。
- 状态：
  - 已 push。
  - 已同步到 WSL。

#### server

- Branch: `deploy/cloud-staging-v1`
- Commit: `56b2d0f fix(events): use readable event copy`
- 内容：
  - 基础口粮文案改为通用宠物文案。
  - `/events` feed detail 改为中文可读文案。
  - 补充 API 测试。
- 验证：
  - `bun test` 通过。
  - Cloud health check 通过。
  - Cloud smoke 通过。
  - Cocos 预览人工复验通过。

#### root

- Branch: `main`
- Latest known commit: `8aeab55 docs(agent): close event copy validation`
- 本轮正在更新账本，记录登录收口与下一步建议。

### 本轮没有做

- 没有改 server 业务逻辑。
- 没有改 API 契约。
- 没有改云服务器 systemd / Nginx / RDS / 安全组。
- 没有开放公网 3000。
- 没有开放公网 5432。
- 没有写入或提交 `.env.production`、token、JWT_SECRET、数据库密码。
- 没有做 HTTPS。
- 没有做正式域名切换。

### 注意事项

1. client WSL 同步脚本默认 source 有旧路径风险。
   - 错误风险路径：`/mnt/e/buddy-client`
   - 当前正确路径：`/mnt/e/buddy/buddy-client`
   - 后续同步 client 时建议显式传入：

```bash
SOURCE_DIR=/mnt/e/buddy/buddy-client sh tools/sync-windows-to-wsl.sh
```

2. WSL 只读检查偶发 `WSL/Service/E_ACCESS_DENIED`。
   - 不要直接判定同步失败。
   - 先看同步脚本退出码和日志。

3. Windows `curl.exe -d "{\"...\"}"` 可能造成 JSON 或中文编码误判。
   - Cloud smoke 优先用 Node、Invoke-RestMethod 或 JSON 文件方式。

4. 不要把 PowerShell 中文显示乱码直接判定为后端存储问题。
   - 需要用 UTF-8 请求或 Cocos 客户端实测确认。

### 下一轮建议

Task Name: 手机端 Cloud API 体验测试准备

建议先做：

1. State Refresh。
2. 检查 client 当前 Cloud API override 能否用于手机端测试包。
3. 设计最小测试包配置方案。
4. 准备手机端一日主链路验收清单。
5. 再进入学生端一日体验 polish。
