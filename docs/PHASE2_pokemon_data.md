# Phase 2: 宝可梦数据全量扩展（Gen 3-9）

---

## 核心原则：严格沿用现有数据逻辑

---

## Claude Code 的第一步

在生成任何数据之前，必须先完整阅读以下文件：

1. `types.ts` — PokedexEntry 接口完整定义
2. `data/gen1.ts` — roster 数据结构
3. `data/gen2.ts` — 确认与 gen1.ts 格式一致
4. `data/stats/gen1.ts` — stats 数据结构
5. `data/stats/gen2.ts` — 确认格式一致
6. `data/pokedexData.ts` — roster 如何合并和消费
7. `data/evolutionData.ts` — 进化链数据结构
8. `services/pokemonGenService.ts` — 稀有度如何被使用

---

## 数据生成策略

数据来源：脚本（https://pokeapi.co/）。编写脚本批量拉取原始数据，再按现有格式转换。
脚本是开发工具，放在 `scripts/` 目录，**不打包进游戏**。

---

## 各世代 ID 范围

| 世代 | 地区 | 图鉴范围 | 数量 |
|------|------|---------|------|
| Gen3 | Hoenn | #252-#386 | 135 |
| Gen4 | Sinnoh | #387-#493 | 107 |
| Gen5 | Unova | #494-#649 | 156 |
| Gen6 | Kalos | #650-#721 | 72 |
| Gen7 | Alola | #722-#809 | 88 |
| Gen8 | Galar | #810-#905 | 96 |
| Gen9 | Paldea | #906-#1010 | 105 |

---

## 进化链扩展

先读取 `data/evolutionData.ts`，理解现有结构，按相同格式追加。

### 新增进化道具

| 道具名 | 触发了哪类进化 | 示例 |
|--------|-------------|------|
| Dawn Stone | 道具进化 | Kirlia♂ → Gardevoir |
| Dusk Stone | 道具进化 | Murkrow → Honchkrow |
| Shiny Stone | 道具进化 | Togetic → Togekiss |
| Friendship Candy | 亲密度进化 | Golbat → Crobat, Riolu → Lucario |
| Trade Cable | 交换进化 | Boldore → Gigalith, Haunter → Gengar |

**不纳入**：Mega Evolution（临时形态）、Regional Forms（留 v1.1）、Gigantamax（已被移除）。

---

## 数据合并

- **`pokedexData.ts`**：不改变现有构建逻辑，只追加新世代 import。
  如果代码中有 `id<=151?1:2` 的世代判断，改为使用数据自带的 `generation` 字段。
- **`stats/index.ts`**：同理追加合并。

> Phase 1 的地区选择界面查 `FULL_ROSTER` 中是否存在对应世代数据 →
> Phase 2 数据到位后自动解锁，**无需改 Phase 1 代码**。

---

## Task 折分（12 tasks）

| Task | 内容 |
|------|------|
| 2.0 | 完整阅读现有数据文件，记录所有字段和规则 |
| 2.1 | 编写数据拉取脚本（PokeAPI → 项目格式） |
| 2.2 | Gen3 数据（Hoenn, 135 只） |
| 2.3 | Gen4 数据（Sinnoh, 107 只） |
| 2.4 | Gen5 数据（Unova, 156 只） |
| 2.5 | Gen6 数据（Kalos, 72 只，全量 Fairy） |
| 2.6 | Gen7 数据（Alola, 88 只） |
| 2.7 | Gen8 数据（Galar, 96 只） |
| 2.8 | Gen9 数据（Paldea, 105 只） |
| 2.9 | `pokedexData.ts` + `stats/index.ts` 合并 |
| 2.10 | `evolutionData.ts` 补充 Gen3-9 进化链 |
| 2.11 | `itemData.ts` 新增进化道具 |

---

## 验证标准

1. `FULL_ROSTER.length` 约为 1010
2. 每只新增宝可梦的数据结构与 `gen1.ts` 字段完全一致
3. 抽验 10 只宝可梦（每世代至少 1 只）的 name、types 与 Bulbapedia 一致
4. Fairy 属性宝可梦的 types 包含 `'Fairy'`
5. 进化链抽验（Ralts / Eevee / Wurmple / Tyrogue 等分支链）通过
6. 选择 Hoenn 地区 → 遭遇宝可梦在 #252-#386 范围内
7. 新增进化道具格式与现有道具一致
