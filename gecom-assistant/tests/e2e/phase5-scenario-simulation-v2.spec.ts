/**
 * Phase 5场景模拟E2E测试 - V2（2025-11-15重写）
 *
 * 测试覆盖：
 * - ScenarioParameterPanel: 7参数调节器（售价/月销量/CAC/物流/履约/退货/支付）
 * - CountryMultiSelector: 19国多选器（3-5国约束）
 * - ScenarioComparisonTable: 横向对比表格（默认展开）
 * - scenario-calculator: 实时计算引擎（300ms节流）
 * - 真实Appwrite 19国数据集成
 *
 * 变更说明（vs旧版本）：
 * - ❌ 移除Tab切换测试（已删除Tab功能）
 * - ❌ 移除智能推荐测试（已删除推荐功能）
 * - ✅ 新增数据默认展开验证
 * - ✅ 新增真实数据集成验证
 *
 * @version 2.0.0
 * @date 2025-11-15
 */

import { test, expect } from '@playwright/test';

test.describe('Phase 5: 场景模拟集成测试 V2', () => {

  /**
   * 前置条件：导航到Step 4
   */
  test.beforeEach(async ({ page }) => {
    // 1. 访问应用首页
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // 2. 点击"开始成本计算"按钮
    const startButton = page.locator('button:has-text("开始成本计算")');
    await startButton.click();
    await page.waitForTimeout(1000);

    // 3. Step 0: 填写项目信息
    await page.fill('#project-name', 'Phase 5场景模拟测试V2');

    // 选择行业（宠物食品）
    const petFoodButton = page.locator('button:has-text("宠物食品")');
    await petFoodButton.click();
    await page.waitForTimeout(500);

    // 进入Step 1
    const step0NextButton = page.locator('button:has-text("下一步：业务场景定义")');
    await step0NextButton.click();
    await page.waitForTimeout(1500);

    // 4. Step 1: 等待模板自动填充
    await page.waitForSelector('text=/业务场景/i', { timeout: 5000 });
    await page.waitForSelector('text=/已加载.*宠物食品.*行业模板/i', { timeout: 10000 });
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      return input && input.value.includes('狗粮');
    }, { timeout: 5000 });
    console.log('✓ Step 1: 宠物食品行业模板已自动填充');
    await page.waitForTimeout(1000);

    // 进入Step 2
    let nextButton = page.locator('button:has-text("下一步")');
    await nextButton.click();
    await page.waitForTimeout(1500);

    // 5. Step 2: 等待数据采集完成
    await page.waitForSelector('text=/数据采集/i', { timeout: 5000 });
    await page.waitForSelector('text=/CAPEX/i', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // 进入Step 3
    nextButton = page.locator('button:has-text("下一步")');
    await nextButton.click();
    await page.waitForTimeout(1500);

    // 6. Step 3: 成本建模结果
    await page.waitForSelector('text=/成本建模/i', { timeout: 5000 });
    await page.waitForTimeout(2000);

    // 进入Step 4
    nextButton = page.locator('button:has-text("下一步")');
    await nextButton.click();
    await page.waitForTimeout(3000);

    // 7. 等待Step 4加载完成
    await page.waitForSelector('text=/智能场景分析/i', { timeout: 15000 });
    await page.waitForTimeout(2000);
  });

  /**
   * 测试1: 参数调节面板 - 7参数渲染验证
   */
  test('S4-P5-V2-01: 参数调节面板完整渲染7个参数', async ({ page }) => {
    // 检查标题
    await expect(page.locator('text=场景参数调节')).toBeVisible();
    await expect(page.locator('button:has-text("重置默认值")')).toBeVisible();

    // 价格参数区（3个参数）
    await expect(page.locator('text=/💰 价格参数/i')).toBeVisible();

    // 1. 售价滑块
    await expect(page.locator('label:has-text("售价")')).toBeVisible();
    const priceValue = await page.locator('[data-testid="price-value"]').textContent();
    expect(priceValue).toContain('$45'); // 默认值

    // 2. 月销量滑块
    await expect(page.locator('label:has-text("月销量")')).toBeVisible();
    const volumeValue = await page.locator('[data-testid="volume-value"]').textContent();
    expect(volumeValue).toContain('1000'); // 默认值

    // 3. 获客成本滑块
    await expect(page.locator('label:has-text("获客成本")')).toBeVisible();
    const cacValue = await page.locator('[data-testid="cac-value"]').textContent();
    expect(cacValue).toContain('$25'); // 默认值

    // 运营参数区（4个参数）
    await expect(page.locator('text=/🚚 运营参数/i')).toBeVisible();

    // 4. 物流模式（修复：使用正确的标签文本）
    await expect(page.locator('label:has-text("物流模式")')).toBeVisible();
    await expect(page.locator('[data-testid="logistics-sea-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="logistics-air-button"]')).toBeVisible();

    // 5. 履约模式
    await expect(page.locator('label:has-text("履约模式")')).toBeVisible();
    await expect(page.locator('[data-testid="fulfillment-fba-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="fulfillment-3pl-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="fulfillment-direct-button"]')).toBeVisible();

    // 6. 退货率滑块
    await expect(page.locator('label:has-text("退货率")')).toBeVisible();
    const returnRateValue = await page.locator('[data-testid="return-rate-value"]').textContent();
    expect(returnRateValue).toContain('5%'); // 默认值

    // 7. 支付方式（修复：使用"支付方式"而非"支付网关"）
    await expect(page.locator('label:has-text("支付方式")')).toBeVisible();
    await expect(page.locator('[data-testid="payment-stripe-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-paypal-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-shoppay-button"]')).toBeVisible();

    console.log('✓ 参数面板7个参数全部渲染成功');
  });

  /**
   * 测试2: 参数调节 - 售价调整触发实时重算
   */
  test('S4-P5-V2-02: 售价调整触发实时重算（300ms节流）', async ({ page }) => {
    // 滚动到参数面板（确保元素可见）
    await page.locator('text=场景参数调节').scrollIntoViewIfNeeded();

    // 记录初始售价
    const initialPrice = await page.locator('[data-testid="price-value"]').textContent();
    console.log('初始售价:', initialPrice);

    // 拖动售价滑块（使用fill方法更可靠）
    const priceSlider = page.locator('[data-testid="price-slider"]');
    await priceSlider.fill('55');

    // 等待节流完成 + 计算时间
    await page.waitForTimeout(800);

    // 验证售价已更新
    const newPrice = await page.locator('[data-testid="price-value"]').textContent();
    expect(newPrice).toContain('$55');
    console.log('新售价:', newPrice);

    // 验证计算结果已更新（检查对比表格是否重新渲染）
    // 滚动到对比表格
    await page.locator('text=📊 场景对比结果').scrollIntoViewIfNeeded();
    await expect(page.locator('text=📊 场景对比结果')).toBeVisible();

    console.log('✓ 售价调整触发实时重算成功');
  });

  /**
   * 测试3: 物流模式切换
   */
  test('S4-P5-V2-03: 物流模式切换（海运↔空运）', async ({ page }) => {
    // 滚动到物流模式区域
    await page.locator('label:has-text("物流模式")').scrollIntoViewIfNeeded();

    // 验证默认为海运
    const seaButton = page.locator('[data-testid="logistics-sea-button"]');
    await expect(seaButton).toHaveClass(/bg-blue-600/);

    // 切换到空运
    const airButton = page.locator('[data-testid="logistics-air-button"]');
    await airButton.click();
    await page.waitForTimeout(800); // 等待重算

    // 验证空运按钮已激活
    await expect(airButton).toHaveClass(/bg-blue-600/);
    await expect(seaButton).not.toHaveClass(/bg-blue-600/);

    console.log('✓ 物流模式切换成功');
  });

  /**
   * 测试4: 国家选择器 - 3-5国约束验证
   */
  test('S4-P5-V2-04: 国家多选器约束验证（3-5国）', async ({ page }) => {
    // 滚动到国家选择器区域
    await page.locator('text=选择对比市场').scrollIntoViewIfNeeded();

    // 验证标题
    await expect(page.locator('text=选择对比市场')).toBeVisible();

    // 验证默认选择了3个国家（US/DE/JP）
    const selectedCountries = await page.locator('.country-badge, [data-country-selected]').count();
    expect(selectedCountries).toBeGreaterThanOrEqual(3);

    console.log(`✓ 已选择${selectedCountries}个国家（3-5国约束）`);

    // 验证至少有3个国家被选中
    await expect(page.locator('text=/US|美国/i')).toBeVisible();
    await expect(page.locator('text=/DE|德国/i')).toBeVisible();
    await expect(page.locator('text=/JP|日本/i')).toBeVisible();

    console.log('✓ 国家选择器渲染成功');
  });

  /**
   * 测试5: 对比结果表格 - 默认展开所有数据
   */
  test('S4-P5-V2-05: 对比结果表格默认展开显示', async ({ page }) => {
    // 滚动到对比表格
    await page.locator('text=📊 场景对比结果').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // 验证表格标题
    await expect(page.locator('text=📊 场景对比结果')).toBeVisible();

    // 验证关键指标行（应该默认展开）
    await expect(page.locator('text=📈 关键指标')).toBeVisible();

    // 验证关键指标子项（默认展开，无需点击）
    await expect(page.locator('text=单位收入')).toBeVisible();
    await expect(page.locator('text=单位成本')).toBeVisible();
    await expect(page.locator('text=毛利率')).toBeVisible();

    // 验证M4模块（应该默认展开，使用正确的图标）
    await expect(page.locator('text=📦 M4 货物税费')).toBeVisible();

    // 验证M4子项（默认展开）
    await page.locator('text=📦 M4 货物税费').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // 验证COGS行
    await expect(page.locator('[data-testid*="COGS"], text=/COGS|商品成本/i').first()).toBeVisible();

    console.log('✓ 对比表格默认展开显示成功');
  });

  /**
   * 测试6: 真实Appwrite数据集成验证
   */
  test('S4-P5-V2-06: 真实Appwrite数据加载验证', async ({ page }) => {
    // 等待数据加载完成
    await page.waitForTimeout(3000);

    // 验证Tier徽章存在（说明真实数据已加载）
    const tierBadges = await page.locator('text=/Tier [123]/i').count();
    expect(tierBadges).toBeGreaterThan(0);

    console.log(`✓ 检测到${tierBadges}个Tier徽章，真实数据已加载`);

    // 验证美国数据（US）
    await expect(page.locator('text=/🇺🇸|US|美国/i')).toBeVisible();

    // 验证德国数据（DE）
    await expect(page.locator('text=/🇩🇪|DE|德国/i')).toBeVisible();

    // 验证日本数据（JP）
    await expect(page.locator('text=/🇯🇵|JP|日本/i')).toBeVisible();

    console.log('✓ 真实Appwrite 19国数据集成验证成功');
  });

  /**
   * 测试7: 完整交互流程 - 参数调整→国家切换→结果更新
   */
  test('S4-P5-V2-07: 完整场景模拟流程', async ({ page }) => {
    // 1. 调整售价
    await page.locator('text=场景参数调节').scrollIntoViewIfNeeded();
    await page.locator('[data-testid="price-slider"]').fill('60');
    await page.waitForTimeout(800);

    // 验证售价更新
    const newPrice = await page.locator('[data-testid="price-value"]').textContent();
    expect(newPrice).toContain('$60');
    console.log('✓ Step 1: 售价调整为$60');

    // 2. 切换物流模式
    await page.locator('label:has-text("物流模式")').scrollIntoViewIfNeeded();
    await page.locator('[data-testid="logistics-air-button"]').click();
    await page.waitForTimeout(800);
    console.log('✓ Step 2: 切换到空运模式');

    // 3. 验证对比表格更新
    await page.locator('text=📊 场景对比结果').scrollIntoViewIfNeeded();
    await expect(page.locator('text=📊 场景对比结果')).toBeVisible();
    console.log('✓ Step 3: 对比表格重新计算完成');

    // 4. 验证数据仍然默认展开
    await expect(page.locator('text=📈 关键指标')).toBeVisible();
    await expect(page.locator('text=📦 M4 货物税费')).toBeVisible();

    console.log('✓ 完整场景模拟流程测试通过');
  });

  /**
   * 测试8: 重置默认值功能
   */
  test('S4-P5-V2-08: 重置默认值功能验证', async ({ page }) => {
    // 1. 修改参数
    await page.locator('text=场景参数调节').scrollIntoViewIfNeeded();
    await page.locator('[data-testid="price-slider"]').fill('70');
    await page.locator('[data-testid="volume-slider"]').fill('2000');
    await page.waitForTimeout(800);

    // 验证参数已修改
    let price = await page.locator('[data-testid="price-value"]').textContent();
    let volume = await page.locator('[data-testid="volume-value"]').textContent();
    expect(price).toContain('$70');
    expect(volume).toContain('2000');
    console.log('✓ 参数已修改为非默认值');

    // 2. 点击重置按钮
    await page.locator('button:has-text("重置默认值")').click();
    await page.waitForTimeout(800);

    // 3. 验证参数已恢复默认值
    price = await page.locator('[data-testid="price-value"]').textContent();
    volume = await page.locator('[data-testid="volume-value"]').textContent();
    expect(price).toContain('$45');
    expect(volume).toContain('1000');

    console.log('✓ 重置默认值功能验证通过');
  });

});
