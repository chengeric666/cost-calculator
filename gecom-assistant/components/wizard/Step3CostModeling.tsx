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
        <p className="text-gray-600">Calculating cost model...</p>
      </div>
    );
  }

  // Prepare data for OPEX breakdown chart
  const opexData = [
    { name: 'M4: Goods & Tax', value: costResult.opex.m4_goodsTax.total, color: '#3b82f6' },
    { name: 'M5: Logistics', value: costResult.opex.m5_logistics.total, color: '#10b981' },
    { name: 'M6: Marketing', value: costResult.opex.m6_marketing.total, color: '#f59e0b' },
    { name: 'M7: Payment', value: costResult.opex.m7_payment.total, color: '#8b5cf6' },
    { name: 'M8: Operations', value: costResult.opex.m8_operations.total, color: '#ec4899' },
  ];

  // Unit economics comparison
  const unitEconomicsData = [
    { name: 'Revenue', amount: costResult.unitEconomics.revenue },
    { name: 'Total Cost', amount: costResult.unitEconomics.totalCost },
    { name: 'Gross Profit', amount: costResult.unitEconomics.grossProfit },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Cost Modeling Results</h2>
        <p className="text-gray-600">
          Complete cost breakdown based on GECOM dual-phase eight-module model
        </p>
      </div>

      {/* Warnings */}
      {costResult.warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Warnings</h4>
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
          title="Gross Margin"
          value={`${costResult.unitEconomics.grossMargin.toFixed(1)}%`}
          subtitle={`$${costResult.unitEconomics.grossProfit.toFixed(2)} per unit`}
          trend={costResult.unitEconomics.grossMargin >= 30 ? 'up' : 'down'}
          color={costResult.unitEconomics.grossMargin >= 30 ? 'green' : 'red'}
        />
        <MetricCard
          title="ROI"
          value={`${costResult.kpis.roi.toFixed(0)}%`}
          subtitle="Annual return"
          trend={costResult.kpis.roi >= 100 ? 'up' : 'down'}
          color={costResult.kpis.roi >= 100 ? 'green' : 'yellow'}
        />
        <MetricCard
          title="Payback Period"
          value={`${costResult.kpis.paybackPeriod.toFixed(1)}`}
          subtitle="months"
          trend={costResult.kpis.paybackPeriod <= 12 ? 'up' : 'down'}
          color={costResult.kpis.paybackPeriod <= 12 ? 'green' : 'yellow'}
        />
        <MetricCard
          title="LTV:CAC"
          value={`${costResult.kpis.ltvCacRatio.toFixed(1)}:1`}
          subtitle={`LTV $${costResult.kpis.ltv.toFixed(0)}`}
          trend={costResult.kpis.ltvCacRatio >= 3 ? 'up' : 'down'}
          color={costResult.kpis.ltvCacRatio >= 3 ? 'green' : 'red'}
        />
      </div>

      {/* CAPEX breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase 0-1: CAPEX (One-time Startup Costs)</h3>
        <div className="space-y-3">
          <CostRow
            label="M1: Market Entry"
            amount={costResult.capex.m1_marketEntry.total}
            details={`Registration, licensing, legal: $${costResult.capex.m1_marketEntry.companyRegistration + costResult.capex.m1_marketEntry.businessLicense + costResult.capex.m1_marketEntry.legalConsulting + costResult.capex.m1_marketEntry.taxRegistration}`}
          />
          <CostRow
            label="M2: Tech & Compliance"
            amount={costResult.capex.m2_techCompliance.total}
            details={`Certification, trademark, testing: $${costResult.capex.m2_techCompliance.productCertification + costResult.capex.m2_techCompliance.trademarkRegistration + costResult.capex.m2_techCompliance.complianceTesting}`}
          />
          <CostRow
            label="M3: Supply Chain Setup"
            amount={costResult.capex.m3_supplyChain.total}
            details={`Warehouse, inventory, systems: $${costResult.capex.m3_supplyChain.warehouseDeposit + costResult.capex.m3_supplyChain.equipmentPurchase + costResult.capex.m3_supplyChain.initialInventory + costResult.capex.m3_supplyChain.systemSetup}`}
          />
          <div className="pt-3 border-t border-gray-200">
            <CostRow
              label="Total CAPEX"
              amount={costResult.capex.total}
              details="One-time investment required"
              bold
            />
          </div>
        </div>
      </div>

      {/* OPEX breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase 1-N: OPEX (Per-Unit Operating Costs)</h3>
        <div className="space-y-3 mb-6">
          <CostRow
            label="M4: Goods & Tax"
            amount={costResult.opex.m4_goodsTax.total}
            details={`COGS $${costResult.opex.m4_goodsTax.cogs}, Tariff $${costResult.opex.m4_goodsTax.importTariff.toFixed(2)}, VAT $${costResult.opex.m4_goodsTax.vat.toFixed(2)}`}
          />
          <CostRow
            label="M5: Logistics"
            amount={costResult.opex.m5_logistics.total}
            details={`Intl shipping $${costResult.opex.m5_logistics.intlShipping.toFixed(2)}, Local $${costResult.opex.m5_logistics.localDelivery.toFixed(2)}, FBA $${(costResult.opex.m5_logistics.fbaFee || 0).toFixed(2)}`}
          />
          <CostRow
            label="M6: Marketing"
            amount={costResult.opex.m6_marketing.total}
            details={`CAC $${costResult.opex.m6_marketing.cac.toFixed(2)}, Commission $${costResult.opex.m6_marketing.platformCommission.toFixed(2)}`}
          />
          <CostRow
            label="M7: Payment"
            amount={costResult.opex.m7_payment.total}
            details={`Gateway $${costResult.opex.m7_payment.paymentGatewayFee.toFixed(2)}, FX $${costResult.opex.m7_payment.currencyConversion.toFixed(2)}`}
          />
          <CostRow
            label="M8: Operations"
            amount={costResult.opex.m8_operations.total}
            details={`CS $${costResult.opex.m8_operations.customerService.toFixed(2)}, Staff $${costResult.opex.m8_operations.staff.toFixed(2)}, Software $${costResult.opex.m8_operations.software.toFixed(2)}`}
          />
          <div className="pt-3 border-t border-gray-200">
            <CostRow
              label="Total OPEX per Unit"
              amount={costResult.opex.total}
              details="Cost per unit sold"
              bold
            />
          </div>
        </div>

        {/* OPEX breakdown chart */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Cost Distribution</h4>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Economics</h3>
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
            <div className="text-sm text-gray-600">Break-even Price</div>
            <div className="text-2xl font-bold text-gray-900">${costResult.kpis.breakEvenPrice.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">Minimum price to cover all costs</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Break-even Volume</div>
            <div className="text-2xl font-bold text-gray-900">{costResult.kpis.breakEvenVolume.toFixed(0)}</div>
            <div className="text-xs text-gray-500 mt-1">Units needed to recover CAPEX</div>
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
