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

      {/* 成本洞察提示（替代英文warnings） */}
      {getGrossMargin() < 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-2">💡 成本结构优化建议</h4>
              <p className="text-sm text-red-800">
                当前毛利率为负（{getGrossMargin().toFixed(1)}%），建议重点关注瀑布式成本拆解中的
                <span className="font-semibold">最大成本项</span>，进行针对性优化。
              </p>
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

            {/* M1: Market Entry - MVP 2.0完整11个字段 */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-2">
                M1: 市场准入
                <span className="text-xs font-normal text-gray-500">（监管：{costResult.capex.m1_regulatory_agency}）</span>
              </div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">公司注册费</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m1_company_registration.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">商业许可证费</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m1_business_license.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">税务登记费</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m1_tax_registration.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">法务咨询费</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m1_legal_consulting.toFixed(2)}</span>
                </div>
                {costResult.capex.m1_industry_license > 0 && (
                  <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                    <span className="text-gray-700">行业许可证</span>
                    <span className="font-semibold text-gray-900">${costResult.capex.m1_industry_license.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 text-xs bg-blue-50 px-2 -mx-2 rounded">
                  <span className="font-bold text-gray-900">M1 小计 <span className="text-gray-500 font-normal">（复杂度：{costResult.capex.m1_complexity}）</span></span>
                  <span className="font-bold text-blue-900">${costResult.capex.m1.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* M2: Tech Compliance - MVP 2.0完整10个字段 */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-2">
                M2: 技术合规
                <span className="text-xs font-normal text-gray-500">（有效期：{costResult.capex.m2_certification_validity_years}年）</span>
              </div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">产品认证费</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m2_product_certification.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">商标注册费</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m2_trademark_registration.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">合规检测费</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m2_compliance_testing.toFixed(2)}</span>
                </div>
                {costResult.capex.m2_patent_filing > 0 && (
                  <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                    <span className="text-gray-700">专利申请费</span>
                    <span className="font-semibold text-gray-900">${costResult.capex.m2_patent_filing.toFixed(2)}</span>
                  </div>
                )}
                {costResult.capex.m2_inspection_cost > 0 && (
                  <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                    <span className="text-gray-700">检验费</span>
                    <span className="font-semibold text-gray-900">${costResult.capex.m2_inspection_cost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 text-xs bg-blue-50 px-2 -mx-2 rounded">
                  <span className="font-bold text-gray-900">M2 小计 <span className="text-gray-500 font-normal">（检验：{costResult.capex.m2_inspection_frequency}）</span></span>
                  <span className="font-bold text-blue-900">${costResult.capex.m2.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* M3: Supply Chain Setup - MVP 2.0完整9个字段 */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-2">
                M3: 供应链搭建
                <span className="text-xs font-normal text-gray-500">（仓库：{costResult.capex.m3_warehouse_type}，{costResult.capex.m3_warehouse_size_sqm}㎡）</span>
              </div>
              <div className="space-y-1 pl-2">
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">仓储押金</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m3_warehouse_deposit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">设备采购费</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m3_equipment_purchase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">初始库存成本</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m3_initial_inventory.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">系统搭建费</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m3_system_setup.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                  <span className="text-gray-700">软件成本</span>
                  <span className="font-semibold text-gray-900">${costResult.capex.m3_software_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-xs bg-blue-50 px-2 -mx-2 rounded">
                  <span className="font-bold text-gray-900">M3 小计 <span className="text-gray-500 font-normal">（库存：{costResult.capex.m3_inventory_months}个月）</span></span>
                  <span className="font-bold text-blue-900">${costResult.capex.m3.toFixed(2)}</span>
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

            {/* M4: Goods & Tax - Detailed */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-green-700 mb-1">M4: 货物税费</div>
              <div className="space-y-1 pl-2">
                {costResult.opex.m4_goodsTax ? (
                  <>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">商品成本 <span className="text-gray-400">COGS</span></span>
                      <span className="font-semibold text-gray-900">${costResult.opex.m4_goodsTax.cogs.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">进口关税 <span className="text-gray-400">Import Tariff</span></span>
                      <span className="font-semibold text-gray-900">${costResult.opex.m4_goodsTax.importTariff.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">增值税 <span className="text-gray-400">VAT</span></span>
                      <span className="font-semibold text-gray-900">${costResult.opex.m4_goodsTax.vat.toFixed(2)}</span>
                    </div>
                    {costResult.opex.m4_goodsTax.exciseTax && costResult.opex.m4_goodsTax.exciseTax > 0 && (
                      <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                        <span className="text-gray-700">消费税 <span className="text-gray-400">Excise Tax</span></span>
                        <span className="font-semibold text-gray-900">${costResult.opex.m4_goodsTax.exciseTax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 text-xs bg-green-50 px-2 -mx-2 rounded">
                      <span className="font-bold text-gray-900">M4 小计</span>
                      <span className="font-bold text-green-900">${costResult.opex.m4_goodsTax.total.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-gray-600">COGS + 关税 + 增值税</span>
                    <span className="font-bold text-gray-900">${m4Total.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* M5: Logistics - Detailed */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-green-700 mb-1">M5: 物流配送</div>
              <div className="space-y-1 pl-2">
                {costResult.opex.m5_logistics ? (
                  <>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">国际运输 <span className="text-gray-400">International Shipping</span></span>
                      <span className="font-semibold text-gray-900">${costResult.opex.m5_logistics.intlShipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">本地配送 <span className="text-gray-400">Local Delivery</span></span>
                      <span className="font-semibold text-gray-900">${costResult.opex.m5_logistics.localDelivery.toFixed(2)}</span>
                    </div>
                    {costResult.opex.m5_logistics.fbaFee && costResult.opex.m5_logistics.fbaFee > 0 && (
                      <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                        <span className="text-gray-700">FBA费用 <span className="text-gray-400">FBA Fee</span></span>
                        <span className="font-semibold text-gray-900">${costResult.opex.m5_logistics.fbaFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">仓储费 <span className="text-gray-400">Warehouse Fee</span></span>
                      <span className="font-semibold text-gray-900">${costResult.opex.m5_logistics.warehouseFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">退货物流 <span className="text-gray-400">Return Logistics</span></span>
                      <span className="font-semibold text-gray-900">${costResult.opex.m5_logistics.returnLogistics.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs bg-green-50 px-2 -mx-2 rounded">
                      <span className="font-bold text-gray-900">M5 小计</span>
                      <span className="font-bold text-green-900">${costResult.opex.m5_logistics.total.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-gray-600">国际运输 + 本地配送 + FBA</span>
                    <span className="font-bold text-gray-900">${m5Total.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* M6: Marketing - Detailed */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-green-700 mb-1">M6: 营销获客</div>
              <div className="space-y-1 pl-2">
                {costResult.opex.m6_marketing && typeof costResult.opex.m6_marketing === 'object' ? (
                  <>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">客户获取成本 <span className="text-gray-400">CAC</span></span>
                      <span className="font-semibold text-gray-900">${(costResult.opex.m6_marketing as any).cac.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">平台佣金 <span className="text-gray-400">Platform Commission</span></span>
                      <span className="font-semibold text-gray-900">${(costResult.opex.m6_marketing as any).platformCommission.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">广告支出 <span className="text-gray-400">Ad Spend</span></span>
                      <span className="font-semibold text-gray-900">${(costResult.opex.m6_marketing as any).adSpend.toFixed(2)}</span>
                    </div>
                    {(costResult.opex.m6_marketing as any).influencerMarketing && (costResult.opex.m6_marketing as any).influencerMarketing > 0 && (
                      <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                        <span className="text-gray-700">网红营销 <span className="text-gray-400">Influencer Marketing</span></span>
                        <span className="font-semibold text-gray-900">${(costResult.opex.m6_marketing as any).influencerMarketing.toFixed(2)}</span>
                      </div>
                    )}
                    {(costResult.opex.m6_marketing as any).seo && (costResult.opex.m6_marketing as any).seo > 0 && (
                      <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                        <span className="text-gray-700">SEO优化 <span className="text-gray-400">SEO</span></span>
                        <span className="font-semibold text-gray-900">${(costResult.opex.m6_marketing as any).seo.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 text-xs bg-green-50 px-2 -mx-2 rounded">
                      <span className="font-bold text-gray-900">M6 小计</span>
                      <span className="font-bold text-green-900">${m6Total.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-gray-600">CAC + 平台佣金</span>
                    <span className="font-bold text-gray-900">${m6Total.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* M7: Payment - Detailed */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-green-700 mb-1">M7: 支付手续费</div>
              <div className="space-y-1 pl-2">
                {costResult.opex.m7_payment && typeof costResult.opex.m7_payment === 'object' ? (
                  <>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">支付网关费 <span className="text-gray-400">Payment Gateway</span></span>
                      <span className="font-semibold text-gray-900">${(costResult.opex.m7_payment as any).paymentGatewayFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">货币兑换 <span className="text-gray-400">Currency Conversion</span></span>
                      <span className="font-semibold text-gray-900">${(costResult.opex.m7_payment as any).currencyConversion.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">退款费用 <span className="text-gray-400">Chargeback Fee</span></span>
                      <span className="font-semibold text-gray-900">${(costResult.opex.m7_payment as any).chargebackFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs bg-green-50 px-2 -mx-2 rounded">
                      <span className="font-bold text-gray-900">M7 小计</span>
                      <span className="font-bold text-green-900">${m7Total.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-gray-600">网关费用 + 汇率损失</span>
                    <span className="font-bold text-gray-900">${m7Total.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* M8: Operations - Detailed */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-green-700 mb-1">M8: 运营管理</div>
              <div className="space-y-1 pl-2">
                {costResult.opex.m8_operations ? (
                  <>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">客服成本 <span className="text-gray-400">Customer Service</span></span>
                      <span className="font-semibold text-gray-900">${costResult.opex.m8_operations.customerService.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">人员成本 <span className="text-gray-400">Staff</span></span>
                      <span className="font-semibold text-gray-900">${costResult.opex.m8_operations.staff.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                      <span className="text-gray-700">软件成本 <span className="text-gray-400">Software</span></span>
                      <span className="font-semibold text-gray-900">${costResult.opex.m8_operations.software.toFixed(2)}</span>
                    </div>
                    {costResult.opex.m8_operations.officeRent && costResult.opex.m8_operations.officeRent > 0 && (
                      <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                        <span className="text-gray-700">办公室租金 <span className="text-gray-400">Office Rent</span></span>
                        <span className="font-semibold text-gray-900">${costResult.opex.m8_operations.officeRent.toFixed(2)}</span>
                      </div>
                    )}
                    {costResult.opex.m8_operations.utilities && costResult.opex.m8_operations.utilities > 0 && (
                      <div className="flex justify-between py-1 text-xs border-b border-gray-100">
                        <span className="text-gray-700">水电费 <span className="text-gray-400">Utilities</span></span>
                        <span className="font-semibold text-gray-900">${costResult.opex.m8_operations.utilities.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 text-xs bg-green-50 px-2 -mx-2 rounded">
                      <span className="font-bold text-gray-900">M8 小计</span>
                      <span className="font-bold text-green-900">${costResult.opex.m8_operations.total.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-gray-600">客服 + 人员 + 软件</span>
                    <span className="font-bold text-gray-900">${m8Total.toFixed(2)}</span>
                  </div>
                )}
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
