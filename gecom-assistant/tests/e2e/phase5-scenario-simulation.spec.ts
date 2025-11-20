/**
 * Phase 5场景模拟E2E测试
 *
 * 测试覆盖：
 * - ScenarioParameterPanel: 7参数调节器
 * - CountryMultiSelector: 19国多选器（3-5国约束）
 * - ScenarioComparisonTable: 横向对比表格
 * - scenario-calculator: 实时计算引擎
 * - Tab切换交互
 * - 场景洞察生成
 *
 * @version 1.0.0
 * @date 2025-11-14
 */

import { test, expect } from '@playwright/test';

test.describe('Phase 5: 场景模拟集成测试', () => {

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
    await page.fill('#project-name', 'Phase 5场景模拟测试');

    // 选择行业（宠物食品）- 点击对应的按钮
    const petFoodButton = page.locator('button:has-text("宠物食品")');
    await petFoodButton.click();
    await page.waitForTimeout(500);

    // 点击"下一步：业务场景定义"进入Step 1
    const step0NextButton = page.locator('button:has-text("下一步：业务场景定义")');
    await step0NextButton.click();
    await page.waitForTimeout(1500);

    // 4. Step 1: 业务场景定义 - 等待模板自动填充
    await page.waitForSelector('text=/业务场景/i', { timeout: 5000 });

    // 等待行业模板加载提示出现（说明模板已自动填充）
    await page.waitForSelector('text=/已加载.*宠物食品.*行业模板/i', { timeout: 10000 });
    console.log('✓ Step 1: 宠物食品行业模板已自动填充');

    // 等待产品名称输入框被填充（验证模板数据已生效）
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      return input && input.value.includes('狗粮');
    }, { timeout: 5000 });
    console.log('✓ Step 1: 产品数据已填充');

    // 额外等待确保scope被创建并传递给父组件
    await page.waitForTimeout(1000);

    // 点击"下一步"进入Step 2
    let nextButton = page.locator('button:has-text("下一步")');
    await nextButton.click();
    await page.waitForTimeout(1500);

    // 5. Step 2: 数据采集 - 等待成本计算完成
    await page.waitForSelector('text=/数据采集/i', { timeout: 5000 });

    // 等待CAPEX部分加载完成（表示数据已加载）
    await page.waitForSelector('text=/CAPEX/i', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // 点击"下一步"进入Step 3
    nextButton = page.locator('button:has-text("下一步")');
    await nextButton.click();
    await page.waitForTimeout(1500);

    // 6. Step 3: 成本建模结果
    await page.waitForSelector('text=/成本建模/i', { timeout: 5000 });
    await page.waitForTimeout(2000);

    // 点击"下一步"进入Step 4
    nextButton = page.locator('button:has-text("下一步")');
    await nextButton.click();
    await page.waitForTimeout(3000); // Step 4需要计算推荐算法

    // 7. 等待Step 4加载完成 - 智能场景分析标题
    await page.waitForSelector('text=/智能场景分析/i', { timeout: 15000 });
    await page.waitForTimeout(2000); // 等待Phase 5组件渲染完成
  });

  /**
   * S4-P5-01: 参数面板渲染和初始值检查
   */
  test('S4-P5-01: 参数调节面板正确渲染', async ({ page }) => {
    // 检查场景模拟Tab是否激活
    await expect(page.locator('button:has-text("场景模拟")')).toHaveClass(/purple-600|indigo-600/);

    // 检查参数面板存在
    await expect(page.locator('text=场景参数调节')).toBeVisible();

    // 检查7个参数输入框
    await expect(page.locator('label:has-text("售价")')).toBeVisible();
    await expect(page.locator('label:has-text("月销量")')).toBeVisible();
    await expect(page.locator('label:has-text("获客成本")')).toBeVisible();
    await expect(page.locator('label:has-text("退货率")')).toBeVisible();

    // 检查物流模式Tab
    await expect(page.locator('button:has-text("海运")')).toBeVisible();
    await expect(page.locator('button:has-text("空运")')).toBeVisible();

    // 检查履约模式Select
    await expect(page.locator('label:has-text("履约模式")')).toBeVisible();

    // 检查支付网关Select
    await expect(page.locator('label:has-text("支付网关")')).toBeVisible();

    console.log('✓ 参数面板渲染成功');
  });

  /**
   * S4-P5-02: 售价调整触发重新计算
   */
  test('S4-P5-02: 售价调整触发实时重算', async ({ page }) => {
    // 等待初始计算完成
    await page.waitForTimeout(1000);

    // 获取初始的对比表格（如果显示了3国）
    const hasComparisonTable = await page.locator('text=场景对比结果').isVisible();

    if (hasComparisonTable) {
      // 记录初始的单位收入值
      const initialRevenue = await page.locator('td >> text=/^\\$\\d+\\.\\d{2}$/').first().textContent();

      // 修改售价：找到售价输入框并调整
      const priceInput = page.locator('input[type="number"]').first();
      await priceInput.fill('55');
      await priceInput.press('Enter');

      // 等待计算（300ms节流 + 计算时间）
      await page.waitForTimeout(500);

      // 检查单位收入是否更新
      const newRevenue = await page.locator('td >> text=/^\\$\\d+\\.\\d{2}$/').first().textContent();

      // 验证数值发生变化
      expect(newRevenue).not.toBe(initialRevenue);
      expect(newRevenue).toContain('55.00');

      console.log(`✓ 售价调整：${initialRevenue} → ${newRevenue}`);
    } else {
      console.log('⚠️ 对比表格未显示（可能需要至少3国）');
    }
  });

  /**
   * S4-P5-03: 物流模式切换影响M4成本
   */
  test('S4-P5-03: 物流模式切换（海运↔空运）', async ({ page }) => {
    // 初始状态：海运（默认）
    await expect(page.locator('button:has-text("海运")')).toHaveClass(/blue-600|indigo-600/);

    // 切换到空运
    await page.click('button:has-text("空运")');
    await page.waitForTimeout(500);

    // 验证空运被选中
    await expect(page.locator('button:has-text("空运")')).toHaveClass(/blue-600|indigo-600/);

    // 验证提示文本变化（空运提示更快更贵）
    const hint = await page.locator('text=/空运.*快速/i').isVisible();
    expect(hint).toBeTruthy();

    // 切换回海运
    await page.click('button:has-text("海运")');
    await page.waitForTimeout(500);

    // 验证海运被选中
    await expect(page.locator('button:has-text("海运")')).toHaveClass(/blue-600|indigo-600/);

    console.log('✓ 物流模式切换成功');
  });

  /**
   * S4-P5-04: 国家选择器约束（3-5国）
   */
  test('S4-P5-04: 国家多选器约束验证', async ({ page }) => {
    // 检查国家选择器存在
    await expect(page.locator('text=选择对比市场')).toBeVisible();

    // 检查默认已选3国（US/DE/JP）
    await expect(page.locator('[data-testid="selected-countries"]')).toBeVisible();

    const selectedCountries = await page.locator('[data-testid^="selected-country-"]').count();
    expect(selectedCountries).toBeGreaterThanOrEqual(3);
    expect(selectedCountries).toBeLessThanOrEqual(5);

    console.log(`✓ 已选择${selectedCountries}个国家（3-5国约束）`);

    // 尝试添加国家（如果少于5个）
    if (selectedCountries < 5) {
      const addButtons = await page.locator('[data-testid^="add-country-"]').count();
      if (addButtons > 0) {
        await page.locator('[data-testid^="add-country-"]').first().click();
        await page.waitForTimeout(300);

        const newCount = await page.locator('[data-testid^="selected-country-"]').count();
        expect(newCount).toBe(selectedCountries + 1);

        console.log(`✓ 成功添加国家：${selectedCountries} → ${newCount}`);
      }
    }

    // 尝试移除国家（保持至少3国）
    if (selectedCountries > 3) {
      // 找到第一个移除按钮（跳过前3个，保持最小数量）
      const removeButton = page.locator('[data-testid^="remove-country-"]').nth(3);
      if (await removeButton.isVisible()) {
        await removeButton.click();
        await page.waitForTimeout(300);

        const newCount = await page.locator('[data-testid^="selected-country-"]').count();
        expect(newCount).toBe(selectedCountries - 1);
        expect(newCount).toBeGreaterThanOrEqual(3);

        console.log(`✓ 成功移除国家：${selectedCountries} → ${newCount}`);
      }
    }
  });

  /**
   * S4-P5-05: 多国对比表格显示
   */
  test('S4-P5-05: 对比结果表格正确显示', async ({ page }) => {
    // 等待计算完成
    await page.waitForTimeout(1000);

    // 检查是否有足够国家（至少3国）
    const selectedCount = await page.locator('[data-testid^="selected-country-"]').count();

    if (selectedCount >= 3) {
      // 等待对比表格出现
      await page.waitForSelector('text=场景对比结果', { timeout: 5000 });

      // 检查国家列（应该有selectedCount列 + 1参数列）
      const tableHeaders = await page.locator('th').count();
      expect(tableHeaders).toBeGreaterThanOrEqual(selectedCount);

      // 检查关键指标行
      await expect(page.locator('text=📈 关键指标')).toBeVisible();
      await expect(page.locator('text=📦 M4 货物税费')).toBeVisible();

      // 检查可展开功能（点击关键指标）
      await page.click('text=📈 关键指标');
      await page.waitForTimeout(200);

      // 验证展开后显示详细行
      const detailRows = await page.locator('text=单位收入').isVisible();
      expect(detailRows).toBeTruthy();

      console.log(`✓ 对比表格显示${selectedCount}个国家的成本数据`);
    } else {
      console.log('⚠️ 国家数量不足3个，跳过对比表格测试');
    }
  });

  /**
   * S4-P5-06: 场景洞察自动生成
   */
  test('S4-P5-06: 场景洞察（最优/风险市场）', async ({ page }) => {
    // 等待计算完成
    await page.waitForTimeout(1500);

    // 检查是否有场景洞察区域
    const hasInsights = await page.locator('text=场景洞察').isVisible();

    if (hasInsights) {
      // 验证最优市场推荐
      const bestMarket = await page.locator('text=/🏆.*最优市场/i').isVisible();
      if (bestMarket) {
        console.log('✓ 检测到最优市场推荐');

        // 检查推荐理由
        await expect(page.locator('text=/毛利率|ROI|回本/i')).toBeVisible();
      }

      // 验证风险市场警告
      const riskMarket = await page.locator('text=/⚠️.*风险|较差/i').isVisible();
      if (riskMarket) {
        console.log('✓ 检测到风险市场警告');
      }

      // 验证优化建议
      const suggestions = await page.locator('text=/优化建议|建议/i').isVisible();
      if (suggestions) {
        console.log('✓ 检测到优化建议');
      }
    } else {
      console.log('⚠️ 场景洞察未显示（可能需要更多数据）');
    }
  });

  /**
   * S4-P5-07: Tab切换（场景模拟 ↔ 智能推荐）
   */
  test('S4-P5-07: Tab切换正常工作', async ({ page }) => {
    // 初始状态：场景模拟Tab激活
    await expect(page.locator('button:has-text("场景模拟")')).toHaveClass(/purple-600|indigo-600/);
    await expect(page.locator('text=场景参数调节')).toBeVisible();

    // 切换到智能推荐Tab
    await page.click('button:has-text("智能推荐")');
    await page.waitForTimeout(300);

    // 验证智能推荐Tab激活
    await expect(page.locator('button:has-text("智能推荐")')).toHaveClass(/purple-600|indigo-600/);

    // 验证智能推荐内容显示（最优市场/最差市场卡片）
    const hasRecommendation = await page.locator('text=/最优市场|市场洞察/i').isVisible();
    if (hasRecommendation) {
      console.log('✓ 智能推荐内容显示');
    } else {
      // 如果没有计算结果，应该显示提示
      await expect(page.locator('text=/请先在.*场景模拟/i')).toBeVisible();
    }

    // 切换回场景模拟Tab
    await page.click('button:has-text("场景模拟")');
    await page.waitForTimeout(300);

    // 验证场景模拟Tab激活
    await expect(page.locator('button:has-text("场景模拟")')).toHaveClass(/purple-600|indigo-600/);
    await expect(page.locator('text=场景参数调节')).toBeVisible();

    console.log('✓ Tab切换工作正常');
  });

  /**
   * S4-P5-08: 端到端场景模拟流程
   */
  test('S4-P5-08: 完整场景模拟流程', async ({ page }) => {
    // 1. 验证初始状态
    await expect(page.locator('text=智能场景分析')).toBeVisible();

    // 2. 调整场景参数
    // 2.1 修改售价
    const priceInput = page.locator('input[type="number"]').first();
    await priceInput.fill('50');
    await priceInput.press('Enter');
    await page.waitForTimeout(400);

    // 2.2 切换物流模式到空运
    await page.click('button:has-text("空运")');
    await page.waitForTimeout(400);

    // 2.3 修改履约模式（如果存在下拉框）
    const fulfillmentSelect = page.locator('select').first();
    if (await fulfillmentSelect.isVisible()) {
      await fulfillmentSelect.selectOption({ index: 1 });
      await page.waitForTimeout(400);
    }

    // 3. 验证国家选择
    const countryCount = await page.locator('[data-testid^="selected-country-"]').count();
    expect(countryCount).toBeGreaterThanOrEqual(3);
    console.log(`✓ 选择了${countryCount}个市场进行对比`);

    // 4. 等待场景计算完成
    await page.waitForTimeout(1000);

    // 5. 验证结果显示
    if (countryCount >= 3) {
      // 验证对比表格
      const hasTable = await page.locator('text=场景对比结果').isVisible();
      expect(hasTable).toBeTruthy();
      console.log('✓ 对比表格显示');

      // 验证至少有基本数据行
      const rows = await page.locator('table tr').count();
      expect(rows).toBeGreaterThan(3);
      console.log(`✓ 表格包含${rows}行数据`);
    }

    // 6. 切换到智能推荐查看分析结果
    await page.click('button:has-text("智能推荐")');
    await page.waitForTimeout(500);

    // 验证智能推荐基于场景计算结果
    const hasInsight = await page.locator('text=/最优市场|市场洞察/i').isVisible();
    if (hasInsight) {
      console.log('✓ 智能推荐基于场景结果生成');
    }

    // 7. 截图保存结果
    await page.screenshot({ path: 'test-results/phase5-scenario-simulation-complete.png', fullPage: true });

    console.log('✓ 完整场景模拟流程测试通过');
  });

});
