# GECOM智能化成本助手产品规划与MVP方案

> Web+AI助手一体化设计 | 2周可交付MVP
>
> **版本:** v1.0
> **创建日期:** 2025年11月6日

---

## 目录

- [一、产品定位与价值主张](#一产品定位与价值主张)
- [二、核心功能架构](#二核心功能架构)
- [三、用户体验设计](#三用户体验设计)
- [四、MVP/POC实施方案(2周)](#四mvppoc实施方案2周)
- [五、技术架构设计](#五技术架构设计)
- [六、开发里程碑](#六开发里程碑)

---

## 一、产品定位与价值主张

> **MVP 2.0升级说明**（2025-11-08更新）：
> - ✅ 19国真实数据库（127字段成本因子）
> - ✅ M1-M8完整模块透明化
> - ✅ AI深度集成（DeepSeek R1+V3工具调用）
> - ✅ 专业报告生成（对标益家之宠30,000字）

### 1.1 产品定位

```
GECOM智能化成本助手 MVP 2.0
= 基于GECOM方法论的跨境电商成本测算与ROI优化平台

核心定位:
"中国出海企业的科学成本测算与决策支持工具"

差异化（MVP 2.0核心升级）:
├─ 真实数据: 19国×127字段真实成本因子（非估算）⭐
├─ 完整透明: M1-M8双阶段八模块完整展示+用户可自定义 ⭐
├─ 方法论: GECOM标准框架（经益家之宠等实战验证）
├─ 数据可信: Tier1/2/3数据源分级+溯源标识 ⭐
├─ AI深度集成: 工具调用连接真实成本引擎 ⭐
├─ 专业报告: 30,000字Word报告（用户可编辑）⭐
├─ 价格优势: ¥10-30K/年 vs 咨询公司$50-200K/项目
└─ 垂直深度: 跨境电商专用,非通用工具

覆盖范围（MVP 2.0）:
├─ 19个国家: 美/加/墨/德/英/法/新/越/泰/马/菲/印尼/印度/日/韩/澳/沙特/阿联酋/巴西
├─ 2个行业: 宠物用品、电子烟（未来扩展至快消/服装/美妆）
└─ 全渠道: 独立站/Amazon/Shopee/TikTok Shop/O2O
```

### 1.2 核心价值主张

**对CEO/决策者:**
> "1小时完成原本需要1-4周的成本测算,
> 避免低估成本导致的战略失误和资金链断裂。"

**对CFO/财务团队:**
> "科学的成本数据和ROI分析,
> 通过审计级数据可信度验证,支撑预算规划和董事会汇报。"

**对运营团队:**
> "快速评估不同市场/渠道/产品的盈利潜力,
> 识别成本优化机会,提升ROI。"

### 1.3 产品Slogan

```
中文: "让复杂的全球电商成本,一目了然"
英文: "Simplify Global E-commerce Cost Management"

品牌调性:
├─ 专业但不晦涩
├─ 科学但不复杂
├─ 智能但可信赖
└─ 高效但不粗糙
```

---

## 二、核心功能架构

> **MVP 2.0功能升级**（2025-11-08更新）：
> - Step 0新增：项目基本信息（独立步骤）
> - Step 1升级：19国动态选择（含数据可用性提示）
> - Step 2核心重构：M1-M8完整展示+用户覆盖机制 ⭐
> - Step 4升级：19国并行对比（最优/最差市场推荐）
> - Step 5深度集成：AI工具调用连接成本引擎

### 2.1 产品功能地图（MVP 2.0）

```
GECOM智能化成本助手 MVP 2.0
│
├─ 【核心流程】GECOM完整五步向导（升级为6步）
│  ├─ Step 0: 项目基本信息 ⭐新增
│  ├─ Step 1: 业务场景定义（19国选择）⭐升级
│  ├─ Step 2: 成本参数配置（M1-M8完整展示）⭐核心重构
│  ├─ Step 3: 成本建模结果
│  ├─ Step 4: 多场景对比分析（19国并行）⭐升级
│  └─ Step 5: AI智能助手（工具调用集成）⭐深度集成
│
├─ 【Web界面】可视化操作平台
│  ├─ 项目管理(新建/管理成本测算项目)
│  ├─ 交互式表单(参数输入+实时验证)
│  ├─ 数据可视化(成本结构图/ROI曲线)
│  ├─ 场景对比(多市场/多渠道对比)
│  └─ 报告导出(PDF/Excel)
│
├─ 【AI助手】智能对话与建议
│  ├─ 智能问答(基于GECOM知识库)
│  ├─ 参数推荐(基于行业因子库)
│  ├─ 异常检测(识别不合理输入)
│  ├─ 优化建议(AI生成ROI优化路线图)
│  └─ 案例参考(推荐相似行业案例)
│
└─ 【数据引擎】GECOM方法论内核
   ├─ 八模块成本模型(M1-M8)
   ├─ 行业因子库(Pet/Vape/3C等)
   ├─ 数据源管理(Tier1/2/3分级)
   ├─ 计算引擎(TCO/UE/ROI/BEP)
   └─ 敏感性分析(变量影响测算)
```

### 2.2 核心功能详解

#### 功能1: GECOM五步测算SOP(核心流程)

**Step 1: 战略对齐与范围设定**
```
用户输入:
├─ 目标国家/市场(美国/欧盟/东南亚等)
├─ 销售渠道(Amazon FBA/Shopee/DTC独立站/O2O)
├─ 产品信息(SKU/规格/重量/COGS/目标售价)
├─ 业务模式(FBA/直邮/本地仓/O2O)
└─ 核心假设(月销量/CAC目标/退货率等)

AI助手提示:
├─ "根据您选择的宠物用品行业+美国市场,建议关注FDA合规要求"
├─ "Amazon FBA模式下,建议预留$5-15K启动成本"
└─ "您的目标售价$25与行业均价$22-30相符"

输出:
项目范围说明书(Scope Document)
```

**Step 2: 数据采集与验证(核心竞争力)**
```
系统自动获取:
├─ Tier 1数据(政府官网)
│   ├─ 美国关税税率(USITC数据库)
│   ├─ 美国销售税率(各州税务局)
│   └─ Amazon FBA官方费率(2025版)
│
├─ Tier 2数据(服务商报价)
│   ├─ 3家物流商对比报价
│   ├─ 支付渠道费率(PayPal/Stripe)
│   └─ 法律服务商报价范围
│
└─ Tier 3数据(行业经验)
    ├─ 行业基准CAC
    └─ 退货率参考值

用户手工输入(如需):
└─ 特定服务商实际报价

数据验证:
├─ 交叉验证(多源对比)
├─ 合理性校验(行业基准对比)
├─ 异常检测(AI识别异常值)
└─ 来源标注(完全透明)

输出:
经过验证的成本数据库(Data Validation Report)
```

**Step 3: 成本建模与计算**
```
自动计算:
├─ 启动成本(CAPEX): M1+M2+M3
│   ├─ M1 市场准入成本
│   ├─ M2 技术合规栈
│   └─ M3 供应链与渠道准备
│
├─ 运营成本(OPEX): M4+M5+M6+M7+M8
│   ├─ M4 商品与税费成本
│   ├─ M5 物流与履约成本
│   ├─ M6 营销与获客成本
│   ├─ M7 交易与支付成本
│   └─ M8 运营与维护成本
│
├─ 单位经济模型(UE): 每单成本拆解
├─ 关键指标:
│   ├─ 贡献利润(Contribution Margin)
│   ├─ 毛利率(Gross Margin)
│   ├─ 盈亏平衡点(Break-Even Point)
│   └─ ROI与回收期
│
└─ 多场景成本:
    ├─ 正常购买场景
    ├─ 退货场景
    └─ 换货场景

输出:
详细成本测算模型(Cost Model Report)
```

**Step 4: 场景模拟与敏感性分析**
```
敏感性分析:
├─ 关键变量:
│   ├─ 关税率(+5% / +10%)
│   ├─ 物流费(+20% / +30%)
│   ├─ CAC(±30%)
│   └─ 售价(+$5 / +$10)
│
└─ 影响测算:
    ├─ ROI变化曲线
    ├─ 盈亏平衡点移动
    └─ 利润率波动范围

多场景模拟:
├─ 场景A: Amazon FBA
├─ 场景B: Shopee平台
├─ 场景C: DTC独立站
└─ 场景D: O2O模式

交互式对比:
"如果从Amazon FBA切换到Shopee,ROI会提升多少?"
→ 实时计算并展示对比结果

输出:
敏感性分析报告(Sensitivity Analysis) + 场景对比表
```

**Step 5: 洞察提炼与优化路线图**
```
AI自动生成:
├─ 核心发现:
│   ├─ "美国市场29%关税是最大成本驱动因素"
│   ├─ "FBA履约费$11/单,占总成本37%"
│   └─ "越南市场仅需提价8%即可盈亏平衡"
│
├─ 优化建议(分优先级):
│   ├─ P0(立即执行):
│   │   └─ "提价至$33以上实现盈亏平衡"
│   ├─ P1(3个月内):
│   │   └─ "优先深耕越南市场,暂缓美国扩张"
│   └─ P2(6个月内):
│       └─ "评估墨西哥制造+USMCA免关税方案"
│
└─ 实施路线图:
    ├─ Q1: 越南市场测试(ROI目标8%)
    ├─ Q2: 优化定价策略
    └─ Q3: 评估美国市场重新进入

输出:
最终成本测算报告 + ROI优化路线图(Action Roadmap)
```

---

## 三、用户体验设计

### 3.1 Web界面设计

#### 首页: 项目管理

```
┌────────────────────────────────────────────────────────┐
│  [GECOM Logo]  GECOM智能化成本助手      [用户] [设置]  │
├────────────────────────────────────────────────────────┤
│                                                         │
│  我的成本测算项目                                       │
│  ┌────────────────────────────────────────────┐        │
│  │  [+ 新建项目]                                │        │
│  └────────────────────────────────────────────┘        │
│                                                         │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │ 项目1    │ 项目2    │ 项目3    │          │        │
│  │ 宠物用品 │ 电子烟   │ 3C产品   │          │        │
│  │ 美国     │ 菲律宾   │ 欧盟     │          │        │
│  │ 已完成   │ 进行中   │ 草稿     │          │        │
│  │ ROI 8%   │ ROI -12% │ --       │          │        │
│  │ [查看]   │ [继续]   │ [编辑]   │          │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
│                                                         │
│  快速入口:                                              │
│  [📘 GECOM方法论介绍] [🎓 案例库] [❓ 常见问题]        │
└────────────────────────────────────────────────────────┘
```

#### 核心页面: GECOM五步测算向导

```
┌────────────────────────────────────────────────────────┐
│  Step 1/5: 战略对齐与范围设定                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                         │
│  ┌─────────────────────┐  ┌───────────────────────┐   │
│  │  参数输入区          │  │  AI助手              │   │
│  │                     │  │                       │   │
│  │  目标市场:          │  │  💡 智能提示:        │   │
│  │  [🇺🇸 美国  ▼]      │  │  根据您选择的宠物    │   │
│  │                     │  │  用品+美国市场,      │   │
│  │  销售渠道:          │  │  建议关注:           │   │
│  │  [Amazon FBA ▼]     │  │  - FDA备案要求       │   │
│  │                     │  │  - $5-15K启动成本    │   │
│  │  行业:              │  │                       │   │
│  │  [宠物用品 ▼]       │  │  [查看相似案例]      │   │
│  │                     │  │                       │   │
│  │  产品信息:          │  │  ❓ 有疑问?          │   │
│  │  SKU: YJ-CF-001     │  │  [问AI助手]          │   │
│  │  重量: 2.5kg        │  │                       │   │
│  │  COGS: $8.00        │  │                       │   │
│  │  售价: $25.00       │  │                       │   │
│  │                     │  │                       │   │
│  │  核心假设:          │  │                       │   │
│  │  月销量: 100单      │  │                       │   │
│  │  退货率: 8%         │  │                       │   │
│  │                     │  │                       │   │
│  │  [保存草稿]         │  │                       │   │
│  │  [下一步 →]         │  │                       │   │
│  └─────────────────────┘  └───────────────────────┘   │
│                                                         │
│  进度: ●─○─○─○─○  1/5 战略对齐                        │
└────────────────────────────────────────────────────────┘
```

#### 结果页面: 成本结构可视化

```
┌────────────────────────────────────────────────────────┐
│  项目: 宠物用品-美国市场          [导出PDF] [导出Excel] │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ⚠️ 当前定价不可持续,需提价29%至$33才能盈亏平衡          │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │  单位成本结构(UE)    │  │  ROI分析            │     │
│  │                     │  │                     │     │
│  │  售价: $25.00       │  │  [ROI曲线图]        │     │
│  │  总成本: $32.37     │  │  当前: -30%         │     │
│  │  利润: -$7.37❌     │  │  盈亏平衡: $33      │     │
│  │                     │  │  目标ROI 15%: $38   │     │
│  │  成本占比:          │  │                     │     │
│  │  [饼图]             │  │                     │     │
│  │  M4 商品税费 38%    │  │                     │     │
│  │  M5 物流履约 37%    │  │                     │     │
│  │  M6 营销获客 3%     │  │                     │     │
│  │  M7 交易支付 8%     │  │                     │     │
│  │  M8 运营维护 14%    │  │                     │     │
│  └─────────────────────┘  └─────────────────────┘     │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │  核心洞察 (AI生成)                            │      │
│  │  ├─ 29%关税($2.32/单)是最大成本驱动因素       │      │
│  │  ├─ FBA履约费$11/单占总成本34%,高于行业均值   │      │
│  │  └─ 越南市场成本结构更优,建议优先测试         │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │  优化建议 (AI生成)                            │      │
│  │  P0 立即执行: 提价至$33实现盈亏平衡           │      │
│  │  P1 3个月内: 优先深耕越南市场(仅亏8%)         │      │
│  │  P2 6个月内: 评估墨西哥制造+USMCA免关税       │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  [查看详细数据] [场景对比] [敏感性分析]                 │
└────────────────────────────────────────────────────────┘
```

### 3.2 AI助手交互设计

#### AI助手对话框(嵌入式)

```
┌────────────────────────────────────────┐
│  GECOM AI助手 💬                       │
├────────────────────────────────────────┤
│                                         │
│  🤖 你好!我是GECOM AI助手,            │
│      有什么可以帮您的?                │
│                                         │
│  常见问题:                             │
│  • 如何理解GECOM八模块?               │
│  • 什么是Tier1/2/3数据源?             │
│  • 如何做敏感性分析?                  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │  输入您的问题...                │  │
│  └─────────────────────────────────┘  │
│  [发送]                                │
│                                         │
│  示例对话:                             │
│  👤 "为什么我的美国市场成本这么高?"   │
│  🤖 "根据您的数据,主要有两个原因:    │
│      1. 29%关税率($2.32/单)          │
│      2. FBA履约费($11/单,占34%)      │
│      建议: 评估墨西哥制造+USMCA免关税" │
│                                         │
└────────────────────────────────────────┘
```

---

## 四、MVP 2.0实施方案（4周）⭐

> **版本说明**: 基于POC v1.0用户反馈，升级为MVP 2.0产品级方案
> **核心升级**: 19国真实数据 + M1-M8完整展示 + AI深度集成 + 专业报告生成

### 4.1 MVP 2.0核心目标

```
目标:
将GECOM方法论产品化为可商业化的专业工具

成功标准（相比POC v1.0全面升级）:
├─ 数据: 19国真实成本因子（含Tier 1/2/3溯源）✅
├─ 功能: M1-M8完整模块透明化展示 ✅
├─ 行业: 覆盖2个行业(宠物用品+电子烟)
├─ 市场: 覆盖19个国家（美欧亚澳中东南美全覆盖）✅
├─ AI能力: DeepSeek R1+V3工具调用（连接真实成本引擎）✅
├─ 报告: 对标益家之宠30,000字专业Word报告 ✅
├─ 用户: 获取50+种子用户测试
├─ 满意度: NPS≥70
└─ 完成度: 用户完成度≥80%

POC问题诊断与MVP 2.0解决方案:
├─ 问题1: 数据引擎不完整 → 导入19国×127字段真实数据库
├─ 问题2: 报告能力不足 → 实现益家之宠级别专业报告
├─ 问题3: 界面粒度错误 → M1-M8模块完整可见可编辑
├─ 问题4: 功能未对齐 → 支持19国并行对比，最优/最差市场推荐
└─ 问题5: AI未集成 → AI工具调用深度联动成本计算引擎
```

### 4.2 MVP 2.0功能范围（产品级）

#### ✅ P0功能（核心必须 - MVP 2.0）

```
1. 19国真实数据库 ⭐核心差异化
   ├─ 覆盖国家: 美/加/墨/德/英/法/新/越/泰/马/菲/印尼/印度/日/韩/澳/沙特/阿联酋/巴西
   ├─ 数据结构: 4个Appwrite Collections
   │  ├─ cost_factors: 19国×127字段成本因子库
   │  ├─ projects: 用户项目管理
   │  ├─ calculations: 计算结果存储
   │  └─ cost_factor_versions: 数据版本管理
   ├─ 数据质量: Tier 1/2/3分级（官方/权威/估算）
   └─ 数据溯源: 每个成本项标注来源与可信度

2. GECOM完整五步向导 ⭐
   ├─ Step 0: 项目基本信息（新增独立步骤）
   │  └─ 项目名称/行业选择/历史项目加载
   ├─ Step 1: 业务场景定义
   │  └─ 19国动态选择/定价/销量/运输方式
   ├─ Step 2: 成本参数配置（完整M1-M8展示）⭐最重要
   │  ├─ CAPEX: M1市场准入 + M2技术合规 + M3供应链搭建
   │  ├─ OPEX: M4货物税费 + M5物流配送 + M6营销获客 + M7支付手续 + M8运营管理
   │  ├─ 每个模块: 预设值显示 + Tier徽章 + 用户自定义按钮
   │  ├─ 实时预览: 右侧1/3屏幕显示当前成本/毛利率
   │  └─ 智能提示: 毛利率<0时显示优化建议
   ├─ Step 3: 成本建模结果
   │  ├─ KPI卡片: 毛利/ROI/回本周期/LTV:CAC
   │  ├─ 可视化: 饼图（成本分布）+ 柱状图（M1-M8对比）
   │  └─ 盈亏平衡: 价格/销量敏感性分析
   ├─ Step 4: 多场景对比分析
   │  ├─ 最多对比5个国家
   │  ├─ 对比维度: 关税/VAT/物流/佣金/总成本/毛利率
   │  └─ 智能推荐: 最优/最差市场标识
   └─ Step 5: AI智能助手（深度集成）
      ├─ DeepSeek V3工具调用: getCostBreakdown/compareScenarios/getOptimizationSuggestions
      ├─ 连接真实数据: 可回答"分析美国成本结构"等问题
      └─ 快捷问题: 预设常见优化场景

3. 专业报告生成系统 ⭐
   ├─ 对标目标: 益家之宠全球在线销售成本测算报告（30,000字）
   ├─ 报告结构:
   │  ├─ 封面 + 执行摘要
   │  ├─ 第一章: 项目概况与假设
   │  ├─ 第二章: M1-M8成本拆解详细分析（8-10页）
   │  ├─ 第三章: 财务模型与盈利能力分析
   │  ├─ 第四章: AI生成的战略建议与优化路径（DeepSeek R1）
   │  ├─ 附录A: 完整成本明细表
   │  ├─ 附录B: 数据溯源说明（Tier 1/2/3）
   │  └─ 附录C: GECOM方法论白皮书
   ├─ 技术实现: docx.js生成Word格式（用户可编辑）
   ├─ 图表插入: html2canvas将Recharts转为PNG
   └─ 生成时间: <15秒

4. AI助手工具调用集成
   ├─ 双模型架构:
   │  ├─ DeepSeek V3: 快速问答 + 工具调用（Step 5助手）
   │  └─ DeepSeek R1: 深度推理 + 战略建议（报告第四章）
   ├─ 3个核心工具函数:
   │  ├─ tool_getCostBreakdown(module): 获取M1-M8成本详情
   │  ├─ tool_compareScenarios(countries[]): 对比多国成本
   │  └─ tool_getOptimizationSuggestions(focus_area): 获取优化建议
   └─ 真实数据联动: 所有AI回答基于真实cost_factors数据

5. 项目管理与历史记录
   ├─ 保存项目到Appwrite（projects表）
   ├─ 保存计算结果到calculations表（含userOverrides）
   ├─ 历史项目列表（按时间倒序）
   └─ 加载历史项目继续编辑
```

#### ⏸️ 暂不包含（留到v3.0+ SaaS化）

```
❌ 用户认证与权限管理（Appwrite Auth）
❌ 多SKU并行计算（一个项目多个产品）
❌ 实时数据更新（关税/汇率API自动同步）
❌ 更多行业扩展（快消品/服装/电子产品/美妆）
❌ 敏感性分析交互式图表（价格/销量滑块）
❌ 用户协作（多人协同编辑项目）
❌ 移动端App（React Native）
❌ API接口（第三方ERP/WMS集成）
❌ 多租户SaaS化（企业版订阅）

说明：MVP 2.0专注于核心价值验证（19国数据+专业报告+AI集成），
v3.0再考虑SaaS化和商业化功能。
```

### 4.3 技术栈选择(2周可交付)

```
前端:
├─ Next.js 14 (React框架,SSR/SSG)
├─ TypeScript (类型安全)
├─ Tailwind CSS + shadcn/ui (快速UI开发)
├─ Recharts (数据可视化)
└─ React Hook Form (表单管理)

后端:
├─ Next.js API Routes (无需独立后端)
├─ 或 FastAPI (Python,如需复杂计算)
└─ PostgreSQL / Supabase (数据库)

AI能力(MVP简化):
├─ 规则引擎(基于if-else逻辑)
├─ 或 Claude API (简单的智能提示)
└─ 留到v2.0: GPT-4深度分析

部署:
├─ Vercel (前端托管,零配置)
└─ Supabase (后端+数据库,免费额度)

成本:
├─ Vercel免费版(Hobby)
├─ Supabase免费版
└─ 总成本: $0/月(MVP阶段)
```

### 4.4 数据结构设计

#### 核心数据模型

```typescript
// 项目(Project)
interface Project {
  id: string;
  userId: string;
  name: string;  // "宠物用品-美国市场"
  industry: 'pet' | 'vape' | '3c';
  targetCountry: 'US' | 'VN' | 'PH' | 'EU';
  salesChannel: 'amazon_fba' | 'shopee' | 'dtc' | 'o2o';
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;

  // Step 1: 战略对齐
  scope: {
    productInfo: {
      sku: string;
      name: string;
      weight: number;  // kg
      dimensions?: { length: number; width: number; height: number };
      cogs: number;    // 美元
      targetPrice: number;
    };
    businessModel: 'fba' | 'direct_ship' | 'local_warehouse' | 'o2o';
    assumptions: {
      monthlySales: number;
      returnRate: number;  // 8% = 0.08
      targetCAC?: number;
    };
  };

  // Step 2-3: 成本数据与计算结果
  costData: {
    capex: {  // M1-M3
      m1_marketEntry: number;
      m2_techCompliance: number;
      m3_supplyChain: number;
      total: number;
    };
    opex: {  // M4-M8
      m4_goodsTax: number;
      m5_logistics: number;
      m6_marketing: number;
      m7_payment: number;
      m8_operations: number;
      total: number;
    };
    unitEconomics: {
      price: number;
      totalCost: number;
      profit: number;
      margin: number;  // -30% = -0.30
    };
    kpis: {
      roi: number;
      breakEvenPrice: number;
      breakEvenVolume: number;
      paybackPeriod: number;  // 月
    };
  };

  // Step 4: 场景模拟
  scenarios?: Array<{
    name: string;
    assumptions: any;
    results: any;
  }>;

  // Step 5: 洞察与建议
  insights?: {
    keyFindings: string[];
    optimizationSuggestions: Array<{
      priority: 'P0' | 'P1' | 'P2';
      description: string;
      expectedImpact: string;
    }>;
  };
}

// 行业因子库(Industry Factor)
interface IndustryFactor {
  industry: 'pet' | 'vape' | '3c';
  country: 'US' | 'VN' | 'PH' | 'EU';

  // M1-M8模块的默认值和参考范围
  m1_marketEntry: {
    description: string;
    defaultValue: number;
    range: { min: number; max: number };
    components: Array<{
      name: string;  // "FDA备案"
      cost: number;
      source: string;
      sourceTier: 'Tier1' | 'Tier2' | 'Tier3';
    }>;
  };

  // ...M2-M8类似结构

  // 特殊监管要求
  specialRequirements?: Array<{
    name: string;
    description: string;
    cost?: number;
  }>;
}
```

---

## 五、技术架构设计

### 5.1 系统架构图

```
┌─────────────────────────────────────────────────────┐
│                    用户浏览器                        │
│  ┌────────────────┐  ┌──────────────────────────┐  │
│  │  Web界面       │  │  AI助手对话框            │  │
│  │  (Next.js)     │  │  (实时交互)              │  │
│  └────────────────┘  └──────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
                   ↓
┌─────────────────────────────────────────────────────┐
│               Next.js前端+API Routes                 │
│  ┌──────────────────────────────────────────────┐  │
│  │  页面路由(/projects, /calculator, etc)        │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  API Routes                                   │  │
│  │  ├─ /api/projects (CRUD)                     │  │
│  │  ├─ /api/calculate (GECOM计算引擎)            │  │
│  │  ├─ /api/factors (行业因子库查询)             │  │
│  │  └─ /api/ai-assistant (AI助手)               │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│              GECOM计算引擎(核心逻辑)                 │
│  ┌──────────────────────────────────────────────┐  │
│  │  gecom-calculator.ts                         │  │
│  │  ├─ calculateCAPEX() : M1+M2+M3              │  │
│  │  ├─ calculateOPEX() : M4+M5+M6+M7+M8         │  │
│  │  ├─ calculateUnitEconomics() : UE/ROI/BEP    │  │
│  │  └─ runScenarioSimulation() : 场景模拟       │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  industry-factors.ts (行业因子库)             │  │
│  │  ├─ getFactorsByIndustry()                   │  │
│  │  ├─ getDefaultValues()                       │  │
│  │  └─ validateInput()                          │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│              Supabase(后端+数据库)                   │
│  ┌──────────────────────────────────────────────┐  │
│  │  PostgreSQL数据库                             │  │
│  │  ├─ projects表                               │  │
│  │  ├─ industry_factors表                       │  │
│  │  └─ users表                                  │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Supabase Auth(用户认证)                     │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 5.2 GECOM计算引擎核心逻辑

```typescript
// gecom-calculator.ts

export function calculateCostModel(project: Project): CostResult {
  // 1. 获取行业因子库
  const factors = getIndustryFactors(
    project.industry,
    project.targetCountry,
    project.salesChannel
  );

  // 2. 计算CAPEX(M1-M3)
  const capex = {
    m1: calculateM1_MarketEntry(project, factors),
    m2: calculateM2_TechCompliance(project, factors),
    m3: calculateM3_SupplyChain(project, factors),
  };
  capex.total = capex.m1 + capex.m2 + capex.m3;

  // 3. 计算OPEX(M4-M8)
  const opex = {
    m4: calculateM4_GoodsTax(project, factors),
    m5: calculateM5_Logistics(project, factors),
    m6: calculateM6_Marketing(project, factors),
    m7: calculateM7_Payment(project, factors),
    m8: calculateM8_Operations(project, factors),
  };
  opex.total = opex.m4 + opex.m5 + opex.m6 + opex.m7 + opex.m8;

  // 4. 计算单位经济模型(UE)
  const unitEconomics = {
    price: project.scope.productInfo.targetPrice,
    totalCost: opex.total,  // 单件成本
    profit: project.scope.productInfo.targetPrice - opex.total,
    margin: (project.scope.productInfo.targetPrice - opex.total) /
            project.scope.productInfo.targetPrice,
  };

  // 5. 计算关键指标
  const kpis = {
    roi: (unitEconomics.profit * project.scope.assumptions.monthlySales * 12 - capex.total) /
         (capex.total) * 100,
    breakEvenPrice: opex.total,  // 简化:不考虑固定成本分摊
    breakEvenVolume: capex.total / unitEconomics.profit,
    paybackPeriod: capex.total / (unitEconomics.profit * project.scope.assumptions.monthlySales),
  };

  return {
    capex,
    opex,
    unitEconomics,
    kpis,
  };
}

// M4示例:商品与税费成本
function calculateM4_GoodsTax(project: Project, factors: IndustryFactor): number {
  const { cogs } = project.scope.productInfo;
  const { targetCountry } = project;

  // Tier1数据:官方税率
  const tariffRate = factors.m4_goodsTax.tariff;  // 如美国宠物食品29%
  const vatRate = factors.m4_goodsTax.vat;        // 如美国各州销售税5-10%

  const tariff = cogs * tariffRate;
  const vatBase = cogs + tariff;
  const vat = vatBase * vatRate;

  return cogs + tariff + vat;
}

// M5示例:物流与履约成本
function calculateM5_Logistics(project: Project, factors: IndustryFactor): number {
  const { salesChannel } = project;

  if (salesChannel === 'amazon_fba') {
    // 从行业因子库获取Amazon FBA费率(Tier1数据)
    const fbaFee = factors.m5_logistics.fba.fulfillmentFee;
    const storageFee = factors.m5_logistics.fba.storageFee;
    return fbaFee + storageFee;
  } else if (salesChannel === 'shopee') {
    // Shopee本地物流费率(Tier1数据)
    return factors.m5_logistics.shopee.shippingFee;
  } else if (salesChannel === 'dtc') {
    // DTC直邮物流(Tier2数据:3家物流商平均报价)
    return factors.m5_logistics.dtc.averageShippingCost;
  }

  return 0;
}
```

---

## 六、开发里程碑（4周Sprint - MVP 2.0）

> **MVP 2.0升级说明**（2025-11-08更新）：
> - 从2周POC升级为4周产品级MVP
> - 详细实施计划见：[MVP-2.0-第五到第七部分.md](./docs/MVP-2.0-第五到第七部分.md) Part 6

### Week 1: 数据基础设施（Day 1-5）

```
Day 1-2: Appwrite数据库搭建 + 19国数据导入 ⭐
├─ 创建4个Collections（cost_factors/projects/calculations/versions）
├─ 配置127个Attributes（M1-M8完整字段）
├─ Python脚本合并Excel/CSV数据
├─ 导入19国×2行业=38条成本因子记录
└─ 验证数据完整性（关键字段无null）

Day 3-4: GECOM计算引擎开发
├─ gecom-calculator.ts核心逻辑
├─ calculateM1-M8()函数实现
├─ 单元测试(确保计算准确性)
└─ 与白皮书案例对比验证

Day 5-6: Step 1-3前端开发
├─ 项目管理页面
├─ Step 1表单(参数输入)
├─ Step 2数据展示(数据源标注)
├─ Step 3结果页面(成本结构可视化)
└─ 响应式设计(移动端适配)

Day 7: 测试与调试
├─ 端到端测试(完整流程)
├─ 数据准确性验证(对比白皮书)
└─ Bug修复
```

### Week 2: 优化+部署+用户测试

```
Day 8-9: Step 4-5功能开发
├─ 场景模拟(3个预设场景)
├─ 场景对比表
├─ AI优化建议(基于规则引擎)
└─ PDF报告导出

Day 10: 基础AI助手
├─ 智能提示(基于输入参数)
├─ 异常检测(不合理值提醒)
└─ 对话框UI

Day 11: UI/UX优化
├─ 视觉设计优化
├─ 加载状态/错误处理
├─ 引导流程(Onboarding)
└─ 移动端优化

Day 12: 部署+文档
├─ Vercel部署(生产环境)
├─ 用户手册编写
├─ GECOM方法论介绍页面
└─ 案例库页面

Day 13-14: 用户测试+迭代
├─ 邀请20-30个种子用户测试
├─ 收集反馈(NPS调研)
├─ 快速迭代修复
└─ 准备v1.0正式发布
```

### 交付物清单

```
✅ 产品:
├─ GECOM成本助手Web应用(生产环境)
├─ 覆盖2行业×3国家×3渠道
└─ 完整GECOM五步测算流程

✅ 文档:
├─ 用户手册(如何使用)
├─ GECOM方法论介绍
├─ 案例库(宠物用品+电子烟)
└─ API文档(如需)

✅ 验证:
├─ 20-30个种子用户测试
├─ NPS≥50(满意度验证)
├─ 完成度≥60%(功能可用性验证)
└─ 与白皮书案例数据对比验证
```

---

## 总结

### MVP核心价值验证

```
通过2周MVP开发,我们将验证:
1. ✅ GECOM方法论可产品化
2. ✅ 用户愿意为专业成本测算工具付费
3. ✅ AI助手能提升用户体验和决策质量
4. ✅ 数据可信度分级能建立用户信任
```

### 后续迭代方向(v2.0+)

```
短期(3个月):
├─ 扩展至8-10个国家
├─ 扩展至5-6个行业
├─ 增强AI能力(GPT-4深度分析)
├─ 实时数据爬取(税率/费率自动更新)
└─ 敏感性分析交互式图表

中期(6-12个月):
├─ 用户协作(多人协同编辑)
├─ 移动端App
├─ API接口(ERP/财务软件集成)
├─ 咨询服务对接(专家1对1)
└─ 行业报告生成(基于平台数据)

长期(12-24个月):
├─ 国际化(英文版/东南亚语言)
├─ 生态系统(服务商/咨询伙伴入驻)
├─ AI Agent(自主成本优化建议)
└─ 成为跨境电商成本管理行业标准
```

---

**文档版本:** v1.0
**创建日期:** 2025年11月6日
**开发团队:** 准备开始2周Sprint
