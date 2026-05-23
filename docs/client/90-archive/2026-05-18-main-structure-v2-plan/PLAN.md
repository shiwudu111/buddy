# PLAN.md

## 当前状态

- 上一轮 Main 相关计划已归档：`docs/90-archive/2026-05-11-main-v1-plan/PLAN.md`。
- 已收口内容包括：登录、学生端 Main、宠物状态真实接入、互动按钮、互动日志、离线状态衰减、背包食物使用闭环、日记最小闭环 V1。
- 学习任务奖励接入 V1 已完成客户端最终验收：提交作业奖励、背包库存刷新、奖励粮食使用、pet 状态刷新、日记 logs 联动均已通过。

## 本轮任务
Main 结构减负 V2：继续拆分 Main 内部稳定渲染模块，并清理 StageRenderer 剪切痕迹。

### 范围

- 将 Main 内部稳定、无后端副作用的渲染辅助逻辑拆出独立模块。
- 优先拆装饰性 UI helper、日记/背包/口粮选择等局部面板渲染。
- 清理 `MainStageRenderer.ts` 内部结构，拆分背景、云、地面、狐狸、装饰、气泡渲染函数。
- 抽出 `MainAssetStore.ts`，集中管理 Main 资源加载、加载状态和资源缓存。
- 定义宠物行为状态类型边界，为后续 `PetBehaviorController` 做准备。
- 抽出 `MainProceduralTextureFactory.ts`，从 Controller 移除 Canvas 程序化贴图生成细节。
- 收敛 `MainStageRendererContext`，按 assets / state / tuning / utils 分组传递舞台依赖。
- 为 AssetStore 资源加载完成回调增加合帧 `requestRender()`，降低启动期重复全量重绘。
- `MainController.ts` 保留 Cocos 生命周期、服务调用、状态协调、tab 切换和顶层渲染调度。
- 正式宠物数值、库存、离线衰减、作业奖励、日记仍以后端 pet 快照和既有接口为准。
- 所有中文注释、中文 UI 文案、中文资源路径必须保持 UTF-8 原样，禁止引入乱码。

### 允许文件

- `PLAN.md`
- `assets/scripts/ui/main/MainController.ts`
- `assets/scripts/ui/main/MainAssetStore.ts`
- `assets/scripts/ui/main/MainAssetStore.ts.meta`
- `assets/scripts/ui/main/MainProceduralTextureFactory.ts`
- `assets/scripts/ui/main/MainProceduralTextureFactory.ts.meta`
- `assets/scripts/ui/main/MainDecorations.ts`
- `assets/scripts/ui/main/MainDecorations.ts.meta`
- `assets/scripts/ui/main/MainJournalPanel.ts`
- `assets/scripts/ui/main/MainJournalPanel.ts.meta`
- `assets/scripts/ui/main/MainBagPanel.ts`
- `assets/scripts/ui/main/MainBagPanel.ts.meta`
- `assets/scripts/ui/main/MainDebugPages.ts`
- `assets/scripts/ui/main/MainDebugPages.ts.meta`
- `assets/scripts/ui/main/MainStageRenderer.ts`
- `assets/scripts/ui/main/MainStageRenderer.ts.meta`
- 已存在的 Main 内部辅助模块：`MainViewModel.ts`、`MainLifeFeedback.ts`、`MainPetAnimator.ts`

### 不在范围内

- 不修改后端代码、数据库迁移、后端测试或后端业务逻辑。
- 不因后端阻塞伪造 `timeContext`、`returnGreeting`、库存、奖励、日记或 pet 正式状态。
- 不改 Login / Chat / Parent 主流程。
- 不改背包 `/inventory/use` 调用主逻辑。
- 不改日记归一化主逻辑，不写 `mainEvents / diaryDays / backend logs`。
- 不改离线状态衰减、每日基础粮食、作业奖励平衡。
- 不改 UI 样式、不改场景文件、不新增资源。
- 不拆 `PetService`、`AppState`、`ApiClient`。

### 里程碑

1. [x] 更新本轮 `Today` scope、允许文件、验收标准和边界。
2. [x] 拆出装饰性 UI helper，降低 MainController 渲染辅助职责。
3. [x] 拆出日记/背包/口粮选择局部面板渲染，保留原有行为和回调。
4. [x] 拆出调参页/参考页 HTML 模板，避免 MainController 承载大块静态页面。
5. [x] 拆出 Main 舞台基础渲染和宠物气泡叠层，Controller 仅保留舞台调度入口。
6. [x] 清理 MainStageRenderer 剪切痕迹，拆成小渲染函数并统一代码卫生。
7. [x] 抽出 MainAssetStore，集中管理 resources.load、atlas 帧解析和资源缓存。
8. [x] 定义 PetBehaviorState，先把 idle / idleShow 行为语义从动画实现里命名出来。
9. [x] 抽出 MainProceduralTextureFactory，集中白图、阴影和云轮廓程序化贴图生成。
10. [x] 收敛 MainStageRendererContext，将舞台依赖分为 assets / state / tuning / utils。
11. [x] 为资源加载回调增加 requestRender 合帧调度，减少多资源加载时连续全量重绘。
12. [x] 运行 TypeScript 与编码验证并记录客户端验收状态。

### 验证

- 本轮客户端改动完成后运行：`.\node_modules\.bin\tsc.cmd --noEmit`
- 编码验证：
  - 搜索 touched Main 文件，确认无常见 mojibake 特征。
  - 检查 touched 文件无 UTF-8 BOM。
  - 搜索关键中文资源路径和 UI 文案仍然存在。
- 手动验收：
  - Main 正常打开。
  - 背包、日记、口粮选择、作业入口不回归。
  - 日记长列表可拖动，不弹回顶部。
  - fox idle 动画仍只更新狐狸帧，不触发整页重建。

### 客户端验收状态

- [x] `.\node_modules\.bin\tsc.cmd --noEmit` 通过。
- [x] 编码与关键中文哨兵检查通过。
- [x] MainController 行数和职责继续下降。

### 剩余风险

- `MainController.ts` 仍较大，本轮只拆稳定 UI 子域，避免大规模视觉回归。
- `render()` 仍是 `RuntimeUI.clear(root)` 后全量重建；资源加载已合帧，但用户交互、宠物气泡和局部特效仍需继续局部化。
- `MainStageRendererContext` 已分组，但 renderer utils 仍有 Controller 方法适配，后续可继续下沉为独立工具模块。
- 顶栏、底栏、调参页仍会保留在后续维护队列。
- PowerShell 终端可能错误显示中文，最终以 Node UTF-8 读取、TypeScript 编译和哨兵搜索为准。

## 规则

- `PLAN.md` 仍作为当前产品执行源。
- 新一轮开始前，先补充本轮 `Today` 的 scope、files、progress 和 validation。
- 新一轮计划必须明确列出允许改动的代码文件或模块；未列入允许范围的代码默认不可改。
- 涉及后端配合的内容，必须先输出后端联调需求；后端联调完成后，需要补齐后端修改对前端产生的接口、字段、流程和验收影响。
- 不从归档计划继续扩写；需要引用历史内容时，到归档文件查看。
## 结构维护记录

- [x] 2026-05-14：从 `assets/scripts/ui/main/MainController.ts` 抽出 Main 美术调参 schema / defaults / fields 到 `assets/scripts/ui/main/MainArtTuning.ts`。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过。
- [x] 2026-05-14：阻止狐狸 idle 动画帧更新触发非宠物 tab 重渲染，修复阅读长后端日志时 journal ScrollView 回弹 / 重置问题。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过。
- [x] 2026-05-14：优化 Main 宠物 idle 动画，只更新狐狸 SpriteFrame，不再每帧重建完整 MainRoot。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过。
- [x] 2026-05-18：从 `assets/scripts/ui/main/MainController.ts` 抽出 Main ViewModel、生命周期反馈和宠物动画辅助逻辑，不改变 Main 行为。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过；已检查触碰的 Main 文件无 mojibake 哨兵。
- [x] 2026-05-18：从 `assets/scripts/ui/main/MainController.ts` 抽出 Main 装饰、日记面板、背包 / 口粮选择面板和 debug / reference 页面模板。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过；已检查触碰的 Main 代码文件无 BOM、mojibake 哨兵，并保留关键中文字符串。
- [x] 2026-05-18：将 Main 舞台基础渲染和宠物生命感叠层抽入 `assets/scripts/ui/main/MainStageRenderer.ts`。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过；已检查触碰的 Main 代码文件无 BOM、mojibake 哨兵，并保留关键中文字符串。
- [x] 2026-05-18：清理 `MainStageRenderer.ts`，拆成聚焦的背景、云、地面、狐狸、debug、装饰和宠物叠层渲染函数。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过；已检查触碰的 Main 代码文件无 BOM、mojibake 哨兵，并保留关键中文字符串。
- [x] 2026-05-18：将 Main 资源加载抽入 `assets/scripts/ui/main/MainAssetStore.ts`，从 `MainController.ts` 移除直接 `resources.load` 调用。
- [x] 2026-05-18：在 `MainPetAnimator.ts` 增加 `PetBehaviorState`，将当前 idle 与 idle-show 播放映射到明确行为名。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过；已检查触碰的 Main 代码文件无 BOM、mojibake 哨兵，并保留关键中文字符串。
- [x] 2026-05-18：新增 `MainAssetStore.dispose()`，并在 `MainController.onDestroy()` 调用，避免晚到的资源加载回调渲染已销毁页面。
- [x] 2026-05-18：清理 Main 程序化贴图 / 材质辅助逻辑附近的缩进，并记录剩余 render / context / procedural-texture 风险。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过；已检查触碰的 Main 代码文件无 BOM、mojibake 哨兵，并保留关键中文字符串。
- [x] 2026-05-18：将白图、云轮廓、壳层阴影和距离采样 canvas helper 抽入 `assets/scripts/ui/main/MainProceduralTextureFactory.ts`。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过；已检查触碰的 Main 代码文件无 BOM、mojibake 哨兵，并保留关键中文字符串。
- [x] 2026-05-18：将 `MainStageRendererContext` 分组为 `assets`、`state`、`tuning`、`utils`，让 StageRenderer 不再依赖扁平的 Controller 形状 context。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过；已检查触碰的 Main 代码文件无 BOM、mojibake 哨兵，并保留关键中文字符串。
- [x] 2026-05-18：新增 `requestRender()` / `cancelScheduledRender()`，让资源加载回调把完整 Main 渲染合并到下一帧。
- [x] 验证：`.\node_modules\.bin\tsc.cmd --noEmit` 通过；已检查触碰的 Main 代码文件无 BOM、mojibake 哨兵，并保留关键中文字符串。
