# 数据架构示例文档

> **目录用途**: 存放具体行业/国家的数据架构实施示例
> **创建日期**: 2025-11-10

---

## 目录说明

本目录包含三层数据架构在不同行业和国家的具体实施案例，作为开发和数据采集的参考模板。

**核心原则**:
- 示例文档展示**具体实现**（以美国vape为例）
- 核心规范在**DATA-COLLECTION-STANDARD.md**（通用策略）

---

## 已有示例

### 1. DATA-ARCHITECTURE-VAPE-EXAMPLE.md
**创建日期**: 2025-11-10
**用途**: 以美国vape数据为例，详细展示三层数据架构的完整实施流程

**内容包括**:
- Layer 1: TypeScript源文件结构（US-vape.ts + US-vape-specific.ts）
- Layer 2: Appwrite数据库导入（60字段核心数据）
- Layer 3: JSON扩展文件导出（84字段扩展数据）
- 数据流转关系图
- 前端使用示例代码

**适用场景**:
- 理解三层架构的具体实现
- 新增国家/行业数据采集参考
- 前端开发数据加载参考

---

## 文档层级定位

### Tier 1: 核心规范（SSOT）
- `CLAUDE.md` - 项目总览
- `DATA-COLLECTION-STANDARD.md` - 数据标准（第5章：三层架构通用策略）

### Tier 2: 动态追踪
- `docs/DATA-COLLECTION-PROGRESS.md` - 实时进度

### Tier 3: 参考示例（本目录）⭐
- `docs/examples/DATA-ARCHITECTURE-VAPE-EXAMPLE.md` - Vape实例

### Tier 4: 历史归档
- `docs/archive/` - 已废弃文档

---

## 未来扩展

计划添加的示例文档：

### Pet Food示例
- [ ] `DATA-ARCHITECTURE-PET-EXAMPLE.md` - 以美国pet_food为例
- [ ] 展示144字段 → 88核心 + 71扩展的数据流

### 跨国对比示例
- [ ] `DATA-ARCHITECTURE-COMPARISON.md` - 美国 vs 越南成本对比
- [ ] 展示如何使用三层架构进行跨国分析

### 前端集成示例
- [ ] `FRONTEND-DATA-LOADING.md` - 前端如何使用data-loader.ts
- [ ] 包含5种使用场景的完整代码

---

## 使用建议

**开发人员**:
1. 先阅读`CLAUDE.md`了解项目总览
2. 再阅读`DATA-COLLECTION-STANDARD.md`第5章了解通用策略
3. 查看本目录示例文档了解具体实现

**数据采集人员**:
1. 参考`DATA-ARCHITECTURE-VAPE-EXAMPLE.md`了解数据流
2. 按照`DATA-COLLECTION-STANDARD.md`标准采集数据
3. 使用脚本（import-data.ts / export-*-extended-data.ts）处理数据

---

**维护者**: GECOM Team
**版本**: v1.0
