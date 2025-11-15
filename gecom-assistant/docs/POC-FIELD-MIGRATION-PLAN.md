# POC兼容字段清理迁移计划

> **创建时间**: 2025-11-15
> **迁移原因**: MVP 2.0是全新数据架构，不应背负POC历史包袱
> **影响范围**: 5个文件，涉及CostResult类型定义和GECOMEngine核心逻辑

---

## 📊 代码审查结果

### 1. 受影响文件清单（5个）

| 文件 | POC字段使用 | 迁移复杂度 | 优先级 |
|------|-----------|-----------|--------|
| `types/gecom.ts` | 定义POC兼容字段 | 🔴 高 | P0 |
| `lib/gecom/gecom-engine-v2.ts` | 填充POC字段 | 🔴 高 | P0 |
| `components/wizard/Step3CostModeling.tsx` | **大量**使用POC字段展示详情 | 🟡 中 | P1 |
| `components/wizard/Step2DataCollection.tsx` | 使用POC字段 | 🟢 低 | P2 |
| `components/wizard/scenario/ScenarioComparisonTable.tsx` | ✅ 已迁移（commit 96a8b00） | ✅ 完成 | - |

### 2. POC字段详细使用情况

#### A. CAPEX POC字段（对象类型）

```typescript
// ❌ POC兼容字段定义（types/gecom.ts:289-291）
capex: {
  m1_marketEntry?: any;  // 应该删除
  m2_techCompliance?: any;  // 应该删除
  m3_supplyChain?: any;  // 应该删除
}

// ✅ MVP 2.0新字段（已存在）
capex: {
  m1: number;  // 直接使用
  m2: number;
  m3: number;
  total: number;
}
```

**使用位置**：
- `Step3CostModeling.tsx:105-121` - 展示M1详细拆解（companyRegistration, businessLicense等）
- `Step3CostModeling.tsx:127-145` - 展示M2详细拆解
- `Step3CostModeling.tsx:151-169` - 展示M3详细拆解

**问题**：这些详细拆解数据在MVP 2.0中**没有对应的数字字段**！

---

#### B. OPEX POC字段（对象类型）

```typescript
// ❌ POC兼容字段定义（types/gecom.ts:308-310）
opex: {
  m4_goodsTax?: any;  // 应该删除
  m5_logistics?: any;  // 应该删除
  m8_operations?: any;  // 应该删除
}

// ✅ MVP 2.0新字段（已存在）
opex: {
  m4_cogs: number;
  m4_tariff: number;
  m4_logistics: number;
  m4_vat: number;
  m5_last_mile: number;
  m5_return: number;
  m6_marketing: number;
  m7_payment: number;
  m7_platform_commission: number;
  m8_ga: number;
  total: number;
}
```

**使用位置**：
- `Step3CostModeling.tsx:25-35` - 计算模块总额（使用`?.total`回退逻辑）
- `Step3CostModeling.tsx:198-240` - 展示M4详细拆解（cogs, importTariff, vat）
- `Step3CostModeling.tsx:244-270` - 展示M5详细拆解

---

### 3. 核心问题分析

#### 问题1：数据拆解粒度丢失 ⚠️

**现状**：POC字段包含详细拆解数据（如M1包含companyRegistration, businessLicense等4个子项）

**MVP 2.0**：只有总额字段（m1: number）

**影响**：
- Step 3成本建模页面的详细拆解展示会丢失
- 无法显示M1/M2/M3的子项明细（目前UI强依赖这些数据）

**解决方案选择**：

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| A. 添加新的详细字段 | 完整保留功能 | 增加字段数量 | ⭐⭐⭐⭐⭐ |
| B. 删除详细展示 | 简化类型 | 功能降级 | ⭐ |
| C. 使用CostFactor原始数据 | 不增加字段 | 需要额外传递数据 | ⭐⭐⭐ |

**推荐：方案A** - 添加MVP 2.0详细字段

```typescript
// 新增字段定义
capex: {
  m1: number;
  m1_company_registration: number;  // 新增
  m1_business_license: number;  // 新增
  m1_tax_registration: number;  // 新增
  m1_legal_consulting: number;  // 新增

  m2: number;
  m2_product_certification: number;  // 新增
  m2_trademark_registration: number;  // 新增
  m2_compliance_testing: number;  // 新增

  m3: number;
  m3_warehouse_deposit: number;  // 新增
  m3_equipment_purchase: number;  // 新增
  m3_initial_inventory: number;  // 新增
  m3_system_setup: number;  // 新增

  total: number;
}

opex: {
  // M4-M8已有详细字段，无需新增
  m4_cogs: number; // ✅ 已存在
  m4_tariff: number; // ✅ 已存在
  m4_vat: number; // ✅ 已存在
  // ...
}
```

---

## 🎯 迁移执行计划

### Phase 1: 类型定义清理（1h）✅

**文件**: `types/gecom.ts`

```typescript
// ❌ 删除POC兼容字段
capex: {
  m1_marketEntry?: any;  // 删除
  m2_techCompliance?: any;  // 删除
  m3_supplyChain?: any;  // 删除
}

opex: {
  m4_goodsTax?: any;  // 删除
  m5_logistics?: any;  // 删除
  m8_operations?: any;  // 删除
}

// ✅ 添加MVP 2.0详细字段（补充CAPEX明细）
capex: {
  m1: number;
  m1_company_registration: number;
  m1_business_license: number;
  m1_tax_registration: number;
  m1_legal_consulting: number;

  m2: number;
  m2_product_certification: number;
  m2_trademark_registration: number;
  m2_compliance_testing: number;

  m3: number;
  m3_warehouse_deposit: number;
  m3_equipment_purchase: number;
  m3_initial_inventory: number;
  m3_system_setup: number;

  total: number;
}
```

---

### Phase 2: GECOMEngine更新（1.5h）✅

**文件**: `lib/gecom/gecom-engine-v2.ts`

**修改位置**: 行300-320（删除POC字段填充逻辑）

```diff
- // POC兼容字段（详细拆解）
- m4_goodsTax: {
-   cogs: m4_cogs,
-   importTariff: m4_tariff,
-   vat: m4_vat,
-   total: m4_cogs + m4_tariff + m4_vat,
-   dataSource: (factor.m4_tier || 'tier2') as DataSourceTier,
- },
- m5_logistics: {
-   intlShipping: m4_logistics,
-   localDelivery: m5_last_mile,
-   warehouseFee: 0,
-   returnLogistics: m5_return,
-   total: m4_logistics + m5_last_mile + m5_return,
-   dataSource: (factor.m5_tier || 'tier2') as DataSourceTier,
- },
- m8_operations: {
-   customerService: 0,
-   staff: 0,
-   software: 0,
-   total: m8_ga,
-   dataSource: (factor.m8_tier || 'tier2') as DataSourceTier,
- },
```

**新增CAPEX详细字段填充**:

```typescript
capex: {
  m1,
  m1_company_registration: factor.m1_company_registration_usd || 500,
  m1_business_license: factor.m1_business_license_usd || 300,
  m1_tax_registration: factor.m1_tax_registration_usd || 200,
  m1_legal_consulting: factor.m1_legal_consulting_usd || 1000,

  m2,
  m2_product_certification: factor.m2_product_certification_usd || 5000,
  m2_trademark_registration: factor.m2_trademark_registration_usd || 1500,
  m2_compliance_testing: factor.m2_product_testing_cost_usd || 2000,

  m3,
  m3_warehouse_deposit: factor.m3_warehouse_deposit_usd || 5000,
  m3_equipment_purchase: factor.m3_equipment_purchase_usd || 10000,
  m3_initial_inventory: factor.m3_initial_inventory_usd || 15000,
  m3_system_setup: factor.m3_system_setup_usd || 3000,

  total: capex_total
}
```

---

### Phase 3: UI组件迁移（2h）✅

#### 3.1 Step3CostModeling.tsx（主要修改）

**位置1**: 行25-35 - OPEX模块总额计算

```diff
- const m4Total = costResult.opex.m4_goodsTax?.total ??
-   (costResult.opex.m4_cogs + costResult.opex.m4_tariff + costResult.opex.m4_logistics + costResult.opex.m4_vat);
+ const m4Total = costResult.opex.m4_cogs + costResult.opex.m4_tariff +
+   costResult.opex.m4_logistics + costResult.opex.m4_vat;

- const m5Total = costResult.opex.m5_logistics?.total ??
-   (costResult.opex.m5_last_mile + costResult.opex.m5_return);
+ const m5Total = costResult.opex.m5_last_mile + costResult.opex.m5_return;

- const m8Total = costResult.opex.m8_operations?.total ?? costResult.opex.m8_ga;
+ const m8Total = costResult.opex.m8_ga;
```

**位置2**: 行105-169 - CAPEX详细展示

```diff
- ${costResult.capex.m1_marketEntry.companyRegistration.toFixed(2)}
+ ${costResult.capex.m1_company_registration.toFixed(2)}

- ${costResult.capex.m1_marketEntry.businessLicense.toFixed(2)}
+ ${costResult.capex.m1_business_license.toFixed(2)}

- ${costResult.capex.m1_marketEntry.taxRegistration.toFixed(2)}
+ ${costResult.capex.m1_tax_registration.toFixed(2)}

- ${costResult.capex.m1_marketEntry.legalConsulting.toFixed(2)}
+ ${costResult.capex.m1_legal_consulting.toFixed(2)}

// M2/M3同样替换...
```

**位置3**: 行198-270 - OPEX详细展示

```diff
- {costResult.opex.m4_goodsTax ? (
+ {true && (
   <>
-    ${costResult.opex.m4_goodsTax.cogs.toFixed(2)}
+    ${costResult.opex.m4_cogs.toFixed(2)}

-    ${costResult.opex.m4_goodsTax.importTariff.toFixed(2)}
+    ${costResult.opex.m4_tariff.toFixed(2)}

-    ${costResult.opex.m4_goodsTax.vat.toFixed(2)}
+    ${costResult.opex.m4_vat.toFixed(2)}
   </>
- ) : (...)}
```

#### 3.2 Step2DataCollection.tsx（待调查）

需要读取文件查看具体使用位置。

---

### Phase 4: 文档规范创建（1h）✅

创建两份文档：

1. **`docs/DATA-USAGE-STANDARD.md`** - 数据使用规范
   - MVP 2.0字段结构说明
   - CostResult字段命名规范
   - 禁止使用POC字段的明确规定
   - 代码示例（正确 vs 错误）

2. **更新`CLAUDE.md`** - 添加"数据使用规范"章节
   - 引用DATA-USAGE-STANDARD.md
   - 强调MVP 2.0彻底抛弃POC历史包袱

---

### Phase 5: 测试验证（1h）✅

```bash
# 1. TypeScript类型检查
npm run build

# 2. E2E测试（Step 3关键功能）
npx playwright test tests/e2e/step3-cost-modeling-test.spec.ts

# 3. 手动验证
# - Step 3成本建模页面完整展示
# - 数据精度无损失
# - 无TypeScript错误
```

---

## 📝 验收标准

- [ ] TypeScript无任何编译错误
- [ ] `types/gecom.ts`删除所有POC字段定义
- [ ] `gecom-engine-v2.ts`停止填充POC字段
- [ ] Step 3 CAPEX/OPEX详细展示功能完整
- [ ] E2E测试100%通过
- [ ] 创建`DATA-USAGE-STANDARD.md`文档
- [ ] 更新`CLAUDE.md`添加规范引用

---

## ⚠️ 风险提示

1. **Breaking Change**：删除POC字段后，任何依赖这些字段的旧代码会立即报错
2. **数据完整性**：确保新字段完整覆盖旧字段功能
3. **测试覆盖**：E2E测试必须覆盖所有详细数据展示场景

---

## 🎯 执行时间线

| 阶段 | 预计时间 | 完成标志 |
|------|---------|---------|
| Phase 1 | 1h | types/gecom.ts无POC字段 |
| Phase 2 | 1.5h | gecom-engine-v2.ts无POC填充 |
| Phase 3 | 2h | UI组件全部迁移 |
| Phase 4 | 1h | 文档规范完成 |
| Phase 5 | 1h | 测试100%通过 |
| **总计** | **6.5h** | Git commit + push |

---

**创建人**: Claude AI
**审批人**: （待确认）
**执行日期**: 2025-11-15
