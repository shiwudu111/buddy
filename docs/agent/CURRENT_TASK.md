# 当前任务：UI 主链路收口

## 状态

已按当前视觉与交互效果收口，等待 Cocos 手动复验和提交确认。

## 本轮目标

修复 MVP 真实点击验收中剩余的两个 UI 缺口：

1. Main 页面缺少聊天入口。
2. 家长账号登录后进入学生端页面，缺少绑定孩子与查看入口。

## 已实现

- `buddy-client/assets/scripts/ui/main/MainController.ts`
  - 顶部导航新增“聊天”入口。
  - 聊天入口复用现有 `ChatService`、`ChatConversationCoordinator`、`ChatConversationView`。
  - 发送聊天消息后写入现有聊天历史，并在 Main 反馈区显示结果。
  - PARENT 角色进入 Main 时渲染家长中心，而不是学生宠物主页。
  - 家长中心提供绑定孩子、查看孩子宠物、查看周报、退出登录。
  - 修复家长中心低高度下查看按钮被结果区域覆盖的问题。
  - 家长已有 childId 时进入 Main 自动拉取孩子宠物状态。
  - 绑定成功后自动拉取孩子宠物状态。
- `buddy-client/assets/scripts/services/ChatService.ts`
  - 收口聊天 fallback 和发送状态的用户可见中文提示。
- `buddy-client/assets/scripts/services/ParentService.ts`
  - 收口家长绑定、查看、周报失败提示。
- `buddy-client/assets/scripts/ui/chat/ChatConversationCoordinator.ts`
  - 收口聊天面板提示文案。
- `buddy-client/assets/scripts/ui/common/runtime/RuntimeUI.ts`
  - 支持家长中心详情滚动区所需的滚动配置。
- `buddy-client/assets/scripts/types/api.ts`
  - 补齐家长侧宠物状态字段类型。
- `buddy-server/src/routes/parent.ts`
  - 家长侧宠物/周报接口补齐体力、清洁、阶段等字段。
- 家长中心当前收口效果：
  - 三栏主视觉：宠物成长、成长洞察、学习分析。
  - 三栏支持点击拉伸/压缩，使用缓入缓出动画。
  - 标题与内容按压缩/拉伸宽度动态排版。

## 未做

- 未新增接口、数据库表或 Prisma migration。
- 未提交、未推送、未运行 WSL 同步。
- Cocos 自动生成的 settings 改动已恢复，不纳入本轮收口。

## 验证结果

- `buddy-client`: `bunx tsc --noEmit --ignoreDeprecations 6.0` 通过。
- root: `node tools/smoke-mvp-flow.mjs` 通过，包含 parent bind/view/report。

## 下一步

1. 用 Cocos 手动复验家长中心当前三栏视觉与点击拉伸/压缩效果。
2. 若当前效果接受，用户确认后进入分仓提交。
3. 提交前再次运行 client TypeScript、server test，并检查 root/client/server `git status -sb`。
