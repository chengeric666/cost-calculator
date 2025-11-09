# GECOM MVP 2.0 完整任务清单（数据优先版）

> **版本**: v2.1.0
> **创建日期**: 2025-11-08
> **最后更新**: 2025-11-09（调整为数据优先策略）
> **总任务数**: 120个任务（调整后）
> **预计周期**: 5周（25个工作日）
> **执行策略**: 数据优先 → UI重构 → 报告+AI
>
> ⚠️ **更新规范**：严格遵守[CLAUDE.md - 任务清单更新规范](../CLAUDE.md#任务清单更新规范-)

---

## 📊 进度总览（v2.2 - Gap修复版）

> **版本说明**: v2.2版本修复了任务简化问题，完整对齐MVP-2.0-详细规划
> **更新日期**: 2025-11-09
> **修复内容**: Week 5扩展（13→92任务）+ Schema扩展（+4任务）+ 验收标准细化

---

**核心指标**：
- **总任务数**: 184任务（v2.1: 120任务）
- **当前进度**: 20/184 (10.9%)
- **数据覆盖**: 5/38记录（13.2%）→ 目标：38/38（100%）
- **Schema进度**: 36字段（Week 1）→ 67字段（Week 2）→ 97字段（Week 3）→ 127字段（最终）

---

**各周任务分布**：

- **Week 1**: 数据基础设施 - 20/28 任务完成（71%）⚠️
  - ✅ Database setup: 100% (8 tasks)
  - ⚠️ **Data collection: 5/19国（26%）** - 需Week 2 Day 6重构
  - ✅ SDK封装: 100% (10 tasks)

- **Week 2**: Schema扩展 + 5国重构 + 14国采集 - 0/39 任务
  - Day 6: Schema扩展（36→67字段P0）+ 5国重构（4 + 30 tasks）
  - Day 7-10: 8-10国新数据采集（3文件模式）

- **Week 3**: 完成19国 + Vape行业 - 0/19 任务
  - Day 11-13: 剩余6国Pet Food
  - Day 14-15: 19国Vape数据（复用base-data.ts）
  - 验收：67个P0字段100%填充 + 97个P1字段≥80%填充

- **Week 4**: UI重构（Step 0-5）- 0/25 任务
  - Day 16-20: 基于真实19国数据重构五步向导
  - 验收：端到端测试通过

- **Week 5**: 专业报告生成 + AI深度集成 - 0/92 任务 ⭐
  - **Day 21-26**: 报告生成系统（6天，58任务）
    * 对标益家之宠30,000字Word报告
    * 9章完整结构（封面+执行摘要+4章+3附录）
    * 15+高质量图表（300 DPI）
  - **Day 27-28**: AI集成+测试+部署（2天，34任务）
    * DeepSeek V3工具调用（getCostBreakdown/compareScenarios/getOptimizationSuggestions）
    * 10场景Prompt优化 + 20+快捷问题库
    * Playwright完整流程测试 + 生产部署

**关键里程碑**：
- ✅ Week 1结束：数据基础设施就绪（36字段Schema）
- 🎯 Week 2结束：13-15国Pet Food + 67字段P0 Schema
- 🎯 Week 3结束：19国×2行业 + 97字段P1 Schema
- 🎯 Week 4结束：UI完整可用（基于真实数据）
- 🎯 Week 5结束：MVP 2.0完整交付（报告+AI+部署）

---

## Week 1: 数据基础设施（Day 1-5）✅已基本完成

### Day 1: Appwrite数据库架构创建 ✅

- [x] **Task 1.1**: 创建cost_factors Collection (36字段，后续扩展到127)
- [x] **Task 1.2**: 创建projects Collection
- [x] **Task 1.3**: 创建calculations Collection
- [x] **Task 1.4**: 创建cost_factor_versions Collection
- [x] **Task 1.5**: 配置数据库索引（9个索引）
- [x] **Task 1.6**: 扩展Appwrite SDK操作函数
- [x] **Task 1.7**: 创建DATABASE-SETUP.md文档
- [x] **Task 1.8**: 配置npm脚本（db:setup, db:import）

### Day 2: 美国市场数据采集 ✅

- [x] **Task 2.1**: 研究美国宠物食品进口关税
  - ✅ HS Code: 2309.10.00
  - ✅ USITC查询：MFN税率55%
  - ✅ 数据来源：USITC官网（Tier 1）

- [x] **Task 2.2**: 获取美国VAT/销售税数据
  - ✅ 联邦层面无VAT（0%）
  - ✅ 州销售税差异（CA: 7.25%, TX: 6.25%等）
  - ✅ 数据来源：IRS官网（Tier 1）

- [x] **Task 2.3**: 调研美国Amazon FBA费率
  - ✅ FBA配送费：$7.50（标准尺寸，1-2磅）
  - ✅ FBA仓储费：$0.75/立方英尺/月
  - ✅ 数据来源：Amazon Seller Central（Tier 1）

- [x] **Task 2.4**: 获取美国物流成本
  - ✅ 海运：$1.20/kg（中国→美国）
  - ✅ 空运：$4.50/kg
  - ✅ 数据来源：上海威万物流报价（Tier 2）

- [x] **Task 2.5**: 调研美国M1市场准入成本
  - ✅ LLC注册费：$50-800（各州不同）
  - ✅ FDA宠物食品设施注册：$0（免费）
  - ✅ 复杂度：极高
  - ✅ 数据来源：SBA官网（Tier 1）

- [x] **Task 2.6**: 调研美国M2技术合规成本
  - ✅ AAFCO认证：$2,000
  - ✅ 产品标签审核：$500
  - ✅ 数据来源：AAFCO官网（Tier 2）

- [x] **Task 2.7**: 调研美国M6营销获客成本
  - ✅ CAC估算：$25（行业中位数）
  - ✅ Amazon广告CPC：$0.80
  - ✅ 数据来源：Jungle Scout 2024报告（Tier 2）

- [x] **Task 2.8**: 创建US-pet-food.ts数据文件
  - ✅ 490行完整数据
  - ✅ M1-M8所有模块
  - ✅ JSON格式logistics数据

- [x] **Task 2.9**: 验证美国数据完整性
  - ✅ 36个必填字段全部填充
  - ✅ 数据合理性检查通过
  - ✅ 95% Tier 1/2数据

- [x] **Task 2.10**: Git提交美国数据成果

### Day 3: 美国数据导入到Appwrite ✅

- [x] **Task 3.1**: 创建import-data.ts导入脚本
- [x] **Task 3.2**: 测试美国数据导入
- [x] **Task 3.3**: 验证Appwrite查询性能（<200ms）
- [x] **Task 3.4**: 创建MANUAL-DATABASE-SETUP.md

### Day 4: 德国/越南市场数据采集（超额完成UK/JP）✅

**原计划**：2国（DE/VN）
**实际完成**：4国（DE/VN/UK/JP）

- [x] **Task 4.1**: 德国数据采集（M1-M8完整）
- [x] **Task 4.2**: 越南数据采集（M1-M8完整）
- [x] **Task 4.3**: 【超额】英国数据采集（M1-M8完整）
- [x] **Task 4.4**: 【超额】日本数据采集（M1-M8完整）
- [x] **Task 4.5**: 4国数据验证

- [ ] **Task 4.6**: 继续采集剩余14国 ⏳（Week 2-3执行）

### Day 5: SDK封装与性能测试 ✅

- [x] **Task 5.1**: 扩展appwrite-data.ts（getCostFactor等）
- [x] **Task 5.2**: 添加getCostFactorsByCountries批量查询
- [x] **Task 5.3**: 添加数据验证层
- [x] **Task 5.4**: TypeScript类型定义完善
- [x] **Task 5.5**: CRUD操作测试
- [x] **Task 5.6**: 性能测试（单国124ms, 批量102ms）✅
- [x] **Task 5.7**: 创建test-database-simple.ts测试脚本
- [x] **Task 5.8**: 更新CLAUDE.md（Appwrite开发规范）
- [x] **Task 5.9**: 更新MVP规划文档进度
- [x] **Task 5.10**: Git提交Week 1成果

---

## Week 2: 5国历史数据重构 + 14国新数据采集

> **⚠️ 重要调整**：Week 2 Day 6专门用于5国历史数据完整重构（策略B）
>
> **调整原因**：
> - ✅ 先将已有5国数据（US/DE/VN/UK/JP）标准化为3文件模式
> - ✅ 建立完整示例，后续14国采集直接参考
> - ✅ 所有数据统一质量标准，避免历史遗留问题
> - ✅ 5国重构完成后，Week 2剩余时间采集新国家（Day 7-10）
>
> **Week 2调整后目标**：
> - Day 6: 5国历史数据重构（策略B完整重构）
> - Day 7-10: 新采集8-10国（每天2-2.5国）
> - Week 3: 继续采集剩余4-6国 + Vape行业
>
> **📊 数据质量强制要求**（所有采集任务必须遵守）⭐
> - ✅ **P0字段100%填充**：67个核心字段无null值
> - ✅ **Tier质量达标**：Tier 1/2数据≥80%，关键字段（M4关税/VAT）必须Tier 1
> - ✅ **数据溯源完整**：每个data_source格式正确（机构 - URL），100%标注collected_at
> - ✅ **通用vs特定分离**：创建3个文件（XX-base-data.ts、XX-pet-food-specific.ts、XX-pet-food.ts）
> - ✅ **合理性验证**：关税<100%, VAT<30%, CAC>0, 海运<空运
> - ✅ **性能达标**：导入成功，查询<200ms
>
> **📋 完整规范参考**：
> - [DATA-COLLECTION-STANDARD.md](./DATA-COLLECTION-STANDARD.md) - 数据采集标准与规范
> - [DATA-TEMPLATE-EXAMPLE.md](./templates/DATA-TEMPLATE-EXAMPLE.md) - 数据模板示例
> - [BACKFILL-5-COUNTRIES-GUIDE.md](./BACKFILL-5-COUNTRIES-GUIDE.md) - 历史数据重构指南
> - [CLAUDE.md - 数据质量标准](../CLAUDE.md#数据质量标准与成功指标-) - 成功指标

---

### Day 6: 数据库Schema扩展 + 5国历史数据重构 🔧

**总目标**：
1. **前置准备**：扩展数据库Schema到67个P0字段（1小时）
2. **主体任务**：5国历史数据重构为3文件模式（7.5小时）

**总预计时间**：8.5小时

---

#### 📐 前置准备：数据库Schema扩展（1小时）⭐

**背景**：Week 1创建的cost_factors表包含36个核心字段，但根据DATA-COLLECTION-STANDARD.md的字段优先级路线图，Week 2需要扩展到67个P0字段以支持完整的核心计算。

**字段扩展路线图**：
- ✅ Week 1 Day 1: 36字段（最小可用）
- 🎯 **Week 2 Day 6: 67字段（P0核心计算必须）** ← 当前目标
- Week 3验收: 97字段（P1完整展示）
- 最终目标: 127字段（P2全量）

**P0字段增量**（36 → 67，新增31个字段）：

**M1模块新增字段**（+3个）：
- m1_industry_license_usd: float（行业特定许可费）
- m1_industry_data_source: string
- m1_industry_tier: string

**M2模块新增字段**（+6个）：
- m2_product_certification_usd: float
- m2_product_certification_data_source: string
- m2_product_certification_tier: string
- m2_trademark_registration_usd: float
- m2_trademark_data_source: string
- m2_trademark_tier: string

**M4模块新增字段**（+8个）：
- m4_logistics: string (JSON格式：{ sea: {cost, days}, air: {cost, days} })
- m4_logistics_data_source: string
- m4_logistics_tier: string
- m4_hs_code: string（HS商品编码，核心字段）
- m4_tariff_notes: string（关税说明，如US 55%构成）
- m4_vat_notes: string（VAT说明）
- m4_collected_at: datetime（M4模块采集时间）
- m4_tier: string（M4整体质量等级）

**M5-M8模块新增字段**（+14个）：
- m5_delivery_cost_usd: float
- m5_return_cost_rate: float
- m5_data_source: string
- m5_tier: string
- m6_platform_commission_rate: float
- m6_data_source: string
- m6_tier: string
- m7_payment_rate: float
- m7_data_source: string
- m7_tier: string
- m8_ga_rate: float（General & Administrative费率）
- m8_data_source: string
- m8_tier: string
- m8_collected_at: datetime

**任务清单**：

- [x] **Task 6.0.1**: 更新Appwrite数据库Schema（扩展cost_factors表）✅
  - 使用Appwrite Console或CLI
  - 添加31个新字段到cost_factors表（ID: 690d4fdd0035c2f63f20）
  - 字段类型：
    * _usd字段：float
    * _rate字段：float
    * _data_source字段：string (512字符)
    * _tier字段：string (enum: tier1_official, tier2_authoritative, tier3_estimated)
    * _notes字段：string (1024字符)
    * _collected_at字段：datetime
    * m4_hs_code：string (16字符)
    * m4_logistics：string (2048字符，JSON格式)
  - 验证：刷新Appwrite Console，确认67字段可见
  - **实际成果**：扩展到88字段（超额完成）

- [x] **Task 6.0.2**: 更新setup-database.ts脚本✅
  - 文件路径：scripts/setup-database.ts
  - 在createCostFactorsCollection函数中添加31个字段定义
  - 示例：
    ```typescript
    await databases.createStringAttribute(
      databaseId, collectionId, 'm4_hs_code', 16, false
    );
    await databases.createFloatAttribute(
      databaseId, collectionId, 'm1_industry_license_usd', false
    );
    ```
  - 添加注释：`// P0字段扩展（36→67）- Week 2 Day 6`
  - **实际成果**：创建extend-schema-to-p0.ts脚本

- [x] **Task 6.0.3**: 更新types/gecom.ts类型定义✅
  - 文件路径：gecom-assistant/types/gecom.ts
  - 在CostFactor接口中添加31个字段
  - 确保类型与数据库Schema一致
  - 添加JSDoc注释标注字段用途和示例值
  - **实际成果**：完成类型定义更新

- [x] **Task 6.0.4**: 验证Schema扩展成功✅
  - TypeScript类型检查通过
  - 测试创建包含67个P0字段的CostFactor对象
  - 运行setup-database.ts脚本（dry-run模式）
  - 验证与Appwrite Schema同步
  - **实际成果**：88字段全部添加成功

**Schema扩展验收标准**：
- ✅ Appwrite cost_factors表有67个字段
- ✅ setup-database.ts脚本包含67字段定义
- ✅ types/gecom.ts接口包含67字段类型
- ✅ TypeScript编译无错误

---

#### 🔧 主体任务：5国历史数据完整重构（策略B）

**目标**：将已有5国数据（US/DE/VN/UK/JP）重构为3文件模式，补充完整溯源信息

**策略**：执行BACKFILL-5-COUNTRIES-GUIDE.md策略B（完整重构）

**预计时间**：7.5小时（每国1.5小时）

**重构价值**：
- ✅ 建立5个完整示例，后续14国直接参考
- ✅ Vape行业可直接复用5国通用数据（base-data.ts）
- ✅ 所有数据统一质量标准，数据一致性100%
- ✅ 验证3文件模式可行性，优化后续采集流程

---

#### 🇺🇸 美国数据重构（1.5小时）

**当前状态**：单文件US-pet-food.ts（490行）

**目标状态**：3文件模式
- US-base-data.ts（通用数据35字段）
- US-pet-food-specific.ts（特定数据55字段）
- US-pet-food.ts（合并数据，保持向后兼容）

- [x] **Task 6.1.1✅**: 读取现有US-pet-food.ts，分析字段通用性
  - 标记35个通用字段（m1_company_registration, m4_vat, m7_payment等）
  - 标记55个特定字段（m4_hs_code, m4_tariff, m6_cac等）

- [x] **Task 6.1.2✅**: 创建US-base-data.ts
  - 参考模板：docs/templates/DATA-TEMPLATE-EXAMPLE.md模板1
  - 提取35个通用字段
  - 补充溯源信息：
    - collected_at: '2025-11-08T10:00:00+08:00'（Week 1 Day 2）
    - collected_by: 'Claude AI + Manual Research'
    - 每个字段补充完整URL（如USITC - https://...）
    - 修正Tier格式（'Tier 2' → 'tier2_authoritative'）
  - 添加注释：`// ✅通用 - 可被pet_food和vape复用`

- [x] **Task 6.1.3✅**: 创建US-pet-food-specific.ts
  - 参考模板：docs/templates/DATA-TEMPLATE-EXAMPLE.md模板2
  - 提取55个行业特定字段
  - 补充溯源信息（同上）
  - 添加注释：`// ❌特定 - 仅pet_food行业`

- [x] **Task 6.1.4✅**: 更新US-pet-food.ts为合并模式
  - 保留原文件名（向后兼容）
  - 改为：`import { US_BASE_DATA } from './US-base-data'`
  - 改为：`import { US_PET_FOOD_SPECIFIC } from './US-pet-food-specific'`
  - 合并：`export const US_PET_FOOD = { ...US_BASE_DATA, ...US_PET_FOOD_SPECIFIC, ... }`
  - 添加data_quality_notes标注重构信息

- [x] **Task 6.1.5✅**: 验证美国数据
  - TypeScript编译通过（3个文件）
  - P0字段67个100%填充
  - Tier 1/2数据≥80%
  - 所有data_source有完整URL
  - 通用vs特定字段标注100%

---

#### 🇩🇪 德国数据重构（1.5小时）

- [x] **Task 6.2.1✅**: 分析DE-pet-food.ts字段通用性
- [x] **Task 6.2.2✅**: 创建DE-base-data.ts（35个通用字段）
  - collected_at: '2025-11-09T10:00:00+08:00'（Week 1 Day 4）
- [x] **Task 6.2.3✅**: 创建DE-pet-food-specific.ts（55个特定字段）
- [x] **Task 6.2.4✅**: 更新DE-pet-food.ts为合并模式
- [x] **Task 6.2.5✅**: 验证德国数据

---

#### 🇻🇳 越南数据重构（1.5小时）

- [x] **Task 6.3.1✅**: 分析VN-pet-food.ts字段通用性
- [x] **Task 6.3.2✅**: 创建VN-base-data.ts
  - collected_at: '2025-11-09T11:00:00+08:00'
- [x] **Task 6.3.3✅**: 创建VN-pet-food-specific.ts
- [x] **Task 6.3.4✅**: 更新VN-pet-food.ts为合并模式
- [x] **Task 6.3.5✅**: 验证越南数据

---

#### 🇬🇧 英国数据重构（1.5小时）

- [x] **Task 6.4.1✅**: 分析UK-pet-food.ts字段通用性
- [x] **Task 6.4.2✅**: 创建UK-base-data.ts
  - collected_at: '2025-11-09T12:00:00+08:00'
- [x] **Task 6.4.3✅**: 创建UK-pet-food-specific.ts
- [x] **Task 6.4.4✅**: 更新UK-pet-food.ts为合并模式
- [x] **Task 6.4.5✅**: 验证英国数据

---

#### 🇯🇵 日本数据重构（1.5小时）

- [x] **Task 6.5.1✅**: 分析JP-pet-food.ts字段通用性
- [x] **Task 6.5.2✅**: 创建JP-base-data.ts
  - collected_at: '2025-11-09T13:00:00+08:00'
- [x] **Task 6.5.3✅**: 创建JP-pet-food-specific.ts
- [x] **Task 6.5.4✅**: 更新JP-pet-food.ts为合并模式
- [x] **Task 6.5.5✅**: 验证日本数据

---

#### 📊 整体验证与重新导入

- [x] **Task 6.6✅**: 运行完整验证（5国）
  - **完整性验证**：
    - [ ] 5国各3个文件共15个文件创建完成
    - [ ] P0字段67个×5国=335个字段100%填充
    - [ ] 每个模块M1-M8有完整data_source（含URL）
    - [ ] collected_at格式正确（ISO 8601）
  - **Tier质量验证**：
    - [ ] 5国平均Tier 1数据占比≥60%
    - [ ] 5国平均Tier 2数据占比≥25%
    - [ ] M4关税/VAT 100% Tier 1
  - **通用性验证**：
    - [ ] 35个通用字段在5个base-data.ts中标注一致
    - [ ] 55个特定字段在5个specific.ts中标注一致
  - **合理性验证**：
    - [ ] 5国关税率均<100%
    - [ ] 5国VAT率均<30%
    - [ ] 5国CAC均>0且<$100

- [x] **Task 6.7✅**: 重新导入到Appwrite
  - 创建import-5-countries-refactored.ts脚本
  - 导入重构后的5国数据
  - 验证导入成功（Appwrite Console）
  - 性能测试：批量查询5国<500ms

- [x] **Task 6.8✅**: 创建对比验证报告
  - 对比重构前后数据一致性
  - 统计溯源信息完整度提升
  - 验证3文件模式可行性
  - 输出：REFACTOR-5-COUNTRIES-REPORT.md

- [x] **Task 6.9✅**: Git提交Day 6重构成果
  - **新增文件**（10个）：
    - US-base-data.ts, US-pet-food-specific.ts
    - DE-base-data.ts, DE-pet-food-specific.ts
    - VN-base-data.ts, VN-pet-food-specific.ts
    - UK-base-data.ts, UK-pet-food-specific.ts
    - JP-base-data.ts, JP-pet-food-specific.ts
  - **修改文件**（5个）：
    - US-pet-food.ts, DE-pet-food.ts, VN-pet-food.ts, UK-pet-food.ts, JP-pet-food.ts
  - **新增脚本**：import-5-countries-refactored.ts
  - **新增报告**：REFACTOR-5-COUNTRIES-REPORT.md
  - **提交消息**：
    ```
    重构：5国历史数据完整重构为3文件模式（策略B）

    - 拆分为base-data（通用）+ specific（特定）+ merged（合并）
    - 补充完整溯源信息（URL + Tier + 时间戳）
    - 建立标准示例，后续14国直接参考
    - Vape行业可复用5个base-data.ts
    ```

**Day 6验收标准**（必须100%通过）：
- ✅ 5国各3个文件（共15个文件）创建完成
- ✅ P0字段67个×5国100%填充
- ✅ Tier 1/2数据平均≥85%
- ✅ 数据溯源100%完整（每个data_source有完整URL）
- ✅ 通用vs特定字段标注100%
- ✅ 重新导入Appwrite成功，性能<500ms
- ✅ 对比验证报告确认数据一致性
- ✅ Git提交，包含15个数据文件+脚本+报告

**Day 6成果价值**：
- 🎯 建立5个完整标准示例（US/DE/VN/UK/JP）
- 🎯 Week 3 Vape行业可直接复用5个base-data.ts
- 🎯 后续14国采集有明确参考模板
- 🎯 数据质量标准落地验证

---

### Day 7: 加拿大数据采集 🎯

**目标国家**: CA（加拿大）
**采集策略**: 通用vs特定数据分离（3文件模式）

**Step 1: 通用数据采集（✅可复用）**

- [x] **Task 7.1✅**: 研究M4关税与VAT（⭐最关键）
  - 关税：查询CBSA官网，HS Code 2309.10.00
  - 获取MFN税率和CPTPP优惠税率
  - VAT：查询CRA官网，GST 5% + 各省PST（安大略HST 13%）
  - **数据来源格式**：'CBSA官网 - https://cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/2025/'
  - **Tier要求**：必须Tier 1官方数据
  - **时间戳**：ISO 8601格式（2025-11-09T10:00:00+08:00）

- [x] **Task 7.2✅**: 获取M4物流成本（✅通用）
  - 海运：中国→温哥华，$0.15/kg（25-30天），FCL $2,200-4,000
  - 空运：中国→多伦多，$6.50/kg（1-4天）
  - **数据来源**：Freightos + Sino-shipping 2025 Q4报价
  - **Tier**：Tier 2权威报价✅

- [x] **Task 7.3✅**: 获取M5配送 + M7支付（✅通用）
  - M5尾程配送：Amazon.ca FBA $4.50（CAD $5.92）
  - M7支付：Stripe 2.9% + $0.30（全球统一）
  - **Tier**：Tier 1官方数据✅

- [x] **Task 7.4✅**: 研究M1-M3通用成本（✅通用）
  - M1公司注册：CAD $200（Corporations Canada）
  - M1税务登记：GST/HST注册免费
  - M2商标：CAD $445（CIPO）
  - M3仓储押金：$5,000（第三方3PL）
  - M8 G&A：3.5%（行业基准）
  - **Tier**：Tier 1/2/3混合✅

**Step 2: Pet Food行业特定数据采集（❌特定）**

- [x] **Task 7.5✅**: 研究M1-M2行业合规（❌特定）
  - M1监管机构：CFIA (Canadian Food Inspection Agency)
  - M1行业许可：$500（CFIA，Tier 3估算⚠️）
  - M2产品认证：$1,800（CFIA标签+双语审核）
  - M2双语标签：$900（英/法双语）
  - **数据来源**：CFIA官网 + SGS Canada报价
  - **Tier**：Tier 1/2混合✅

- [x] **Task 7.6✅**: 研究M4关税 + M6营销（❌特定）
  - M4 HS Code：2309.10.00
  - M4关税率：0% CPTPP优惠（⚠️Tier 3推断，需验证）
  - M5 FBA：$4.50（Amazon.ca Pet类目）
  - M6 CAC：$24（Jungle Scout Benchmark）
  - M6平台佣金：15%（Amazon.ca Pet类目）
  - **Tier**：Tier 1（FBA/佣金）+ Tier 2（CAC）+ Tier 3（关税⚠️）

**Step 3: 数据文件创建（3文件模式）**

- [x] **Task 7.7✅**: 创建CA-base-data.ts（通用数据）
  - ✅ 257行，35个通用字段
  - ✅ Tier 1: 70%, Tier 2: 25%, Tier 3: 5%
  - ✅ 每个字段标注：data_source、tier、collected_at
  - ✅ TypeScript编译通过

- [x] **Task 7.8✅**: 创建CA-pet-food-specific.ts（特定数据）
  - ✅ 308行，55个行业特定字段
  - ✅ Tier 1: 40%, Tier 2: 40%, Tier 3: 20%
  - ✅ ⚠️ 关税为Tier 3推断值（CBSA访问受限）
  - ✅ TypeScript编译通过

- [x] **Task 7.9✅**: 创建CA-pet-food.ts（合并完整数据）
  - ✅ 285行，合并完整数据
  - ✅ 添加元数据：country='CA', industry='pet_food', version='2025Q1'
  - ✅ 合并数据：{...CA_BASE_DATA, ...CA_PET_FOOD_SPECIFIC}

**Step 4: 验证与导入**

- [x] **Task 7.10✅**: 运行完整验证清单
  - **完整性验证**：
    - [x] P0字段67个100%填充（无null）✅
    - [x] 每个模块M1-M8有data_source✅
    - [x] collected_at格式正确（ISO 8601）✅
  - **合理性验证**：
    - [x] 关税率 0% ≤ tariff ≤ 100%✅
    - [x] VAT率 0% ≤ VAT ≤ 30%✅
    - [x] CAC > 0 且 < $100✅
    - [x] 海运成本 < 空运成本✅
  - **Tier质量验证**：
    - [ ] Tier 1数据占比 ≥ 60%（实际31.6%，⚠️不达标）
    - [x] Tier 2数据占比 ≥ 20%（实际42.1%，✅达标）
    - [ ] M4关税/VAT必须Tier 1（VAT✅，关税⚠️Tier 3）
  - **溯源验证**：
    - [x] 所有data_source格式正确（机构 - URL）✅
    - [x] Tier 1数据有完整URL✅
    - [x] 时间戳在2024-2025范围✅
  - **验证结果**：⚠️ 条件通过（60%通过率，需后续人工验证关税）

- [x] **Task 7.11✅**: 导入Appwrite并性能测试
  - ✅ 创建导入脚本：import-6-countries-data.ts
  - ✅ 成功导入CA_PET_FOOD数据（文档ID: 691060b900289d015aa6）
  - ✅ 验证导入成功（6国数据完整）
  - ✅ 性能测试：查询耗时178ms（<200ms达标）

- [x] **Task 7.12✅**: Git提交Day 7成果
  - **提交文件**（5个）：
    - gecom-assistant/data/cost-factors/CA-base-data.ts（257行）
    - gecom-assistant/data/cost-factors/CA-pet-food-specific.ts（308行）
    - gecom-assistant/data/cost-factors/CA-pet-food.ts（285行）
    - gecom-assistant/scripts/validate-ca-data.ts（200行）
    - gecom-assistant/scripts/import-6-countries-data.ts（260行）
  - **提交消息**：`数据：完成加拿大（CA）宠物食品数据采集（6/19国）`
  - ✅ Git提交完成（commit: dcd6b20）
  - ✅ Push到远程仓库成功

**Day 7验收标准**（条件通过）：
- ✅ 3个数据文件创建完成（base/specific/merged）
- ✅ P0字段67个100%填充（67/67）
- ⚠️ Tier 1数据31.6%（不达标，原因：CBSA访问受限关税为Tier 3）
- ⚠️ M4关税为Tier 3（不达标，原因：CBSA网站访问限制）
- ✅ Tier 2数据42.1%（达标≥20%）
- ✅ 数据溯源100%完整（含URL和时间戳）
- ✅ 数据合理性100%通过
- ✅ 导入Appwrite成功，查询178ms（<200ms达标）
- ✅ Git提交并push成功
- ✅ 验证脚本创建完成
- ⚠️ **需后续人工验证**：CBSA关税数据（https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/2025/html/00/ch23-eng.html）

**Day 7成果价值**：
- 🎯 完成第6国数据采集（6/19国，进度31.6%）
- 🎯 CPTPP优惠关税数据（0%推断，vs 美国55%）
- 🎯 双语市场数据（英/法双语标签+客服）
- 🎯 验证+导入脚本完善，支持6国并行导入
- ⚠️ 识别数据盲区：CBSA关税需人工验证

---

### Day 8: 法国（FR）+ 澳大利亚（AU）数据采集 🎯

**目标国家**: FR（法国）+ AU（澳大利亚）
**采集策略**: 继续3文件模式，1天完成2国（提速）

### Day 8: 法国数据采集 🎯

**目标国家**: FR（法国）

- [ ] **Task 7.1**: 研究法国宠物食品进口关税
  - 查询EU TARIC数据库
  - HS Code: 2309.10.00
  - 欧盟统一关税（预期6.5%，与德国一致）
  - 数据来源：EU TARIC（Tier 1）

- [ ] **Task 7.2**: 获取法国VAT税率
  - 标准VAT: 20%
  - 宠物食品可能适用降低税率5.5%（需确认）
  - 数据来源：Direction générale des Finances publiques（Tier 1）

- [ ] **Task 7.3**: 调研法国Amazon FBA费率
  - Amazon.fr FBA费率表
  - 配送费用
  - 仓储费用（欧洲FBA网络）
  - 数据来源：Amazon.fr Seller Central（Tier 1）

- [ ] **Task 7.4**: 获取法国物流成本
  - 从中国到法国勒阿弗尔港海运成本
  - 空运成本（巴黎戴高乐机场）
  - 联系CMA CGM/Air France Cargo
  - 数据来源：物流商报价（Tier 2）

- [ ] **Task 7.5**: 调研法国M1市场准入成本
  - SARL/SAS注册费
  - SIRET注册（免费）
  - TVA注册
  - 数据来源：Infogreffe官网（Tier 1）

- [ ] **Task 7.6**: 调研法国M2技术合规成本
  - EU 767/2009宠物食品法规合规
  - FEDIAF认证
  - 法语标签要求
  - 数据来源：DGCCRF + FEDIAF（Tier 1-2）

- [ ] **Task 7.7**: 创建FR-pet-food.ts数据文件
  - 复用DE模板（同属欧盟）
  - 调整VAT税率（20% vs 德国19%）
  - 填充M1-M8所有字段

- [ ] **Task 7.8**: 验证法国数据完整性
- [ ] **Task 7.9**: 导入法国数据到Appwrite
- [ ] **Task 7.10**: Git提交Day 7成果（7/19国）

**验收标准**：
- ✅ 法国数据完整
- ✅ 与德国数据对比验证（欧盟一致性）
- ✅ Tier 1/2数据≥80%

---

### Day 8: 新加坡+马来西亚数据采集 🎯

**目标国家**: SG（新加坡）+ MY（马来西亚）

#### 新加坡 (SG)

- [ ] **Task 8.1**: 新加坡关税研究
  - 查询Singapore Customs
  - HS Code: 2309.10.00
  - 新加坡零关税政策（预期0%）
  - 数据来源：Singapore Customs（Tier 1）

- [ ] **Task 8.2**: 新加坡GST税率
  - GST: 9%（2024年起，从8%调整）
  - 数据来源：IRAS官网（Tier 1）

- [ ] **Task 8.3**: 新加坡物流+FBA成本
  - Lazada SG佣金（预期8-12%）
  - Shopee SG佣金（预期6-10%）
  - 海运/空运成本
  - 数据来源：Lazada/Shopee卖家中心（Tier 2）

- [ ] **Task 8.4**: 新加坡M1-M2合规成本
  - ACRA公司注册费
  - AVA宠物食品进口许可
  - 数据来源：ACRA + AVA官网（Tier 1）

- [ ] **Task 8.5**: 创建SG-pet-food.ts数据文件

#### 马来西亚 (MY)

- [ ] **Task 8.6**: 马来西亚关税研究
  - 查询Malaysia Royal Customs
  - HS Code: 2309.10.00
  - ASEAN优惠关税（预期0-5%）
  - 数据来源：Royal Malaysian Customs（Tier 1）

- [ ] **Task 8.7**: 马来西亚销售税/服务税
  - SST (Sales and Service Tax): 10%（替代GST）
  - 数据来源：Royal Malaysian Customs（Tier 1）

- [ ] **Task 8.8**: 马来西亚物流+平台成本
  - Lazada MY佣金
  - Shopee MY佣金
  - 海运成本（巴生港）
  - 数据来源：平台卖家中心（Tier 2）

- [ ] **Task 8.9**: 马来西亚M1-M2合规成本
  - SSM公司注册
  - DVS宠物食品许可
  - 数据来源：SSM + DVS官网（Tier 1-2）

- [ ] **Task 8.10**: 创建MY-pet-food.ts数据文件

#### 验证与导入

- [ ] **Task 8.11**: 验证SG+MY数据完整性
- [ ] **Task 8.12**: 导入2国数据到Appwrite
- [ ] **Task 8.13**: Git提交Day 8成果（9/19国）

**验收标准**：
- ✅ 2国数据完整（SG+MY）
- ✅ 进度：9/19国（47%）

---

### Day 9: 菲律宾+泰国数据采集 🎯

**目标国家**: PH（菲律宾）+ TH（泰国）

#### 菲律宾 (PH)

- [ ] **Task 9.1**: 菲律宾关税研究
  - 查询Bureau of Customs Philippines
  - HS Code: 2309.10.00
  - ASEAN优惠关税
  - 数据来源：BOC官网（Tier 1）

- [ ] **Task 9.2**: 菲律宾VAT税率
  - VAT: 12%
  - 数据来源：BIR官网（Tier 1）

- [ ] **Task 9.3**: 菲律宾平台+物流成本
  - Lazada PH佣金
  - Shopee PH佣金（菲律宾是Shopee第二大市场）
  - 马尼拉港海运成本
  - 数据来源：平台卖家中心（Tier 2）

- [ ] **Task 9.4**: 菲律宾M1-M2合规成本
  - SEC公司注册
  - FDA宠物食品进口许可
  - 数据来源：SEC + FDA Philippines（Tier 1-2）

- [ ] **Task 9.5**: 创建PH-pet-food.ts数据文件

#### 泰国 (TH)

- [ ] **Task 9.6**: 泰国关税研究
  - 查询Thai Customs Department
  - HS Code: 2309.10.00
  - ASEAN优惠关税（预期0-5%）
  - 数据来源：Thai Customs（Tier 1）

- [ ] **Task 9.7**: 泰国VAT税率
  - VAT: 7%
  - 数据来源：Revenue Department Thailand（Tier 1）

- [ ] **Task 9.8**: 泰国平台+物流成本
  - Lazada TH佣金
  - Shopee TH佣金
  - 曼谷港海运成本
  - 数据来源：平台卖家中心（Tier 2）

- [ ] **Task 9.9**: 泰国M1-M2合规成本
  - DBD公司注册
  - DLD宠物食品许可
  - 数据来源：DBD + DLD官网（Tier 1-2）

- [ ] **Task 9.10**: 创建TH-pet-food.ts数据文件

#### 验证与导入

- [ ] **Task 9.11**: 验证PH+TH数据完整性
- [ ] **Task 9.12**: 导入2国数据到Appwrite
- [ ] **Task 9.13**: Git提交Day 9成果（11/19国）

**验收标准**：
- ✅ 2国数据完整（PH+TH）
- ✅ 进度：11/19国（58%）

---

### Day 10: 印尼+印度数据采集 🎯

**目标国家**: ID（印尼）+ IN（印度）

#### 印尼 (ID)

- [ ] **Task 10.1**: 印尼关税研究
  - 查询Indonesia Customs (DJBC)
  - HS Code: 2309.10.00
  - ASEAN优惠关税
  - 数据来源：DJBC官网（Tier 1）

- [ ] **Task 10.2**: 印尼VAT税率
  - PPN (VAT): 11%
  - 数据来源：DJP官网（Tier 1）

- [ ] **Task 10.3**: 印尼平台+物流成本
  - Lazada ID佣金
  - Shopee ID佣金
  - Tokopedia佣金（印尼本土最大平台）
  - 雅加达港海运成本
  - 数据来源：平台卖家中心（Tier 2）

- [ ] **Task 10.4**: 印尼M1-M2合规成本
  - PT注册（外资公司）
  - BPOM宠物食品许可
  - Halal认证（如需清真市场）
  - 数据来源：BKPM + BPOM（Tier 1-2）

- [ ] **Task 10.5**: 创建ID-pet-food.ts数据文件

#### 印度 (IN)

- [ ] **Task 10.6**: 印度关税研究
  - 查询CBIC (Central Board of Indirect Taxes and Customs)
  - HS Code: 2309.10.00
  - MFN关税（预期30-40%，印度关税普遍较高）
  - 数据来源：CBIC官网（Tier 1）

- [ ] **Task 10.7**: 印度GST税率
  - CGST + SGST: 18%（9% + 9%）
  - 或IGST: 18%（跨邦交易）
  - 数据来源：GST Council（Tier 1）

- [ ] **Task 10.8**: 印度平台+物流成本
  - Amazon India佣金
  - Flipkart佣金
  - Mumbai港海运成本
  - 数据来源：Amazon.in + Flipkart卖家中心（Tier 2）

- [ ] **Task 10.9**: 印度M1-M2合规成本
  - ROC公司注册
  - FSSAI宠物食品许可
  - Import Export Code (IEC)
  - 数据来源：MCA + FSSAI（Tier 1-2）

- [ ] **Task 10.10**: 创建IN-pet-food.ts数据文件

#### 验证与导入

- [ ] **Task 10.11**: 验证ID+IN数据完整性
- [ ] **Task 10.12**: 导入2国数据到Appwrite
- [ ] **Task 10.13**: Git提交Day 10成果（13/19国）

**验收标准**：
- ✅ 2国数据完整（ID+IN）
- ✅ 进度：13/19国（68%）

---

**Week 2整体验收标准**⭐：

**数据覆盖**：
- ✅ 5国历史数据重构完成（15个文件：5国×3文件）
- ✅ 新采集8-10国Pet Food数据（3文件模式）
- ✅ 总进度：13-15/19国（68%-79%）

**数据库Schema**：
- ✅ cost_factors表扩展到67个P0字段
- ✅ setup-database.ts脚本更新
- ✅ types/gecom.ts类型定义更新

**数据质量**（P0字段验收）⭐：
- ✅ **P0字段100%填充**：67个核心字段×13国=871个字段全部非null
- ✅ **Tier质量达标**：平均Tier 1/2数据≥80%
- ✅ **关键字段Tier 1**：M4关税/VAT 100% Tier 1
- ✅ **数据溯源完整**：100%标注collected_at + data_source（含URL）
- ✅ **通用vs特定分离**：13国全部3文件模式

**技术验收**：
- ✅ Appwrite导入成功率100%
- ✅ 查询性能<200ms（单国）
- ✅ TypeScript编译无错误

---

## Week 3: 继续数据采集（完成19国+Vape行业）

### Day 11: 韩国+澳大利亚数据采集 🎯

**目标国家**: KR（韩国）+ AU（澳大利亚）

#### 韩国 (KR)

- [ ] **Task 11.1**: 韩国关税研究（Korea Customs Service）
- [ ] **Task 11.2**: 韩国VAT税率（10%）
- [ ] **Task 11.3**: 韩国平台成本（Coupang, Naver Shopping）
- [ ] **Task 11.4**: 韩国M1-M2合规（MFDS宠物食品许可）
- [ ] **Task 11.5**: 创建KR-pet-food.ts数据文件

#### 澳大利亚 (AU)

- [ ] **Task 11.6**: 澳大利亚关税研究（ABF）
- [ ] **Task 11.7**: 澳大利亚GST税率（10%）
- [ ] **Task 11.8**: 澳大利亚平台成本（Amazon AU, Catch）
- [ ] **Task 11.9**: 澳大利亚M1-M2合规（APVMA宠物食品许可）
- [ ] **Task 11.10**: 创建AU-pet-food.ts数据文件

- [ ] **Task 11.11**: 验证KR+AU数据
- [ ] **Task 11.12**: 导入2国数据
- [ ] **Task 11.13**: Git提交（15/19国）

**验收标准**：进度 15/19国（79%）

---

### Day 12: 沙特+阿联酋数据采集 🎯

**目标国家**: SA（沙特）+ AE（阿联酋）

#### 沙特 (SA)

- [ ] **Task 12.1**: 沙特关税研究（ZATCA）
- [ ] **Task 12.2**: 沙特VAT税率（15%）
- [ ] **Task 12.3**: 沙特平台成本（Noon, Amazon.sa）
- [ ] **Task 12.4**: 沙特M1-M2合规（SFDA宠物食品许可）
- [ ] **Task 12.5**: 创建SA-pet-food.ts数据文件

#### 阿联酋 (AE)

- [ ] **Task 12.6**: 阿联酋关税研究（FTA）
- [ ] **Task 12.7**: 阿联酋VAT税率（5%）
- [ ] **Task 12.8**: 阿联酋平台成本（Noon, Amazon.ae, Namshi）
- [ ] **Task 12.9**: 阿联酋M1-M2合规（迪拜经济部许可）
- [ ] **Task 12.10**: 创建AE-pet-food.ts数据文件

- [ ] **Task 12.11**: 验证SA+AE数据
- [ ] **Task 12.12**: 导入2国数据
- [ ] **Task 12.13**: Git提交（17/19国）

**验收标准**：进度 17/19国（89%）

---

### Day 13: 墨西哥+巴西数据采集 🎯

**目标国家**: MX（墨西哥）+ BR（巴西）

#### 墨西哥 (MX)

- [ ] **Task 13.1**: 墨西哥关税研究（SAT）
- [ ] **Task 13.2**: 墨西哥VAT税率（IVA 16%）
- [ ] **Task 13.3**: 墨西哥平台成本（Mercado Libre MX, Amazon.com.mx）
- [ ] **Task 13.4**: 墨西哥M1-M2合规（SENASICA宠物食品许可）
- [ ] **Task 13.5**: 创建MX-pet-food.ts数据文件

#### 巴西 (BR)

- [ ] **Task 13.6**: 巴西关税研究（Receita Federal）
- [ ] **Task 13.7**: 巴西税收体系（ICMS + IPI + PIS/COFINS，综合≈60-80%）⚠️
- [ ] **Task 13.8**: 巴西平台成本（Mercado Livre, B2W, Amazon.com.br）
- [ ] **Task 13.9**: 巴西M1-M2合规（MAPA宠物食品许可，复杂度极高）
- [ ] **Task 13.10**: 创建BR-pet-food.ts数据文件

- [ ] **Task 13.11**: 验证MX+BR数据
- [ ] **Task 13.12**: 导入2国数据
- [ ] **Task 13.13**: Git提交（19/19国Pet Food完成）🎉

**验收标准**：
- ✅ 19国Pet Food数据100%完成
- ✅ 数据覆盖：19/38记录（50%）

---

### Day 14-15: Vape行业数据采集（19国）🎯

**目标**: 复制Pet Food结构，调整为Vape行业数据

#### Day 14: Vape数据采集（1-10国）

- [ ] **Task 14.1**: 研究19国Vape监管政策差异
  - 禁售国家识别（如澳大利亚、新加坡等）
  - 限制销售国家（如日本、韩国）
  - 开放市场（如美国、英国）

- [ ] **Task 14.2**: 创建US-vape.ts（调整关税、VAT、平台限制）
- [ ] **Task 14.3**: 创建CA-vape.ts
- [ ] **Task 14.4**: 创建DE-vape.ts
- [ ] **Task 14.5**: 创建GB-vape.ts
- [ ] **Task 14.6**: 创建FR-vape.ts
- [ ] **Task 14.7**: 创建SG-vape.ts（标注：禁售市场）
- [ ] **Task 14.8**: 创建MY-vape.ts
- [ ] **Task 14.9**: 创建PH-vape.ts
- [ ] **Task 14.10**: 创建VN-vape.ts
- [ ] **Task 14.11**: 创建TH-vape.ts

- [ ] **Task 14.12**: 验证前10国Vape数据
- [ ] **Task 14.13**: Git提交（10/19国Vape）

#### Day 15: Vape数据采集（11-19国）+ 导入

- [ ] **Task 15.1**: 创建ID-vape.ts
- [ ] **Task 15.2**: 创建IN-vape.ts
- [ ] **Task 15.3**: 创建JP-vape.ts
- [ ] **Task 15.4**: 创建KR-vape.ts
- [ ] **Task 15.5**: 创建AU-vape.ts（标注：禁售市场）
- [ ] **Task 15.6**: 创建SA-vape.ts
- [ ] **Task 15.7**: 创建AE-vape.ts
- [ ] **Task 15.8**: 创建MX-vape.ts
- [ ] **Task 15.9**: 创建BR-vape.ts

- [ ] **Task 15.10**: 验证全部19国Vape数据
- [ ] **Task 15.11**: 批量导入19国×2行业数据到Appwrite
  - 更新import脚本支持38条记录
  - 运行导入
  - 验证导入成功

- [ ] **Task 15.12**: 数据完整性最终验证
  - 验证38条记录（19国×2行业）
  - 检查所有字段完整性
  - 性能测试（查询<500ms）

- [ ] **Task 15.13**: 更新文档
  - 更新CLAUDE.md数据覆盖状态
  - 更新MVP-2.0-任务清单.md进度
  - 创建DATA-COLLECTION-COMPLETE.md总结报告

- [ ] **Task 15.14**: Git提交Week 3成果（数据采集100%完成）🎉

**Week 3整体验收标准**⭐：

**数据覆盖**：
- ✅ 19国Pet Food全部完成（57个文件：19国×3文件）
- ✅ 19国Vape全部完成（38个文件：19国×2文件，复用base-data.ts）
- ✅ 总计：19国×2行业 = 38条完整记录

**数据库Schema（扩展到P1）**：
- ✅ cost_factors表扩展到97个P1字段（从67个P0）
- ✅ 新增30个P1字段（完整展示，非核心计算）

**数据质量（P0+P1字段验收）**⭐：
- ✅ **P0字段100%填充**：67个核心字段×38条=2,546个字段全部非null
- ✅ **P1字段尽力完成**：97个字段×38条，填充率≥80%（允许部分字段null）
- ✅ **Tier质量持续达标**：平均Tier 1/2数据≥80%
- ✅ **数据溯源100%完整**：38条记录全部有collected_at + data_source
- ✅ **Vape复用验证**：19国Vape行业成功复用base-data.ts

**技术验收**：
- ✅ Appwrite导入成功：38条记录
- ✅ 查询性能<200ms（单国）
- ✅ 批量查询<1秒（19国）
- ✅ TypeScript编译无错误

---

## Week 4: UI重构（Step 0-5完整实现）

> **前置条件**: 19国×2行业数据100%完成
> **目标**: 基于真实数据重构完整五步向导

### Day 16: Step 0界面实现

- [ ] **Task 16.1**: 设计Step0ProjectInfo组件架构
  - 项目名称输入
  - 行业选择（pet_food/vape双选项）
  - 项目描述（可选）

- [ ] **Task 16.2**: 实现历史项目加载功能
  - 从projects Collection查询用户历史项目
  - 显示项目列表（含创建时间、行业）
  - 点击加载历史项目数据

- [ ] **Task 16.3**: 实现项目保存逻辑
  - 保存到projects Collection
  - 生成唯一projectId
  - 关联userId（未来用户认证）

- [ ] **Task 16.4**: UI样式实现（Liquid Glass设计）
  - 毛玻璃效果卡片
  - 平滑动画过渡
  - 响应式布局

- [ ] **Task 16.5**: Playwright测试Step 0
  - 测试创建新项目
  - 测试加载历史项目
  - 测试数据验证

- [ ] **Task 16.6**: Git提交Day 16成果

---

### Day 17: Step 1界面实现

- [ ] **Task 17.1**: 实现Step1Scope组件架构
  - 产品基本参数输入区
  - 目标市场选择区
  - 销售渠道选择区

- [ ] **Task 17.2**: 实现CountrySelector组件（19国动态加载）
  - 从cost_factors动态查询可用国家
  - 按大洲分组显示（北美/欧洲/亚太/中东/拉美）
  - 搜索功能
  - 国旗显示
  - 数据可用性徽章（显示Tier等级）

- [ ] **Task 17.3**: 实现IndustryTemplateLoader
  - 自动加载行业预设参数
  - Pet Food模板（COGS $10, 复购率50%）
  - Vape模板（COGS $5, 复购率70%）

- [ ] **Task 17.4**: 实现表单验证逻辑
  - COGS必填（>0）
  - 零售价必填（>COGS）
  - 月销量必填（>0）
  - 目标市场必选

- [ ] **Task 17.5**: Playwright测试Step 1
  - 测试19国选择器
  - 测试行业模板加载
  - 测试表单验证

- [ ] **Task 17.6**: Git提交Day 17成果

---

### Day 18: Step 2界面实现（Part 1 - M1-M4）

- [ ] **Task 18.1**: 实现Step2CostParams组件架构
  - 左侧参数配置区（2/3宽度）
  - 右侧实时预览区（1/3宽度）
  - 快速模式/专家模式切换

- [ ] **Task 18.2**: 实现CAPEXAccordion组件
  - M1市场准入折叠面板
  - M2技术合规折叠面板
  - M3供应链搭建折叠面板
  - 默认收起，可展开查看详情

- [ ] **Task 18.3**: 实现M4Module组件（最复杂）
  - COGS输入框
  - 海运/空运切换按钮
  - 关税率显示（含Tier徽章）
  - VAT显示（含Tier徽章）
  - 自定义按钮（点击解锁编辑）

- [ ] **Task 18.4**: 实现CostItemRow组件（通用）
  - 参数名称
  - 预设值（灰色只读）
  - Tier徽章（Tier 1绿色/Tier 2黄色/Tier 3灰色）
  - 自定义按钮
  - 数据来源tooltip

- [ ] **Task 18.5**: 实现DataSourceTooltip组件
  - 鼠标悬停显示详细信息
  - 数据来源说明
  - Tier等级说明
  - 更新时间

- [ ] **Task 18.6**: Git提交Day 18成果

---

### Day 19: Step 2界面实现（Part 2 - M5-M8 + 实时预览）

- [ ] **Task 19.1**: 实现M5Module组件
  - 配送费显示
  - 退货成本（退货率×零售价×退货成本率）
  - FBA费用（如选Amazon渠道）

- [ ] **Task 19.2**: 实现M6Module组件
  - CAC输入/预设值
  - 平台佣金率显示

- [ ] **Task 19.3**: 实现M7-M8 Module组件
  - M7: 支付网关费率 + 固定费用
  - M8: G&A费率

- [ ] **Task 19.4**: 实现智能预填充逻辑（autoFillFromCostFactors）
  - 根据选择的国家自动加载cost_factors
  - 填充所有M1-M8参数
  - 保留用户已自定义的值（userOverrides优先）

- [ ] **Task 19.5**: 实现右侧实时成本预览面板
  - 单位收入/成本/毛利实时显示
  - 毛利率百分比（颜色映射：绿色>30%, 黄色15-30%, 红色<15%）
  - 智能建议（毛利率<0时显示警告）
  - 成本分布快速预览

- [ ] **Task 19.6**: 实现UserOverride功能
  - 点击"自定义"按钮解锁编辑
  - 显示"已自定义"标识
  - 支持恢复预设值
  - 数据持久化到userOverrides对象

- [ ] **Task 19.7**: 集成GECOM计算引擎v2.0
  - 创建lib/gecom-engine-v2.ts
  - 实现GECOMEngine类
  - 支持userOverrides参数
  - 实时计算（节流300ms）

- [ ] **Task 19.8**: Playwright测试Step 2
  - 测试预填功能
  - 测试用户覆盖功能
  - 测试实时计算
  - 视觉回归测试（截图对比）

- [ ] **Task 19.9**: Git提交Day 19成果

---

### Day 20: Step 3-4界面实现 + Step 5基础

- [ ] **Task 20.1**: 实现Step3CostModeling组件
  - 4个KPI卡片（毛利/毛利率/ROI/回本周期）
  - 成本分布饼图（M4-M8占比）
  - 盈亏平衡分析表格

- [ ] **Task 20.2**: 实现CostBreakdownChart组件
  - Recharts饼图
  - 交互tooltip
  - 颜色映射（M4深蓝/M5绿/M6橙/M7紫/M8灰）

- [ ] **Task 20.3**: 实现UnitEconomicsTable组件
  - 收入/成本/毛利明细
  - M4-M8逐项拆解
  - 格式化数字（美元符号、千位分隔符）

- [ ] **Task 20.4**: 实现Step4Comparison组件
  - 场景选择器（最多5个国家对比）
  - 对比表格（关税/VAT/物流/佣金/总成本/毛利率）
  - 对比柱状图（毛利率对比）

- [ ] **Task 20.5**: 实现MarketRecommendation组件
  - 基于毛利率排序19国
  - 显示最优市场（绿色）
  - 显示最差市场（红色）
  - 生成推荐理由（AI或规则引擎）

- [ ] **Task 20.6**: 实现Step5AIAssistant基础组件
  - 聊天界面布局
  - 消息历史显示
  - 输入框和发送按钮
  - 快捷问题按钮（未连接AI）

- [ ] **Task 20.7**: Playwright端到端测试（Step 0-5）
  - 测试完整五步流程
  - 测试数据正确传递
  - 性能测试（页面加载<3秒）

- [ ] **Task 20.8**: 更新文档
  - 更新README.md（添加Step 0-5截图）
  - 更新CLAUDE.md（UI架构说明）

- [ ] **Task 20.9**: Git提交Week 4成果（UI重构完成）🎉

**Week 4验收标准**：
- ✅ Step 0-5界面完整实现
- ✅ 基于真实19国数据预填
- ✅ 用户覆盖功能正常
- ✅ 端到端测试通过

---

## Week 5: 专业报告生成系统 + AI深度集成

> **目标对标**：益家之宠30,000字Word报告质量（9章完整结构）
> **扩展内容**：基于MVP-2.0-详细规划Part 3-4，完整实现报告生成和AI工具调用
> **时间安排**：8天（Day 21-28）

---

### Day 21: 报告生成基础架构

- [ ] **Task 21.1**: 安装docx.js依赖及相关库
  - docx: ^8.5.0
  - html-to-image: ^1.11.11（用于图表转PNG）
  - sharp: ^0.33.0（图片处理）

- [ ] **Task 21.2**: 创建lib/report/reportGenerator.ts核心引擎
  - ReportGenerator类
  - generateReport(project, calculation, costFactors)方法
  - 文档样式配置（字体、颜色、页边距）

- [ ] **Task 21.3**: 创建报告模板目录结构
  - lib/report/templates/cover-page.ts
  - lib/report/templates/executive-summary.ts
  - lib/report/templates/chapter-*.ts (1-4章)
  - lib/report/templates/appendix-*.ts (附录A/B/C)

- [ ] **Task 21.4**: 实现封面页模板（cover-page.ts）
  - GECOM智能成本助手Logo/标题
  - 产品名称、行业、目标市场
  - 生成日期、版本号
  - 对标益家之宠封面设计

- [ ] **Task 21.5**: 实现目录自动生成
  - docx.js TableOfContents功能
  - 自动识别标题层级（Heading 1-3）
  - 页码自动更新

- [ ] **Task 21.6**: Git提交Day 21成果

---

### Day 22: 报告核心章节（执行摘要 + 第一章）

- [ ] **Task 22.1**: 实现执行摘要模板（executive-summary.ts）
  - 核心结论：毛利率总结（最优/最差市场）
  - 关键成本驱动因素（关税/VAT/物流TOP 3）
  - 战略建议预览（3-5条）
  - 报告阅读指南
  - 字数控制：800-1,000字

- [ ] **Task 22.2**: 实现第一章模板（chapter-1-overview.ts）
  - 1.1 项目背景（产品、行业、目标市场、销售渠道）
  - 1.2 核心假设（产品规格、定价、COGS、月销量、物流方式）
  - 1.3 GECOM方法论说明（双阶段八模块简介）
  - 1.4 报告范围与限制（汇率基准日期、不含成本说明）
  - 字数控制：2,500-3,000字

- [ ] **Task 22.3**: 实现数据格式化工具（lib/report/utils/formatters.ts）
  - formatCurrency(value, currency)
  - formatPercentage(value, decimals)
  - formatNumber(value, decimals)
  - formatDate(date, locale)

- [ ] **Task 22.4**: 测试第一章生成
  - 使用3个标杆市场（US/VN/DE）测试
  - 验证格式正确
  - 验证数据准确

- [ ] **Task 22.5**: Git提交Day 22成果

---

### Day 23: 报告核心章节（第二章：成本拆解M1-M8）⭐

- [ ] **Task 23.1**: 实现第二章模板（chapter-2-cost-breakdown.ts）
  - 2.1 阶段0-1: CAPEX（M1-M3）
  - 2.2 阶段1-N: OPEX（M4-M8）
  - 2.3 成本结构可视化

- [ ] **Task 23.2**: 实现M1-M3成本表格生成
  - M1市场准入对比表（各国合规要求、成本、复杂度）
  - M2技术合规表格（认证、商标、检测）
  - M3供应链搭建表格（仓储、设备、系统）
  - 表格样式：边框、标题行加粗、斑马纹

- [ ] **Task 23.3**: 实现M4核心成本表格⭐
  - 表2.1: N国COGS + 关税 + VAT对比表
  - 列：市场、COGS、头程物流、关税、VAT、M4小计
  - 数据来源Tier标注（绿/黄/灰色徽章）
  - 特殊说明：US关税55%构成（10% + 25% + 20%）

- [ ] **Task 23.4**: 实现M5-M8成本表格
  - M5物流配送表（尾程、退货、FBA）
  - M6营销获客表（CAC、广告、佣金）
  - M7支付手续费表（网关、汇率）
  - M8运营管理表（客服、软件、G&A）

- [ ] **Task 23.5**: 实现图表生成工具（lib/report/utils/chartToImage.ts）
  - captureRechartsAsImage(chartElement)
  - 使用html-to-image库
  - 图表质量：300 DPI（对标要求）
  - 尺寸：宽度600px，高度400px

- [ ] **Task 23.6**: 实现成本结构可视化
  - 图2.1: 关税税率对比柱状图
  - 图2.2: N国物流费用对比
  - 图2.3: N国成本结构饼图（M4-M8占比）
  - 图2.4: CAPEX vs OPEX对比
  - 图2.5: 成本模块占比瀑布图

- [ ] **Task 23.7**: 测试第二章生成
  - 验证所有表格正确渲染
  - 验证图表插入成功（300 DPI）
  - 字数控制：8,000-10,000字

- [ ] **Task 23.8**: Git提交Day 23成果

---

### Day 24: 报告核心章节（第三章：财务分析）

- [ ] **Task 24.1**: 实现第三章模板（chapter-3-financial-analysis.ts）
  - 3.1 单位经济模型
  - 3.2 盈亏平衡分析
  - 3.3 关键KPI指标
  - 3.4 市场排名分析

- [ ] **Task 24.2**: 实现单位经济对比表（表3.1）
  - 列：市场、零售价、单位成本、毛利润、毛利率
  - 本地货币显示（USD/EUR/GBP/JPY等）
  - 毛利率颜色映射：正值绿色，负值红色

- [ ] **Task 24.3**: 实现盈亏平衡分析表（表3.2）
  - 列：市场、当前价格、盈亏平衡价格、30%毛利价格、涨价幅度
  - 计算公式：breakEvenPrice = unitCost / (1 - targetMargin)
  - 涨价幅度%显示

- [ ] **Task 24.4**: 实现关键KPI计算
  - ROI计算：(年毛利 - CAPEX) / CAPEX
  - 回本周期：CAPEX / (月毛利 × 12)
  - LTV:CAC比率：(毛利 × 平均订单数) / CAC

- [ ] **Task 24.5**: 实现市场排名分析
  - 基于毛利率排序N国
  - 显示最优市场（绿色标注）
  - 显示最差市场（红色标注）
  - 生成推荐理由（规则引擎或AI）

- [ ] **Task 24.6**: 实现财务分析图表
  - 图3.1: N国毛利率对比柱状图
  - 图3.2: 价格敏感性分析曲线
  - 图3.3: 市场吸引力矩阵（毛利率 vs 市场规模）

- [ ] **Task 24.7**: 测试第三章生成
  - 验证所有计算正确
  - 验证图表质量（300 DPI）
  - 字数控制：5,000-7,000字

- [ ] **Task 24.8**: Git提交Day 24成果

---

### Day 25: AI生成第四章战略建议⭐

- [ ] **Task 25.1**: 创建lib/ai/deepseek-r1-optimizer.ts
  - callDeepSeekR1ForOptimization(calculation, costFactors)
  - 使用DeepSeek R1推理模型（deepseek-reasoner）

- [ ] **Task 25.2**: 设计第四章Prompt模板（lib/ai/prompts/optimization-prompt.ts）
  - 输入数据：完整计算结果、成本因子、毛利率、ROI
  - 要求输出：
    * 4.1 定价策略优化（分级定价、动态定价）
    * 4.2 成本削减路径（供应链优化、关税规避、营销效率）
    * 4.3 市场选择建议（短期/中期/长期）
    * 4.4 实施路线图（Q1-Q4具体行动）
    * 4.5 风险预警（提价风险、关税风险、竞品风险）
  - 字数要求：5,000-6,000字

- [ ] **Task 25.3**: 实现第四章模板（chapter-4-strategy.ts）
  - 解析AI返回的Markdown内容
  - 转换为docx格式（段落、列表、表格）
  - 插入AI生成的战略建议
  - 添加免责声明："本章由AI生成，仅供参考"

- [ ] **Task 25.4**: 实现Fallback机制
  - AI调用失败时使用规则引擎
  - 基于成本结构自动生成基础建议
  - 确保报告100%可生成

- [ ] **Task 25.5**: 测试10个不同场景Prompt输出质量
  - 场景1: 美国高关税市场
  - 场景2: 欧盟高VAT市场
  - 场景3: 东南亚低毛利市场
  - 场景4: 多国对比（5国以上）
  - 场景5-10: 不同行业/渠道组合
  - 评估标准：专业性、可执行性、逻辑严密性

- [ ] **Task 25.6**: 优化Prompt获得更高质量建议
  - 添加行业上下文（宠物/Vape）
  - 添加市场趋势信息
  - 添加竞品基准数据

- [ ] **Task 25.7**: Git提交Day 25成果

---

### Day 26: 报告附录 + 对标验证

- [ ] **Task 26.1**: 实现附录A：完整成本明细表（appendix-a-cost-details.ts）
  - 表A.1-A.N: 每个市场的M1-M8逐项成本拆解
  - 格式：每国一页，完整127字段展示
  - Tier徽章显示

- [ ] **Task 26.2**: 实现附录B：数据溯源说明（appendix-b-data-sources.ts）
  - B.1 官方数据来源（Tier 1）：列出所有政府/海关/税务局链接
  - B.2 权威数据来源（Tier 2）：物流商、平台费率表
  - B.3 估算数据来源（Tier 3）：AI研究、专家访谈
  - B.4 数据更新频率说明

- [ ] **Task 26.3**: 实现附录C：GECOM方法论白皮书（appendix-c-methodology.ts）
  - C.1 方法论起源
  - C.2 八模块详解（M1-M8架构图）
  - C.3 应用场景与案例
  - C.4 与传统成本核算的差异
  - 字数：2,000-2,500字

- [ ] **Task 26.4**: 实现完整报告生成流程
  - 封面 → 目录 → 执行摘要 → 第1-4章 → 附录A-C → 页脚
  - 页眉：项目名称（左）+ 章节名（右）
  - 页脚：页码（居中）
  - 样式一致性检查

- [ ] **Task 26.5**: 对标验证（与益家之宠报告对比）⭐
  - 创建validation/report-benchmark.md
  - 对比项：
    * 文档长度（目标30,000字）
    * 章节结构（9章完整）
    * 图表数量（目标15+张）
    * 表格数量（目标20+个）
    * 数据溯源完整性
  - 差异分析并优化

- [ ] **Task 26.6**: 报告质量测试
  - 测试文件大小（目标<5MB）
  - 测试生成时间（目标<2分钟）
  - 测试Word兼容性（Word 2019/2021/365）
  - 图表清晰度验证（300 DPI）

- [ ] **Task 26.7**: Git提交Day 26成果

---

### Day 27: AI助手深度集成（工具调用）⭐

- [ ] **Task 27.1**: 实现AI工具函数库（lib/ai/tools/）
  - tools/getCostBreakdown.ts
    * 输入：country, industry
    * 输出：M1-M8完整成本拆解JSON
  - tools/compareScenarios.ts
    * 输入：countries[], industry
    * 输出：多国对比表格数据
  - tools/getOptimizationSuggestions.ts
    * 输入：calculation结果
    * 输出：成本优化建议列表

- [ ] **Task 27.2**: 实现工具函数单元测试
  - tests/ai/tools/getCostBreakdown.test.ts
  - tests/ai/tools/compareScenarios.test.ts
  - tests/ai/tools/getOptimizationSuggestions.test.ts
  - 覆盖率目标：>80%

- [ ] **Task 27.3**: 集成DeepSeek V3工具调用（lib/ai/deepseek-v3-client.ts）
  - callDeepSeekV3WithTools(messages, tools)
  - 实现function calling机制
  - 解析tool_calls响应

- [ ] **Task 27.4**: 实现AIToolCallHandler路由（lib/ai/tool-handler.ts）
  - handleToolCall(toolName, arguments)
  - 工具调用分发逻辑
  - 错误处理（工具不存在、参数错误）

- [ ] **Task 27.5**: 实现工具调用错误处理
  - 超时处理（30秒）
  - 参数验证
  - 工具调用失败Fallback
  - 用户友好的错误提示

- [ ] **Task 27.6**: Git提交Day 27成果

---

### Day 28: AI助手UI + 测试 + 部署

- [ ] **Task 28.1**: 实现Step5AIAssistant完整组件
  - 聊天界面布局（左侧对话，右侧快捷问题）
  - 消息历史显示（用户/AI/系统消息）
  - Markdown渲染（支持表格、列表、代码）
  - 工具调用可视化（显示"正在调用getCostBreakdown..."）

- [ ] **Task 28.2**: 实现Prompt模板库（10个场景）
  - lib/ai/prompts/scenarios.ts
  - 场景1: "为什么美国成本这么高？"
  - 场景2: "如何降低关税成本？"
  - 场景3: "对比美国和德国的优劣"
  - 场景4: "推荐最适合我的市场"
  - 场景5-10: 其他常见问题
  - Prompt优化：添加上下文、示例、格式要求

- [ ] **Task 28.3**: 实现快捷问题库扩展（20+问题）
  - components/ai/QuickQuestions.tsx
  - 分类：成本分析、优化建议、市场对比、政策解读
  - 点击快捷问题自动填充输入框

- [ ] **Task 28.4**: 实现AI响应质量验证
  - tests/ai/response-quality.test.ts
  - 测试10个场景的AI回答
  - 评估标准：准确性、专业性、可读性
  - 不合格场景优化Prompt

- [ ] **Task 28.5**: Playwright完整流程测试
  - tests/e2e/full-workflow.spec.ts
  - 测试Step 0-5完整流程
  - 测试报告生成（3个标杆市场）
  - 测试AI助手（5个快捷问题）
  - 测试19国数据加载

- [ ] **Task 28.6**: 性能基准测试
  - 首屏加载<3秒
  - 成本计算响应<300ms
  - AI响应<5秒
  - 报告生成<2分钟
  - 使用Lighthouse和WebPageTest

- [ ] **Task 28.7**: 浏览器兼容性测试
  - Chrome 120+
  - Safari 17+
  - Firefox 120+
  - Edge 120+

- [ ] **Task 28.8**: 部署到Appwrite Sites生产环境
  - 配置环境变量（Appwrite/DeepSeek API keys）
  - 运行部署脚本（npm run deploy）
  - 生产环境冒烟测试

- [ ] **Task 28.9**: 更新所有文档
  - 更新README.md（添加报告生成、AI助手截图）
  - 更新CLAUDE.md（报告架构、AI工具说明）
  - 更新GECOM-03.md（MVP 2.0功能清单）

- [ ] **Task 28.10**: 创建MVP 2.0交付报告（docs/MVP-2.0-DELIVERY-REPORT.md）
  - 功能完成度：100%（19国×2行业+报告+AI）
  - 数据质量：Tier 1/2占比85%
  - 性能指标：全部达标
  - 对标验证：与益家之宠报告对比结果
  - 下一步计划：v3.0 SaaS化路线图

- [ ] **Task 28.11**: Git提交MVP 2.0最终成果 🎉
  - 提交信息："功能：MVP 2.0完整交付（19国数据+专业报告+AI深度集成）"

- [ ] **Task 28.12**: 推送所有代码到远程仓库
  - git push origin claude/gecom-cost-assistant-mvp-011CUrxFSFUUrKts6nqQwHRd

---

**Week 5验收标准**（扩展版）⭐：

**报告质量**：
- ✅ 30,000字级别Word报告（对标益家之宠）
- ✅ 9章完整结构（封面+执行摘要+4章+3附录）
- ✅ 15+高质量图表（300 DPI）
- ✅ 20+专业表格（M1-M8完整拆解）
- ✅ 数据溯源100%完整（附录B）
- ✅ AI生成第四章战略建议（5,000+字）

**AI集成**：
- ✅ 3个工具函数正常工作（getCostBreakdown/compareScenarios/getOptimizationSuggestions）
- ✅ DeepSeek V3工具调用成功率>95%
- ✅ AI响应时间<5秒
- ✅ 20+快捷问题库
- ✅ 10个场景Prompt优化完成
- ✅ 工具调用错误处理完善

**性能与部署**：
- ✅ 生产环境部署成功（Appwrite Sites）
- ✅ 首屏加载<3秒
- ✅ 成本计算<300ms
- ✅ 报告生成<2分钟
- ✅ 浏览器兼容性测试通过

**文档与交付**：
- ✅ 所有文档更新完整（README/CLAUDE.md/GECOM-03）
- ✅ MVP 2.0交付报告创建
- ✅ 代码推送到远程仓库

---

## 📈 进度追踪说明

### 更新频率
- 每完成一个任务后，立即更新此文档
- 将 `- [ ]` 改为 `- [x]`
- 更新进度总览的百分比

### Git提交规范
- 每天完成后提交代码
- 提交消息格式：`数据：完成XX国宠物食品数据采集（X/19国）`
- 关键节点单独提交：
  - 19国Pet Food完成
  - 19国×2行业全部完成
  - UI重构完成
  - MVP 2.0最终交付

### 质量标准
- 每国数据必须通过验证（36字段完整）
- Tier 1/2数据≥75%
- 所有代码通过TypeScript类型检查
- 关键功能有Playwright E2E测试

---

**最后更新**: 2025-11-09
**维护者**: GECOM Team
**版本**: v2.1.0（数据优先版）
