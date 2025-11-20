# M1-M8完整字段映射表

**创建时间**: 2025-11-13 20:30
**分析模式**: Ultra-Think
**目标**: 系统性检查M1-M8所有字段映射，一次性修复所有不匹配

---

## 🎯 分析策略

### 步骤1：提取UI字段名
从Step2DataCollection.tsx提取所有`getEffectiveValue('m*_*')`调用

### 步骤2：提取数据字段名
从VN-base-data.ts和VN-pet-food-specific.ts提取所有m*_*字段定义

### 步骤3：建立映射表
对比UI字段名vs数据字段名，找出所有不匹配

### 步骤4：生成修复代码
为所有不匹配字段生成映射代码

---

## 📋 M1-M8字段映射详细分析

### M1 市场准入 ✅ 已修复

| UI字段名 | 数据字段名 | 映射状态 | 数值 |
|---------|-----------|---------|------|
| m1_import_license_cost_usd | m1_industry_license_usd | ✅ 已映射 | 从数据文件 |
| m1_import_license_required | m1_pre_approval_required | ✅ 已映射 | 从数据文件 |
| m1_company_registration_usd | m1_company_registration_usd | ✅ 直接匹配 | 300 |
| m1_business_license_usd | m1_business_license_usd | ✅ 直接匹配 | 150 |
| m1_legal_consulting_usd | m1_legal_consulting_usd | ✅ 直接匹配 | 1000 |

**M1结论**: ✅ 已在前次修复中完成

---

### M2 技术合规 ⚠️ 部分修复

| UI字段名 | 数据字段名 | 映射状态 | 来源 | 数值 |
|---------|-----------|---------|------|------|
| m2_product_testing_cost_usd | m2_product_certification_usd | ✅ 已映射 | VN_PET_FOOD_SPECIFIC | 1200 |
| m2_product_testing_cost_usd | m2_compliance_testing_usd | ✅ fallback | VN_BASE_DATA | 800 |
| m2_trademark_registration_usd | m2_trademark_registration_usd | ✅ 直接匹配 | VN_BASE_DATA | 250 |
| m2_patent_filing_usd | m2_patent_filing_usd | ⚠️ 不存在 | - | 0 |

**M2结论**: ✅ 核心字段已映射，patent_filing字段数据中不存在（符合预期）

---

### M3 供应链搭建 🔍 待检查

**UI期望字段**（根据代码推断）:
```typescript
m3_warehouse_deposit_usd        // 仓储押金
m3_initial_inventory_usd        // 初始库存
m3_equipment_usd                // 设备采购（推测）
m3_system_setup_usd             // 系统搭建（推测）
```

**数据文件实际字段**:
```typescript
// VN_BASE_DATA.ts
m3_warehouse_deposit_usd: 2000  // ✅ 匹配

// VN_PET_FOOD_SPECIFIC.ts
m3_initial_inventory_usd: 15000  // ✅ 匹配
```

**M3映射需求**: 需要读取完整UI代码确认

---

### M4 货物税费 🔍 待详细检查

**核心字段（已知使用）**:
```typescript
m4_effective_tariff_rate   // 关税税率 ✅ 应该直接匹配
m4_vat_rate               // VAT税率 ✅ 应该直接匹配
m4_logistics              // 物流费用（JSON对象）⚠️ 可能需要特殊处理
```

**M4特殊性**: 物流费用是JSON对象，包含sea_freight_usd_kg和air_freight_usd_kg

---

### M5 物流配送 🔍 待详细检查

**UI期望字段**（基于前面的grep结果）:
```typescript
m5_last_mile_delivery_usd       // 本地配送
m5_return_rate                  // 退货率
m5_return_cost_rate             // 退货成本率
m5_delivery_time_days_min       // 配送时间最小值
m5_delivery_time_days_max       // 配送时间最大值
m5_fba_fee_small_usd           // FBA小件费用
m5_fba_fee_standard_usd        // FBA标准件费用
m5_fba_fee_large_usd           // FBA大件费用
m5_warehouse_fee_per_unit_month_usd  // 仓储费
m5_return_logistics_usd         // 退货物流费
m5_cod_available               // 是否支持货到付款
m5_cod_fee_rate                // 货到付款费率
```

**数据文件实际字段**（需确认）

---

### M6 营销获客 ⚠️ 部分修复

| UI字段名 | 数据字段名 | 映射状态 | 数值 |
|---------|-----------|---------|------|
| m6_cac_estimated_usd | m6_cac_usd | ✅ 已映射 | 18 |
| m6_marketing_rate | m6_marketing_rate | ✅ 直接匹配 | 0.12 |
| m6_platform_commission_rate | m6_platform_commission_rate | ✅ 直接匹配 | 0.06 |
| m6_ad_cpc_usd | m6_ad_cpc_usd | 🔍 待确认 | - |
| m6_conversion_rate | m6_conversion_rate | 🔍 待确认 | - |
| m6_acos_target | m6_acos_target | 🔍 待确认 | - |

**M6结论**: 核心字段已映射，需确认ad_cpc/conversion_rate/acos字段

---

### M7 支付手续费 🔍 待详细检查

**UI期望字段**:
```typescript
m7_payment_rate                    // 支付费率
m7_payment_fixed_usd              // 固定费用
m7_platform_commission_rate       // 平台佣金率
m7_currency_conversion_rate       // 汇率损失
m7_chargeback_rate               // 退款率
```

**数据文件实际字段**:
```typescript
// VN_BASE_DATA.ts
m7_payment_rate: 0.025            // ✅ 匹配
m7_payment_fixed_usd: 0.10        // ✅ 匹配
m7_platform_commission_rate: 0.02  // ✅ 匹配
```

---

### M8 运营管理 🔍 待详细检查

**UI期望字段**:
```typescript
m8_customer_service_cost_per_order_usd  // 客服成本
m8_ga_rate                              // 管理费用率
```

**数据文件实际字段**:
```typescript
// VN_BASE_DATA.ts
m8_ga_rate: 0.08  // ✅ 匹配
```

---

## 🚀 执行计划

### Phase 1: 完整字段清单提取（当前）
- [x] 创建分析框架
- [ ] 读取Step2DataCollection.tsx M3-M8完整UI字段
- [ ] 读取VN-base-data.ts和VN-pet-food-specific.ts完整数据字段
- [ ] 建立M3-M8完整映射表

### Phase 2: 生成修复代码
- [ ] 为所有不匹配字段生成映射代码
- [ ] 按模块分组（M1/M2/M3.../M8）
- [ ] 添加优先级链（specific > base > default）

### Phase 3: 应用修复
- [ ] 更新Step2DataCollection.tsx
- [ ] TypeScript编译验证
- [ ] 本地测试M1-M8所有模块

---

## 📝 待完成

**立即执行**: 读取Step2DataCollection.tsx完整代码，提取M3-M8所有UI字段名
