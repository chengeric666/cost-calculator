# GECOM Assistant - POC

**Global E-Commerce Cost Optimization Methodology Assistant**

A professional cost calculation and analysis tool for cross-border e-commerce businesses, built on the GECOM methodology.

## 🎯 Overview

GECOM Assistant is an intelligent cost calculator that helps Chinese overseas e-commerce companies:
- **Calculate comprehensive costs** using the dual-phase eight-module GECOM framework
- **Optimize profitability** through AI-powered recommendations
- **Compare scenarios** across different markets, channels, and strategies
- **Make data-driven decisions** for global market entry

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

### Project Structure
```
gecom-assistant/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── CostCalculatorWizard.tsx    # Main wizard controller
│   ├── AssistantPanel.tsx          # AI assistant sidebar
│   └── wizard/                     # Wizard step components
│       ├── Step1Strategic.tsx      # Strategic alignment
│       ├── Step2DataCollection.tsx # Data input
│       ├── Step3CostModeling.tsx   # Cost results
│       ├── Step4ScenarioAnalysis.tsx # Scenario comparison
│       └── Step5Insights.tsx       # Insights & roadmap
├── lib/                     # Core business logic
│   ├── gecom/
│   │   ├── calculator.ts    # Cost calculation engine (M1-M8)
│   │   └── industry-factors.ts # Pre-configured factor library
│   └── utils/
│       └── cn.ts            # Utility functions
└── types/
    └── gecom.ts             # TypeScript type definitions
```

## 📊 GECOM Methodology

### Dual-Phase Eight-Module Model

**Phase 0-1: CAPEX (One-time Startup Costs)**
- **M1**: Market Entry - Registration, licensing, legal
- **M2**: Tech & Compliance - Certifications, trademarks, testing
- **M3**: Supply Chain Setup - Warehouse, inventory, systems

**Phase 1-N: OPEX (Per-Unit Operating Costs)**
- **M4**: Goods & Tax - COGS, import tariffs, VAT, excise tax
- **M5**: Logistics - International shipping, local delivery, FBA, warehousing
- **M6**: Marketing - CAC, platform commission, ads
- **M7**: Payment - Gateway fees, FX conversion, chargebacks
- **M8**: Operations - Customer service, staff, software

### Five-Step SOP Process
1. **Strategic Alignment** - Define goals and target configuration
2. **Data Collection** - Gather product and business information
3. **Cost Modeling** - Calculate complete cost breakdown
4. **Scenario Analysis** - Compare different strategies
5. **Insights & Roadmap** - Generate recommendations and action plan

## 🌍 Supported Configurations

### Industries
- Pet Products (益家之宠 case study)
- Vape / E-Cigarettes (VapePro case study)

### Markets
- 🇺🇸 United States
- 🇻🇳 Vietnam
- 🇵🇭 Philippines

### Sales Channels
- Amazon FBA
- Shopee
- Direct-to-Consumer (DTC)
- Online-to-Offline (O2O)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

### Environment Variables

No environment variables are required for the POC. For production deployment with AI integration:

```bash
# .env.local
ANTHROPIC_API_KEY=your_claude_api_key_here
```

## 📈 Key Features

### 1. Interactive Five-Step Wizard
Guides users through the complete GECOM process with a clean, intuitive interface.

### 2. Real-Time Cost Calculation
Calculates costs based on pre-configured industry factors from validated case studies:
- **Data Source**: Tier 2 (90% credibility)
- **Based on**: GECOM whitepaper v2.2 case studies
- **Industries**: Pet products (益家之宠), Vape (VapePro)

### 3. Visual Analytics
- Unit economics breakdown
- Cost distribution pie charts
- Scenario comparison tables
- KPI dashboards (ROI, payback period, LTV:CAC)

### 4. AI Assistant (Rule-Based POC)
Provides guidance on:
- GECOM methodology
- Cost optimization strategies
- CAC reduction tactics
- Channel and market selection

### 5. Actionable Insights
- AI-generated recommendations
- 90-day action roadmap
- Risk mitigation strategies
- Export capabilities (JSON, print)

## 🧮 Sample Calculation

**Example**: Pet Food - US Amazon FBA

**Input:**
- Product: Premium Dog Food, 2.5kg
- COGS: $10.00
- Target Price: $29.99
- Monthly Sales: 1,000 units

**Output:**
- **Gross Margin**: 28.5%
- **Unit Profit**: $8.54
- **ROI**: 145%
- **Payback Period**: 8.3 months
- **LTV:CAC Ratio**: 3.2:1

## 📦 Industry Factor Library

Pre-configured cost parameters for 6 validated combinations:
1. Pet - US - Amazon FBA
2. Pet - Vietnam - Shopee
3. Pet - Philippines - Shopee
4. Vape - US - DTC
5. Vape - US - O2O
6. (Custom combinations use default estimates)

## 🔮 Future Enhancements (v2.0)

### Technical
- [ ] Supabase integration for user authentication and data persistence
- [ ] Claude API integration for advanced AI recommendations
- [ ] Scenario comparison with side-by-side views
- [ ] Multi-SKU portfolio analysis
- [ ] Export to PDF/Excel

### Business
- [ ] Expand to 10+ industries (3C, fashion, home, etc.)
- [ ] Add 5+ markets (EU, Japan, Brazil, India, etc.)
- [ ] Dynamic data source updates
- [ ] Benchmark database from real customer data
- [ ] Consulting service integration

## 📝 Data Sources

### Tier 1 (100% Credibility)
- Government agencies (Census Bureau, FDA, etc.)
- Official trade statistics
- Tax authority databases

### Tier 2 (90% Credibility) ✅ **Current**
- GECOM whitepaper case studies
- Industry research reports
- Validated market data

### Tier 3 (80% Credibility)
- Experience-based estimates
- Conservative projections
- Industry benchmarks

## 🤝 Contributing

This is a POC implementation. For production use:
1. Replace rule-based AI with Claude API or GPT-4
2. Implement user authentication (Supabase, Auth0)
3. Add database for persisting projects
4. Expand industry factor library with more markets
5. Add comprehensive testing

## 📄 License

Based on GECOM Methodology v2.2

## 🙏 Acknowledgments

- GECOM whitepaper case studies: 益家之宠 (Pet), VapePro (Vape)
- Next.js team for the excellent framework
- Tailwind CSS for rapid UI development
- Recharts for beautiful data visualization

---

**Built with ❤️ for Chinese overseas e-commerce companies**

For questions or feedback, please open an issue on GitHub.
