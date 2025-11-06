# GECOM Assistant 中文化指南

## 📋 需要中文化的文件清单

### ✅ 已完成
- [x] `README.zh-CN.md` - 中文版README（已创建）

### 🔄 待中文化的UI组件

#### 1. 首页 `app/page.tsx`
**需要翻译的内容：**
- Hero标题和副标题
- 功能特性卡片（3个）
- GECOM 5步流程说明
- 页脚信息

**关键文本：**
```
- "Professional Cost Analysis for Global E-Commerce"
- "Start Cost Calculation"
- "Dual-Phase Analysis"
- "Multi-Market Support"
- "Industry Factors"
- "GECOM 5-Step Process"
```

#### 2. 向导主控制器 `components/CostCalculatorWizard.tsx`
**需要翻译的内容：**
- 步骤标题（5个步骤）
- 导航按钮（Previous/Next/Complete）
- 进度指示器

**关键文本：**
```
- "Strategic Alignment"
- "Data Collection"
- "Cost Modeling"
- "Scenario Analysis"
- "Insights & Roadmap"
- "Previous" / "Next" / "Complete"
```

#### 3. 步骤1 - 战略对齐 `components/wizard/Step1Strategic.tsx`
**需要翻译的内容：**
- 页面标题和描述
- 字段标签（Project Name, Industry, Target Market, Sales Channel）
- 选项卡片文本

**关键文本：**
```
- "Define your business goals and target market configuration"
- "Pet Products" / "Vape / E-Cigarettes"
- "United States" / "Vietnam" / "Philippines"
- "Amazon FBA" / "Shopee" / "Direct-to-Consumer" / "Online-to-Offline"
```

#### 4. 步骤2 - 数据采集 `components/wizard/Step2DataCollection.tsx`
**需要翻译的内容：**
- 表单标签和占位符
- 帮助提示文本
- 计算结果显示

**关键文本：**
```
- "Product Information"
- "Product Name" / "Weight (kg)" / "Manufacturing Cost (COGS)"
- "Target Selling Price" / "Expected Monthly Sales"
- "Return Rate" / "Initial Margin"
- "Data Source Tier"
```

#### 5. 步骤3 - 成本建模 `components/wizard/Step3CostModeling.tsx`
**需要翻译的内容：**
- 成本模块标题（M1-M8）
- KPI指标卡片
- 警告和提示信息
- 图表标签

**关键文本：**
```
- "Phase 0-1: CAPEX (One-time Startup Costs)"
- "Phase 1-N: OPEX (Per-Unit Operating Costs)"
- "M1: Market Entry" / "M2: Tech & Compliance" / "M3: Supply Chain Setup"
- "M4: Goods & Tax" / "M5: Logistics" / "M6: Marketing"
- "M7: Payment" / "M8: Operations"
- "Gross Margin" / "ROI" / "Payback Period" / "LTV:CAC"
- "Break-even Price" / "Break-even Volume"
- "⚠️ WARNING: Negative gross margin"
```

#### 6. 步骤4 - 场景分析 `components/wizard/Step4ScenarioAnalysis.tsx`
**需要翻译的内容：**
- 场景对比表格
- 关键洞察卡片
- 建议步骤

**关键文本：**
```
- "Compare different market and channel strategies"
- "Current Configuration"
- "Market Opportunity" / "Channel Strategy" / "Risk Consideration"
- "Recommended Next Steps"
```

#### 7. 步骤5 - 洞察与路线图 `components/wizard/Step5Insights.tsx`
**需要翻译的内容：**
- 执行摘要
- AI推荐方案
- 90天行动路线图
- 风险缓解策略

**关键文本：**
```
- "Executive Summary"
- "Business Model" (Healthy/Workable/High Risk)
- "AI-Powered Recommendations"
- "90-Day Action Roadmap"
- "Month 1: Market Validation"
- "Month 2: Market Testing & Optimization"
- "Month 3: Scale & Expansion"
- "Risk Mitigation Strategies"
- "Export & Share"
```

#### 8. AI助手 `components/AssistantPanel.tsx`
**需要翻译的内容：**
- 欢迎消息
- 快速问题选项
- 资源链接
- 回复模板

**关键文本：**
```
- "Hi! I'm your GECOM Assistant..."
- "What is GECOM methodology?"
- "How do I reduce my CAC?"
- "Explain M1-M8 modules"
- "Helpful Resources"
- "GECOM Methodology" / "Industry Factors" / "FAQ"
```

## 🎨 中文化实施方案

### 方案一：i18n库（推荐用于生产）
使用 `next-intl` 或 `react-i18next` 实现多语言切换

**优点：**
- 支持动态语言切换
- 易于维护和扩展
- 标准化的国际化方案

**实施步骤：**
```bash
# 安装依赖
npm install next-intl

# 创建语言文件
/locales/
  ├── en.json
  └── zh-CN.json
```

### 方案二：直接硬编码中文（POC快速方案）
直接将英文文本替换为中文

**优点：**
- 实施快速，适合POC
- 无额外依赖

**缺点：**
- 不支持语言切换
- 后期维护成本高

## 📝 关键术语对照表

| 英文 | 中文 | 说明 |
|------|------|------|
| CAPEX | 资本支出/一次性投入 | 创业启动成本 |
| OPEX | 运营支出/单位成本 | 每单位运营成本 |
| Gross Margin | 毛利率 | 利润占收入的百分比 |
| ROI | 投资回报率 | Return on Investment |
| Payback Period | 回本周期 | 收回投资所需时间 |
| CAC | 获客成本 | Customer Acquisition Cost |
| LTV | 客户终身价值 | Lifetime Value |
| COGS | 制造成本 | Cost of Goods Sold |
| SKU | 库存单位 | Stock Keeping Unit |
| FBA | 亚马逊物流 | Fulfillment by Amazon |
| DTC | 直营电商 | Direct-to-Consumer |
| O2O | 线上到线下 | Online-to-Offline |

## 🚀 快速中文化步骤（POC版本）

### 1. 核心UI中文化（1-2小时）
仅翻译最关键的用户可见文本：
- 首页hero section
- 5个步骤的标题和主要说明
- 表单字段标签
- 按钮文本

### 2. 完整UI中文化（4-6小时）
翻译所有用户可见文本，包括：
- 所有提示信息
- 帮助文本
- AI助手回复
- 错误提示

### 3. 添加语言切换（2-3小时）
实现中英文动态切换功能

## 💡 实施建议

**对于当前POC阶段：**
1. 优先中文化首页和向导主流程
2. 保留AI助手的英文（或提供简化的中文回复）
3. 图表和数据可视化保持英文（避免布局问题）

**对于v2.0生产版本：**
1. 采用i18n方案，支持中英文切换
2. 完整翻译所有文本，包括AI回复
3. 考虑增加繁体中文支持（台湾、香港市场）

## 🔧 技术实施参考

### 使用next-intl的示例代码：

```typescript
// app/[locale]/layout.tsx
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';

export default async function LocaleLayout({
  children,
  params: {locale}
}) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// 使用翻译
import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return <h1>{t('title')}</h1>;
}
```

### 语言文件结构示例：

```json
// locales/zh-CN.json
{
  "HomePage": {
    "title": "专业的全球电商成本分析",
    "subtitle": "科学的、可信赖的海外销售成本测算模型",
    "startButton": "开始成本计算"
  },
  "Wizard": {
    "steps": {
      "strategic": "战略对齐",
      "dataCollection": "数据采集",
      "costModeling": "成本建模",
      "scenarioAnalysis": "场景分析",
      "insights": "洞察与路线图"
    }
  }
}
```

## 📊 预计工作量

| 任务 | 预计时间 | 优先级 |
|------|---------|--------|
| README中文化 | ✅ 已完成 | 高 |
| 首页中文化 | 0.5小时 | 高 |
| 向导流程中文化 | 2-3小时 | 高 |
| AI助手中文化 | 1-2小时 | 中 |
| 实现i18n切换 | 2-3小时 | 低（v2.0） |
| **总计（POC版）** | **3.5-5.5小时** | - |

## ✅ 验收标准

POC版本中文化完成标准：
- [ ] 首页所有文案为中文
- [ ] 5个步骤的标题和说明为中文
- [ ] 表单字段标签为中文
- [ ] 按钮和导航文本为中文
- [ ] 关键提示信息为中文
- [ ] 专业术语使用准确（参考术语对照表）
- [ ] 文案符合中国出海企业的语言习惯
