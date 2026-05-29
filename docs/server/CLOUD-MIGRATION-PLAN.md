# buddy-server 云端部署 V1

## 目标

把 `buddy-server` 从当前 WSL 本地运行维护模式，迁移到一个可长期运行、可被手机端访问、可回归验证的云端环境。

最低目标：

* 云端 API 有稳定公网入口。
* 手机端客户端可以访问云端 API。
* 数据库迁移和 Prisma generate 流程明确。
* 服务重启、日志查看、健康检查和回滚方式明确。
* MVP smoke 可以指向云端执行。

## 当前后端事实

* 技术栈：Bun、Hono、TypeScript、Prisma、PostgreSQL。
* 入口文件：`src/index.ts`。
* 默认端口：`PORT=3000`。
* 健康检查：`GET /`。
* 健康检查返回：

```json
{
  "status": "ok",
  "message": "Buddy API Server"
}
```

* 数据库：Prisma 使用 `DATABASE_URL`。
* Prisma provider：PostgreSQL。
* 当前云端准备分支：`deploy/cloud-staging-v1`。
* 当前需要云端化的关键点：

  * CORS 来源不能继续硬编码本地地址。
  * 云端需要 `.env.production`。
  * 云端只使用 `prisma migrate deploy`，不使用 `prisma migrate dev`。
  * 手机端不能继续访问 `localhost`，需要切到云端 API 地址。

## 推荐云端架构

### Cloud Staging V1 推荐架构

```text
公网 HTTPS 入口
  -> Nginx 或 Caddy 反向代理
  -> buddy-server 本机 127.0.0.1:3000
  -> PostgreSQL 数据库
```

### 面向中国境内的长期推荐架构

```text
ECS：运行 buddy-server
RDS PostgreSQL：运行数据库
OSS：后续存放作业图片和上传资源
域名 + HTTPS：api-staging.xxx.com / api.xxx.com
```

说明：

* 第一阶段先做 `Cloud Staging V1`，目标是跑通公网访问、手机端联调、迁移流程、日志、重启、smoke 和回滚。
* 不建议第一阶段就做 Kubernetes、多地域容灾、复杂 CI/CD。
* 作业图片上传到 OSS 可以作为后续阶段，不放进 Cloud Staging V1。

## 环境变量

云端运行需要准备 `.env.production`，但真实 `.env.production` 不提交到仓库。

仓库中只提交：

```text
.env.example
.env.production.example
```

### 必填环境变量

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=
JWT_SECRET=
ALLOWED_ORIGINS=
PUBLIC_API_BASE_URL=
LOG_LEVEL=info
```

### 字段说明

#### NODE_ENV

云端使用：

```env
NODE_ENV=production
```

#### PORT

默认：

```env
PORT=3000
```

buddy-server 只监听本机端口，公网请求由 Nginx / Caddy 反向代理转发。

#### DATABASE_URL

云端 PostgreSQL 连接地址。

示例：

```env
DATABASE_URL=postgresql://USER:PASSWORD@RDS_INTERNAL_HOST:5432/buddy_staging?schema=public
```

注意：

* 如果使用阿里云 ECS + RDS，优先使用 RDS 内网地址。
* 不要把本地 `postgres:postgres@localhost` 带到云端。
* 不要把真实数据库密码提交到 Git。

#### JWT_SECRET

云端必须使用强随机值，不要使用开发环境默认值。

示例：

```env
JWT_SECRET=replace-with-a-strong-random-secret
```

#### ALLOWED_ORIGINS

CORS 允许来源，使用英文逗号分隔。

本地开发示例：

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:7456,http://127.0.0.1:7456
```

云端 staging 示例：

```env
ALLOWED_ORIGINS=https://api-staging.xxx.com,https://app-staging.xxx.com
```

注意：

* 生产环境不要使用 `*`。
* 如果手机端是原生请求，CORS 可能不是主要限制。
* 如果手机端是 WebView、Cocos 预览、H5 包，CORS 会影响访问。

#### PUBLIC_API_BASE_URL

公网 API 地址，用于文档、smoke、客户端配置参考。

示例：

```env
PUBLIC_API_BASE_URL=https://api-staging.xxx.com
```

#### LOG_LEVEL

默认：

```env
LOG_LEVEL=info
```

## CORS 规则

CORS 来源由 `ALLOWED_ORIGINS` 控制。

原则：

* 本地开发默认允许本地地址。
* 云端 staging / production 使用环境变量配置。
* 不在代码里硬编码云端域名。
* 不在生产环境使用 `*`。
* 不因为 CORS 问题修改业务接口。

推荐行为：

```text
如果请求 Origin 在 ALLOWED_ORIGINS 中：
  返回该 Origin

如果请求 Origin 不在 ALLOWED_ORIGINS 中：
  不允许跨域
```

## 数据库迁移流程

云端环境必须使用：

```bash
bunx prisma migrate deploy
bunx prisma generate
```

云端环境不要使用：

```bash
bunx prisma migrate dev
```

### 标准部署顺序

```text
1. 拉取或上传代码。
2. 安装依赖。
3. 准备 .env.production。
4. 执行 prisma migrate deploy。
5. 执行 prisma generate。
6. 重启 buddy-server。
7. 执行 GET / 健康检查。
8. 执行 cloud smoke。
```

### 注意事项

* 代码回滚相对容易。
* 数据库 migration 回滚不容易。
* 后续 migration 应尽量保持向后兼容：

  * 先加字段。
  * 再切逻辑。
  * 最后再删除旧字段。

## 服务运行方式

Cloud Staging V1 可以选择两种方式之一：

* systemd 直接管理 Bun 服务。
* Docker / Docker Compose 管理服务。

第一阶段任选一种即可，但必须满足：

* 能启动服务。
* 能重启服务。
* 能查看日志。
* 能健康检查。
* 能回滚。

## systemd 方案

### 常用命令

查看服务状态：

```bash
sudo systemctl status buddy-server
```

重启服务：

```bash
sudo systemctl restart buddy-server
```

查看最近日志：

```bash
sudo journalctl -u buddy-server -n 200
```

实时查看日志：

```bash
sudo journalctl -u buddy-server -f
```

### systemd 方式适合

* 第一阶段快速部署。
* 服务器上只跑一个后端服务。
* 暂时不想引入 Docker。

### systemd 方式风险

* 环境容易和服务器系统耦合。
* 回滚需要自己管理 release 目录。
* 后续迁移不如 Docker 清晰。

## Docker 方案

### 常用命令

查看容器状态：

```bash
docker compose ps
```

重启服务：

```bash
docker compose restart buddy-server
```

查看最近日志：

```bash
docker compose logs --tail=200 buddy-server
```

实时查看日志：

```bash
docker compose logs -f buddy-server
```

### Docker 方式适合

* 希望部署环境更稳定。
* 希望后续回滚更清楚。
* 希望减少服务器环境污染。

### Docker 方式风险

* 第一轮需要多写 Dockerfile 和 compose 配置。
* 如果用户不熟 Docker，初次配置成本略高。

## 推荐当前选择

Cloud Staging V1 可以先选：

```text
ECS + systemd + RDS PostgreSQL
```

如果希望长期更稳，可以直接选：

```text
ECS + Docker Compose + RDS PostgreSQL
```

无论选哪种，`PORT=3000` 不应直接暴露公网。

## 反向代理

公网入口建议：

```text
https://api-staging.xxx.com
```

反向代理到：

```text
http://127.0.0.1:3000
```

可以使用：

* Nginx
* Caddy

### 反向代理要求

* 公网只暴露 80 / 443。
* `3000` 不对公网开放。
* HTTPS 证书由 Nginx / Caddy 管理。
* 后端继续只关心 `PORT=3000`。

## 安全组建议

推荐开放：

```text
22：SSH，只允许可信 IP
80：HTTP，用于证书申请或跳转
443：HTTPS，对外 API 入口
```

不推荐公网开放：

```text
3000：buddy-server 内部端口
5432：PostgreSQL 端口
```

如果使用 RDS：

* RDS 不直接开放公网。
* RDS 白名单只允许 ECS 内网 IP 或 VPC 访问。

## 上传文件和 OSS

当前作业图片路径类似：

```text
/uploads/homeworks/...
```

Cloud Staging V1 可以暂时保留本地上传目录，先验证主链路：

```text
上传图片
提交作业
发放奖励
背包可见
日记可读
```

OSS 迁移建议放到后续阶段：

```text
Cloud Staging V2：作业图片上传迁移到 OSS
```

原因：

* OSS 涉及上传签名、访问 URL、历史数据迁移、权限控制。
* 第一阶段先不要扩大范围。

## 手机端接入

手机端不能继续访问：

```text
http://localhost:3000/api/v1
```

云端 staging 应改为：

```text
https://api-staging.xxx.com/api/v1
```

建议客户端后续支持环境切换：

```text
local: http://localhost:3000/api/v1
staging: https://api-staging.xxx.com/api/v1
production: https://api.xxx.com/api/v1
```

Cloud Staging V1 只要求文档明确，不强制本轮修改客户端代码。

## 健康检查

### L1 健康检查

请求：

```bash
curl -i https://api-staging.xxx.com/
```

期望返回：

```json
{
  "status": "ok",
  "message": "Buddy API Server"
}
```

L1 只能证明：

* 公网入口可访问。
* 反向代理可用。
* buddy-server 进程在线。

不能证明：

* 数据库正常。
* 登录正常。
* dashboard 正常。
* 作业和背包正常。

因此还需要 L2 smoke。

## Cloud Smoke

Cloud Smoke 详细步骤见：

```text
docs/server/CLOUD-SMOKE-V1.md
```

建议只读 smoke 包含：

* `GET /`
* `POST /api/v1/auth/login`
* `GET /api/v1/auth/me`
* `GET /api/v1/pets/:petId/dashboard`
* `GET /api/v1/pets/:petId/logs?days=7`
* `GET /api/v1/homeworks/status`

写入型 smoke 只在 staging 或专用测试账号执行，不在 production 随便执行。

## 回滚方案

### 最低要求

每次部署必须记录：

* 当前 commit hash。
* 当前部署时间。
* 当前环境变量版本。
* 当前 migration 状态。
* 上一个可用 release。

### systemd 回滚示例

推荐目录结构：

```text
/opt/buddy-server/releases/20260529_001
/opt/buddy-server/releases/20260529_002
/opt/buddy-server/current -> /opt/buddy-server/releases/20260529_002
/opt/buddy-server/shared/.env.production
```

回滚步骤：

```bash
ln -sfn /opt/buddy-server/releases/20260529_001 /opt/buddy-server/current
sudo systemctl restart buddy-server
curl -i http://127.0.0.1:3000/
```

### Docker 回滚示例

如果镜像使用 commit hash 作为 tag：

```text
buddy-server:commit_a
buddy-server:commit_b
```

回滚步骤：

```bash
# 修改 docker-compose 中镜像 tag 回上一版
docker compose up -d
docker compose logs --tail=200 buddy-server
curl -i http://127.0.0.1:3000/
```

### 数据库回滚注意

数据库 migration 不做自动回滚。

原则：

* migration 尽量向后兼容。
* 上云前先在 staging 跑 migration。
* 出现问题优先回滚代码，不轻易回滚数据库。
* RDS 备份恢复属于应急方案，不作为普通发布流程。

## Cloud Staging Checklist

创建资源：

* [ ] ECS 已创建。
* [ ] PostgreSQL 数据库已准备。
* [ ] ECS 和数据库网络连通。
* [ ] 安全组只开放必要端口。
* [ ] API 域名已准备。
* [ ] HTTPS 证书已准备或可自动申请。

配置环境：

* [ ] `.env.production` 已放到服务器，不提交 Git。
* [ ] `DATABASE_URL` 指向云端数据库。
* [ ] `JWT_SECRET` 已换成云端强随机值。
* [ ] `ALLOWED_ORIGINS` 已配置。
* [ ] `PUBLIC_API_BASE_URL` 已配置。
* [ ] `NODE_ENV=production`。
* [ ] `PORT=3000`。

部署验证：

* [ ] 依赖安装成功。
* [ ] `bunx prisma migrate deploy` 成功。
* [ ] `bunx prisma generate` 成功。
* [ ] buddy-server 启动成功。
* [ ] `GET /` 健康检查通过。
* [ ] cloud smoke 通过。
* [ ] 手机端可访问云端 API。

运维能力：

* [ ] 可以重启服务。
* [ ] 可以查看最近日志。
* [ ] 可以实时查看日志。
* [ ] 知道当前部署 commit hash。
* [ ] 有上一版回滚方式。

## 本轮不做

Cloud Staging V1 不做：

* 不做 Kubernetes。
* 不做复杂 CI/CD。
* 不做多地域容灾。
* 不做完整监控大盘。
* 不迁移 OSS。
* 不修改宠物、背包、日记、作业奖励、每日基础粮食、timeContext 业务逻辑。
* 不提交真实 `.env.production`。
* 不提交真实密钥。
* 不让 `3000` 端口直接公网裸露。

## 建议提交信息

如果是 root 文档提交：

```text
docs(server): add cloud migration plan
```

如果是 buddy-server 配置提交：

```text
chore(deploy): add cloud env configuration
```
