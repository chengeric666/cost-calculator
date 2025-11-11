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

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4">
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

      {/* CAPEX breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">阶段0-1: CAPEX（一次性启动成本）</h3>
        <div className="space-y-3">
          <CostRow
            label="M1: 市场准入"
            amount={costResult.capex.m1_marketEntry.total}
            details={`公司注册、许可证、法务: $${costResult.capex.m1_marketEntry.companyRegistration + costResult.capex.m1_marketEntry.businessLicense + costResult.capex.m1_marketEntry.legalConsulting + costResult.capex.m1_marketEntry.taxRegistration}`}
          />
          <CostRow
            label="M2: 技术合规"
            amount={costResult.capex.m2_techCompliance.total}
            details={`产品认证、商标注册、检测: $${costResult.capex.m2_techCompliance.productCertification + costResult.capex.m2_techCompliance.trademarkRegistration + costResult.capex.m2_techCompliance.complianceTesting}`}
          />
          <CostRow
            label="M3: 供应链搭建"
            amount={costResult.capex.m3_supplyChain.total}
            details={`仓储、库存、系统: $${costResult.capex.m3_supplyChain.warehouseDeposit + costResult.capex.m3_supplyChain.equipmentPurchase + costResult.capex.m3_supplyChain.initialInventory + costResult.capex.m3_supplyChain.systemSetup}`}
          />
          <div className="pt-3 border-t border-gray-200">
            <CostRow
              label="CAPEX总计"
              amount={costResult.capex.total}
              details="所需一次性投资"
              bold
            />
          </div>
        </div>

        {/* CAPEX回本详情 */}
        <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            💡 CAPEX回本预测
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600 mb-1">初始投资</div>
              <div className="text-xl font-bold text-blue-900">
                ${costResult.capex.total.toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">每月毛利</div>
              <div className="text-xl font-bold text-green-600">
                ${(getGrossProfit() * (project?.scope?.assumptions?.monthlySales ?? 0)).toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">
                ${getGrossProfit().toFixed(2)} × {project?.scope?.assumptions?.monthlySales ?? 0}单位
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">预计回本</div>
              <div className={`text-xl font-bold ${getPaybackPeriod() <= 12 ? 'text-green-600' : getPaybackPeriod() <= 24 ? 'text-yellow-600' : 'text-red-600'}`}>
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
      </div>

      {/* OPEX breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">阶段1-N: OPEX（单位运营成本）</h3>
        <div className="space-y-3 mb-6">
          <CostRow
            label="M4: 货物税费"
            amount={m4Total}
            details={costResult.opex.m4_goodsTax
              ? `COGS $${costResult.opex.m4_goodsTax.cogs}, 关税 $${costResult.opex.m4_goodsTax.importTariff.toFixed(2)}, 增值税 $${costResult.opex.m4_goodsTax.vat.toFixed(2)}`
              : `COGS + 关税 + 物流 + 增值税`}
          />
          <CostRow
            label="M5: 物流配送"
            amount={m5Total}
            details={costResult.opex.m5_logistics
              ? `国际运输 $${costResult.opex.m5_logistics.intlShipping.toFixed(2)}, 本地配送 $${costResult.opex.m5_logistics.localDelivery.toFixed(2)}, FBA $${(costResult.opex.m5_logistics.fbaFee || 0).toFixed(2)}`
              : `尾程配送 + 退货物流`}
          />
          <CostRow
            label="M6: 营销获客"
            amount={m6Total}
            details={typeof costResult.opex.m6_marketing === 'object' && costResult.opex.m6_marketing !== null
              ? `CAC $${(costResult.opex.m6_marketing as any).cac.toFixed(2)}, 平台佣金 $${(costResult.opex.m6_marketing as any).platformCommission.toFixed(2)}`
              : `营销获客成本`}
          />
          <CostRow
            label="M7: 支付手续费"
            amount={m7Total}
            details={typeof costResult.opex.m7_payment === 'object' && costResult.opex.m7_payment !== null
              ? `网关费用 $${(costResult.opex.m7_payment as any).paymentGatewayFee.toFixed(2)}, 汇率损失 $${(costResult.opex.m7_payment as any).currencyConversion.toFixed(2)}`
              : `支付手续费 + 平台佣金`}
          />
          <CostRow
            label="M8: 运营管理"
            amount={m8Total}
            details={costResult.opex.m8_operations
              ? `客服 $${costResult.opex.m8_operations.customerService.toFixed(2)}, 人员 $${costResult.opex.m8_operations.staff.toFixed(2)}, 软件 $${costResult.opex.m8_operations.software.toFixed(2)}`
              : `运营管理成本`}
          />
          <div className="pt-3 border-t border-gray-200">
            <CostRow
              label="单位OPEX总计"
              amount={costResult.opex.total}
              details="每单位销售成本"
              bold
            />
          </div>
        </div>

        {/* OPEX breakdown chart */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">成本分布</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={opexData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry: any) => `${entry.name}: $${entry.value.toFixed(2)}`}
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

      {/* Unit economics */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">单位经济模型</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={unitEconomicsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="amount" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">盈亏平衡价格</div>
            <div className="text-2xl font-bold text-gray-900">${getBreakEvenPrice().toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">覆盖所有成本的最低价格</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">盈亏平衡销量</div>
            <div className="text-2xl font-bold text-gray-900">{getBreakEvenVolume().toFixed(0)}</div>
            <div className="text-xs text-gray-500 mt-1">回收CAPEX所需单位数</div>
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
