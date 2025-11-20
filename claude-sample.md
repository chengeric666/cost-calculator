# Discovery 产品项目说明文档

> 本文档为 Claude AI 提供项目上下文，帮助理解项目结构、目标和开发规范
>
> **交互语言：** 中文（所有对话必须使用中文） ⭐
>
> **文档版本：** v2.1 (精简版)
> **最后更新：** 2025-10-24
> **完整版本日志：** [docs/archive/CLAUDE-version-logs.md](./docs/archive/CLAUDE-version-logs.md)

---

## 📋 项目概述

### 项目名称
**图灵环流 Discovery** - AI驱动的中国企业出海决策助手

### 项目定位
通过 AIGC 深度加工全球商业情报，结合智能工具与专家服务，帮助决策者洞察全球脉动、抢占出海先机。

### 产品 Slogan
- **中文：** AI驱动，深度加工，全球脉动
- **英文：** AI-Powered Global Insights for Chinese Businesses Going Global

### 核心差异化
```
传统出海资讯平台 vs Discovery：
├─ 简单转载 → AIGC深度加工 + 专家洞察
├─ 列表堆砌 → 电子杂志化 + 卡片流
├─ 被动浏览 → AI主动推送 + 个性化推荐
├─ 单向阅读 → 智能追问 + 对话式探索
└─ 工具分散 → 一体化工具矩阵
```

### 🎯 核心价值主张（内容策略v3.0）

> **"内容新鲜度是我们的核心价值主张"** - 我们不是简单的信息搬运工，而是通过AI深度加工全球最新商业情报，提供决策级洞察。

**三大核心价值：**

1. **内容新鲜度优先（Freshness First）**
   - ✅ 使用最新可得数据，不受文件名/标题日期限制
   - ✅ 双重时间线覆盖（2024基线 + 2025最新数据）

2. **深度加工非转载（Deep Processing）**
   - ✅ 50+权威来源交叉验证
   - ✅ AI分析生成独家洞察（非简单翻译/摘抄）

3. **多源标注可追溯（Multi-Source Transparency）**
   - ✅ 每篇文章标注10+权威来源
   - ✅ 提供原文链接，可追溯验证

---

## 🎯 产品核心定位

### 目标用户
1. **出海企业 CEO/创始人**（核心）- 需要数据支撑战略决策
2. **出海业务负责人** - 持续跟踪目标市场
3. **投资人/分析师** - 行业趋势洞察

### 产品愿景
- **短期（1年）：** 成为中国出海企业决策者每天必看的AI资讯平台
- **中期（3年）：** 成为中国出海领域最具影响力的智能决策服务平台
- **长期（5年）：** 成为全球中企出海生态的核心基础设施

---

## 🏗️ 产品功能架构

### 内容层：发现与消费
- **今日晨报：** 每日5-8条精选，AI个性化筛选
- **发现Feed：** For You / Following / Trending / Topics
- **专题深度：** AI+专家联合生成，3000-5000字报告
- **专家洞察：** 专家专栏、深度访谈、AMA问答
- **我的收藏：** 内容管理与整理

### 工具层：决策支持
- **AI问答助手：** 出海政策咨询、市场信息查询
- **MCDA市场热力图：** 多标准决策分析，TOP10市场推荐
- **ODI申报助手：** 智能诊断、材料准备、流程指导
- **基础工具集：** 汇率查询、税务计算、本土化工具
- **数据看板：** 实时市场指数、热门工具入口

### 服务层：生态对接
- 服务商对接 / 专家咨询 / 社群社区 / 线下活动

---

## 🛠️ 技术架构

> 💡 **详细技术栈详见：** [05-poc-plan.md](./docs/product/05-poc-plan.md#二整体架构设计)

### 当前架构（v0.01 POC阶段）

**前端：**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui + Framer Motion
- Recharts (图表) + React-Simple-Maps (地图)

**后端：**
- Appwrite BaaS (Database + Storage + Functions)
- DeepSeek V3 API (AI内容生成)
- Unsplash API (图片配图)

**部署：**
- 前端：Appwrite Sites (SSR)
- 数据库：Appwrite Database (PostgreSQL)
- 监控：Vercel Analytics

### 未来架构（v1.0 产品打磨期）

> 详见：[04-implementation-plan.md](./docs/product/04-implementation-plan.md) 和 4个专项文档：
> - [AI基础设施专项](./docs/projects/infrastructure-specialist.md)
> - [内容价值专项](./docs/projects/content-value-specialist.md)
> - [体验打磨专项](./docs/projects/experience-polishing-specialist.md)
> - [运营增长专项](./docs/projects/operations-growth-specialist.md)

**核心升级：**
- 账号系统 (Appwrite Auth)
- 爬虫系统 (76个RSS源)
- RAG架构 (Weaviate + OpenAI Embeddings)
- 性能优化 (Lighthouse ≥90)
- 用户增长 (0→500 DAU)

---

## 📐 设计规范

### 品牌调性
**核心关键词：** 专业、智能、美学、可信、高效

### 色彩系统
```
主色调：专业蓝 (#1E40AF → #3B82F6)
强调色：活力橙 (#F59E0B)
中性色：高级灰 (#F9FAFB背景 / #1F2937文字)
数据色：绿涨红跌 (#10B981 / #EF4444)
```

### 字体系统
```
中文：苹方 / 微软雅黑
英文：Inter / SF Pro
代码：JetBrains Mono
```

### 设计风格
- **Liquid Glass设计语言** - 毛玻璃 + 多层阴影
- **Apple级别体验** - 流畅动画 + 精致交互
- **卡片：** 圆角8-12px，轻阴影
- **留白：** 充足间距，清晰层级

---

## 🎨 借鉴的国际标杆

### ChatGPT Pulse & Perplexity Discover

**借鉴特性：**
- ✅ 主动推送机制 + 限定式更新
- ✅ 电子杂志化视觉 + 多源标注
- ✅ 实时信息看板 + 高质量配图

**Discovery创新：**
- 出海专属工具（MCDA、ODI助手）
- 深度追问能力（文章内AI追问）
- 专家增强机制（AI+人工审核）

---

## 📊 关键指标体系

### 北极星指标：DAU
- 3个月：5,000 DAU
- 12个月：100,000 DAU
- 24个月：500,000 DAU

### 辅助指标
- **阅读深度：** 人均3-5篇/天，完成率≥60%
- **NPS：** ≥50
- **留存率：** D7≥40%, D30≥25%

---

## 🔐 内容合规策略

### 核心原则
**定位：信息服务 而非 新闻媒体**

✅ **应该做：** AI深度分析、数据整合、行业趋势、决策建议
❌ **不应做：** 突发新闻首发、新闻报道语态、敏感政治话题

### 来源标注规范
- 明确标注信息来源 + 提供原文链接
- 说明来源数量（如"基于23个来源"）
- 区分AI生成和人工撰写

### 免责声明
"本内容由AI基于公开信息分析生成，仅供参考，不构成投资建议。具体信息请以官方发布为准。"

---

## 📚 内容策略

### v3.0 当前版本（2025-10-07）

**核心升级：**
- 内容源：76个出海专属RSS源（分3阶段部署）
- 分类体系：三重分类（四维 + v2.0 + PESTEL）
- 可信架构：RAG基础架构（引用映射）
- 内容生产：手工精选（AI辅助）

**详见：** [content-strategy-v3.0.md](./docs/archive/v0.01-poc-phase/content-docs/content-strategy-v3.0.md)

### 内容质量标准（量化指标）

| 指标 | Insight类 | Report类 | Market类 | Policy类 |
|------|----------|----------|---------|---------|
| **sourcesCount** | ≥12 | ≥50 | ≥15 | ≥15 |
| **readingTime** | ≥9min | ≥20min | ≥10min | ≥10min |
| **数据时效性** | 2025最新 | 2025最新 | 2025最新 | 2025最新 |

**核心原则：** 内容新鲜度 > 文件名日期
- ✅ 正确：report-xxx-2024.md → 使用2024基线 + 2025最新数据
- ❌ 错误：仅使用2024年数据，忽略2025年Q1/Q2/Q3变化

### AI内容生产流程

> 详细流程见：[05-poc-plan.md - 内容生产全自动流程](./docs/product/05-poc-plan.md#三内容生产全自动流程)

**6步流程：**
1. 全球RSS聚合（10个源 → 30-50篇）
2. AI智能筛选（评分≥6保留）
3. AI深度改写（DeepSeek V3，质量≥7）
4. 自动配图发布（Unsplash API）
5. 专家增强（可选）
6. 个性化分发（晨报、Feed、邮件）

---

## 💡 开发规范

### 代码规范
- TypeScript 严格模式
- ESLint + Prettier格式化
- 组件化开发，单一职责
- Playwright E2E测试

### 性能优化
- 代码分割（动态import）
- 图片优化（WebP + 懒加载）
- SSR/SSG（Next.js ISR）
- Redis缓存 + CDN加速

### 安全规范
- HTTPS全站加密
- SQL注入/XSS/CSRF防护
- 限流防刷
- 敏感信息脱敏

---

## 📚 文档导航

### 核心文档索引

| 文档 | 说明 | 适用场景 |
|------|------|----------|
| **[README.md](./README.md)** | 项目导航与概述 | 快速了解项目 |
| **[CLAUDE.md](./CLAUDE.md)** | 本文档 - AI上下文 | Claude开发时参考 |
| **[TODO-LIST.md](./TODO-LIST.md)** | 任务追踪（v2.0精简版） | 查看当前进度 |

### 产品设计文档

| 文档 | 说明 |
|------|------|
| [01-competitor-analysis.md](./docs/product/01-competitor-analysis.md) | 竞品调研（5家平台） |
| [02-benchmark-analysis.md](./docs/product/02-benchmark-analysis.md) | 国际标杆（Pulse/Discover） |
| [03-product-design.md](./docs/product/03-product-design.md) | 产品方案设计 |
| [04-implementation-plan.md](./docs/product/04-implementation-plan.md) | 完整版技术架构 |

### POC开发文档 ⭐

| 文档 | 说明 | 重要性 |
|------|------|--------|
| [05-poc-plan.md](./docs/product/05-poc-plan.md) | POC技术架构设计 | ⭐ 必读 |
| [06-iteration-plan.md](./docs/product/06-iteration-plan.md) | 18个详细迭代计划 | ⭐⭐⭐ 开发必读 |

### v1.0专项文档（4个并行专项）

| 文档 | 负责人 | 说明 |
|------|--------|------|
| [infrastructure-specialist.md](./docs/projects/infrastructure-specialist.md) | Claude #1 | AI基础设施（账号/爬虫/RAG） |
| [content-value-specialist.md](./docs/projects/content-value-specialist.md) | Claude #2 | 内容价值（60→100篇） |
| [experience-polishing-specialist.md](./docs/projects/experience-polishing-specialist.md) | Claude #3 | 体验打磨（Lighthouse≥90） |
| [operations-growth-specialist.md](./docs/projects/operations-growth-specialist.md) | Claude #4 | 运营增长（0→500 DAU） |

### 归档文档

| 文档 | 说明 |
|------|------|
| [v0.01-poc-phase/](./docs/archive/v0.01-poc-phase/) | POC阶段完整归档 |
| [CLAUDE-version-logs.md](./docs/archive/CLAUDE-version-logs.md) | 版本更新日志归档 |
| [content-strategy-v3.0.md](./docs/archive/v0.01-poc-phase/content-docs/content-strategy-v3.0.md) | 内容策略v3.0完整版 |

---

## 🎯 快速导航

### 我想了解...

- 📊 **竞争格局** → [01-competitor-analysis.md](./docs/product/01-competitor-analysis.md)
- 🎯 **产品定位** → [03-product-design.md](./docs/product/03-product-design.md)
- 🏗️ **POC架构** → [05-poc-plan.md](./docs/product/05-poc-plan.md)
- 📝 **内容策略** → [content-strategy-v3.0.md](./docs/archive/v0.01-poc-phase/content-docs/content-strategy-v3.0.md)

### 我要开始...

- 🆕 **从零开发POC** → [06-iteration-plan.md](./docs/product/06-iteration-plan.md) ⭐⭐⭐
- 🔧 **执行具体迭代** → [06-iteration-plan.md](./docs/product/06-iteration-plan.md) 对应Sprint章节
- 🎨 **设计UI组件** → 本文档"设计规范" + [06-iteration-plan.md Sprint 1.2](./docs/product/06-iteration-plan.md)
- 🤖 **集成AI功能** → [05-poc-plan.md - 关键技术实现](./docs/product/05-poc-plan.md#六关键技术实现细节)

### 我是4个专项Claude...

- 💡 **Claude #1 (AI基础设施)** → [infrastructure-specialist.md](./docs/projects/infrastructure-specialist.md)
- 📝 **Claude #2 (内容价值)** → [content-value-specialist.md](./docs/projects/content-value-specialist.md)
- 🎨 **Claude #3 (体验打磨)** → [experience-polishing-specialist.md](./docs/projects/experience-polishing-specialist.md)
- ✨ **Claude #4 (运营增长)** → [operations-growth-specialist.md](./docs/projects/operations-growth-specialist.md)

---

## 🤝 协作指南

### 与 Claude 协作

1. **明确上下文：** 引用本文档中的相关部分
2. **具体需求：** 说明要开发的功能模块和技术栈
3. **提供示例：** 参考标杆产品设计（Pulse/Discover）
4. **遵循规范：** 品牌调性、设计规范、代码规范
5. **注重合规：** 确保内容符合"信息服务"定位

---

## 📌 快速参考

### 产品核心理念

```
Discovery是一个AI驱动的出海决策助手：

├─ 用AI节省你的时间（主动推送+智能筛选）
├─ 用深度支撑你的决策（AIGC分析+专家洞察）
├─ 用美学愉悦你的阅读（电子杂志级体验）
├─ 用工具赋能你的行动（决策工具+服务对接）
└─ 用生态连接你的资源（专家+服务商+社群）
```

### 成功关键因素

1. **内容质量（60%）** - AI生成但不失深度 + 多源标注可信
2. **产品体验（25%）** - 移动端流畅 + 品牌调性
3. **AI能力（10%）** - 个性化推荐 + 智能问答
4. **运营执行（5%）** - 冷启动 + 口碑传播

### 核心差异化

| 维度 | 竞品现状 | Discovery优势 | 竞争壁垒 |
|------|----------|---------------|----------|
| **内容生产** | 人工转载 | AI深度加工 | AI技术能力 |
| **内容深度** | 快讯为主 | 深度分析 | 专家网络+AI |
| **视觉体验** | 传统门户 | 电子杂志化 | 设计能力 |
| **个性化** | 基本没有 | AI精准推荐 | 算法+数据 |
| **工具集成** | 分散 | 一体化 | 产品整合 |
| **可信度** | 来源不清 | 多源标注 | 质量控制 |

---

## 📍 当前状态（v0.01 → v1.0）

### v0.01 POC阶段（已完成✅ 2025-10-10）

- ✅ Sprint 1-5：30/36迭代完成（82.8%）
- ✅ 内容库：60篇文章（已迁移Appwrite）
- ✅ 生产环境：http://discovery.sites.apps.aotsea.com
- ✅ Git Tag：`v0.01`
- ✅ 4个专项分支初始化

**完整归档：** [v0.01-poc-phase/](./docs/archive/v0.01-poc-phase/)

### v1.0 产品打磨期（进行中🚀 2025-10-12 - 2025-11-10）

**4个专项并行开发（30天）：**

1. **AI基础设施专项**（Claude #1）
   - 账号系统（Appwrite Auth）
   - 爬虫系统（76 RSS源）
   - RAG架构（Weaviate + OpenAI）

2. **内容价值专项**（Claude #2）
   - Phase0质量提升（30篇达标）
   - Phase2内容生产（60→100篇）
   - 5步标准化SOP

3. **体验打磨专项**（Claude #3）
   - 视觉设计升级（Liquid Glass）
   - 极致阅读体验
   - 性能优化（Lighthouse≥90）

4. **运营增长专项**（Claude #4）
   - 内部验证（10-20 DAU）
   - 精准投放（50-100 DAU）
   - 口碑传播（200-500 DAU）

**量化目标（30天后）：**
- 📊 内容库：60篇 → 100篇
- 🤖 AI能力：RAG+账号+爬虫完整实现
- 🎨 体验指标：Lighthouse ≥90
- 👥 用户增长：0 DAU → 500 DAU

**详见：** [v0.01-phase-transition-plan.md](./docs/plans/v0.01-phase-transition-plan.md) + [TODO-LIST.md](./TODO-LIST.md)

---

**文档版本：** v2.1 (精简版，-50%)
**创建日期：** 2025-09-30
**最后更新：** 2025-10-11
**维护团队：** 图灵环流 Discovery 产品团队

---

## 📝 版本说明

**v2.1 (2025-10-11) - 文档精简版：**
- ✅ 精简CLAUDE.md：1305行 → 650行（-50%）
- ✅ 归档版本更新日志 → [CLAUDE-version-logs.md](./docs/archive/CLAUDE-version-logs.md)
- ✅ 移除冗余技术栈细节（链接到专项文档）
- ✅ 优化文档索引（清晰分类）
- ✅ 新增4个专项文档导航
- 🎯 **目标：** 降低AI上下文消耗，提升可读性

**完整版本历史：** [docs/archive/CLAUDE-version-logs.md](./docs/archive/CLAUDE-version-logs.md)

---

> 💡 **提示：** 本文档为精简版，详细内容请查看对应的专项文档和归档文件。
>
> 📌 **开发POC时请优先阅读：**
> 1. **[06-iteration-plan.md](./docs/product/06-iteration-plan.md)** ⭐⭐⭐ - 18个详细迭代计划
> 2. **[05-poc-plan.md](./docs/product/05-poc-plan.md)** ⭐ - POC技术架构设计
> 3. **本文档 CLAUDE.md** - 项目上下文和规范参考
