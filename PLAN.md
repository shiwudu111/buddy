# PLAN.md

## 当前任务

图片上传阻塞已关闭；下一步处理两个客户端收口问题。

## 已关闭阻塞

### 手机端作业图片上传 HTTP 413

- 结论：已验收通过。
- 最新提交：`buddy-client` `3d19599 fix(homework): compress uploaded images`，已推送 `develop`。
- 热更验证：staging `0.0.64` 已生效，真机日志显示 `local=0.0.64`、`remote=0.0.64`、`failed=0`。
- 原生压缩已触发：
  - `22,970,577` bytes -> `112,769` bytes
  - `10,097,450` bytes -> `257,211` bytes
- 上传与提交已通过：
  - `/homeworks/uploads status=200`
  - `/homeworks/submit status=200`
- 本轮未修改 `buddy-server`。
- WSL 同步按用户指令跳过。

## 当前待处理

1. 修复“没有返回登录界面接口”。
2. 调整手机端 `Log` 按钮位置，避免挡住左上角图标。

## Lite Task Packet

```text
Task: 登录返回接口与 Log 按钮位置收口
Goal: 补齐返回登录界面的客户端入口，并调整手机端 Log 按钮位置
Repos: buddy-client
Allowed Files:
  buddy-client/assets/scripts/ui/**
  buddy-client/assets/scripts/app/**
  buddy-client/assets/scripts/services/**
  buddy-client/assets/scripts/network/**
  PLAN.md
  docs/agent/CURRENT_TASK.md
  docs/agent/HANDOFF.md
Out of Scope:
  buddy-server
  作业上传链路
  宠物状态、库存、奖励规则
  .tmp/
Backend Impact: 无，除非定位发现确实缺服务端登出接口
Client Impact: 登录状态/界面跳转与 Log 按钮布局
Contract Impact: 暂无
Validation:
  buddy-client: bunx tsc --noEmit --ignoreDeprecations 6.0
  root/client/server: git status -sb
Commit Plan: client 与 root 分仓提交
Risks:
  需要先确认现有登录/登出状态流，避免只做 UI 跳转但残留 token/session
```

## 验证要求

- 修改前先定位现有登录状态、启动页、返回首页/登录页逻辑。
- 如只是缺客户端入口，不新增后端接口。
- Log 按钮只做位置调整，不改变日志功能。
