'use client';

import { Project, CostResult } from '@/types/gecom';
import { DollarSign, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Step3CostModelingProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  costResult: CostResult | null;
}

export default function Step3CostModeling({ project, costResult }: Step3CostModelingProps) {
  if (!costResult) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">正在计算成本模型...</p>
      </div>
    );
  }

  // Prepare data for OPEX breakdown chart
  // MVP 2.0 uses simplified structure: use compat fields if available, otherwise calculate
  const m4Total = costResult.opex.m4_goodsTax?.total ??
    (costResult.opex.m4_cogs + costResult.opex.m4_tariff + costResult.opex.m4_logistics + costResult.opex.m4_vat);
  const m5Total = costResult.opex.m5_logistics?.total ??
    (costResult.opex.m5_last_mile + costResult.opex.m5_return);
  const m6Total = typeof costResult.opex.m6_marketing === 'number'
    ? costResult.opex.m6_marketing
    : (costResult.opex.m6_marketing as any)?.total ?? 0;
  const m7Total = typeof costResult.opex.m7_payment === 'number'
    ? costResult.opex.m7_payment + (costResult.opex.m7_platform_commission ?? 0)
    : (costResult.opex.m7_payment as any)?.total ?? 0;
  const m8Total = costResult.opex.m8_operations?.total ?? costResult.opex.m8_ga;

  const opexData = [
    { name: 'M4: 货物税费', value: m4Total, color: '#3b82f6' },
    { name: 'M5: 物流配送', value: m5Total, color: '#10b981' },
    { name: 'M6: 营销获客', value: m6Total, color: '#f59e0b' },
    { name: 'M7: 支付手续费', value: m7Total, color: '#8b5cf6' },
    { name: 'M8: 运营管理', value: m8Total, color: '#ec4899' },
  ];

  // Unit economics comparison - MVP 2.0 uses unit_economics
  const unitEcon = costResult.unit_economics || costResult.unitEconomics;
  const unitEconomicsData = [
    { name: '营收', amount: unitEcon?.revenue ?? 0 },
    { name: '总成本', amount: unitEcon?.cost ?? (unitEcon as any)?.totalCost ?? 0 },
    { name: '毛利', amount: unitEcon?.gross_profit ?? (unitEcon as any)?.grossProfit ?? 0 },
  ];

  // Helper to get unit economics fields with fallback
  const getGrossMargin = () => unitEcon?.gross_margin ?? (unitEcon as any)?.grossMargin ?? 0;
  const getGrossProfit = () => unitEcon?.gross_profit ?? (unitEcon as any)?.grossProfit ?? 0;
  const getRoi = () => costResult.kpis.roi ?? 0;
  const getPaybackPeriod = () => costResult.kpis.payback_period_months ?? costResult.kpis.paybackPeriod ?? 0;
  const getLtv = () => costResult.kpis.ltv ?? 0;
  const getLtvCacRatio = () => costResult.kpis.ltvCacRatio ?? 0;
  const getBreakEvenPrice = () => costResult.kpis.breakeven_price ?? costResult.kpis.breakEvenPrice ?? 0;
  const getBreakEvenVolume = () => costResult.kpis.breakeven_volume ?? costResult.kpis.breakEvenVolume ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">成本建模结果</h2>
        <p className="text-gray-600">
          基于GECOM双阶段八模块模型的完整成本拆解
        </p>
      </div>

      {/* Warnings */}
      {costResult.warnings && costResult.warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-2">警告</h4>
              <ul className="space-y-1">
                {costResult.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-red-800">{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Compact Left-Right Layout (60/40 split) */}
      <div className="grid grid-cols-5 gap-4">
        {/* Left Column (60%): Cost Details */}
        <div className="col-span-3 space-y-4">
          {/* CAPEX Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              阶段0-1: CAPEX（一次性启动成本）
            </h3>

            {/* M1: Market Entry */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-blue-700 mb-1">M1: 市场准入</div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">公司注册费 <span className="text-gray-400">Company Registration</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m1_marketEntry.companyRegistration.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">商业许可证费 <span className="text-gray-400">Business License</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m1_marketEntry.businessLicense.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">税务登记费 <span className="text-gray-400">Tax Registration</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m1_marketEntry.taxRegistration.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">法务咨询费 <span className="text-gray-400">Legal Consulting</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m1_marketEntry.legalConsulting.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs bg-blue-50 px-2 -mx-2 rounded">
                  <span className="font-bold text-gray-900">M1 小计</span>
                  <span className="font-bold text-blue-900">${costResult.capex.m1_marketEntry.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* M2: Tech Compliance */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-blue-700 mb-1">M2: 技术合规</div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">产品认证费 <span className="text-gray-400">Product Certification</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m2_techCompliance.productCertification.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">商标注册费 <span className="text-gray-400">Trademark Registration</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m2_techCompliance.trademarkRegistration.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">合规检测费 <span className="text-gray-400">Compliance Testing</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m2_techCompliance.complianceTesting.toFixed(2)}</span>
                </div>
                {costResult.capex.m2_techCompliance.patentFiling && costResult.capex.m2_techCompliance.patentFiling > 0 && (
                  <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                    <span className="text-gray-700">专利申请费 <span className="text-gray-400">Patent Filing</span></span>
                    <span className="font-semibold text-gray-900">${costResult.capex.m2_techCompliance.patentFiling.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 text-xs bg-blue-50 px-2 -mx-2 rounded">
                  <span className="font-bold text-gray-900">M2 小计</span>
                  <span className="font-bold text-blue-900">${costResult.capex.m2_techCompliance.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* M3: Supply Chain Setup */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-blue-700 mb-1">M3: 供应链搭建</div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">仓储押金 <span className="text-gray-400">Warehouse Deposit</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m3_supplyChain.warehouseDeposit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">设备采购费 <span className="text-gray-400">Equipment Purchase</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m3_supplyChain.equipmentPurchase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">初始库存成本 <span className="text-gray-400">Initial Inventory</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m3_supplyChain.initialInventory.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">系统搭建费 <span className="text-gray-400">System Setup</span></span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m3_supplyChain.systemSetup.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs bg-blue-50 px-2 -mx-2 rounded">
                  <span className="font-bold text-gray-900">M3 小计</span>
                  <span className="font-bold text-blue-900">${costResult.capex.m3_supplyChain.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between py-2 text-sm bg-gradient-to-r from-blue-100 to-blue-50 px-3 -mx-2 rounded font-bold border-t-2 border-blue-200 mt-3">
              <span className="text-gray-900">CAPEX总计</span>
              <span className="text-blue-900 text-base">${costResult.capex.total.toFixed(2)}</span>
            </div>
          </div>

          {/* OPEX Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              阶段1-N: OPEX（单位运营成本）
            </h3>

            {/* M4: Goods & Tax */}
            <div className="mb-2">
              <div className="text-xs font-semibold text-green-700 mb-1">M4: 货物税费</div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-gray-600">COGS + 关税 + 物流 + 增值税</span>
                  <span className="font-bold text-gray-900">${m4Total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* M5: Logistics */}
            <div className="mb-2">
              <div className="text-xs font-semibold text-green-700 mb-1">M5: 物流配送</div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-gray-600">国际运输 + 本地配送 + FBA</span>
                  <span className="font-bold text-gray-900">${m5Total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* M6: Marketing */}
            <div className="mb-2">
              <div className="text-xs font-semibold text-green-700 mb-1">M6: 营销获客</div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-gray-600">CAC + 平台佣金</span>
                  <span className="font-bold text-gray-900">${m6Total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* M7: Payment */}
            <div className="mb-2">
              <div className="text-xs font-semibold text-green-700 mb-1">M7: 支付手续费</div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-gray-600">网关费用 + 汇率损失</span>
                  <span className="font-bold text-gray-900">${m7Total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* M8: Operations */}
            <div className="mb-2">
              <div className="text-xs font-semibold text-green-700 mb-1">M8: 运营管理</div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-gray-600">客服 + 人员 + 软件</span>
                  <span className="font-bold text-gray-900">${m8Total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between py-2 text-sm bg-gradient-to-r from-green-100 to-green-50 px-3 -mx-2 rounded font-bold border-t-2 border-green-200 mt-3">
              <span className="text-gray-900">单位OPEX总计</span>
              <span className="text-green-900 text-base">${costResult.opex.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column (40%): KPI Results */}
        <div className="col-span-2 space-y-4">
          {/* Key Metrics Cards */}
          <div className="space-y-3">
            <MetricCard
              title="毛利率"
              value={`${getGrossMargin().toFixed(1)}%`}
              subtitle={`单位毛利 $${getGrossProfit().toFixed(2)}`}
              trend={getGrossMargin() >= 30 ? 'up' : 'down'}
              color={getGrossMargin() >= 30 ? 'green' : 'red'}
            />
            <MetricCard
              title="投资回报率"
              value={`${getRoi().toFixed(0)}%`}
              subtitle="年化回报"
              trend={getRoi() >= 100 ? 'up' : 'down'}
              color={getRoi() >= 100 ? 'green' : 'yellow'}
            />
            <MetricCard
              title="回本周期"
              value={`${getPaybackPeriod().toFixed(1)}`}
              subtitle="个月"
              trend={getPaybackPeriod() <= 12 ? 'up' : 'down'}
              color={getPaybackPeriod() <= 12 ? 'green' : 'yellow'}
            />
            <MetricCard
              title="LTV:CAC比率"
              value={`${getLtvCacRatio().toFixed(1)}:1`}
              subtitle={`LTV $${getLtv().toFixed(0)}`}
              trend={getLtvCacRatio() >= 3 ? 'up' : 'down'}
              color={getLtvCacRatio() >= 3 ? 'green' : 'red'}
            />
          </div>

          {/* Unit Economics */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              单位经济模型
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                <span className="text-gray-600">营收</span>
                <span className="font-bold text-gray-900">${(unitEcon?.revenue ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                <span className="text-gray-600">总成本</span>
                <span className="font-bold text-gray-900">${(unitEcon?.cost ?? (unitEcon as any)?.totalCost ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                <span className="text-gray-600">毛利</span>
                <span className="font-bold text-green-700">${getGrossProfit().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Breakeven Analysis */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              盈亏平衡分析
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">盈亏平衡价格</div>
                <div className="text-lg font-bold text-gray-900">${getBreakEvenPrice().toFixed(2)}</div>
                <div className="text-xs text-gray-500">覆盖所有成本的最低价格</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">盈亏平衡销量</div>
                <div className="text-lg font-bold text-gray-900">{getBreakEvenVolume().toFixed(0)}</div>
                <div className="text-xs text-gray-500">回收CAPEX所需单位数</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">预计回本</div>
                <div className={`text-lg font-bold ${getPaybackPeriod() <= 12 ? 'text-green-600' : getPaybackPeriod() <= 24 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {getPaybackPeriod() === Infinity || getPaybackPeriod() > 1000
                    ? '∞'
                    : `${getPaybackPeriod().toFixed(1)}月`}
                </div>
                <div className="text-xs text-gray-500">
                  {getPaybackPeriod() <= 12 ? '✅ 快速回本' : getPaybackPeriod() <= 24 ? '⚠️ 中等周期' : '❌ 周期过长'}
                </div>
              </div>
            </div>
          </div>

          {/* OPEX Pie Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              成本分布
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={opexData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={(entry: any) => `$${entry.value.toFixed(0)}`}
                >
                  {opexData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down';
  color: 'green' | 'yellow' | 'red';
}) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
  };

  const textColorClasses = {
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    red: 'text-red-700',
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        {trend === 'up' ? (
          <TrendingUp className={`h-4 w-4 ${textColorClasses[color]}`} />
        ) : (
          <TrendingDown className={`h-4 w-4 ${textColorClasses[color]}`} />
        )}
      </div>
      <div className={`text-2xl font-bold ${textColorClasses[color]}`}>{value}</div>
      <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
    </div>
  );
}

function CostRow({
  label,
  amount,
  details,
  bold,
}: {
  label: string;
  amount: number;
  details: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className={`${bold ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{label}</div>
        <div className="text-xs text-gray-500">{details}</div>
      </div>
      <div className={`text-right ${bold ? 'text-xl font-bold text-gray-900' : 'text-lg font-semibold text-gray-700'}`}>
        ${amount.toFixed(2)}
      </div>
    </div>
  );
}
