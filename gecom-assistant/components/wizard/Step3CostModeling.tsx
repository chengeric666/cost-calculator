'use client';

import { Project, CostResult } from '@/types/gecom';
import { AlertCircle, TrendingUp, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

  // Get unit economics with fallback
  const unitEcon = costResult.unit_economics || costResult.unitEconomics;
  const revenue = unitEcon?.revenue ?? 0;
  const totalCost = unitEcon?.cost ?? (unitEcon as any)?.totalCost ?? 0;
  const grossProfit = unitEcon?.gross_profit ?? (unitEcon as any)?.grossProfit ?? 0;
  const grossMargin = unitEcon?.gross_margin ?? (unitEcon as any)?.grossMargin ?? 0;

  // Calculate CAPEX per unit (分摊到每单)
  const monthlyVolume = (project as any).monthlyVolume || 1000;
  const capexPerUnit = costResult.capex.total / monthlyVolume;

  // Prepare OPEX data for chart and analysis
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

  // Calculate Top 3 cost drivers
  const costDrivers = [
    { name: 'M4: 货物税费', value: m4Total, module: 'M4' },
    { name: 'M5: 物流配送', value: m5Total, module: 'M5' },
    { name: 'M6: 营销获客', value: m6Total, module: 'M6' },
    { name: 'M7: 支付手续费', value: m7Total, module: 'M7' },
    { name: 'M8: 运营管理', value: m8Total, module: 'M8' },
  ].sort((a, b) => b.value - a.value).slice(0, 3);

  // Prepare pie chart data
  const opexData = [
    { name: 'M4: 货物税费', value: m4Total, color: '#f59e0b' },
    { name: 'M5: 物流配送', value: m5Total, color: '#eab308' },
    { name: 'M6: 营销获客', value: m6Total, color: '#22c55e' },
    { name: 'M7: 支付手续费', value: m7Total, color: '#3b82f6' },
    { name: 'M8: 运营管理', value: m8Total, color: '#6b7280' },
  ];

  // Calculate breakeven scenarios
  const breakEvenPrice = costResult.kpis.breakeven_price ?? costResult.kpis.breakEvenPrice ?? 0;
  const currentPrice = revenue;
  const priceGap = breakEvenPrice - currentPrice;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">成本建模结果</h2>
        <p className="text-sm text-gray-600">
          基于GECOM双阶段八模块模型的完整成本拆解 · 目标市场: {(project as any).targetCountry || '美国'} · 销售渠道: {(project as any).salesChannel || 'Amazon FBA'}
        </p>
      </div>

      {/* Chinese Insights Alert */}
      {grossMargin < 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-2">💡 成本结构优化建议</h4>
              <p className="text-sm text-red-800">
                当前毛利率为负（{grossMargin.toFixed(1)}%），每销售一单亏损${Math.abs(grossProfit).toFixed(2)}。
                建议重点关注下方成本拆解表中的<span className="font-semibold">最大成本项</span>，进行针对性优化。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: 65% Left + 35% Right */}
      <div className="grid grid-cols-3 gap-6">
        {/* LEFT COLUMN (65%): Simple Table Layout */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900">
                单位经济模型 (Unit Economics)
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                从营收到毛利的完整计算链路 · 月销量: {monthlyVolume}单
              </p>
            </div>

            {/* Simple Table - NO Folding */}
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">成本项目</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">金额</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">占售价</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">备注说明</th>
                </tr>
              </thead>
              <tbody>
                {/* ========== 1. 营收起点 ========== */}
                <tr className="bg-green-50 border-b border-green-200">
                  <td className="px-6 py-3 font-semibold text-gray-900">营收 (AOV)</td>
                  <td className="px-4 py-3 text-right font-bold text-green-700 text-base">${revenue.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">100%</td>
                  <td className="px-6 py-3 text-gray-600 text-xs">平均订单价值</td>
                </tr>

                {/* ========== 2. CAPEX Section Header ========== */}
                <tr className="bg-blue-100 border-b border-blue-200">
                  <td colSpan={4} className="px-6 py-2.5 font-bold text-blue-900 text-xs uppercase tracking-wide">
                    阶段0-1: CAPEX (一次性启动成本分摊 - 总计 ${costResult.capex.total.toFixed(2)} ÷ {monthlyVolume}单)
                  </td>
                </tr>

                {/* ========== M1: 市场准入 ========== */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2.5">
                    <div className="font-medium text-gray-900">(-) M1: 市场准入</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      监管: {costResult.capex.m1_regulatory_agency} · 复杂度: {costResult.capex.m1_complexity}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                    ${(costResult.capex.m1 / monthlyVolume).toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-600">
                    {((costResult.capex.m1 / monthlyVolume / revenue) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-2.5 text-xs text-gray-600">
                    总计${costResult.capex.m1.toFixed(2)} ÷ {monthlyVolume}单
                  </td>
                </tr>

                {/* M1 详细项 - Always visible */}
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">├─ 公司注册费</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m1_company_registration.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    <TierBadge tier="tier1" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">├─ 商业许可证费</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m1_business_license.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    <TierBadge tier="tier1" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">├─ 税务登记费</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m1_tax_registration.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    <TierBadge tier="tier1" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">└─ 法务咨询费</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m1_legal_consulting.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    <TierBadge tier="tier1" />
                  </td>
                </tr>
                {costResult.capex.m1_industry_license > 0 && (
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-8 py-2 text-gray-700 text-xs">└─ 行业许可证</td>
                    <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m1_industry_license.toFixed(2)}</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-6 py-2 text-xs text-gray-500">
                      续期: {costResult.capex.m1_renewal_required ? costResult.capex.m1_renewal_frequency : '无需'}
                    </td>
                  </tr>
                )}

                {/* ========== M2: 技术合规 ========== */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2.5">
                    <div className="font-medium text-gray-900">(-) M2: 技术合规</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      有效期: {costResult.capex.m2_certification_validity_years}年 · 检验: {costResult.capex.m2_inspection_frequency}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                    ${(costResult.capex.m2 / monthlyVolume).toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-600">
                    {((costResult.capex.m2 / monthlyVolume / revenue) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-2.5 text-xs text-gray-600">
                    总计${costResult.capex.m2.toFixed(2)} ÷ {monthlyVolume}单
                  </td>
                </tr>

                {/* M2 详细项 */}
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">├─ 产品认证费</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m2_product_certification.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    <TierBadge tier="tier1" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">├─ 商标注册费</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m2_trademark_registration.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    {costResult.capex.m2_trademark_notes || <TierBadge tier="tier1" />}
                  </td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">└─ 合规检测费</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m2_compliance_testing.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    <TierBadge tier="tier1" />
                  </td>
                </tr>
                {costResult.capex.m2_product_testing_cost > 0 && (
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-8 py-2 text-gray-700 text-xs">├─ 产品检测费</td>
                    <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m2_product_testing_cost.toFixed(2)}</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-6 py-2 text-xs text-gray-500">
                      <TierBadge tier="tier2" />
                    </td>
                  </tr>
                )}
                {costResult.capex.m2_patent_filing > 0 && (
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-8 py-2 text-gray-700 text-xs">└─ 专利申请费</td>
                    <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m2_patent_filing.toFixed(2)}</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-6 py-2 text-xs text-gray-500">
                      <TierBadge tier="tier2" />
                    </td>
                  </tr>
                )}

                {/* ========== M3: 供应链搭建 ========== */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2.5">
                    <div className="font-medium text-gray-900">(-) M3: 供应链搭建</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      仓库: {costResult.capex.m3_warehouse_type} · {costResult.capex.m3_warehouse_size_sqm}㎡
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                    ${(costResult.capex.m3 / monthlyVolume).toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-600">
                    {((costResult.capex.m3 / monthlyVolume / revenue) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-2.5 text-xs text-gray-600">
                    总计${costResult.capex.m3.toFixed(2)} ÷ {monthlyVolume}单
                  </td>
                </tr>

                {/* M3 详细项 */}
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">├─ 仓储押金</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m3_warehouse_deposit.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    <TierBadge tier="tier2" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">├─ 设备采购</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m3_equipment_purchase.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    <TierBadge tier="tier2" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">├─ 初始库存</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m3_initial_inventory.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    {costResult.capex.m3_inventory_months}个月库存
                  </td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-8 py-2 text-gray-700 text-xs">└─ 系统搭建</td>
                  <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m3_system_setup.toFixed(2)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-6 py-2 text-xs text-gray-500">
                    <TierBadge tier="tier2" />
                  </td>
                </tr>
                {costResult.capex.m3_software_cost > 0 && (
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-8 py-2 text-gray-700 text-xs">└─ 软件订阅</td>
                    <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.capex.m3_software_cost.toFixed(2)}</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-6 py-2 text-xs text-gray-500">
                      首年订阅费
                    </td>
                  </tr>
                )}

                {/* CAPEX 小计 */}
                <tr className="bg-blue-50 border-b-2 border-blue-300">
                  <td className="px-6 py-2.5 font-bold text-blue-900">CAPEX 小计 (单位分摊)</td>
                  <td className="px-4 py-2.5 text-right font-bold text-blue-900">${capexPerUnit.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-blue-800">
                    {((capexPerUnit / revenue) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-2.5 text-xs text-gray-600">
                    总计${costResult.capex.total.toFixed(2)} ÷ {monthlyVolume}单
                  </td>
                </tr>

                {/* ========== 3. OPEX Section Header ========== */}
                <tr className="bg-green-100 border-b border-green-200">
                  <td colSpan={4} className="px-6 py-2.5 font-bold text-green-900 text-xs uppercase tracking-wide">
                    阶段1-N: OPEX (单位运营成本)
                  </td>
                </tr>

                {/* ========== M4: 货物税费 ========== */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2.5">
                    <div className="font-medium text-gray-900">(-) M4: 货物税费</div>
                    {costDrivers[0]?.module === 'M4' && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-semibold">
                        ⚠️ 最大成本项
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                    ${m4Total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-600">
                    {((m4Total / revenue) * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-2.5 text-xs text-gray-600">
                    COGS + 关税 + VAT + 物流
                  </td>
                </tr>

                {/* M4 详细项 - 兼容两种数据结构 */}
                {costResult.opex.m4_goodsTax ? (
                  <>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 商品成本 (COGS)</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m4_goodsTax.cogs.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier1" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 进口关税</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m4_goodsTax.importTariff.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier1" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 增值税 (VAT)</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m4_goodsTax.vat.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier1" />
                      </td>
                    </tr>
                    {(costResult.opex.m4_goodsTax.exciseTax ?? 0) > 0 && (
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td className="px-8 py-2 text-gray-700 text-xs">└─ 消费税</td>
                        <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m4_goodsTax.exciseTax.toFixed(2)}</td>
                        <td className="px-4 py-2"></td>
                        <td className="px-6 py-2 text-xs text-gray-500">
                          <TierBadge tier="tier2" />
                        </td>
                      </tr>
                    )}
                  </>
                ) : (
                  <>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 商品成本 (COGS)</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m4_cogs.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier1" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 进口关税</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m4_tariff.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier1" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 增值税 (VAT)</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m4_vat.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier1" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">└─ 头程物流</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m4_logistics.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                  </>
                )}

                {/* ========== M5: 物流配送 ========== */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2.5">
                    <div className="font-medium text-gray-900">(-) M5: 物流配送</div>
                    {costDrivers[0]?.module === 'M5' && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-semibold">
                        ⚠️ 最大成本项
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                    ${m5Total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-600">
                    {((m5Total / revenue) * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-2.5 text-xs text-gray-600">
                    配送 + 退货 + 仓储
                  </td>
                </tr>

                {/* M5 详细项 - 兼容两种数据结构 */}
                {costResult.opex.m5_logistics ? (
                  <>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 国际运输</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m5_logistics.intlShipping.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 本地配送</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m5_logistics.localDelivery.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                    {(costResult.opex.m5_logistics.fbaFee ?? 0) > 0 && (
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td className="px-8 py-2 text-gray-700 text-xs">├─ FBA费用</td>
                        <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m5_logistics.fbaFee.toFixed(2)}</td>
                        <td className="px-4 py-2"></td>
                        <td className="px-6 py-2 text-xs text-gray-500">
                          <TierBadge tier="tier1" />
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 仓储费</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m5_logistics.warehouseFee.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">└─ 退货物流</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m5_logistics.returnLogistics.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 尾程物流</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m5_last_mile.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">└─ 退货成本</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m5_return.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                  </>
                )}

                {/* ========== M6: 营销获客 ========== */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2.5">
                    <div className="font-medium text-gray-900">(-) M6: 营销获客</div>
                    {costDrivers[0]?.module === 'M6' && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-semibold">
                        ⚠️ 最大成本项
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                    ${m6Total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-600">
                    {((m6Total / revenue) * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-2.5 text-xs text-gray-600">
                    CAC + 平台佣金 + 广告
                  </td>
                </tr>

                {/* M6 详细项 - 兼容两种数据结构 */}
                {costResult.opex.m6_marketing && typeof costResult.opex.m6_marketing === 'object' ? (
                  <>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 客户获取成本 (CAC)</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${((costResult.opex.m6_marketing as any).cac).toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 平台佣金</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${((costResult.opex.m6_marketing as any).platformCommission).toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier1" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">└─ 广告支出</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${((costResult.opex.m6_marketing as any).adSpend).toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-8 py-2 text-gray-700 text-xs">└─ CAC + 平台佣金</td>
                    <td className="px-4 py-2 text-right text-gray-700 text-xs">${m6Total.toFixed(2)}</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-6 py-2 text-xs text-gray-500">
                      <TierBadge tier="tier2" />
                    </td>
                  </tr>
                )}

                {/* ========== M7: 支付手续费 ========== */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2.5">
                    <div className="font-medium text-gray-900">(-) M7: 支付手续费</div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                    ${m7Total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-600">
                    {((m7Total / revenue) * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-2.5 text-xs text-gray-600">
                    支付网关 + 货币兑换
                  </td>
                </tr>

                {/* M7 详细项 - 兼容两种数据结构 */}
                {costResult.opex.m7_payment && typeof costResult.opex.m7_payment === 'object' ? (
                  <>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 支付网关费</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${((costResult.opex.m7_payment as any).paymentGatewayFee).toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier1" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">└─ 货币兑换</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${((costResult.opex.m7_payment as any).currencyConversion).toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 支付手续费</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${(costResult.opex.m7_payment as number).toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier1" />
                      </td>
                    </tr>
                    {(costResult.opex.m7_platform_commission ?? 0) > 0 && (
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td className="px-8 py-2 text-gray-700 text-xs">└─ 平台佣金</td>
                        <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m7_platform_commission.toFixed(2)}</td>
                        <td className="px-4 py-2"></td>
                        <td className="px-6 py-2 text-xs text-gray-500">
                          <TierBadge tier="tier1" />
                        </td>
                      </tr>
                    )}
                  </>
                )}

                {/* ========== M8: 运营管理 ========== */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2.5">
                    <div className="font-medium text-gray-900">(-) M8: 运营管理</div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                    ${m8Total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-600">
                    {((m8Total / revenue) * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-2.5 text-xs text-gray-600">
                    客服 + 人员 + 软件
                  </td>
                </tr>

                {/* M8 详细项 - 兼容两种数据结构 */}
                {costResult.opex.m8_operations ? (
                  <>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 客服成本</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m8_operations.customerService.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">├─ 人员成本</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m8_operations.staff.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="px-8 py-2 text-gray-700 text-xs">└─ 软件成本</td>
                      <td className="px-4 py-2 text-right text-gray-700 text-xs">${costResult.opex.m8_operations.software.toFixed(2)}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-500">
                        <TierBadge tier="tier2" />
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-8 py-2 text-gray-700 text-xs">└─ 运营管理费用</td>
                    <td className="px-4 py-2 text-right text-gray-700 text-xs">${m8Total.toFixed(2)}</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-6 py-2 text-xs text-gray-500">
                      <TierBadge tier="tier2" />
                    </td>
                  </tr>
                )}

                {/* OPEX 小计 */}
                <tr className="bg-green-50 border-b-2 border-green-300">
                  <td className="px-6 py-2.5 font-bold text-green-900">OPEX 小计</td>
                  <td className="px-4 py-2.5 text-right font-bold text-green-900">${costResult.opex.total.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-green-800">
                    {((costResult.opex.total / revenue) * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-2.5 text-xs text-gray-600">
                    M4 + M5 + M6 + M7 + M8
                  </td>
                </tr>

                {/* ========== 总成本 ========== */}
                <tr className="bg-gray-100 border-b-2 border-gray-400">
                  <td className="px-6 py-3 font-bold text-gray-900 text-base">(=) 总成本</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900 text-lg">${totalCost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800 text-base">
                    {((totalCost / revenue) * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-600">
                    CAPEX分摊 + OPEX
                  </td>
                </tr>

                {/* ========== 毛利 ========== */}
                <tr className={`border-b-2 ${grossProfit >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <td className="px-6 py-3 font-bold text-gray-900 text-lg">(=) 毛利</td>
                  <td className="px-4 py-3 text-right font-bold text-xl" style={{ color: grossProfit >= 0 ? '#16a34a' : '#dc2626' }}>
                    ${grossProfit.toFixed(2)}
                  </td>
                  <td colSpan={2} className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-2xl ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {grossMargin.toFixed(1)}%
                      </span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${grossProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(Math.abs(grossMargin), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN (35%): Insights & Recommendations */}
        <div className="space-y-4">
          {/* 1. 盈利能力诊断 */}
          {grossMargin < 0 && (
            <div className="bg-white rounded-lg border-2 border-red-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h4 className="font-bold text-red-900">盈利能力诊断</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">✗</span>
                  </div>
                  <div>
                    <div className="font-semibold text-red-900">负毛利率 {grossMargin.toFixed(1)}%</div>
                    <div className="text-xs text-red-700">每销售一单亏损${Math.abs(grossProfit).toFixed(2)}，业务模式不可持续</div>
                  </div>
                </div>
                {costResult.kpis.roi < 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold">✗</span>
                    </div>
                    <div>
                      <div className="font-semibold text-red-900">负投资回报率 {costResult.kpis.roi.toFixed(0)}%</div>
                      <div className="text-xs text-red-700">整体投资亏损，需要调整策略</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. 成本驱动因素 Top 3 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <h4 className="font-bold text-gray-900">主要成本驱动因素 (Top 3)</h4>
            </div>
            <div className="space-y-3">
              {costDrivers.map((driver, index) => (
                <div key={driver.module} className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-red-100 text-red-700' :
                    index === 1 ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-sm">{driver.name}</span>
                      <span className="text-base font-bold text-gray-900">${driver.value.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">占售价{((driver.value / revenue) * 100).toFixed(0)}%</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min((driver.value / revenue) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 优化建议 (盈亏平衡分析) */}
          {grossMargin < 0 && (
            <div className="bg-white rounded-lg border border-blue-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-blue-600" />
                <h4 className="font-bold text-gray-900">优化建议 (盈亏平衡分析)</h4>
              </div>
              <div className="space-y-3">
                {/* 方案A: 提价 */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      A
                    </div>
                    <span className="font-semibold text-blue-900 text-sm">提价策略</span>
                  </div>
                  <div className="text-xs text-gray-700 ml-7">
                    将售价从${revenue.toFixed(2)}提升至<span className="font-bold text-blue-600">${breakEvenPrice.toFixed(2)}以上</span>即可实现盈亏平衡
                  </div>
                  <div className="mt-2 ml-7 text-xs">
                    <div className="text-gray-600">需要提价: <span className="font-bold text-blue-600">${priceGap.toFixed(2)} (+{((priceGap / revenue) * 100).toFixed(0)}%)</span></div>
                  </div>
                </div>

                {/* 方案B: 降本 */}
                {costDrivers.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        B
                      </div>
                      <span className="font-semibold text-green-900 text-sm">成本优化策略</span>
                    </div>
                    <div className="text-xs text-gray-700 ml-7">
                      优化{costDrivers[0].name}，将成本从${costDrivers[0].value.toFixed(2)}降至<span className="font-bold text-green-600">${(costDrivers[0].value * 0.5).toFixed(2)}以下</span>(降低50%)
                    </div>
                    <div className="mt-2 ml-7 space-y-1 text-xs">
                      <div className="text-gray-600">• 预计节省: ${(costDrivers[0].value * 0.5).toFixed(2)}/单</div>
                    </div>
                  </div>
                )}

                {/* 方案C: 市场切换 */}
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      C
                    </div>
                    <span className="font-semibold text-purple-900 text-sm">市场选择策略</span>
                  </div>
                  <div className="text-xs text-gray-700 ml-7">
                    考虑转向<span className="font-bold text-purple-600">低关税市场</span>(如越南/加拿大)，可能降低货物税费成本
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. 成本分布可视化 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-bold text-gray-900 mb-3 text-sm">成本分布</h4>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={opexData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={(entry: any) => `$${entry.value.toFixed(0)}`}
                  labelLine={false}
                >
                  {opexData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1 text-xs">
              {opexData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{((item.value / costResult.opex.total) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Helper Component ==========

function TierBadge({ tier }: { tier: string }) {
  const colors = {
    tier1: 'bg-green-100 text-green-700 border-green-300',
    tier2: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    tier3: 'bg-gray-100 text-gray-700 border-gray-300',
  };

  const tierNum = tier.includes('1') ? 'tier1' : tier.includes('2') ? 'tier2' : 'tier3';

  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${colors[tierNum]}`}>
      Tier {tierNum.slice(-1)}
    </span>
  );
}
