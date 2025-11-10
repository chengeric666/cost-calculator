# 文档归档说明

> **归档日期**: 2025-11-10
> **原因**: SSOT（单一真相来源）文档整合

---

## 归档策略

根据SSOT原则，我们将分散的三层数据架构文档整合到核心文档中，避免重复和不一致。

---

## 已归档文档

### 1. DATA-MAINTENANCE-STRATEGY.md
**归档原因**: 内容已整合到核心规范文档
**新位置**: `DATA-COLLECTION-STANDARD.md` 第5章：三层数据架构策略
**整合日期**: 2025-11-10

**原文档内容**:
- 三层数据架构设计（Layer 1/2/3）
- 数据维护流程
- 前端数据加载规范

**现在查看**: `/Users/batfic887/Documents/project/cost-calculator/DATA-COLLECTION-STANDARD.md` (v2.0)

---

### 2. THREE-LAYER-DATA-ARCHITECTURE.md
**归档原因**: 内容已整合到项目总览文档
**新位置**: `CLAUDE.md` 数据库结构章节
**整合日期**: 2025-11-10

**原文档内容**:
- 三层架构总览
- 为什么需要三层架构
- 架构图和对比表

**现在查看**: `/Users/batfic887/Documents/project/cost-calculator/CLAUDE.md` (v2.0)

---

## 文档层级体系 (Tier 1-4)

### Tier 1: 核心规范（SSOT）⭐
- `CLAUDE.md` - 项目总览、三层架构总览
- `DATA-COLLECTION-STANDARD.md` - 数据采集标准、三层架构详细规范

### Tier 2: 动态追踪
- `docs/DATA-COLLECTION-PROGRESS.md` - 实时数据采集进度

### Tier 3: 参考示例
- `docs/examples/DATA-ARCHITECTURE-VAPE-EXAMPLE.md` - Vape数据架构实例

### Tier 4: 历史归档（本目录）
- `docs/archive/DATA-MAINTENANCE-STRATEGY.md` - 已合并到DATA-COLLECTION-STANDARD.md
- `docs/archive/THREE-LAYER-DATA-ARCHITECTURE.md` - 已合并到CLAUDE.md
- `docs/archive/BACKFILL-5-COUNTRIES-GUIDE.md` - 历史回填指南
- `docs/archive/REFACTOR-5-COUNTRIES-REPORT.md` - 重构报告

---

## 核心成果

### SSOT明确化
- ✅ 单一真相来源：TypeScript源文件（Layer 1）
- ✅ 核心规范文档：DATA-COLLECTION-STANDARD.md (v2.0)
- ✅ 项目总览文档：CLAUDE.md (v2.0)

### 三层架构成为通用策略
- ✅ 不再是vape特有，而是**所有行业通用规范**
- ✅ 适用于pet_food、vape、未来扩展行业
- ✅ 包含完整实施规范、验证清单、成功指标

---

## 查看最新文档

**核心规范**:
```bash
# 项目总览（三层架构总览）
cat CLAUDE.md

# 数据采集标准（三层架构详细规范）
cat DATA-COLLECTION-STANDARD.md
```

**实施示例**:
```bash
# Vape数据架构实例
cat docs/examples/DATA-ARCHITECTURE-VAPE-EXAMPLE.md
```

---

**维护者**: GECOM Team
**版本**: v1.0
