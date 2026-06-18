# CURRENT TASK

## 2026-06-18 当前任务：登录返回入口与 Log 按钮位置收口

### 已关闭阻塞

手机端作业图片上传 HTTP 413 已验收通过。

- `buddy-client` 提交：`3d19599 fix(homework): compress uploaded images`
- 已推送：`develop`
- 热更：staging `0.0.64`
- 真机验证：
  - `local=0.0.64`
  - `remote=0.0.64`
  - `failed=0`
  - Android 原生压缩触发两次
  - `/homeworks/uploads status=200`
  - `/homeworks/submit status=200`
- 用户已明确：跳过 WSL 同步。

### 当前目标

1. 修复“没有返回登录界面接口”。
2. 将手机端 `Log` 按钮下移，避免挡住左上角图标。

### 当前事实

- 三仓在进入本任务前均为干净状态。
- 本任务优先只改 `buddy-client` 与 root 文档。
- 暂不修改 `buddy-server`，除非定位确认确实缺服务端接口。
- 不继续修改作业图片上传链路。

### Allowed Files

- `buddy-client/assets/scripts/ui/**`
- `buddy-client/assets/scripts/app/**`
- `buddy-client/assets/scripts/services/**`
- `buddy-client/assets/scripts/network/**`
- `PLAN.md`
- `docs/agent/CURRENT_TASK.md`
- `docs/agent/HANDOFF.md`

### Validation

```powershell
cd E:\buddy\buddy-client
bunx tsc --noEmit --ignoreDeprecations 6.0
git diff --stat
git status -sb
```

还需要分别检查：

- `E:\buddy`
- `E:\buddy\buddy-client`
- `E:\buddy\buddy-server`

### 注意事项

- 返回登录界面要先查现有登录态、token/session、启动页切换逻辑。
- 如果只是客户端缺入口，不新增后端接口。
- `Log` 按钮只调整位置，不改变日志功能。
