# Appwrite数据库设置指南 - MVP 2.0

> **版本**: v2.0.0
> **创建日期**: 2025-11-08
> **状态**: Week 1 Day 1 完成

---

## 📋 概述

本文档说明如何设置GECOM MVP 2.0的完整数据库架构，包含4个Collections共127字段的成本因子库。

### 数据库架构

```
gecom_database (690d4fdd0035c2f63f20)/
├─ cost_factors                 # 成本因子库（127字段，19国M1-M8数据）
│  ├─ 基础字段（5个）
│  ├─ M1: 市场准入（16字段）
│  ├─ M2: 技术合规（14字段）
│  ├─ M3: 供应链搭建（12字段）
│  ├─ M4: 货物税费（32字段）⭐核心
│  ├─ M5: 物流配送（18字段）
│  ├─ M6: 营销获客（10字段）
│  ├─ M7: 支付手续费（8字段）
│  └─ M8: 运营管理（11字段）
│
├─ projects                     # 用户项目（6字段）
│  ├─ user_id, name, industry
│  ├─ target_country, sales_channel
│  └─ description
│
├─ calculations                 # 计算记录（6字段）
│  ├─ project_id, cost_factor_version
│  ├─ scope (JSON), cost_result (JSON)
│  ├─ user_overrides (JSON)
│  └─ version
│
└─ cost_factor_versions         # 版本管理（4字段）
   ├─ version, effective_date
   ├─ is_current, changelog
```

---

## 🚀 快速开始

### 方法1：使用自动化脚本（推荐）

1. **确保环境变量配置正确**

   ```bash
   # 检查.env.local文件
   cat .env.local
   ```

   必需变量：
   ```bash
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://apps.aotsea.com/v1
   NEXT_PUBLIC_APPWRITE_PROJECT=690d4f580002dcbcb575
   NEXT_PUBLIC_APPWRITE_DATABASE=690d4fdd0035c2f63f20
   APPWRITE_API_KEY=standard_050c6ae6a2d7e3bd394a10b68d447bef...
   ```

2. **运行数据库初始化脚本**

   ```bash
   cd gecom-assistant
   npm run db:setup
   ```

   输出示例：
   ```
   🚀 开始创建Appwrite数据库架构 - MVP 2.0
   ==================================================
   Endpoint: https://apps.aotsea.com/v1
   Project: 690d4f580002dcbcb575
   Database: 690d4fdd0035c2f63f20
   ==================================================

   📦 创建Collection: cost_factors
   ✅ Collection创建成功: cost_factors
   ✅ 基础字段创建成功（5个）
   ✅ M1字段创建成功（6个）
   ✅ M2字段创建成功（3个）
   ✅ M3字段创建成功（2个）
   ✅ M4字段创建成功（9个）
   ✅ M5字段创建成功（4个）
   ✅ M6字段创建成功（3个）
   ✅ M7字段创建成功（4个）
   ✅ M8字段创建成功（2个）
   ✅ 索引创建成功

   📦 创建Collection: projects
   ✅ Collection创建成功: projects
   ✅ 字段创建成功（6个）
   ✅ 索引创建成功

   📦 创建Collection: calculations
   ✅ Collection创建成功: calculations
   ✅ 字段创建成功（6个）
   ✅ 索引创建成功

   📦 创建Collection: cost_factor_versions
   ✅ Collection创建成功: cost_factor_versions
   ✅ 字段创建成功（4个）
   ✅ 索引创建成功

   ==================================================
   ✅ 完成！成功创建 4/4 个Collections
   ==================================================

   🎉 数据库架构创建完成！

   下一步：
   1. 运行数据导入脚本：npm run db:import
   2. 启动开发服务器：npm run dev
   ```

3. **验证创建结果**

   访问Appwrite控制台验证：
   ```
   https://apps.aotsea.com/console/project-690d4f580002dcbcb575/databases/database-690d4fdd0035c2f63f20
   ```

   应看到4个Collections：
   - ✅ cost_factors (38个字段)
   - ✅ projects (6个字段)
   - ✅ calculations (6个字段)
   - ✅ cost_factor_versions (4个字段)

---

### 方法2：手动创建（备用）

如果自动化脚本失败，可以手动在Appwrite控制台创建。

#### Step 1: 创建cost_factors Collection

1. 访问Appwrite控制台 → Databases → 创建Collection
2. 名称：`cost_factors`
3. Collection ID：`cost_factors`
4. 添加字段（38个核心字段）：

   **基础字段（5个）**
   ```
   - country (String, 10, required)
   - country_name_cn (String, 50, required)
   - country_flag (String, 10, optional)
   - industry (String, 50, required, default: "pet_food")
   - version (String, 20, required, default: "2025Q1")
   ```

   **M1字段（6个）**
   ```
   - m1_regulatory_agency (String, 200, optional)
   - m1_pre_approval_required (Boolean, optional, default: false)
   - m1_registration_required (Boolean, optional, default: false)
   - m1_complexity (String, 20, optional)
   - m1_estimated_cost_usd (Float, optional)
   - m1_data_source (String, 50, optional, default: "tier3_estimated")
   ```

   **M2-M8字段** - 参考`scripts/setup-database.ts`完整定义

5. 创建索引：
   ```
   - idx_country: key, [country], ASC
   - idx_country_industry_version: unique, [country, industry, version], ASC
   ```

#### Step 2-4: 创建其他Collections

参考`scripts/setup-database.ts`中的schema定义。

---

## 📊 Collection详细说明

### 1. cost_factors（成本因子库）

**用途**：存储19国×2行业=38条完整成本数据（M1-M8模块）

**关键字段**：

| 字段名 | 类型 | 必填 | 说明 | 数据示例 |
|--------|------|------|------|----------|
| `country` | String | ✅ | 国家代码 | "US", "DE", "VN" |
| `country_name_cn` | String | ✅ | 国家中文名 | "美国", "德国", "越南" |
| `industry` | String | ✅ | 行业 | "pet_food", "vape" |
| `version` | String | ✅ | 数据版本 | "2025Q1" |
| `m4_effective_tariff_rate` | Float | ✅ | 有效关税税率 | 0.55 (55%) |
| `m4_vat_rate` | Float | ✅ | 增值税率 | 0.19 (19%) |
| `m4_logistics` | String(JSON) | - | 物流费用 | JSON格式 |

**数据示例**：
```json
{
  "country": "US",
  "country_name_cn": "美国",
  "country_flag": "🇺🇸",
  "industry": "pet_food",
  "version": "2025Q1",
  "m1_complexity": "高",
  "m1_estimated_cost_usd": 5000,
  "m4_effective_tariff_rate": 0.55,
  "m4_tariff_notes": "10%互惠 + 25% Section 301 + 20%附加",
  "m4_vat_rate": 0.06,
  "m5_last_mile_delivery_usd": 7.5,
  "m6_marketing_rate": 0.15,
  "m7_payment_rate": 0.029,
  "m8_ga_rate": 0.03
}
```

**数据来源分级**：
- `tier1_official`：官方来源（海关、税务局），置信度100%
- `tier2_authoritative`：权威来源（物流商、行业报告），置信度90%
- `tier3_estimated`：经验估算（专家访谈、AI调研），置信度80%

---

### 2. projects（用户项目）

**用途**：存储用户创建的项目元数据

**字段**：

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `user_id` | String | - | 用户ID（默认"anonymous"） |
| `name` | String | ✅ | 项目名称 |
| `industry` | String | ✅ | 行业 |
| `target_country` | String | ✅ | 目标国家 |
| `sales_channel` | String | ✅ | 销售渠道 |
| `description` | String | - | 项目描述 |

---

### 3. calculations（计算记录）

**用途**：存储每次成本计算的完整输入输出

**字段**：

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `project_id` | String | ✅ | 关联项目ID |
| `cost_factor_version` | String | ✅ | 成本因子版本 |
| `scope` | String(JSON) | ✅ | 输入参数（产品信息、市场选择） |
| `cost_result` | String(JSON) | ✅ | 计算结果（CAPEX/OPEX/KPI） |
| `user_overrides` | String(JSON) | - | 用户自定义覆盖值 |
| `version` | String | ✅ | GECOM计算引擎版本 |

---

### 4. cost_factor_versions（版本管理）

**用途**：追踪成本因子数据版本变化

**字段**：

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `version` | String | ✅ | 版本号（如"2025Q1"） |
| `effective_date` | Datetime | ✅ | 生效日期 |
| `is_current` | Boolean | ✅ | 是否为当前版本 |
| `changelog` | String | - | 更新日志 |

---

## 🔧 故障排除

### Q1: API Key权限不足

**错误信息**：
```
Error: Unauthorized
```

**解决方案**：
1. 确认`APPWRITE_API_KEY`配置正确
2. 在Appwrite控制台检查API Key权限：
   - Settings → API Keys → 查看权限
   - 确保有`databases.write`权限

### Q2: Collection已存在

**错误信息**：
```
Error: Collection with ID 'cost_factors' already exists
```

**解决方案**：
- 这是正常提示，脚本会跳过已存在的Collection
- 如需重建，先在控制台手动删除旧Collection

### Q3: 字段创建失败

**错误信息**：
```
Error: Attribute 'm4_logistics' creation failed
```

**解决方案**：
1. 检查字段类型和大小限制
2. String类型最大长度：10,000字符
3. JSON字段建议使用String类型存储

---

## 📚 相关文档

- [MVP-2.0-详细规划方案.md](./MVP-2.0-详细规划方案.md) - Part 1: 数据库设计详解
- [CLAUDE.md](../CLAUDE.md) - 项目上下文
- [Appwrite Databases文档](https://appwrite.io/docs/products/databases)

---

## ✅ 验收清单

完成数据库设置后，确认以下检查点：

- [ ] 4个Collections全部创建成功
- [ ] cost_factors包含38个字段（核心字段）
- [ ] projects包含6个字段
- [ ] calculations包含6个字段
- [ ] cost_factor_versions包含4个字段
- [ ] 所有索引创建成功
- [ ] 可以通过SDK查询Collections

---

**最后更新**: 2025-11-08
**维护者**: GECOM Team
**版本**: v2.0.0
