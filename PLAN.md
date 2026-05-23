# PLAN.md

## 当前状态

- `buddy-client/` 与 `buddy-server/` 仍然是独立 Git 仓库。
- 父级工作区负责统一规划、统一文档和前后端协作，不承载运行时代码。
- 文档正在集中到根目录 `docs/`，用于减少前后端信息差：
  - `docs/client/`：客户端文档
  - `docs/server/`：后端文档
  - `docs/contracts/`：前后端契约文档

## 本轮任务

整理并中文化 Buddy 工作区文档。

### 范围

- 将 `buddy-client/docs` 集中迁移到 `docs/client/`。
- 将 `buddy-server/docs` 集中迁移到 `docs/server/`。
- 保留根目录 `docs/contracts/` 作为跨项目契约区。
- 将 `AGENTS.md`、`PLAN.md` 和集中后 Markdown 文档中的英文协作说明改为中文。
- 保留代码块、命令、路径、接口字段、JSON 字段、环境变量、状态码和文件名原义。
- 修复已发现的中文乱码文档。

### 允许文件

- `AGENTS.md`
- `PLAN.md`
- `docs/**`
- `buddy-client/AGENTS.md`
- `buddy-client/PLAN.md`
- `buddy-client/README.md`
- `buddy-server/README.md`
- `buddy-server/CHANGELOG.md`

### 不在范围内

- 不移动 `buddy-client/` 或 `buddy-server/` 仓库本身。
- 不合并两个仓库的 Git 历史。
- 不修改客户端或后端运行时代码。
- 不修改数据库迁移、依赖、CI/CD 或接口实现。
- 不把代码标识符、接口字段、命令、配置项翻译成中文。

### 契约 / API 影响

- 本轮不改变任何接口契约或响应结构。
- 只整理契约文档入口与存放位置。
- 如果发现旧文档与当前契约冲突，只记录为文档风险，不改后端或客户端实现。

### 验证

- 分别检查 `buddy-client/` 与 `buddy-server/` 的 `git status -sb`。
- 检查 `docs/client/`、`docs/server/`、`docs/contracts/` 均存在。
- 检查 Markdown 文档中无明显 mojibake 哨兵字符。
- 抽查关键入口文档是否为中文且保留代码块原义。

### 验收状态

- [x] 已确认两个仓库当前均有未提交代码改动，本轮不触碰运行时代码。
- [x] 已确认客户端是 Cocos Creator 3.8.7 + TypeScript 架构。
- [x] 已确认后端是 Bun / Hono / TypeScript + Prisma 架构。
- [x] 已将两边 `docs` 目录集中到根 `docs/`。
- [x] Markdown 中文化与路径修正完成。
- [x] 文档 sanity check 完成。

## 跨项目契约索引

- `docs/contracts/README.md`
- `docs/contracts/auth.md`
- `docs/contracts/pet.md`
- `docs/contracts/homework.md`

## 工作区版本管理

- 父级工作区已初始化 Git，用于管理 `AGENTS.md`、`PLAN.md`、`docs/**` 和 `buddy.code-workspace`。
- 父级 `.gitignore` 已忽略 `buddy-client/` 与 `buddy-server/`，避免误把两个独立子仓库纳入父仓库。
- `buddy-client/` 与 `buddy-server/` 继续保留各自独立 Git 历史。
