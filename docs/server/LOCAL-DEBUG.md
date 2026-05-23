# 本地开发与调试说明

## 1. 文档目的

本文件用于指导团队成员在本地完成 `buddy-server` 的启动、调试、验证与常见问题排查。

本说明特别针对当前项目实际踩过的坑进行整理，重点覆盖：

- WSL 本地开发环境
- PostgreSQL / Redis 启动
- Prisma 迁移
- Bun 启动链路
- Git 代理问题
- 常见运行报错排查

## 2. 推荐环境

### 2.1 操作系统

- Windows 11 23H2
- WSL2 Ubuntu 24.04

### 2.2 推荐工作方式

优先使用 WSL 作为主开发运行环境，Windows 主要用于：

- 访问文件
- 使用浏览器
- GitHub Desktop / PowerShell 补充操作

### 2.3 项目目录

WSL：

```text
/home/openclaw/.openclaw/workspace/buddy-server
```

Windows：

```text
\\wsl.localhost\Ubuntu-24.04\home\openclaw\.openclaw\workspace\buddy-server
```

## 3. 本地固定环境变量

项目当前统一使用以下本地开发配置：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buddy_dev?schema=public"
REDIS_URL="redis://127.0.0.1:6380"
PORT=3000
NODE_ENV=development
```

说明：

- 不再使用历史旧配置。
- 不再尝试旧数据库账号密码组合。
- 当前不要切换 SQLite。
- 当前不依赖 Docker 启动数据库和缓存。

## 4. 本地启动步骤

### 4.1 进入项目目录

```bash
cd /home/openclaw/.openclaw/workspace/buddy-server
```

### 4.2 启动 PostgreSQL

```bash
sudo service postgresql start
pg_isready
```

期望输出包含：

```text
accepting connections
```

如需重置 `postgres` 密码：

```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

确认数据库存在：

```bash
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'buddy_dev';" | grep -q 1 || sudo -u postgres createdb buddy_dev
```

### 4.3 启动 Redis

当前推荐直接手动启动本地 Redis，不依赖 `service redis-server start`：

```bash
pkill redis-server || true
redis-server --bind 127.0.0.1 --port 6380 --daemonize yes
redis-cli -h 127.0.0.1 -p 6380 ping
```

期望结果：

```text
PONG
```

说明：

- 当前固定使用 `6380`。
- 不强依赖默认 `6379`。
- 不建议为当前开发再折腾 Docker Redis。

### 4.4 安装依赖

```bash
pnpm install
```

如依赖安装卡住，先检查 WSL 代理配置，必要时取消错误代理或统一代理设置。

### 4.5 Prisma 生成与迁移

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

期望结果：

- Prisma Client 生成成功。
- `buddy_dev` 数据库 schema 同步成功。

### 4.6 启动服务

```bash
pnpm dev
```

成功标志：

```text
Started development server: http://localhost:3000
```

## 5. 常用验证命令

### 5.1 首页检查

```bash
curl http://localhost:3000
```

期望返回类似：

```json
{"status":"ok","message":"Buddy API Server"}
```

### 5.2 注册接口

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800000001","password":"123456","role":"child","nickname":"test"}'
```

### 5.3 登录接口

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800000001","password":"123456"}'
```

### 5.4 创建宠物

登录成功后，用 token 调用：

```bash
curl -X POST http://localhost:3000/api/v1/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"name":"Buddy"}'
```

### 5.5 获取宠物

```bash
curl http://localhost:3000/api/v1/pets/<petId> \
  -H "Authorization: Bearer <your_token>"
```

## 6. Git 网络问题排查

### 6.1 问题现象

Windows PowerShell / Git 无法访问 GitHub，但浏览器可以打开 GitHub 页面。

### 6.2 原因

浏览器和命令行没有走同一套代理链路。

### 6.3 解决方式

为 Git 显式设置本地代理：

```bash
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

### 6.4 验证

```bash
git ls-remote origin
```

### 6.5 push 成功后

如果后续仍需通过代理访问 GitHub，则保留该配置。如果后续已不需要代理，可清除：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 7. 常见问题与处理方式

### 7.1 数据库认证失败

报错示例：

```text
Authentication failed against database server
```

检查项：

- PostgreSQL 是否启动
- `.env` 中 `DATABASE_URL` 是否正确
- `postgres` 密码是否已设置为 `postgres`
- `buddy_dev` 数据库是否存在

处理方式：

```bash
sudo service postgresql start
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres createdb buddy_dev
```

### 7.2 Redis 无法启动

现象：`service redis-server start` 失败，或 `redis-cli ping` 卡住。

建议不要卡在 service 管理方式，直接使用本地前台 / 后台实例：

```bash
redis-server --bind 127.0.0.1 --port 6380 --daemonize yes
redis-cli -h 127.0.0.1 -p 6380 ping
```

### 7.3 Prisma 迁移失败

常见原因：

- 数据库没启动
- 连接字符串错误
- schema 与当前数据库状态不一致

处理方式：

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

必要时先确认数据库存在。

### 7.4 `bun not found`

原因：项目当前 `pnpm dev` 依赖 Bun 运行入口。

解决：

```bash
npm install -g bun
bun -v
```

### 7.5 `Export named xxxRouter not found`

原因：路由文件未正确导出命名路由对象。

正确写法示例：

```ts
export const authRouter = new Hono();
export default authRouter;
```

排查重点：

- `src/index.ts` 中的 import 名称
- `src/routes/*.ts` 中的 export 名称
- 是否出现重复 `default export`

### 7.6 GitHub 推送失败

常见报错：

```text
Failed to connect to github.com port 443
Recv failure: Connection was reset
```

原因：命令行没有走代理，或 Git 认证未完成。

处理方式：

1. 配置 Git 代理。
2. 浏览器完成 GitHub 登录 / 授权。
3. 再执行：

```bash
git push -u origin main
```

## 8. 调试建议

### 8.1 调试顺序

出现问题时，不要同时改很多地方，按顺序排查：

1. 先查服务是否启动
2. 再查数据库是否通
3. 再查 Redis 是否通
4. 再查 Prisma 是否迁移完成
5. 再查接口逻辑
6. 最后再查前端联调问题

### 8.2 最小验证原则

每次修改后，优先只验证最小链路：

- `GET /`
- register
- login
- create pet
- get pet

只要这条线通，说明主环境大概率正常。

## 9. 当前开发建议

当前不建议做的事：

- 不要切 SQLite。
- 不要让 Docker 成为当前唯一依赖。
- 不要同时修改数据库方案和接口逻辑。
- 不要绕过 `develop` 直接在 `main` 上做日常开发。

当前建议做的事：

- 优先稳定 auth / pets 主链路。
- 逐步联调 homework / chat / parent。
- 新问题优先补到本文档，避免团队重复踩坑。

## 10. 总结

本文件是当前项目的本地调试标准说明。后续成员接手、环境迁移、接口联调、异常排查时，优先参考本文件执行，不要再从零试错。
