# GECOM MVP 2.0 UI改进清单

> **创建时间**: 2025-11-11
> **文档目的**: 对比当前UI实现与MVP 2.0详细规划，系统性列出所有改进项
> **参考文档**:
> - MVP-2.0-详细规划方案.md（第二部分：完整五步界面重设计）
> - 03-product-design.md（产品调性与视觉设计）
> - 竞品参考：https://www.sellersprite.com/v3/calculator/index

---

## 一、当前实现 vs MVP 2.0 目标分析

### 1.1 整体质量差距

| 维度 | 当前状态 | MVP 2.0目标 | 差距程度 |
|------|---------|------------|---------|
| **专业度** | 基础功能可用 | 对标专业SaaS产品 | ⚠️ 中等差距 |
| **视觉设计** | 简单卡片布局 | Liquid Glass高端设计 | ⚠️ 较大差距 |
| **数据展示** | 基础数值显示 | 完整溯源+Tier徽章 | ⚠️ 较大差距 |
| **交互体验** | 静态表单 | 智能预填+实时计算+状态反馈 | ⚠️ 较大差距 |
| **信息架构** | 线性流程 | 分层+折叠+预览面板 | ⚠️ 中等差距 |

### 1.2 核心问题总结

**❌ 当前UI的主要问题：**

1. **缺少专业感标识**
   - 无数据溯源信息（Tier 1/2/3徽章）
   - 无数据来源标注
   - 无最后更新时间

2. **信息展示不完整**
   - Step 1缺少"数据可用性面板"
   - Step 2缺少M1-M8完整详情展示
   - 缺少公式可视化
   - 缺少参数说明与tooltip

3. **交互体验不足**
   - Step 1缺少跨境模式选择（直邮/海外仓/FBA）
   - Step 2缺少快速/专家模式切换UI
   - 缺少参数锁定/解锁交互
   - 缺少编辑状态的视觉反馈（preset/customizable/customized）

4. **视觉层级不清晰**
   - 缺少双阶段分组视觉（CAPEX vs OPEX）
   - 缺少成本预览面板（右侧sticky）
   - 缺少模块折叠/展开动画

5. **缺少智能元素**
   - 无AI推荐提示
   - 无智能优化建议
   - 无异常数据警告

---

## 二、Step-by-Step 改进清单

### Step 0: 项目基本信息

**状态**: ✅ 基本完成，小幅优化

| ID | 改进项 | 优先级 | 当前状态 | 目标状态 |
|----|--------|--------|---------|---------|
| S0.1 | 行业选择卡片视觉优化 | P2 | 简单按钮 | 大卡片+图标+行业说明 |
| S0.2 | 添加行业特色背景色 | P3 | 统一白色 | Pet=绿色系，Vape=紫色系 |

**预计工时**: 0.5h

---

### Step 1: 业务场景定义 ⭐ 核心改进

**状态**: ⚠️ 缺少关键功能

#### 1.1 产品基本参数区（当前已有，需优化）

| ID | 改进项 | 优先级 | 当前状态 | 目标状态 | 预计工时 |
|----|--------|--------|---------|---------|----------|
| S1.1 | 实时毛利率计算显示 | P1 | ✅已实现 | 保持 | 0h |
| S1.2 | 参数tooltip说明 | P2 | ❌缺失 | 每个输入框添加Info图标+tooltip | 1h |
| S1.3 | 输入验证即时反馈 | P1 | ✅已实现 | 保持 | 0h |

#### 1.2 目标市场选择（当前已有CountrySelector，需增强）

| ID | 改进项 | 优先级 | 当前状态 | 目标状态 | 预计工时 |
|----|--------|--------|---------|---------|----------|
| S1.4 | 国家选择器UI优化 | P2 | 基础列表 | 大洲分组+国旗+搜索 | 1h |
| S1.5 | **数据可用性面板** ⭐ | **P0** | **❌完全缺失** | **选择国家后立即显示M1-M8数据概览+Tier徽章** | **3h** |
| S1.6 | 国家对比快捷入口 | P3 | ❌缺失 | "对比其他市场"按钮 | 0.5h |

**数据可用性面板设计（S1.5 - 最重要）:**

```tsx
{selectedCountryData && (
  <Alert className="mt-4 bg-blue-50 border-blue-200">
    <AlertTitle>✅ {selectedCountryData.country_name_cn} 数据完整</AlertTitle>
    <AlertDescription>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="text-sm">
          <span className="font-medium">M1 市场准入:</span>
          <span className="ml-2">{selectedCountryData.m1_complexity}</span>
          <TierBadge tier={selectedCountryData.m1_data_source} className="ml-2" />
        </div>
        <div className="text-sm">
          <span className="font-medium">M4 关税:</span>
          <span className="ml-2">{(selectedCountryData.m4_effective_tariff_rate * 100).toFixed(1)}%</span>
          <TierBadge tier={selectedCountryData.m4_tariff_data_source} className="ml-2" />
        </div>
        <div className="text-sm">
          <span className="font-medium">M4 VAT:</span>
          <span className="ml-2">{(selectedCountryData.m4_vat_rate * 100).toFixed(1)}%</span>
          <TierBadge tier={selectedCountryData.m4_vat_data_source} className="ml-2" />
        </div>
        <div className="text-sm">
          <span className="font-medium">M5 配送:</span>
          <span className="ml-2">${selectedCountryData.m5_last_mile_delivery_usd}</span>
          <TierBadge tier={selectedCountryData.m5_data_source} className="ml-2" />
        </div>
        {/* 其他关键模块... */}
      </div>
      <p className="text-xs text-blue-600 mt-2">
        数据版本: {selectedCountryData.version} |
        更新时间: {selectedCountryData.m4_tariff_updated_at || '2025-Q1'}
      </p>
    </AlertDescription>
  </Alert>
)}
```

#### 1.3 销售渠道与跨境模式 ⭐ 关键缺失

| ID | 改进项 | 优先级 | 当前状态 | 目标状态 | 预计工时 |
|----|--------|--------|---------|---------|----------|
| S1.7 | 销售渠道选择UI | P1 | ✅已有ChannelCard | 优化：添加渠道特性说明 | 0.5h |
| S1.8 | **跨境模式选择** ⭐ | **P0** | **❌完全缺失** | **三选一：直邮/海外仓/FBA** | **2h** |
| S1.9 | 模式关联提示 | P1 | ❌缺失 | 选择FBA时自动提示"推荐Amazon FBA渠道" | 1h |

**跨境模式选择UI设计（S1.8）:**

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center gap-3">
      <Truck className="h-6 w-6 text-indigo-600" />
      <h3 className="text-xl font-semibold">跨境履约模式</h3>
    </div>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-4">
      <ModeCard
        mode="direct_mail"
        title="直邮模式"
        description="从中国直接发货，清关后配送"
        icon={<Package className="h-8 w-8" />}
        pros={["启动成本低", "库存压力小"]}
        cons={["物流时间长", "退货成本高"]}
        selected={formState.fulfillmentMode === 'direct_mail'}
        onClick={() => setFormState({...formState, fulfillmentMode: 'direct_mail'})}
      />
      <ModeCard
        mode="overseas_warehouse"
        title="海外仓模式"
        description="提前备货至海外仓，本地发货"
        icon={<Warehouse className="h-8 w-8" />}
        pros={["配送速度快", "用户体验好"]}
        cons={["需要资金投入", "库存管理复杂"]}
        selected={formState.fulfillmentMode === 'overseas_warehouse'}
        onClick={() => setFormState({...formState, fulfillmentMode: 'overseas_warehouse'})}
      />
      <ModeCard
        mode="fba"
        title="FBA模式"
        description="Amazon仓储物流全托管"
        icon={<AmazonLogo className="h-8 w-8" />}
        pros={["Prime配送", "仓储托管"]}
        cons={["费用较高", "依赖平台"]}
        selected={formState.fulfillmentMode === 'fba'}
        onClick={() => setFormState({...formState, fulfillmentMode: 'fba'})}
      />
    </div>
  </CardContent>
</Card>
```

**Step 1 总计工时**: 9h

---

### Step 2: 成本参数配置 ⭐⭐ 最核心改进

**状态**: ⚠️ 基础架构已有，但缺少完整M1-M8展示细节

#### 2.1 整体布局优化

| ID | 改进项 | 优先级 | 当前状态 | 目标状态 | 预计工时 |
|----|--------|--------|---------|---------|----------|
| S2.1 | 快速/专家模式切换Tab | P1 | ✅已实现 | 优化：添加模式说明tooltip | 0.5h |
| S2.2 | **右侧sticky预览面板** ⭐ | **P0** | **❌缺失** | **固定在右侧1/3，实时显示成本** | **2h** |
| S2.3 | 双阶段分组视觉 | P1 | ✅已有Card分组 | 优化：添加阶段标识背景色 | 0.5h |

**右侧预览面板设计（S2.2）:**

```tsx
{/* 右侧1/3：实时成本预览 - Sticky */}
<div className="col-span-1">
  <div className="sticky top-4 space-y-4">
    <Card className="border-2 border-blue-500 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          成本预览
        </CardTitle>
        <p className="text-xs text-gray-600">基于当前参数实时计算</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">单位收入</span>
          <span className="text-2xl font-bold text-gray-900">
            ${costPreview?.unit_economics.revenue.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">单位成本</span>
          <span className="text-2xl font-bold text-gray-900">
            ${costPreview?.unit_economics.cost.toFixed(2)}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">单位毛利</span>
          <span className={`text-3xl font-bold ${costPreview?.unit_economics.gross_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${costPreview?.unit_economics.gross_profit.toFixed(2)}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">毛利率</span>
            <span className={`text-lg font-bold ${costPreview?.unit_economics.gross_margin >= 30 ? 'text-green-600' : 'text-red-600'}`}>
              {costPreview?.unit_economics.gross_margin.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.max(0, costPreview?.unit_economics.gross_margin ?? 0)}
            className="h-2"
          />
          <p className="text-xs text-gray-500 mt-1">目标: 30%+</p>
        </div>

        {/* OPEX构成快览 */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700">OPEX构成：</p>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>M4 货物税费</span>
              <span className="font-medium">${(costPreview?.opex.m4_cogs + costPreview?.opex.m4_tariff + costPreview?.opex.m4_logistics + costPreview?.opex.m4_vat).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>M5 物流配送</span>
              <span className="font-medium">${(costPreview?.opex.m5_last_mile + costPreview?.opex.m5_return).toFixed(2)}</span>
            </div>
            {/* ... 其他模块 */}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* 警告提示 */}
    {costPreview?.warnings && costPreview.warnings.length > 0 && (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>成本预警</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside text-xs space-y-1">
            {costPreview.warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    )}
  </div>
</div>
```

#### 2.2 M1-M8模块完整展示 ⭐⭐ 最重要

**当前状态**: 基础折叠面板存在，但缺少详细字段展示

| ID | 改进项 | 优先级 | 当前状态 | 目标状态 | 预计工时 |
|----|--------|--------|---------|---------|----------|
| S2.4 | **M1模块完整展示** | P1 | ❌仅展示总计 | 16个字段完整展示+Tier徽章 | 3h |
| S2.5 | **M4模块完整展示** ⭐⭐ | **P0** | ❌仅基础字段 | **32个字段+物流计算器+公式可视化** | **5h** |
| S2.6 | **M5-M8模块展示** | P1 | ❌仅基础字段 | 60个字段完整展示 | 4h |
| S2.7 | 参数锁定/解锁交互 | P1 | ❌缺失 | 系统预设显示锁图标，点击解锁编辑 | 2h |
| S2.8 | 三种数据状态可视化 | P1 | ❌缺失 | preset灰色/customizable蓝色/customized绿色 | 2h |
| S2.9 | Tier徽章显示 | P0 | ✅已实现组件 | 需在每个参数旁显示 | 1h |
| S2.10 | 数据来源tooltip | P1 | ❌缺失 | hover显示完整来源+更新时间 | 2h |
| S2.11 | 公式可视化 | P2 | ❌缺失 | 关键计算显示公式（如M4 VAT计算） | 2h |

**M4模块详细展示示例（S2.5 - 最核心）:**

```tsx
<M4Module
  presetData={state.costFactor}
  userOverrides={state.userOverrides}
  scope={project.scope}
  expanded={state.expandedSections.m4}
  onToggle={() => toggleSection('m4')}
  onOverride={(field, value) => handleOverride(field, value)}
  mode={state.mode}
/>

// M4Module组件内部:
function M4Module({ presetData, userOverrides, scope, expanded, onToggle, onOverride, mode }) {
  const getEffectiveValue = (field) => userOverrides[field] ?? presetData[field];
  const isUserCustomized = (field) => field in userOverrides;

  // 物流方式选择（海运/空运）
  const [shippingMethod, setShippingMethod] = useState('air'); // 'sea' | 'air'

  // 解析物流JSON
  const logistics = useMemo(() => {
    try {
      return JSON.parse(getEffectiveValue('m4_logistics'));
    } catch {
      return { sea_freight: {usd_per_kg: 0}, air_freight: {usd_per_kg: 0} };
    }
  }, [getEffectiveValue('m4_logistics')]);

  // 计算物流成本
  const logisticsCost = useMemo(() => {
    const rate = shippingMethod === 'sea'
      ? logistics.sea_freight.usd_per_kg
      : logistics.air_freight.usd_per_kg;
    return rate * (scope.productWeightKg || 0);
  }, [shippingMethod, logistics, scope.productWeightKg]);

  // 计算关税
  const tariffRate = getEffectiveValue('m4_effective_tariff_rate');
  const tariffCost = (scope.cogsUsd || 0) * tariffRate;

  // 计算VAT
  const vatRate = getEffectiveValue('m4_vat_rate');
  const cifValue = (scope.cogsUsd || 0) + logisticsCost;
  const vatBase = cifValue + tariffCost;
  const vatCost = vatBase * vatRate;

  const m4Total = (scope.cogsUsd || 0) + logisticsCost + tariffCost + vatCost;

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
      {/* 模块头部 */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown className="h-5 w-5 text-blue-600" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
          <div>
            <h4 className="text-lg font-semibold text-gray-900">M4: 货物税费 (Goods & Tax)</h4>
            <p className="text-sm text-gray-600">COGS + 物流 + 关税 + VAT</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">${m4Total.toFixed(2)}</div>
          <div className="text-xs text-gray-500">USD/单位</div>
        </div>
      </div>

      {/* 模块详情 - 展开时显示 */}
      {expanded && (
        <div className="p-6 space-y-6 bg-white">
          {/* 1. COGS */}
          <ParameterField
            label="商品成本 (COGS)"
            value={scope.cogsUsd}
            unit="USD/单位"
            tier={presetData.m4_cogs_data_source}
            isCustomized={false} // COGS来自Step 1，不可在此修改
            locked={true}
            tooltip="商品采购成本，来自Step 1产品定义"
          />

          {/* 2. 物流费用（带计算器） */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-700" />
                <span className="font-medium text-gray-900">国际物流费用</span>
                <TierBadge tier={presetData.m4_logistics_data_source} />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">数据来源: {presetData.m4_logistics_data_source}</p>
                    <p className="text-xs">更新时间: {presetData.m4_logistics_updated_at || '2025-Q1'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* 物流方式选择 */}
            <Tabs value={shippingMethod} onValueChange={(v) => setShippingMethod(v as 'sea' | 'air')}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="sea" className="flex items-center gap-2">
                  <Ship className="h-4 w-4" />
                  海运
                </TabsTrigger>
                <TabsTrigger value="air" className="flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  空运
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* 物流费率与计算 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">
                  {shippingMethod === 'sea' ? '海运费率' : '空运费率'}
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    step="0.01"
                    value={shippingMethod === 'sea' ? logistics.sea_freight.usd_per_kg : logistics.air_freight.usd_per_kg}
                    onChange={(e) => {
                      const newLogistics = {...logistics};
                      if (shippingMethod === 'sea') {
                        newLogistics.sea_freight.usd_per_kg = parseFloat(e.target.value);
                      } else {
                        newLogistics.air_freight.usd_per_kg = parseFloat(e.target.value);
                      }
                      onOverride('m4_logistics', JSON.stringify(newLogistics));
                    }}
                    className={isUserCustomized('m4_logistics') ? 'border-green-500 bg-green-50' : 'border-gray-300'}
                  />
                  <span className="text-sm text-gray-600">USD/kg</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">产品重量</label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    value={scope.productWeightKg}
                    disabled
                    className="bg-gray-100"
                  />
                  <span className="text-sm text-gray-600">kg</span>
                </div>
              </div>
            </div>

            {/* 计算结果 */}
            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="text-xs text-gray-600 mb-2">计算公式:</div>
              <div className="text-sm font-mono text-gray-700 mb-3">
                {shippingMethod === 'sea' ? '海运费率' : '空运费率'} × 产品重量 =
                ${(shippingMethod === 'sea' ? logistics.sea_freight.usd_per_kg : logistics.air_freight.usd_per_kg).toFixed(2)} × {scope.productWeightKg}kg
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center font-semibold">
                <span>物流成本:</span>
                <span className="text-lg text-blue-600">${logisticsCost.toFixed(2)}/单位</span>
              </div>
            </div>
          </div>

          {/* 3. 关税 */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-700" />
                <span className="font-medium text-gray-900">进口关税</span>
                <TierBadge tier={presetData.m4_tariff_data_source} />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">数据来源: {presetData.m4_tariff_data_source}</p>
                    <p className="text-xs">HS编码: {presetData.m4_tariff_hs_code || 'N/A'}</p>
                    <p className="text-xs">更新时间: {presetData.m4_tariff_updated_at || '2025-Q1'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  有效关税税率
                  {!isUserCustomized('m4_effective_tariff_rate') && (
                    <Lock className="h-3 w-3 text-gray-400" />
                  )}
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    step="0.001"
                    value={(tariffRate * 100).toFixed(2)}
                    onChange={(e) => onOverride('m4_effective_tariff_rate', parseFloat(e.target.value) / 100)}
                    className={isUserCustomized('m4_effective_tariff_rate') ? 'border-green-500 bg-green-50' : 'border-gray-300'}
                  />
                  <span className="text-sm text-gray-600">%</span>
                  {!isUserCustomized('m4_effective_tariff_rate') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOverride('m4_effective_tariff_rate', tariffRate)}
                      className="h-8"
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded border p-3">
                <div className="text-xs text-gray-600 mb-1">计算公式:</div>
                <div className="text-sm font-mono text-gray-700 mb-2">
                  COGS × 关税税率
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-sm">关税成本:</span>
                  <span className="text-blue-600">${tariffCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {presetData.m4_tariff_notes && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-xs text-yellow-800">
                  {presetData.m4_tariff_notes}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* 4. VAT */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-gray-700" />
                <span className="font-medium text-gray-900">增值税 (VAT/GST)</span>
                <TierBadge tier={presetData.m4_vat_data_source} />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">数据来源: {presetData.m4_vat_data_source}</p>
                    <p className="text-xs">更新时间: {presetData.m4_vat_updated_at || '2025-Q1'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  VAT税率
                  {!isUserCustomized('m4_vat_rate') && (
                    <Lock className="h-3 w-3 text-gray-400" />
                  )}
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    step="0.01"
                    value={(vatRate * 100).toFixed(1)}
                    onChange={(e) => onOverride('m4_vat_rate', parseFloat(e.target.value) / 100)}
                    className={isUserCustomized('m4_vat_rate') ? 'border-green-500 bg-green-50' : 'border-gray-300'}
                  />
                  <span className="text-sm text-gray-600">%</span>
                  {!isUserCustomized('m4_vat_rate') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOverride('m4_vat_rate', vatRate)}
                      className="h-8"
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded border p-3">
                <div className="text-xs text-gray-600 mb-1">计算公式:</div>
                <div className="text-sm font-mono text-gray-700 mb-2">
                  (COGS + 物流 + 关税) × VAT税率
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CIF Value:</span>
                    <span className="font-medium">${cifValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">+ 关税:</span>
                    <span className="font-medium">${tariffCost.toFixed(2)}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between font-semibold">
                    <span>VAT成本:</span>
                    <span className="text-blue-600">${vatCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {presetData.m4_vat_notes && (
              <div className="text-xs text-gray-600 bg-white rounded p-2">
                备注: {presetData.m4_vat_notes}
              </div>
            )}
          </div>

          {/* M4总计 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">M4 货物税费总计</div>
                <div className="text-xs text-gray-500 mt-1">
                  COGS + 物流 + 关税 + VAT
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  ${m4Total.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">USD/单位</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### 2.3 专家模式增强

| ID | 改进项 | 优先级 | 当前状态 | 目标状态 | 预计工时 |
|----|--------|--------|---------|---------|----------|
| S2.12 | 专家模式完整字段展开 | P1 | ❌仅部分字段 | 所有127个字段可编辑 | 2h |
| S2.13 | 批量重置功能 | P2 | ❌缺失 | "重置所有为系统预设"按钮 | 1h |
| S2.14 | 数据导入/导出 | P3 | ❌缺失 | JSON格式导入导出用户覆盖值 | 2h |

**Step 2 总计工时**: 29.5h

---

### Step 3: 成本建模结果

**状态**: ✅ 基本完成，小幅优化

| ID | 改进项 | 优先级 | 当前状态 | 目标状态 | 预计工时 |
|----|--------|--------|---------|---------|----------|
| S3.1 | KPI卡片视觉优化 | P2 | ✅基本完成 | 添加趋势箭头+色彩分级 | 1h |
| S3.2 | 图表交互优化 | P2 | 静态图表 | 添加hover tooltip+点击钻取 | 2h |
| S3.3 | 盈亏平衡分析可视化 | P2 | 文字说明 | 添加交互式图表 | 2h |
| S3.4 | 敏感性分析（未来） | P3 | ❌缺失 | "如果定价提高10%，毛利率变化" | 4h |

**Step 3 总计工时**: 5h（P1-P2优先级）

---

### Step 4: 场景对比分析

**状态**: ✅ 基本完成，增强交互

| ID | 改进项 | 优先级 | 当前状态 | 目标状态 | 预计工时 |
|----|--------|--------|---------|---------|----------|
| S4.1 | 19国快速对比选择器 | P1 | ❌缺失 | 一键添加"东南亚5国"等预设组 | 2h |
| S4.2 | 对比表格视觉优化 | P2 | 基础表格 | 添加色彩编码+最优/最差标识 | 1h |
| S4.3 | 智能推荐算法 | P1 | ❌缺失 | 基于毛利率/ROI/市场规模推荐Top 3 | 3h |
| S4.4 | 导出对比报告 | P2 | ❌缺失 | Excel格式导出对比表 | 2h |

**Step 4 总计工时**: 6h（P1优先级）

---

### Step 5: AI智能助手

**状态**: ✅ 基本完成，待增强工具调用

| ID | 改进项 | 优先级 | 当前状态 | 目标状态 | 预计工时 |
|----|--------|--------|---------|---------|----------|
| S5.1 | DeepSeek工具调用集成 | P1 | ❌缺失 | 3个工具：成本查询/场景对比/优化建议 | 4h |
| S5.2 | 聊天界面优化 | P2 | ✅基本完成 | 添加Markdown渲染+代码高亮 | 1h |
| S5.3 | 快捷问题模板 | P1 | ❌缺失 | 4-6个常见问题按钮 | 1h |
| S5.4 | AI生成报告预览 | P2 | ❌缺失 | 显示生成的Word报告大纲 | 2h |

**Step 5 总计工时**: 6h（P1优先级）

---

## 三、视觉设计系统优化

### 3.1 Liquid Glass设计语言统一

| ID | 改进项 | 优先级 | 预计工时 |
|----|--------|--------|----------|
| V1 | 毛玻璃效果应用（backdrop-blur-xl） | P2 | 2h |
| V2 | 渐变背景统一（from-blue-50 to-indigo-50） | P2 | 1h |
| V3 | 阴影层级规范（4级阴影系统） | P2 | 1h |
| V4 | 圆角统一（12px标准） | P3 | 0.5h |
| V5 | 间距系统规范（4/8/12/16/24/32px） | P3 | 1h |

**视觉优化总计**: 5.5h

### 3.2 交互动画优化

| ID | 改进项 | 优先级 | 预计工时 |
|----|--------|--------|----------|
| A1 | 页面切换过渡动画（fade-in） | P2 | 1h |
| A2 | 折叠面板展开动画（smooth height transition） | P1 | 1h |
| A3 | 数值变化动画（CountUp effect） | P2 | 2h |
| A4 | Hover状态统一（scale-105 + shadow-lg） | P2 | 1h |
| A5 | Loading状态骨架屏 | P1 | 2h |

**交互优化总计**: 7h

---

## 四、总工时估算与优先级排序

### 4.1 按优先级汇总

| 优先级 | 改进项数量 | 总工时 | 关键改进 |
|-------|-----------|--------|---------|
| **P0（必须）** | 5项 | **15h** | S1.5数据可用性, S1.8跨境模式, S2.2预览面板, S2.5 M4展示, S2.9 Tier徽章 |
| **P1（重要）** | 18项 | **34h** | M1-M8完整展示, 参数锁定, 智能推荐 |
| **P2（优化）** | 15项 | **21h** | 视觉优化, 交互动画, tooltip |
| **P3（未来）** | 5项 | **8h** | 批量导入导出, 敏感性分析 |
| **总计** | **43项** | **78h** | **约10个工作日** |

### 4.2 分阶段实施计划

#### 阶段1：核心功能完善（P0优先级，2天）

```
Day 1: Step 1关键缺失
- S1.5 数据可用性面板（3h）⭐⭐⭐
- S1.8 跨境模式选择（2h）⭐⭐⭐
- S2.2 右侧预览面板（2h）⭐⭐⭐

Day 2: Step 2 M4核心
- S2.5 M4模块完整展示（5h）⭐⭐⭐
- S2.9 Tier徽章显示（1h）⭐⭐⭐
```

**预期成果**: 解决用户反馈的"不像真正产品"核心问题

#### 阶段2：M1-M8完整展示（P1优先级，3天）

```
Day 3-4: CAPEX模块
- S2.4 M1模块完整展示（3h）
- M2/M3模块展示（各2h）
- S2.7 参数锁定交互（2h）

Day 5: OPEX模块
- S2.6 M5-M8模块展示（4h）
- S2.8 三种数据状态可视化（2h）
```

#### 阶段3：专业化提升（P1+P2，3天）

```
Day 6-7: 数据溯源与交互
- S2.10 数据来源tooltip（2h）
- S2.11 公式可视化（2h）
- A2 折叠面板动画（1h）
- A5 Loading骨架屏（2h）

Day 8: Step 4-5增强
- S4.3 智能推荐算法（3h）
- S5.1 AI工具调用（4h）
```

#### 阶段4：视觉打磨（P2优先级，2天）

```
Day 9-10: 视觉系统
- V1-V5 Liquid Glass统一（5.5h）
- A1/A3/A4 交互动画（4h）
- S3.1-S3.3 图表优化（5h）
```

---

## 五、实施细节与注意事项

### 5.1 开发规范

1. **组件拆分原则**
   - M1-M8每个模块独立组件（`M1Module.tsx`, `M4Module.tsx`, ...）
   - 数据状态管理统一（使用`CostParamsState`）
   - 实时计算节流（300ms throttle）

2. **数据流规范**
   - 系统预设：从`costFactor`读取
   - 用户覆盖：存储在`userOverrides`
   - 有效值：`getEffectiveValue(field) = userOverrides[field] ?? costFactor[field]`

3. **样式规范**
   - Tailwind CSS优先
   - 组件库：shadcn/ui
   - 自定义样式：CSS Modules（必要时）

### 5.2 测试策略

1. **单元测试**
   - GECOM引擎计算正确性
   - 数据合并逻辑（userOverrides + presets）

2. **集成测试**
   - Step 1 → Step 2数据传递
   - 实时计算触发

3. **E2E测试（Playwright）**
   - 完整向导流程
   - 截图对比（Step 0-5）
   - 性能测试（加载<3s）

### 5.3 性能优化

1. **实时计算优化**
   - 使用`useRef`存储引擎实例，避免重复创建
   - 300ms节流，避免频繁计算
   - `useMemo`缓存复杂计算

2. **渲染优化**
   - 折叠面板延迟渲染（`expanded`时才渲染详情）
   - 虚拟滚动（19国列表）
   - 图表懒加载

### 5.4 数据溯源显示规范

**Tier徽章颜色标准**:
```tsx
Tier 1 (Official 100%):
  - bg-green-100 text-green-700 border-green-300
  - 示例：中国海关官网、美国ITC数据库

Tier 2 (Authoritative 90%):
  - bg-yellow-100 text-yellow-700 border-yellow-300
  - 示例：Statista, Euromonitor, McKinsey报告

Tier 3 (Estimated 80%):
  - bg-gray-100 text-gray-700 border-gray-300
  - 示例：行业专家估算、类比推算
```

**数据来源Tooltip格式**:
```tsx
<TooltipContent>
  <p className="text-xs font-medium">数据来源</p>
  <p className="text-xs">{dataSource}</p>
  <Separator className="my-1" />
  <p className="text-xs text-gray-500">更新时间: {updatedAt}</p>
  <p className="text-xs text-gray-500">数据质量: {tier}</p>
</TooltipContent>
```

---

## 六、验收标准

### 6.1 功能完整性

- [ ] Step 1显示完整数据可用性面板（含M1-M8概览+Tier徽章）
- [ ] Step 1提供跨境模式三选一（直邮/海外仓/FBA）
- [ ] Step 2右侧实时预览面板sticky展示
- [ ] Step 2 M1-M8模块完整展示（127个字段可见/可编辑）
- [ ] Step 2每个参数显示Tier徽章+数据来源tooltip
- [ ] Step 2参数锁定/解锁交互完整
- [ ] Step 2三种数据状态可视化（preset灰/customizable蓝/customized绿）
- [ ] Step 3-5基本功能保持完整

### 6.2 视觉质量

- [ ] Liquid Glass设计语言统一应用
- [ ] 毛玻璃效果、渐变背景、阴影层级一致
- [ ] 折叠面板展开动画流畅（<300ms）
- [ ] Hover状态统一（scale + shadow）
- [ ] Loading状态有骨架屏

### 6.3 性能指标

- [ ] 首屏加载 <3s（Lighthouse Performance >90）
- [ ] 实时计算响应 <500ms（含300ms节流）
- [ ] 页面切换流畅（60fps）
- [ ] 无明显卡顿或白屏

### 6.4 专业度验收

- [ ] 与竞品（sellersprite）对比，专业度持平或超越
- [ ] 数据溯源信息完整，可信度高
- [ ] 无明显"demo感"，具备产品级品质
- [ ] 符合MVP 2.0详细规划的完整设计意图

---

## 七、风险与应对

### 7.1 技术风险

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 实时计算性能问题 | 高 | 使用Web Worker后台计算（如需） |
| 127个字段UI复杂度 | 中 | 采用虚拟滚动+按需渲染 |
| Appwrite数据加载慢 | 中 | 添加缓存层+Loading状态 |

### 7.2 时间风险

| 风险 | 应对措施 |
|------|---------|
| 工时估算偏差 | 优先完成P0/P1，P2/P3可推迟 |
| 突发需求变更 | 每阶段结束验收，及时调整 |

---

## 八、后续优化方向（MVP 3.0）

1. **AI深度集成**
   - DeepSeek R1推理对话
   - 自动生成30,000字专业报告
   - 智能参数调优建议

2. **19国并行对比**
   - 一键对比"全球Top 10市场"
   - 交互式地图可视化
   - 最优市场路线图

3. **历史项目管理**
   - Appwrite Auth用户系统
   - 项目保存/加载/分享
   - 版本对比（参数变化追踪）

4. **高级分析功能**
   - 敏感性分析（What-if场景）
   - 蒙特卡洛模拟（风险评估）
   - 时间序列预测（汇率/关税）

---

**文档状态**: ✅ 已完成
**下一步**: 开始阶段1实施（P0优先级，预计2天）
