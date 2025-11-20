# Appwrite数据库手动创建指南

> **原因**：自动化脚本执行失败 - API密钥权限不足
> **状态**：需要在Appwrite控制台手动创建4个Collections
> **创建日期**：2025-11-09

---

## ⚠️ 问题说明

执行`npm run db:setup`时遇到权限错误：

```
❌ 创建失败: The current user is not authorized to perform the requested action.
```

**根本原因**：当前APPWRITE_API_KEY缺少创建Collections的权限。

**解决方案**：
1. 方案A：在Appwrite控制台手动创建Collections（推荐）
2. 方案B：重新生成具有完整权限的API Key

---

## 📋 手动创建步骤

### Step 1: 访问Appwrite控制台

1. 打开浏览器访问：https://apps.aotsea.com/console
2. 登录账号
3. 选择项目：`690d4f580002dcbcb575`
4. 进入Databases → `690d4fdd0035c2f63f20`

### Step 2: 创建Collection 1 - cost_factors

**基本信息**：
- Collection ID: `cost_factors`
- Name: `成本因子库 (19国M1-M8数据)`

**属性（38个核心字段）**：

**基础字段（5个）**：
```
1. country          | String  | Size: 10   | Required | Default: -
2. country_name_cn  | String  | Size: 50   | Required | Default: -
3. country_flag     | String  | Size: 10   | Optional | Default: -
4. industry         | String  | Size: 50   | Required | Default: "pet_food"
5. version          | String  | Size: 20   | Required | Default: "2025Q1"
```

**M1字段（6个）**：
```
6.  m1_regulatory_agency         | String  | Size: 200 | Optional | Default: -
7.  m1_pre_approval_required     | Boolean | -         | Optional | Default: false
8.  m1_registration_required     | Boolean | -         | Optional | Default: false
9.  m1_complexity                | String  | Size: 20  | Optional | Default: -
10. m1_estimated_cost_usd        | Float   | -         | Optional | Default: -
11. m1_data_source               | String  | Size: 50  | Optional | Default: "tier3_estimated"
```

**M2字段（3个）**：
```
12. m2_certifications_required   | String  | Size: 500 | Optional | Default: -
13. m2_estimated_cost_usd        | Float   | -         | Optional | Default: -
14. m2_data_source               | String  | Size: 50  | Optional | Default: "tier3_estimated"
```

**M3字段（2个）**：
```
15. m3_packaging_rate            | Float   | -         | Optional | Default: 0.02
16. m3_data_source               | String  | Size: 50  | Optional | Default: "tier2_authoritative"
```

**M4字段（9个）**：
```
17. m4_hs_code                   | String  | Size: 20  | Optional | Default: "2309.10.00"
18. m4_base_tariff_rate          | Float   | -         | Optional | Default: -
19. m4_effective_tariff_rate     | Float   | -         | Required | Default: 0
20. m4_tariff_notes              | String  | Size: 500 | Optional | Default: -
21. m4_vat_rate                  | Float   | -         | Required | Default: 0
22. m4_vat_notes                 | String  | Size: 500 | Optional | Default: -
23. m4_logistics                 | String  | Size: 2000| Optional | Default: - (JSON字段)
24. m4_tariff_data_source        | String  | Size: 50  | Optional | Default: "tier1_official"
25. m4_vat_data_source           | String  | Size: 50  | Optional | Default: "tier1_official"
```

**M5字段（4个）**：
```
26. m5_last_mile_delivery_usd    | Float   | -         | Optional | Default: -
27. m5_return_rate               | Float   | -         | Optional | Default: 0.10
28. m5_return_cost_rate          | Float   | -         | Optional | Default: 0.30
29. m5_data_source               | String  | Size: 50  | Optional | Default: "tier2_authoritative"
```

**M6字段（3个）**：
```
30. m6_marketing_rate            | Float   | -         | Optional | Default: 0.15
31. m6_platform_commission_rate  | Float   | -         | Optional | Default: -
32. m6_data_source               | String  | Size: 50  | Optional | Default: "tier2_authoritative"
```

**M7字段（4个）**：
```
33. m7_payment_rate              | Float   | -         | Optional | Default: 0.029
34. m7_payment_fixed_usd         | Float   | -         | Optional | Default: 0.30
35. m7_platform_commission_rate  | Float   | -         | Optional | Default: -
36. m7_data_source               | String  | Size: 50  | Optional | Default: "tier1_official"
```

**M8字段（2个）**：
```
37. m8_ga_rate                   | Float   | -         | Optional | Default: 0.03
38. m8_data_source               | String  | Size: 50  | Optional | Default: "tier2_authoritative"
```

**索引（2个）**：
```
1. idx_country
   - Type: key
   - Attributes: [country]
   - Orders: [ASC]

2. idx_country_industry_version
   - Type: unique
   - Attributes: [country, industry, version]
   - Orders: [ASC, ASC, ASC]
```

---

### Step 3: 创建Collection 2 - projects

**基本信息**：
- Collection ID: `projects`
- Name: `用户项目`

**属性（6个）**：
```
1. user_id         | String   | Size: 50   | Optional | Default: "anonymous"
2. name            | String   | Size: 200  | Required | Default: -
3. industry        | String   | Size: 50   | Required | Default: "pet_food"
4. target_country  | String   | Size: 10   | Required | Default: -
5. sales_channel   | String   | Size: 50   | Required | Default: -
6. description     | String   | Size: 1000 | Optional | Default: -
```

**索引（1个）**：
```
1. idx_user_id
   - Type: key
   - Attributes: [user_id]
   - Orders: [ASC]
```

---

### Step 4: 创建Collection 3 - calculations

**基本信息**：
- Collection ID: `calculations`
- Name: `计算记录`

**属性（6个）**：
```
1. project_id           | String | Size: 50    | Required | Default: -
2. cost_factor_version  | String | Size: 20    | Required | Default: "2025Q1"
3. scope                | String | Size: 10000 | Required | Default: - (JSON)
4. cost_result          | String | Size: 10000 | Required | Default: - (JSON)
5. user_overrides       | String | Size: 10000 | Optional | Default: - (JSON)
6. version              | String | Size: 20    | Required | Default: "1.0"
```

**索引（1个）**：
```
1. idx_project_id
   - Type: key
   - Attributes: [project_id]
   - Orders: [ASC]
```

---

### Step 5: 创建Collection 4 - cost_factor_versions

**基本信息**：
- Collection ID: `cost_factor_versions`
- Name: `成本因子版本管理`

**属性（4个）**：
```
1. version         | String   | Size: 20   | Required | Default: -
2. effective_date  | Datetime | -          | Required | Default: -
3. is_current      | Boolean  | -          | Required | Default: true
4. changelog       | String   | Size: 5000 | Optional | Default: -
```

**索引（1个）**：
```
1. idx_version
   - Type: unique
   - Attributes: [version]
   - Orders: [ASC]
```

---

## ✅ 验收清单

完成手动创建后，请验证：

- [ ] 4个Collections全部创建成功
- [ ] cost_factors包含38个字段
- [ ] projects包含6个字段
- [ ] calculations包含6个字段
- [ ] cost_factor_versions包含4个字段
- [ ] 所有索引创建成功
- [ ] 在Appwrite Console中可以看到所有Collections

---

## 🔄 方案B：更新API密钥权限

如果希望使用自动化脚本，需要：

1. 访问Appwrite控制台：Settings → API Keys
2. 找到当前API Key或创建新的
3. 确保勾选以下权限：
   - `databases.write`
   - `collections.write`
   - `attributes.write`
   - `indexes.write`
4. 更新.env.local中的APPWRITE_API_KEY
5. 重新运行：`npm run db:setup`

---

## 📚 相关文档

- [DATABASE-SETUP.md](./DATABASE-SETUP.md) - 完整数据库架构说明
- [setup-database.ts](../scripts/setup-database.ts) - 自动化脚本源码

---

**创建日期**: 2025-11-09
**状态**: 待用户手动创建或更新API密钥权限
