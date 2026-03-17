# Phase 1: 架构重构 — 话题与世代解耦

---

## 一、当前问题诊断

### 1.1 核心耦合点

项目中有一条隐含的等式：**选择数学话题 = 决定遭遇哪些宝可梦**。具体体现为
`selectedTopic === 'linear'` 时 gen1，gen2 散落在 `encounters.ts`、`trainers.ts`、
`TopicSelect.tsx` 三处。新增话题必须绑定世代：话题数量被世代数量锁死。

### 1.2 解决方案

将"学什么数学"和"遇到什么宝可梦"拆成两个**完全独立**的维度：

- **数学维度**：年级 (Year 7-10) → 具体话题（每年级 4 个）
- **宝可梦维度**：地区 (Region) → 对应世代的宝可梦遭遇池

两者之间**没有任何映射关系**。

### 1.3 底层逻辑保护规则

不改动任何的战斗公式、经验值计算、稀有度判定、宝可梦生成逻辑、事件系统框架、
道具使用框架、存档结构底层、PeerJS 多人模块。
只改"话题选择"和"世代选择"这两个入口的驱动方式。

---

## 二、新的游戏开局流程

```
主菜单 → [新游戏]
  → Step 1: 选择初始地区
  → Step 2: 选择年级 (7 / 8 / 9 / 10)
  → Step 3: 选择该年级下的具体话题
  → Step 4: 输入名字
  → Step 5: 选择初始宝可梦（3 只御三家）
  → 进入游戏
```

> Phase 1 阶段只有 Gen1/Gen2 数据，初始地区只能选 **Kanto** 或 **Johto**。
> 其他地区灰色标注 Coming Soon。Phase 2 数据就位后自动解锁。

---

## 三、地区旅行系统设计

### 3.1 核心思路

地区不是"设置项"，而是**游戏进度的一部分**。玩家从一个地区开始冒险，通过游戏内的
事件和道具解锁并旅行到新地区。"去新地区"是一种奖励和目标。

### 3.2 两种切换方式

| 方式 | 触发时机 | 性质 | 逻辑 |
|------|---------|------|------|
| 旅行事件 | 击败当前地区冠军后自动 | 剧情推进 | 类似主菜单"遇见某些宝可梦新地区"标注 |
| 旅行道具（票券） | 随后在背包中使用 | 自由旅行 | 已解锁的地区之间自由切换 |

两种方式不冲突：旅行事件解锁"第一次出新地区"（需要仪式感和成就感），旅行道具
解决"回到旧地区"或"在已解锁地区间切换"。

### 3.3 旅行事件：新地区解锁

**流程**：击败冠军 → 胜利结算 → 触发旅行事件画面（NPC 对话 + 选择按钮）→ 选择
旅行 → selectedRegion 切换 → 获得出发地票券 → 继续游戏。

选择留下则不切换，下次击败冠军时还可以选。

**解锁链**：
```
Kanto   → 击败 Red     → 解锁 Johto
Johto   → 击败 Lance   → 解锁 Hoenn
Hoenn   → 击败 Steven  → 解锁 Sinnoh
Sinnoh  → 击败 Cynthia → 解锁 Unova
Unova   → 击败 Alder   → 解锁 Kalos
Kalos   → 击败 Diantha → 解锁 Alola
Alola   → 击败 Kukui   → 解锁 Galar
Galar   → 击败 Leon    → 解锁 Paldea
```

### 3.4 旅行道具：自由切换

以地区命名的票券（Kanto Ticket、Johto Ticket 等）。
首次旅行时自动获得出发地和目的地的票券。

### 3.5 切换地区时发生什么

**会更新：**
- `selectedRegion` 更新为新地区
- 后续野生宝可梦遭遇从新地区世代中抽取
- 后续训练师遭遇从新地区训练师池中抽取

**不变：**
- 宝可梦队伍和 PC 存储箱
- 背包道具和金钱
- 连胜数
- 已获得的徽章和成就
- 数学话题（话题和地区独立）

### 3.6 已解锁地区的状态存储

在 `SaveData` 中新增：`unlockedRegions?: Region[]`（默认 `[KANTO]`）。
该字段 optional，旧存档读取时默认为 `[KANTO]`。

### 3.7 旅行事件的实现方式

复用现有事件系统框架（`eventRegistry.ts`）：
- 在 `eventRegistry` 注册新事件类型 `region_travel`
- 击败冠军后在 `encounters.ts` 检查是否有下一个未解锁地区，触发事件
- 新建事件 UI 组件 `RegionTravelEvent.tsx`
- 通过现有 `GameActions` 接口操作状态

**不修改事件系统底层框架。**

---

## 四、话题系统重设计

### 4.1 新的话题类型

| 年级 | 话题 ID | 显示名 | NSW Syllabus |
|------|---------|--------|-------------|
| Year 7 | `y7_number` | Number & Place Value | MA4-4NA |
| Year 7 | `y7_algebra` | Intro to Algebra | MA4-8NA |
| Year 7 | `y7_geometry` | Angles & Shapes | MA4-17MG |
| Year 7 | `y7_statistics` | Data & Graphs | MA4-19SP |
| Year 8 | `y8_number` | Fractions & Ratios | MA4-5NA |
| Year 8 | `y8_algebra` | Linear Equations | MA4-10NA（取代 linear）|
| Year 8 | `y8_geometry` | Area & Volume | MA4-13MG, MA4-14MG |
| Year 8 | `y8_statistics` | Probability | MA4-21SP（取代 probability）|
| Year 9 | `y9_algebra` | Indices & Surds | MA5.1-5NA, MA5.2-7NA |
| Year 9 | `y9_geometry` | Trigonometry | MA5.1-10MG |
| Year 9 | `y9_statistics` | Bivariate Data | MA5.2-15SP |
| Year 9 | `y9_financial` | Simple Interest | MA5.1-4NA |
| Year 10 | `y10_algebra` | Quadratics | MA5.2-8NA, MA5.3-7NA |
| Year 10 | `y10_geometry` | Advanced Trigonometry | MA5.3-15MG |
| Year 10 | `y10_statistics` | Cumulative Frequency | MA5.3-18SP |
| Year 10 | `y10_financial` | Compound Interest | MA5.2-4NA |

### 4.2 Legacy 话题兼容

- 类型定义中保留 `'linear'` | `'probability'` 作为合法值
- 读取存档时迁移：`linear → y8_algebra`，`probability → y8_statistics`
- 题目引擎注册中 `linear` 和 `y8_algebra` 指向同一引擎
- UI 层不再展示 legacy 值

### 4.3 话题选择 UI

两步选择：
- **Step 1** 选年级（4 张卡片：Year 7 绿 / 8 蓝 / 9 紫 / 10 红）
- **Step 2** 选该年级的 4 个话题

### 4.4 游戏中途不能换话题

话题在开局选定后锁定。题目难度与宝可梦稀有度有挂钩，换话题会打乱平衡。
想学新话题可以开新存档。

---

## 五、Fairy 属性补全

Gen 6 引入了 Fairy 属性。Phase 2 会添加 Gen6 数据。**必须在 Phase 1 先把属性系统补全。**

`constants.ts` 中所有 `Record<PokemonType, ...>` 的映射表都需要补 Fairy 条目：
- `TYPE_CHART`
- `TYPE_COLORS`
- `TYPE_BG`
- `TYPE_ENVIRONMENTS`
- `TYPE_HP_MULTI`
- `TYPE_ATK_MULTI`
- `TYPE_DEF_MULTI`

> Claude Code 应全文搜索所有包含现有属性（如 `'Dragon'`, `'Steel'`）的 `Record`
> 对象字面量，确保 Fairy 无遗漏。

---

## 六、图鉴增加地区筛选

在现有图鉴界面增加筛选功能：默认显示全部宝可梦（All Regions），可按地区筛选。
筛选方式为顶部下拉选择器或顶部 Tab 栏。

筛选逻辑按 `PokedexEntry.generation` 字段过滤，复用 `regionService.ts` 的
`getTargetGenerations(region)`。
不修改 `pokedexData.ts` 数据结构，不修改已捕捉/未捕捉判定逻辑。

---

## 七、状态管理层改动

- `useGameStore` 新增 `selectedRegion: Region`（默认 `KANTO`）
- `useGameStore` 新增 `mathYear: MathYear`（默认 `8`）
- `usePlayerStore` 新增 `unlockedRegions: Region[]`（默认 `[KANTO]`）

---

## 八、现有代码改动点清单

| 文件 | 改动 | 原则 |
|------|------|------|
| `encounters.ts` | 2 处 `selectedTopic===linear` 改为 `selectedRegion + getTargetGenerations`；击败后触发旅行事件 | 不改遭遇数量 |
| `trainers.ts` | `generateTrainerTeam` 的 `gen: 1\|2` 改为接受 `Generation[]` | 只改参数类型 |
| `topicRegistry.ts` | 新增话题→年级映射；按年级查询；显示名/描述；新话题 fallback 到 linear 引擎 | 追加，不改现有 |
| `TopicSelect.tsx` | 完全重写为年级→话题两步选择 | 不涉及地区 |
| `StarterSelect.tsx` | 读取 `selectedRegion` 展示对应三家 | 无需 fallback Kanto |
| `itemData.ts` | 添加 9 种旅行票券道具 | 沿用现有道具格式 |
| `eventRegistry.ts` | 注册 `region_travel` 事件类型 | 添加，不改框架 |
| 图鉴组件 | 增加地区筛选 UI | 仅 UI 层 |
| `App.tsx` | 新游戏流程中增加地区选择步骤 | 追加路由 |

---

## 九、存档迁移

`SaveData` 新增字段（全部 optional）：
- `selectedRegion?`（默认 `KANTO`）
- `mathYear?`（默认 `8`）
- `unlockedRegions?`（默认 `[KANTO]`）
- `gameVersion?`（默认 `'1.0'`）

**迁移逻辑**（读档时执行，对玩家透明）：
- `linear` → `y8_algebra`
- `probability` → `y8_statistics`
- `selectedRegion` 不存在 → 由旧 topic 推断
- `unlockedRegions` 不存在 → 初始化为 `[selectedRegion]`

迁移后回写存档。

---

## 十、检验标准

1. `npx tsc --noEmit` 零报错
2. 新游戏流程能完成 地区→年级→话题→命名→御三家→遭遇 完整流程
3. 旧存档兼容：读档后 `selectedTopic` 为 `y8_algebra`，`selectedRegion` 为 `KANTO`
4. 遭遇过滤：KANTO 只遇 Gen1，JOHTO 遇 Gen1+Gen2
5. 训练师过滤：队伍宝可梦在所选地区世代范围内
6. Fairy 属性：所有属性映射 key 数量为 18
7. 话题 fallback：选 `y7_number` 后游戏不崩溃
8. 图鉴筛选：选 Kanto 只显示 Gen1，选 All 显示全部
9. 旅行事件组件渲染正常

---

## 十一、Task 折分（16 tasks）

| Task | 内容 | 依赖 |
|------|------|------|
| 1.1 | `types.ts` 扩展（Generation, Region, MathYear, MathTopic, Fairy, SaveData） | 无 |
| 1.2 | `constants.ts` 补全 Fairy 所有映射表 | 1.1 |
| 1.3 | 新增 `regionService.ts` | 1.1 |
| 1.4 | `useGameStore` 新增 `selectedRegion` / `mathYear` | 1.1, 1.3 |
| 1.5 | `usePlayerStore` 新增 `unlockedRegions` | 1.1 |
| 1.6 | `encounters.ts` 替换话题转世代逻辑 | 1.3, 1.4 |
| 1.7 | `trainers.ts` 替换 gen 参数 | 1.3, 1.4 |
| 1.8 | `topicRegistry.ts` 扩展 | 1.1 |
| 1.9 | `TopicSelect.tsx` 重写 | 1.8 |
| 1.10 | `RegionSelect.tsx` 新增（初始地区选择） | 1.3, 1.5 |
| 1.11 | `StarterSelect.tsx` 适配多地区 | 1.3, 1.4 |
| 1.12 | `itemData.ts` 注册旅行票券道具 | 1.3 |
| 1.13 | `RegionTravelEvent.tsx` + `eventRegistry` 注册 | 1.3, 1.5, 1.12 |
| 1.14 | 图鉴界面增加地区筛选 | 1.3 |
| 1.15 | `storageService.ts` 添加迁移函数 | 1.1, 1.4, 1.5 |
| 1.16 | `App.tsx` 更新游戏流程路由 | 1.10 |
