# AGENTS.md

## 工作区用途

本工作区统一协调 Buddy 产品的两个既有仓库：

- `buddy-client/`：Cocos / TypeScript 客户端
- `buddy-server/`：后端服务、数据库与 API 逻辑

两个仓库仍然是彼此独立的 Git 仓库。父级工作区只作为统一执行、统一规划、统一文档协调面，避免前后端因为上下文不同步而产生偏差。

## 事实来源

- 跨项目任务以根目录 `PLAN.md` 作为当前产品执行源。
- 文档统一集中在 `docs/`：
  - `docs/client/`：客户端文档
  - `docs/server/`：后端文档
  - `docs/contracts/`：前后端契约文档
- 只涉及客户端时，同时遵守 `buddy-client/PLAN.md` 和 `buddy-client/AGENTS.md`。
- 只涉及后端时，先查看 `docs/server/` 与 `buddy-server/package.json`、本地脚本，再改动后端。
- 跨项目任务开始前，先更新根目录 `PLAN.md`，写清范围、允许文件、验证方式和契约影响。

## 执行规则

改代码前必须先重述：

1. 本轮范围
2. 预计触碰的客户端文件
3. 预计触碰的后端文件
4. 契约 / API 影响
5. 验证命令

保持 diff 最小且局部。不要做无关重构、重命名、依赖升级、迁移、样式重写或顺手整理。

## 跨项目规则

- 功能需要前后端同时配合时，优先在同一轮里同步完成。
- 请求 / 响应契约变化必须记录到 `docs/contracts/`。
- 客户端不得自行发明假后端状态，除非当前 `PLAN.md` 明确允许临时本地 fallback。
- 如果后端集成阻塞进度，只能在写清后端需求后交付最小安全 fallback。
- 后端响应结构变化时，必须同步更新客户端解析 / guard 和契约文档。

## 验证要求

按改动范围做有针对性的验证：

- 客户端 TypeScript 改动：在 `buddy-client/` 下运行 `./node_modules/.bin/tsc.cmd --noEmit`。
- 后端代码改动：先查看 `buddy-server/package.json`，再运行最窄的相关测试或类型检查命令。
- 只改契约或文档时不需要构建，但必须做文件清单和 Git 状态 sanity check。

## Git 边界

- `buddy-client/` 与 `buddy-server/` 是两个独立 Git 仓库。
- 大范围改动前分别检查两个仓库的 `git status -sb`。
- 未经用户明确要求，绝不 reset、revert 或覆盖用户已有改动。
- 父级工作区文件只用于协调，不是产品运行时代码。
