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

## 📊 进度总览

- **Week 1**: 数据基础设施 - 20/28 任务完成（71%）⚠️
  - ✅ Database setup: 100% (8 tasks)
  - ⚠️ **Data collection: 5/19国（26%）**
  - ✅ SDK封装: 100% (10 tasks)

- **Week 2**: 14国数据采集（Pet Food）- 0/35 任务
- **Week 3**: Vape行业数据采集 - 0/19 任务
- **Week 4**: UI重构（Step 0-5）- 0/25 任务
- **Week 5**: 报告生成 + AI集成 - 0/13 任务

**总进度**: 20/120 (16.7%)
**数据覆盖**: 5/38记录（13.2%）- 目标：38/38（100%）

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

## Week 2: 14国数据采集（Pet Food行业）

> **目标**: 完成剩余14国宠物食品数据，达到19/19国（100%）
> **策略**: 数据质量优先，通用vs特定数据分离
> **验收**: 每国必须通过完整验证清单
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
> - [CLAUDE.md - 数据质量标准](../CLAUDE.md#数据质量标准与成功指标-) - 成功指标

### Day 6: 加拿大数据采集 🎯

**目标国家**: CA（加拿大）
**采集策略**: 通用vs特定数据分离（3文件模式）

**Step 1: 通用数据采集（✅可复用）**

- [ ] **Task 6.1**: 研究M4关税与VAT（⭐最关键）
  - 关税：查询CBSA官网，HS Code 2309.10.00
  - 获取MFN税率和CPTPP优惠税率
  - VAT：查询CRA官网，GST 5% + 各省PST（安大略HST 13%）
  - **数据来源格式**：'CBSA官网 - https://cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/2025/'
  - **Tier要求**：必须Tier 1官方数据
  - **时间戳**：ISO 8601格式（2025-11-09T10:00:00+08:00）

- [ ] **Task 6.2**: 获取M4物流成本（✅通用）
  - 海运：中国→温哥华，$/kg + 时效
  - 空运：中国→多伦多，$/kg + 时效
  - 联系DHL/FedEx/CMA CGM获取2025年Q1报价
  - **数据来源**：'DHL Express报价 - 2025年Q1中国→加拿大线路'
  - **Tier**：Tier 2权威报价

- [ ] **Task 6.3**: 获取M5配送 + M7支付（✅通用）
  - M5尾程配送：Canada Post官方费率
  - M7支付：Stripe 2.9% + $0.3（全球统一，复用）
  - **Tier**：Tier 1官方数据

- [ ] **Task 6.4**: 研究M1-M3通用成本（✅通用）
  - M1公司注册：Corporations Canada费用
  - M1税务登记：GST/HST注册（免费）
  - M3仓储押金：第三方仓储报价
  - M8最低工资：安大略劳工法
  - **Tier**：Tier 1官方数据

**Step 2: Pet Food行业特定数据采集（❌特定）**

- [ ] **Task 6.5**: 研究M1-M2行业合规（❌特定）
  - M1监管机构：CFIA (Canadian Food Inspection Agency)
  - M1行业许可：CFIA宠物食品进口许可费
  - M2产品认证：CFIA标签合规 + SGS检测报价
  - M2双语标签：英/法双语审核成本
  - **数据来源**：'CFIA官网 - https://inspection.canada.ca + SGS报价'
  - **Tier**：Tier 1/2混合

- [ ] **Task 6.6**: 研究M4关税 + M6营销（❌特定）
  - M4 HS Code：2309.10.00（宠物食品特定）
  - M4实际关税率：基于CPTPP优惠税率
  - M5 FBA费用：Amazon.ca Pet类目标准尺寸
  - M6 CAC：Jungle Scout报告 - Pet类目2024
  - M6平台佣金：Amazon.ca Pet类目15%
  - **Tier**：Tier 1（关税/FBA）+ Tier 2（CAC）

**Step 3: 数据文件创建（3文件模式）**

- [ ] **Task 6.7**: 创建CA-base-data.ts（通用数据）
  - 参考模板：docs/templates/DATA-TEMPLATE-EXAMPLE.md模板1
  - 包含35个通用字段（M1公司注册、M4 VAT、物流、M7支付、M8工资等）
  - 每个字段标注：data_source、tier、collected_at
  - 添加注释标记：`// ✅通用`
  - **验证**：TypeScript编译通过，无null值

- [ ] **Task 6.8**: 创建CA-pet-food-specific.ts（特定数据）
  - 参考模板：docs/templates/DATA-TEMPLATE-EXAMPLE.md模板2
  - 包含55个行业特定字段（M1行业许可、M2认证、M4关税、M6 CAC等）
  - 每个字段标注：data_source、tier、collected_at
  - 添加注释标记：`// ❌特定`
  - **验证**：TypeScript编译通过

- [ ] **Task 6.9**: 创建CA-pet-food.ts（合并完整数据）
  - 参考模板：docs/templates/DATA-TEMPLATE-EXAMPLE.md模板3
  - 导入CA_BASE_DATA和CA_PET_FOOD_SPECIFIC
  - 添加元数据：country='CA', industry='pet_food', version='2025Q1'
  - 添加collected_at、collected_by、verified_at
  - 合并数据：`{...CA_BASE_DATA, ...CA_PET_FOOD_SPECIFIC}`

**Step 4: 验证与导入**

- [ ] **Task 6.10**: 运行完整验证清单
  - **完整性验证**：
    - [ ] P0字段67个100%填充（无null）
    - [ ] 每个模块M1-M8有data_source
    - [ ] collected_at格式正确（ISO 8601）
  - **合理性验证**：
    - [ ] 关税率 0% ≤ tariff ≤ 100%
    - [ ] VAT率 0% ≤ VAT ≤ 30%
    - [ ] CAC > 0 且 < $100
    - [ ] 海运成本 < 空运成本
  - **Tier质量验证**：
    - [ ] Tier 1数据占比 ≥ 60%
    - [ ] Tier 2数据占比 ≥ 20%
    - [ ] M4关税/VAT必须Tier 1
  - **溯源验证**：
    - [ ] 所有data_source格式正确（机构 - URL）
    - [ ] Tier 1数据有完整URL
    - [ ] 时间戳在2024-2025范围

- [ ] **Task 6.11**: 导入Appwrite并性能测试
  - 更新导入脚本：import-6-countries-data.ts
  - 导入CA_PET_FOOD数据
  - 验证导入成功（Appwrite Console检查）
  - 性能测试：查询CA数据<200ms

- [ ] **Task 6.12**: Git提交Day 6成果
  - **提交文件**：
    - data/cost-factors/CA-base-data.ts
    - data/cost-factors/CA-pet-food-specific.ts
    - data/cost-factors/CA-pet-food.ts
    - scripts/import-6-countries-data.ts
  - **提交消息**：`数据：完成加拿大宠物食品数据采集（6/19国，通用vs特定分离）`
  - **验证报告**：附带验证清单检查结果

**Day 6验收标准**（必须100%通过）：
- ✅ 3个数据文件创建完成（base/specific/merged）
- ✅ P0字段67个100%填充
- ✅ Tier 1/2数据≥80%，M4关税/VAT 100% Tier 1
- ✅ 数据溯源100%完整（含URL和时间戳）
- ✅ 通过完整验证清单（完整性+合理性+Tier+溯源）
- ✅ 导入Appwrite成功，查询<200ms
- ✅ Git提交，文档更新

---

### Day 7: 法国数据采集 🎯

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

**Week 3验收标准**：
- ✅ 19国×2行业 = 38条完整记录
- ✅ 数据覆盖：100%
- ✅ Tier 1/2数据≥75%
- ✅ 所有数据导入Appwrite成功

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

## Week 5: 报告生成 + AI集成

### Day 21-22: 专业报告生成系统

- [ ] **Task 21.1**: 安装docx.js依赖
- [ ] **Task 21.2**: 创建reportGenerator.ts核心引擎
- [ ] **Task 21.3**: 实现第一章：项目概览
- [ ] **Task 21.4**: 实现第二章：GECOM成本分析（M1-M8详细表格）
- [ ] **Task 21.5**: 实现第三章：财务模型与KPI
- [ ] **Task 21.6**: 实现图表转图片功能（recharts → PNG → docx）
- [ ] **Task 21.7**: 测试报告生成（3个标杆市场）
- [ ] **Task 21.8**: Git提交Day 21-22成果

### Day 23: AI生成报告第四章

- [ ] **Task 23.1**: 实现callDeepSeekR1ForOptimization
- [ ] **Task 23.2**: 设计Prompt模板（成本驱动因素/ROI优化路线/风险预警）
- [ ] **Task 23.3**: 实现第四章：AI战略建议
- [ ] **Task 23.4**: 测试10个场景Prompt输出质量
- [ ] **Task 23.5**: 实现附录：数据溯源
- [ ] **Task 23.6**: 对标验证（与益家之宠报告对比）
- [ ] **Task 23.7**: Git提交Day 23成果

### Day 24: Step 5 AI助手深度集成

- [ ] **Task 24.1**: 实现AI工具函数（getCostBreakdown/compareScenarios/getOptimizationSuggestions）
- [ ] **Task 24.2**: 集成DeepSeek V3工具调用
- [ ] **Task 24.3**: 实现AIToolCallHandler（工具调用路由）
- [ ] **Task 24.4**: 测试AI助手功能
- [ ] **Task 24.5**: Git提交Day 24成果

### Day 25: 测试与部署

- [ ] **Task 25.1**: Playwright完整流程测试（Step 0-5 + 报告生成 + AI助手）
- [ ] **Task 25.2**: 性能基准测试（首屏<3s, 计算<300ms, AI<5s, 报告<2min）
- [ ] **Task 25.3**: 浏览器兼容性测试（Chrome/Safari/Firefox）
- [ ] **Task 25.4**: 部署到Appwrite Sites生产环境
- [ ] **Task 25.5**: 生产环境冒烟测试
- [ ] **Task 25.6**: 更新所有文档（README/CLAUDE.md/GECOM-03）
- [ ] **Task 25.7**: 创建MVP 2.0交付报告
- [ ] **Task 25.8**: Git提交MVP 2.0最终成果 🎉
- [ ] **Task 25.9**: 推送所有代码到远程仓库

**Week 5验收标准**：
- ✅ 30,000字Word报告生成功能
- ✅ AI助手可调用成本引擎
- ✅ 生产环境部署成功
- ✅ 所有文档更新完整

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
