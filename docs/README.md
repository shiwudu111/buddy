# Buddy 文档中心

本目录是 Buddy 前后端协作的统一文档入口。

## 目录结构

- `client/`：来自 `buddy-client` 的客户端文档、联调记录、归档资料和视觉 / Cocos 说明。
- `server/`：来自 `buddy-server` 的后端文档、接口基线、本地调试说明和联调状态。
- `contracts/`：当前或未来需要前后端共同遵守的正式契约。

## 使用规则

- 跨项目决策先看根目录 `PLAN.md`，再看本目录。
- 前后端接口、字段、状态码或业务口径变化时，必须同步更新 `contracts/`。
- 客户端文档与后端文档冲突时，不要直接猜测，以最新契约文档和当前代码为准，并在交付中标出冲突。
- 归档文档只用于追溯历史，不得直接当作当前执行标准。

## 迁移说明

- 原 `buddy-client/docs` 已集中到 `docs/client/`。
- 原 `buddy-server/docs` 已集中到 `docs/server/`。
- `buddy-client/` 与 `buddy-server/` 仍是独立 Git 仓库，本目录只统一文档视角。
