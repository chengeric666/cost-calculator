'use client';

import { useState } from 'react';
import { Project, CostResult } from '@/types/gecom';
import { DollarSign, TrendingDown, TrendingUp, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Step3CostModelingProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  costResult: CostResult | null;
}

export default function Step3CostModeling({ project, costResult }: Step3CostModelingProps) {
  // State for expandable CAPEX modules
  const [m1Expanded, setM1Expanded] = useState(false);
  const [m2Expanded, setM2Expanded] = useState(false);
  const [m3Expanded, setM3Expanded] = useState(false);

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
          {/* M1: Market Entry - Expandable详细表格 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* M1 Header */}
            <button
              onClick={() => setM1Expanded(!m1Expanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">M1: 市场准入 (Market Entry)</div>
                <div className="text-sm text-gray-500 mt-1">
                  公司注册、许可证、法务咨询等一次性成本
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    ${costResult.capex.m1_marketEntry.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {m1Expanded ? '点击收起' : '点击展开详情'}
                  </div>
                </div>
                {m1Expanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* M1 Detailed Cost Table */}
            {m1Expanded && (
              <div className="border-t border-gray-200 bg-gray-50">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        成本项目
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        金额 (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">公司注册费</div>
                        <div className="text-xs text-gray-500">Company Registration</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m1_marketEntry.companyRegistration.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">商业许可证费</div>
                        <div className="text-xs text-gray-500">Business License</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m1_marketEntry.businessLicense.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">税务登记费</div>
                        <div className="text-xs text-gray-500">Tax Registration</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m1_marketEntry.taxRegistration.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">法务咨询费</div>
                        <div className="text-xs text-gray-500">Legal Consulting</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m1_marketEntry.legalConsulting.toFixed(2)}
                      </td>
                    </tr>
                    {/* M1 Total Row */}
                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        M1 小计
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-blue-900">
                        ${costResult.capex.m1_marketEntry.total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* M2: Tech Compliance - Expandable详细表格 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* M2 Header */}
            <button
              onClick={() => setM2Expanded(!m2Expanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">M2: 技术合规 (Technical Compliance)</div>
                <div className="text-sm text-gray-500 mt-1">
                  产品认证、商标注册、合规检测等技术性投入
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    ${costResult.capex.m2_techCompliance.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {m2Expanded ? '点击收起' : '点击展开详情'}
                  </div>
                </div>
                {m2Expanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* M2 Detailed Cost Table */}
            {m2Expanded && (
              <div className="border-t border-gray-200 bg-gray-50">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        成本项目
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        金额 (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">产品认证费</div>
                        <div className="text-xs text-gray-500">Product Certification (FDA, CE, FCC, etc.)</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m2_techCompliance.productCertification.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">商标注册费</div>
                        <div className="text-xs text-gray-500">Trademark Registration</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m2_techCompliance.trademarkRegistration.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">合规检测费</div>
                        <div className="text-xs text-gray-500">Compliance Testing</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m2_techCompliance.complianceTesting.toFixed(2)}
                      </td>
                    </tr>
                    {costResult.capex.m2_techCompliance.patentFiling && costResult.capex.m2_techCompliance.patentFiling > 0 && (
                      <tr className="hover:bg-gray-100 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="font-medium">专利申请费（可选）</div>
                          <div className="text-xs text-gray-500">Patent Filing (Optional)</div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                          ${costResult.capex.m2_techCompliance.patentFiling.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {/* M2 Total Row */}
                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        M2 小计
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-blue-900">
                        ${costResult.capex.m2_techCompliance.total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* M3: Supply Chain Setup - Expandable详细表格 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* M3 Header */}
            <button
              onClick={() => setM3Expanded(!m3Expanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">M3: 供应链搭建 (Supply Chain Setup)</div>
                <div className="text-sm text-gray-500 mt-1">
                  仓储押金、设备采购、初始库存、系统搭建等供应链投入
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    ${costResult.capex.m3_supplyChain.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {m3Expanded ? '点击收起' : '点击展开详情'}
                  </div>
                </div>
                {m3Expanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* M3 Detailed Cost Table */}
            {m3Expanded && (
              <div className="border-t border-gray-200 bg-gray-50">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        成本项目
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        金额 (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">仓储押金</div>
                        <div className="text-xs text-gray-500">Warehouse Deposit (3-month security deposit)</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m3_supplyChain.warehouseDeposit.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">设备采购费</div>
                        <div className="text-xs text-gray-500">Equipment Purchase (shelving, forklifts, etc.)</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m3_supplyChain.equipmentPurchase.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">初始库存成本</div>
                        <div className="text-xs text-gray-500">Initial Inventory (2-month buffer stock)</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m3_supplyChain.initialInventory.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">系统搭建费</div>
                        <div className="text-xs text-gray-500">System Setup (ERP, WMS, inventory management)</div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ${costResult.capex.m3_supplyChain.systemSetup.toFixed(2)}
                      </td>
                    </tr>
                    {/* M3 Total Row */}
                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        M3 小计
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-blue-900">
                        ${costResult.capex.m3_supplyChain.total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
