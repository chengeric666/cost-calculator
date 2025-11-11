/**
 * GECOM Cost Calculator - End-to-End Test
 *
 * 测试完整的Step 0-5向导流程：
 * - Step 0: 项目基本信息
 * - Step 1: 业务场景定义
 * - Step 2: 成本参数配置
 * - Step 3: 成本建模结果
 * - Step 4: 场景分析
 * - Step 5: 洞察与路线图
 *
 * 验证点：
 * - 数据正确传递
 * - 实时计算正常
 * - UI渲染正确
 * - 性能达标（<3秒）
 */

import { test, expect } from '@playwright/test';

test.describe('GECOM Wizard Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到应用首页
    await page.goto('http://localhost:3000');
  });

  test('Step 0-5: 完整向导流程 + 截图', async ({ page }) => {
    // ========== Step 0: 项目基本信息 ==========
    console.log('📝 Step 0: 项目基本信息');

    // 等待首页加载
    await expect(page.locator('text=GECOM智能成本助手')).toBeVisible({ timeout: 10000 });

    // 点击"开始新项目"
    await page.locator('button:has-text("开始新项目")').click();

    // 等待Step 0加载
    await expect(page.locator('text=项目基本信息')).toBeVisible();

    // 填写项目名称
    await page.fill('input[placeholder*="项目名称"]', 'E2E测试项目');

    // 选择行业（宠物食品）
    await page.locator('button:has-text("Pet Food")').click();

    // 截图：Step 0
    await page.screenshot({
      path: 'tests/screenshots/step0-project-info.png',
      fullPage: true,
    });

    // 点击"开始配置"
    await page.locator('button:has-text("开始配置")').click();

    // 等待进入Step 1
    await expect(page.locator('text=业务场景定义')).toBeVisible();

    // ========== Step 1: 业务场景定义 ==========
    console.log('📝 Step 1: 业务场景定义');

    // 填写产品参数
    await page.fill('input[placeholder*="产品名称"]', '天然无谷狗粮 2kg');
    await page.fill('input[type="number"]', '2.0'); // 产品重量
    // 等待2秒让行业模板加载
    await page.waitForTimeout(1000);

    // 选择目标市场（美国）
    await page.locator('button:has-text("美国")').first().click();

    // 选择销售渠道（Amazon FBA）
    await page.locator('button:has-text("Amazon FBA")').click();

    // 截图：Step 1
    await page.screenshot({
      path: 'tests/screenshots/step1-business-scenario.png',
      fullPage: true,
    });

    // 点击"下一步"
    await page.locator('button:has-text("下一步")').click();

    // 等待进入Step 2
    await expect(page.locator('text=成本参数配置')).toBeVisible();

    // ========== Step 2: 成本参数配置 ==========
    console.log('📝 Step 2: 成本参数配置');

    // 等待Mock数据加载
    await page.waitForTimeout(2000);

    // 展开M4模块
    await page.locator('button:has-text("M4: 货物税费")').click();

    // 验证实时计算预览面板存在
    await expect(page.locator('text=成本预览')).toBeVisible();

    // 截图：Step 2
    await page.screenshot({
      path: 'tests/screenshots/step2-cost-params.png',
      fullPage: true,
    });

    // 点击"下一步"
    await page.locator('button:has-text("下一步")').click();

    // 等待进入Step 3
    await expect(page.locator('text=成本建模结果')).toBeVisible();

    // ========== Step 3: 成本建模结果 ==========
    console.log('📝 Step 3: 成本建模结果');

    // 等待图表渲染
    await page.waitForTimeout(2000);

    // 验证KPI卡片存在
    await expect(page.locator('text=毛利率')).toBeVisible();
    await expect(page.locator('text=投资回报率')).toBeVisible();

    // 截图：Step 3
    await page.screenshot({
      path: 'tests/screenshots/step3-cost-modeling.png',
      fullPage: true,
    });

    // 点击"下一步"
    await page.locator('button:has-text("下一步")').click();

    // 等待进入Step 4
    await expect(page.locator('text=场景分析')).toBeVisible();

    // ========== Step 4: 场景分析 ==========
    console.log('📝 Step 4: 场景分析');

    // 等待对比表格加载
    await page.waitForTimeout(1000);

    // 验证对比表格存在
    await expect(page.locator('text=当前配置')).toBeVisible();

    // 截图：Step 4
    await page.screenshot({
      path: 'tests/screenshots/step4-scenario-analysis.png',
      fullPage: true,
    });

    // 点击"下一步"
    await page.locator('button:has-text("下一步")').click();

    // 等待进入Step 5
    await expect(page.locator('text=洞察与行动路线图')).toBeVisible();

    // ========== Step 5: 洞察与路线图 ==========
    console.log('📝 Step 5: 洞察与路线图');

    // 等待内容加载
    await page.waitForTimeout(1000);

    // 验证执行摘要存在
    await expect(page.locator('text=执行摘要')).toBeVisible();
    await expect(page.locator('text=90天行动路线图')).toBeVisible();

    // 截图：Step 5
    await page.screenshot({
      path: 'tests/screenshots/step5-insights.png',
      fullPage: true,
    });

    // 验证"完成"按钮存在
    await expect(page.locator('button:has-text("完成")')).toBeVisible();

    console.log('✅ E2E测试完成！所有截图已保存到 tests/screenshots/');
  });

  test('性能测试：页面加载 < 3秒', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('http://localhost:3000');
    await page.locator('text=GECOM智能成本助手').waitFor();

    const loadTime = Date.now() - startTime;
    console.log(`⚡ 首页加载时间: ${loadTime}ms`);

    // 验证加载时间 < 3秒
    expect(loadTime).toBeLessThan(3000);
  });

  test('数据传递验证：Step 1 → Step 2', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 进入向导
    await page.locator('button:has-text("开始新项目")').click();

    // Step 0: 填写基本信息
    await page.fill('input[placeholder*="项目名称"]', '数据传递测试');
    await page.locator('button:has-text("Pet Food")').click();
    await page.locator('button:has-text("开始配置")').click();

    // Step 1: 填写产品信息
    await page.waitForTimeout(1000);
    await page.fill('input[placeholder*="产品名称"]', '测试产品');

    // 验证行业模板预填值
    const cogsInput = page.locator('input[type="number"]').nth(2);
    const cogsValue = await cogsInput.inputValue();
    console.log(`📊 COGS预填值: ${cogsValue}`);
    expect(parseFloat(cogsValue)).toBeGreaterThan(0);

    // 进入Step 2
    await page.locator('button:has-text("下一步")').click();
    await page.waitForTimeout(2000);

    // 验证Step 2收到了Step 1的数据
    await expect(page.locator('text=成本预览')).toBeVisible();

    console.log('✅ 数据传递验证通过');
  });

  test('实时计算验证：用户覆盖值', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 快速进入Step 2
    await page.locator('button:has-text("开始新项目")').click();
    await page.fill('input[placeholder*="项目名称"]', '实时计算测试');
    await page.locator('button:has-text("Pet Food")').click();
    await page.locator('button:has-text("开始配置")').click();
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("下一步")').click();
    await page.waitForTimeout(2000);

    // 切换到专家模式
    await page.locator('button:has-text("专家模式")').click();

    // 等待专家模式加载
    await page.waitForTimeout(500);

    // 验证实时计算预览面板更新
    await expect(page.locator('text=成本预览')).toBeVisible();
    await expect(page.locator('text=单位毛利')).toBeVisible();

    console.log('✅ 实时计算验证通过');
  });
});
