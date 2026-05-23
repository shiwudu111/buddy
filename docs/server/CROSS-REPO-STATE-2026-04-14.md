# 跨仓库状态摘要（2026-04-14）

## 1. 文档目的

本文从后端视角汇总当前项目状态，综合参考：

- `docs/server`
- `docs/client`

目的：避免后端开发继续依赖过期的客户端镜像文档或已经被替代的假设。

## 2. 推荐事实优先级

当文档之间发生冲突时，按以下顺序判断：

1. 父级 `docs/` 中的当前权威文档
2. 已标记为生效的冻结决策
3. 后端当前联调契约：`docs/server/INTERFACE-LIST-FOR-INTEGRATION.md`
4. 客户端近期仍生效的决策与阶段报告
5. 更早的镜像副本与归档摘要

## 3. 当前项目阶段

- 项目仍处于 MVP 执行阶段。
- 学生端与家长端主链路已经在客户端联调中跑通过。
- 当前工作重点已经不是“把技术栈跑起来”，而是契约稳定、UI 流程重组和范围控制。

## 4. 当前有效的跨项目状态

### 4.1 主流程

`Login + Main` 主流程已在客户端跑通。

学生端当前可以：

- 登录 / 注册 / 恢复会话
- 创建宠物
- 刷新宠物状态
- 喂养宠物
- 提交作业
- 查看作业历史和作业状态

家长端当前可以：

- 登录
- 绑定孩子
- 查看孩子宠物状态
- 查看作业快照
- 查看周报占位

### 4.2 当前视为生效的后端契约

以后端联调契约 `docs/server/INTERFACE-LIST-FOR-INTEGRATION.md` 作为当前后端侧 API 基线。

当前有效规则包括：

- User DTO：`id`、`username`、`role`、`childId`、`petId`
- 家长绑定支持 `child_username` 或 `child_id`
- 家长绑定当前能力是 `1 parent <-> 1 child`
- 作业状态接口是 `GET /api/v1/homeworks/status`
- 业务日期使用 `Asia/Shanghai`
- Pet 对外字段是 `hunger`、`mood`、`experience`、`status`

### 4.3 Login 模块

客户端登录不再被视为永远固定的单页表单。

当前已有新的生效决策：

- 登录入口从单页表单升级为：
  - `restore -> brandEntry -> roleSelect -> authForm`

对后端的重要影响：

- 第一阶段不需要新增 auth API。
- 现有 auth 端点仍然足够：
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
- 登录成功后的真实身份仍以后端返回的 `user.role` 为准。

### 4.4 首次宠物创建

当前也已有新的生效决策：

- MVP 正式冻结首次宠物流程为：
  - 无宠物学生进入主流程
  - 触发首次创建入口
  - 输入宠物名称
  - 调用创建宠物 API
  - 创建成功后进入正常成长流程

当前正式解释：

- MVP 冻结的是“创建宠物”，不是“选蛋 / 孵化系统”。
- `eggType`、`species`、`rarity`、`hatchSeed`、孵化结果和抽卡式演出当前都不是正式业务输出。
- 如果客户端保留选蛋 / 孵化内容，只能作为原型，并应放在 feature flag 后。

后端含义：

- `createPet(name)` 仍是当前正式契约。
- 后端当前不承诺任何基于蛋的结果语义。

## 5. 对后端最重要的客户端文档

以下客户端文档目前最有助于后端理解当前口径：

- `docs/client/PROJECT-CONTEXT.md`
- `docs/client/CURRENT-STATUS.md`
- `docs/client/03-API接口/API-MVP-BASELINE-V1.0.md`
- `docs/client/05-决策记录/登录入口重构变更决议-V1.0.md`
- `docs/client/05-决策记录/首次宠物创建链路冻结说明-V1.0.md`
- `docs/client/06-开发规范/后端协作需求-客户端联调-V1.0.md`
- `docs/client/90-archive/2026-04-14-阶段报告归档/开发进度报告-2026-04-03-客户端阶段测试汇总.md`

## 6. 已知文档漂移 / 冲突

### 6.1 家长绑定冲突

较早的客户端镜像决策曾写过 MVP 支持两个家长绑定同一个孩子。

但当前有效实现和联调基线是：

- `1 parent <-> 1 child`

请将当前有效规则视为：

- `1 parent <-> 1 child`

原因：

- 后端 User DTO 只暴露一个 `childId`
- 后端联调契约已经冻结该规则
- 客户端阶段报告和验收清单已经对齐

### 6.2 客户端 API 基线部分过期

`docs/client/03-API接口/API-MVP-BASELINE-V1.0.md` 仍包含旧假设，例如：

- 带 `email` 的旧 auth 响应示例
- pet resources 响应中的 `isAlive`
- 更早的绑定和作业说明

不要单独把该文件视为最终契约。后端工作优先参考：

- `docs/server/INTERFACE-LIST-FOR-INTEGRATION.md`
- 最新生效决策文档
- 最新客户端测试汇总

### 6.3 客户端 CURRENT-STATUS 落后于近期变化

`docs/client/CURRENT-STATUS.md` 仍反映较早检查点，未完整覆盖：

- 登录入口重构决策
- 首次宠物创建冻结决策
- 当前家长绑定正式口径

该文件只能作为项目概览，不应作为最终事实源。

## 7. 后端侧对“当前事实”的解释

从后端侧看，当前最稳妥的解释是：

1. MVP 仍优先主循环：auth -> pet create -> homework -> reward linkage -> parent view。
2. Auth 契约足够稳定，客户端登录入口重构不需要新增 API。
3. 家长绑定当前是单家长单孩子。
4. 宠物创建当前是只按名称创建实体，不是正式孵化结果生成。
5. 客户端代码中可能存在先于正式业务口径的原型流程。

## 8. 后端行动项

### 8.1 立即执行

- 继续使用 `INTERFACE-LIST-FOR-INTEGRATION.md` 作为后端联调事实源。
- 不要把“一个孩子可绑定多个家长”的假设重新引入 API 响应或 DTO 设计。
- 除非有新的正式决策升级孵化语义，否则宠物创建仍按 `createPet(name)` 处理。

### 8.2 推荐文档补充

后端文档应补充一条明确规则：

- 当前 MVP 宠物创建端点只保证创建宠物实体。
- 它不保证 `eggType`、`species`、`rarity`、`hatchSeed` 或可复现孵化结果语义。

### 8.3 未来审查时

阅读客户端文档时，始终先判断文件属于：

- 当前生效基线
- 镜像副本
- 归档材料
- 阶段报告

## 9. 摘要

当前项目已经不再被“后端能不能跑起来”阻塞。真正的协作重点是：

- 保持 API 事实稳定
- 防止原型 UI 意外升级成业务契约
- 让后端行为与最新客户端生效决策保持一致

原始 MVP 冻结后，最重要的两个生效变化是：

- 登录入口重构已成为客户端当前基线
- 首次宠物创建已明确冻结为简单创建宠物流程，不是正式孵化系统
