# 契约文档

本目录记录同时影响 `buddy-client` 与 `buddy-server` 的前后端契约。

契约正式生效后，按业务域一域一文档维护。例如：

- `auth.md`：注册、登录、当前用户
- `pet.md`：宠物创建、宠物快照、互动、库存使用
- `homework.md`：作业提交、作业历史、作业状态
- `dashboard.md`：主界面启动载荷
- `diary.md`：日记视图使用的日志 / 事件

每份契约至少记录：

- endpoint 与 method
- request shape
- success response shape
- failure response shape
- 依赖该契约的客户端页面 / 组件
- 负责该契约的后端 route / service
- 验证清单

## 当前已建契约

- `auth.md`
- `pet.md`
- `homework.md`
