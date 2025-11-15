'use client';

import { Project, CostResult } from '@/types/gecom';
import { AlertCircle, TrendingUp, Target, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';

interface Step3CostModelingProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  costResult: CostResult | null;
}

export default function Step3CostModeling({ project, costResult }: Step3CostModelingProps) {
  const [capexExpanded, setCapexExpanded] = useState(false);
  const [m1Expanded, setM1Expanded] = useState(false);
  const [m2Expanded, setM2Expanded] = useState(false);
  const [m3Expanded, setM3Expanded] = useState(false);
  const [m4Expanded, setM4Expanded] = useState(true); // 默认展开最大成本项
  const [m5Expanded, setM5Expanded] = useState(false);
  const [m6Expanded, setM6Expanded] = useState(false);
  const [m7Expanded, setM7Expanded] = useState(false);
  const [m8Expanded, setM8Expanded] = useState(false);

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
                建议重点关注下方瀑布式成本拆解中的<span className="font-semibold">最大成本项</span>，进行针对性优化。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: 65% Left + 35% Right */}
      <div className="grid grid-cols-3 gap-6">
        {/* LEFT COLUMN (65%): Waterfall Cost Breakdown */}
        <div className="col-span-2 space-y-4">
          {/* ========== 瀑布式成本拆解表 ========== */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-lg border-b-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900">
                单位经济模型 (Unit Economics)
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                从营收到毛利的完整计算链路
              </p>
            </div>

            <div className="p-4 space-y-3">
              {/* 1. 营收起点 */}
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">营收</span>
                    <div className="text-xs text-gray-500">Average Order Value (AOV)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-700">${revenue.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">100%</div>
                  </div>
                </div>
              </div>

              {/* 2. CAPEX分摊区域 (可折叠) */}
              <div className="border-l-4 border-blue-300 bg-blue-50 rounded">
                <button
                  className="w-full p-3 text-left flex justify-between items-center hover:bg-blue-100 transition-colors"
                  onClick={() => setCapexExpanded(!capexExpanded)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-900">(-) 阶段0-1: CAPEX (一次性启动成本分摊)</span>
                      {capexExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                    <div className="text-xs text-gray-600">M1 + M2 + M3 总计 ${costResult.capex.total.toFixed(2)} ÷ {monthlyVolume}单</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-blue-900">-${capexPerUnit.toFixed(2)}</div>
                    <div className="text-xs text-gray-600">{((capexPerUnit / revenue) * 100).toFixed(1)}%</div>
                  </div>
                </button>

                {/* CAPEX详情 (展开后) */}
                {capexExpanded && (
                  <div className="px-6 pb-3 space-y-3 border-t border-blue-200">
                    {/* M1 Market Entry */}
                    <div className="pt-3">
                      <button
                        className="w-full flex justify-between items-start py-2 hover:bg-blue-100 rounded px-2 -mx-2"
                        onClick={() => setM1Expanded(!m1Expanded)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">M1: 市场准入</span>
                            <TierBadge tier="tier1" />
                            {m1Expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </div>
                          <div className="text-xs text-gray-500">监管: {costResult.capex.m1_regulatory_agency} · 复杂度: {costResult.capex.m1_complexity}</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-semibold text-gray-900">${costResult.capex.m1.toFixed(2)}</div>
                          <div className="text-xs text-gray-600">${(costResult.capex.m1 / monthlyVolume).toFixed(2)}/单</div>
                        </div>
                      </button>

                      {/* M1 详细拆解 */}
                      {m1Expanded && (
                        <div className="pl-4 mt-2 space-y-1 text-xs bg-white p-2 rounded">
                          <CostDetailRow label="公司注册费" amount={costResult.capex.m1_company_registration} />
                          <CostDetailRow label="商业许可证费" amount={costResult.capex.m1_business_license} />
                          <CostDetailRow label="税务登记费" amount={costResult.capex.m1_tax_registration} />
                          <CostDetailRow label="法务咨询费" amount={costResult.capex.m1_legal_consulting} />
                          {costResult.capex.m1_industry_license > 0 && (
                            <CostDetailRow label="行业许可证" amount={costResult.capex.m1_industry_license} />
                          )}
                          <div className="flex justify-between font-medium bg-blue-50 px-2 py-1 rounded mt-2">
                            <span>M1小计</span>
                            <span>${costResult.capex.m1.toFixed(2)} → ${(costResult.capex.m1 / monthlyVolume).toFixed(2)}/单</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* M2 Tech Compliance */}
                    <div>
                      <button
                        className="w-full flex justify-between items-start py-2 hover:bg-blue-100 rounded px-2 -mx-2"
                        onClick={() => setM2Expanded(!m2Expanded)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">M2: 技术合规</span>
                            <TierBadge tier="tier1" />
                            {m2Expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </div>
                          <div className="text-xs text-gray-500">有效期: {costResult.capex.m2_certification_validity_years}年 · 检验: {costResult.capex.m2_inspection_frequency}</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-semibold text-gray-900">${costResult.capex.m2.toFixed(2)}</div>
                          <div className="text-xs text-gray-600">${(costResult.capex.m2 / monthlyVolume).toFixed(2)}/单</div>
                        </div>
                      </button>

                      {m2Expanded && (
                        <div className="pl-4 mt-2 space-y-1 text-xs bg-white p-2 rounded">
                          <CostDetailRow label="产品认证费" amount={costResult.capex.m2_product_certification} />
                          <CostDetailRow label="商标注册费" amount={costResult.capex.m2_trademark_registration} />
                          <CostDetailRow label="合规检测费" amount={costResult.capex.m2_compliance_testing} />
                          {costResult.capex.m2_product_testing_cost > 0 && (
                            <CostDetailRow label="产品检测费" amount={costResult.capex.m2_product_testing_cost} />
                          )}
                          {costResult.capex.m2_patent_filing > 0 && (
                            <CostDetailRow label="专利申请费" amount={costResult.capex.m2_patent_filing} />
                          )}
                          <div className="flex justify-between font-medium bg-blue-50 px-2 py-1 rounded mt-2">
                            <span>M2小计</span>
                            <span>${costResult.capex.m2.toFixed(2)} → ${(costResult.capex.m2 / monthlyVolume).toFixed(2)}/单</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* M3 Supply Chain */}
                    <div>
                      <button
                        className="w-full flex justify-between items-start py-2 hover:bg-blue-100 rounded px-2 -mx-2"
                        onClick={() => setM3Expanded(!m3Expanded)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">M3: 供应链搭建</span>
                            <TierBadge tier="tier2" />
                            {m3Expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </div>
                          <div className="text-xs text-gray-500">仓库: {costResult.capex.m3_warehouse_type} · {costResult.capex.m3_warehouse_size_sqm}㎡</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-semibold text-gray-900">${costResult.capex.m3.toFixed(2)}</div>
                          <div className="text-xs text-gray-600">${(costResult.capex.m3 / monthlyVolume).toFixed(2)}/单</div>
                        </div>
                      </button>

                      {m3Expanded && (
                        <div className="pl-4 mt-2 space-y-1 text-xs bg-white p-2 rounded">
                          <CostDetailRow label="仓储押金" amount={costResult.capex.m3_warehouse_deposit} />
                          <CostDetailRow label="设备采购" amount={costResult.capex.m3_equipment_purchase} />
                          <CostDetailRow label="初始库存" amount={costResult.capex.m3_initial_inventory} />
                          <CostDetailRow label="系统搭建" amount={costResult.capex.m3_system_setup} />
                          {costResult.capex.m3_software_cost > 0 && (
                            <CostDetailRow label="软件订阅" amount={costResult.capex.m3_software_cost} />
                          )}
                          <div className="flex justify-between font-medium bg-blue-50 px-2 py-1 rounded mt-2">
                            <span>M3小计</span>
                            <span>${costResult.capex.m3.toFixed(2)} → ${(costResult.capex.m3 / monthlyVolume).toFixed(2)}/单</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. OPEX区域 */}
              <div className="border-l-4 border-green-400 bg-green-50 rounded">
                <div className="p-3">
                  <div className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <span>阶段1-N: OPEX (单位运营成本)</span>
                  </div>

                  <div className="space-y-2">
                    {/* M4 - 默认展开(最大成本项) */}
                    <OPEXModule
                      name="M4: 货物税费"
                      total={m4Total}
                      revenue={revenue}
                      expanded={m4Expanded}
                      onToggle={() => setM4Expanded(!m4Expanded)}
                      isTopCost={costDrivers[0]?.module === 'M4'}
                    >
                      {costResult.opex.m4_goodsTax ? (
                        <>
                          <CostDetailRow label="商品成本 (COGS)" amount={costResult.opex.m4_goodsTax.cogs} tier="tier1" />
                          <CostDetailRow label="进口关税" amount={costResult.opex.m4_goodsTax.importTariff} tier="tier1" />
                          <CostDetailRow label="增值税 (VAT)" amount={costResult.opex.m4_goodsTax.vat} tier="tier1" />
                          {costResult.opex.m4_goodsTax.exciseTax && costResult.opex.m4_goodsTax.exciseTax > 0 && (
                            <CostDetailRow label="消费税" amount={costResult.opex.m4_goodsTax.exciseTax} tier="tier2" />
                          )}
                        </>
                      ) : (
                        <>
                          <CostDetailRow label="商品成本 (COGS)" amount={costResult.opex.m4_cogs} tier="tier1" />
                          <CostDetailRow label="进口关税" amount={costResult.opex.m4_tariff} tier="tier1" />
                          <CostDetailRow label="增值税 (VAT)" amount={costResult.opex.m4_vat} tier="tier1" />
                          <CostDetailRow label="头程物流" amount={costResult.opex.m4_logistics} tier="tier2" />
                        </>
                      )}
                    </OPEXModule>

                    {/* M5 */}
                    <OPEXModule
                      name="M5: 物流配送"
                      total={m5Total}
                      revenue={revenue}
                      expanded={m5Expanded}
                      onToggle={() => setM5Expanded(!m5Expanded)}
                      isTopCost={costDrivers[0]?.module === 'M5'}
                    >
                      {costResult.opex.m5_logistics ? (
                        <>
                          <CostDetailRow label="国际运输" amount={costResult.opex.m5_logistics.intlShipping} tier="tier2" />
                          <CostDetailRow label="本地配送" amount={costResult.opex.m5_logistics.localDelivery} tier="tier2" />
                          {costResult.opex.m5_logistics.fbaFee && costResult.opex.m5_logistics.fbaFee > 0 && (
                            <CostDetailRow label="FBA费用" amount={costResult.opex.m5_logistics.fbaFee} tier="tier1" />
                          )}
                          <CostDetailRow label="仓储费" amount={costResult.opex.m5_logistics.warehouseFee} tier="tier2" />
                          <CostDetailRow label="退货物流" amount={costResult.opex.m5_logistics.returnLogistics} tier="tier2" />
                        </>
                      ) : (
                        <>
                          <CostDetailRow label="尾程物流" amount={costResult.opex.m5_last_mile} tier="tier2" />
                          <CostDetailRow label="退货成本" amount={costResult.opex.m5_return} tier="tier2" />
                        </>
                      )}
                    </OPEXModule>

                    {/* M6 */}
                    <OPEXModule
                      name="M6: 营销获客"
                      total={m6Total}
                      revenue={revenue}
                      expanded={m6Expanded}
                      onToggle={() => setM6Expanded(!m6Expanded)}
                      isTopCost={costDrivers[0]?.module === 'M6'}
                    >
                      {costResult.opex.m6_marketing && typeof costResult.opex.m6_marketing === 'object' ? (
                        <>
                          <CostDetailRow label="客户获取成本 (CAC)" amount={(costResult.opex.m6_marketing as any).cac} tier="tier2" />
                          <CostDetailRow label="平台佣金" amount={(costResult.opex.m6_marketing as any).platformCommission} tier="tier1" />
                          <CostDetailRow label="广告支出" amount={(costResult.opex.m6_marketing as any).adSpend} tier="tier2" />
                        </>
                      ) : (
                        <CostDetailRow label="CAC + 平台佣金" amount={m6Total} tier="tier2" />
                      )}
                    </OPEXModule>

                    {/* M7 */}
                    <OPEXModule
                      name="M7: 支付手续费"
                      total={m7Total}
                      revenue={revenue}
                      expanded={m7Expanded}
                      onToggle={() => setM7Expanded(!m7Expanded)}
                      isTopCost={false}
                    >
                      {costResult.opex.m7_payment && typeof costResult.opex.m7_payment === 'object' ? (
                        <>
                          <CostDetailRow label="支付网关费" amount={(costResult.opex.m7_payment as any).paymentGatewayFee} tier="tier1" />
                          <CostDetailRow label="货币兑换" amount={(costResult.opex.m7_payment as any).currencyConversion} tier="tier2" />
                        </>
                      ) : (
                        <>
                          <CostDetailRow label="支付手续费" amount={costResult.opex.m7_payment as number} tier="tier1" />
                          {costResult.opex.m7_platform_commission && (
                            <CostDetailRow label="平台佣金" amount={costResult.opex.m7_platform_commission} tier="tier1" />
                          )}
                        </>
                      )}
                    </OPEXModule>

                    {/* M8 */}
                    <OPEXModule
                      name="M8: 运营管理"
                      total={m8Total}
                      revenue={revenue}
                      expanded={m8Expanded}
                      onToggle={() => setM8Expanded(!m8Expanded)}
                      isTopCost={false}
                    >
                      {costResult.opex.m8_operations ? (
                        <>
                          <CostDetailRow label="客服成本" amount={costResult.opex.m8_operations.customerService} tier="tier2" />
                          <CostDetailRow label="人员成本" amount={costResult.opex.m8_operations.staff} tier="tier2" />
                          <CostDetailRow label="软件成本" amount={costResult.opex.m8_operations.software} tier="tier2" />
                        </>
                      ) : (
                        <CostDetailRow label="运营管理费用" amount={m8Total} tier="tier2" />
                      )}
                    </OPEXModule>
                  </div>
                </div>
              </div>

              {/* 4. 底部总结 */}
              <div className="border-t-2 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-b-lg">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-base">
                    <span className="font-bold text-gray-900">(=) 总成本</span>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 text-lg">${totalCost.toFixed(2)}</span>
                      <span className="text-sm text-gray-600 ml-2">{((totalCost / revenue) * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-300"></div>

                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-gray-900">(=) 毛利</span>
                    <span className={`font-bold text-xl ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${grossProfit.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold text-gray-900">(=) 毛利率</span>
                    <span className={`font-bold text-2xl ${grossMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {grossMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
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

// ========== Helper Components ==========

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

function CostDetailRow({ label, amount, tier }: { label: string; amount: number; tier?: string }) {
  return (
    <div className="flex justify-between text-gray-700 py-0.5">
      <span className="flex items-center gap-1">
        ├─ {label}
        {tier && <TierBadge tier={tier} />}
      </span>
      <span className="font-medium">${amount.toFixed(2)}</span>
    </div>
  );
}

function OPEXModule({
  name,
  total,
  revenue,
  expanded,
  onToggle,
  isTopCost,
  children,
}: {
  name: string;
  total: number;
  revenue: number;
  expanded: boolean;
  onToggle: () => void;
  isTopCost: boolean;
  children: React.ReactNode;
}) {
  const percentage = ((total / revenue) * 100).toFixed(0);

  return (
    <div>
      <button
        className="w-full flex justify-between items-center bg-white p-2 rounded border border-green-200 hover:bg-green-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800 text-sm">(-) {name}</span>
          {isTopCost && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-semibold">
              ⚠️ 最大成本项
            </span>
          )}
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-gray-900">${total.toFixed(2)}</div>
          <div className="text-xs text-gray-600">{percentage}%</div>
        </div>
      </button>

      {expanded && (
        <div className="pl-4 mt-1 space-y-1 text-xs bg-white p-2 rounded border border-green-100">
          {children}
        </div>
      )}
    </div>
  );
}
