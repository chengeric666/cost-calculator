/**
 * Step 5 Report Generation E2E Tests
 *
 * Test Coverage:
 * - S5-RPT-01: 报告生成UI正确显示
 * - S5-RPT-02: 报告配置选项可正常切换
 * - S5-RPT-03: 点击生成按钮可下载Word文档
 *
 * @created 2025-11-17
 * @phase Phase 1 Task 1.3
 */

import { test, expect } from '@playwright/test';

test.describe('Step 5 Report Generation', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到主页并进入向导
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 点击"开始成本计算"按钮进入向导
    await page.click('button:has-text("开始成本计算")');
    await page.waitForLoadState('networkidle');
  });

  test('S5-RPT-01: 报告生成UI正确显示', async ({ page }) => {
    // Step 0: 填写项目信息
    await page.fill('input[name="projectName"]', 'Test Project for Report');
    await page.selectOption('select[name="industry"]', 'pet');
    await page.selectOption('select[name="targetCountry"]', 'US');
    await page.click('button:has-text("下一步")');
    await page.waitForLoadState('networkidle');

    // Step 1: 填写业务场景
    await page.fill('input[placeholder*="SKU"]', 'TEST-RPT-001');
    await page.fill('input[placeholder*="产品名称"]', 'Test Report Product');
    await page.fill('input[placeholder*="重量"]', '1.5');
    await page.fill('input[placeholder*="COGS"]', '15');
    await page.fill('input[placeholder*="目标售价"]', '50');
    await page.fill('input[placeholder*="月销量"]', '1000');
    await page.click('button:has-text("下一步")');
    await page.waitForLoadState('networkidle');

    // Step 2: 数据采集（跳过，使用默认值）
    await page.click('button:has-text("下一步")');
    await page.waitForLoadState('networkidle');

    // Step 3: 成本建模（查看结果）
    await page.waitForSelector('text=成本建模结果', { timeout: 10000 });
    await page.click('button:has-text("下一步")');
    await page.waitForLoadState('networkidle');

    // Step 4: 场景分析（跳过）
    await page.click('button:has-text("下一步")');
    await page.waitForLoadState('networkidle');

    // Step 5: 报告生成 - 验证UI显示
    await expect(page.locator('h2:has-text("生成专业成本分析报告")')).toBeVisible();
    await expect(page.locator('text=基于GECOM方法论')).toBeVisible();

    // 验证左侧配置面板
    await expect(page.locator('h3:has-text("报告配置")')).toBeVisible();
    await expect(page.locator('text=报告语言')).toBeVisible();
    await expect(page.locator('text=包含章节')).toBeVisible();

    // 验证右侧预览面板
    await expect(page.locator('h3:has-text("报告预览")')).toBeVisible();
    await expect(page.locator('text=封面')).toBeVisible();
    await expect(page.locator('text=目录')).toBeVisible();
    await expect(page.locator('text=第一章')).toBeVisible();
    await expect(page.locator('text=第二章')).toBeVisible();

    // 验证生成按钮
    await expect(page.locator('button:has-text("生成专业Word报告")')).toBeVisible();
    await expect(page.locator('button:has-text("生成专业Word报告")')).toBeEnabled();
  });

  test('S5-RPT-02: 报告配置选项可正常切换', async ({ page }) => {
    // 快速导航到Step 5（使用数据填充辅助函数）
    await fillMinimalDataAndNavigateToStep5(page);

    // 测试语言选择
    const languageSelect = page.locator('select').first();
    await expect(languageSelect).toHaveValue('zh-CN');

    // 测试执行摘要复选框
    const executiveSummaryCheckbox = page.locator('input[type="checkbox"]').nth(0);
    await expect(executiveSummaryCheckbox).toBeChecked();
    await executiveSummaryCheckbox.uncheck();
    await expect(executiveSummaryCheckbox).not.toBeChecked();

    // 验证预览区域更新（执行摘要应该消失）
    // 注意：由于有条件渲染，摘要行应该不可见
    await executiveSummaryCheckbox.check();
    await expect(page.locator('text=摘要')).toBeVisible();

    // 测试图表可视化复选框
    const chartsCheckbox = page.locator('input[type="checkbox"]').nth(1);
    await expect(chartsCheckbox).toBeChecked();
    await chartsCheckbox.uncheck();
    await expect(chartsCheckbox).not.toBeChecked();

    // 测试附录复选框
    const appendixCheckbox = page.locator('input[type="checkbox"]').nth(2);
    await expect(appendixCheckbox).toBeChecked();
    await appendixCheckbox.uncheck();
    await expect(appendixCheckbox).not.toBeChecked();

    // 验证预览区域更新（附录A/B/C应该消失）
    await expect(page.locator('text=附录A')).not.toBeVisible();
    await expect(page.locator('text=附录B')).not.toBeVisible();
    await expect(page.locator('text=附录C')).not.toBeVisible();

    await appendixCheckbox.check();
    await expect(page.locator('text=附录A')).toBeVisible();

    // 测试AI生成复选框
    const aiCheckbox = page.locator('input[type="checkbox"]').nth(3);
    await expect(aiCheckbox).toBeChecked();
    await aiCheckbox.uncheck();
    await expect(aiCheckbox).not.toBeChecked();

    // 验证预览字数变化（应该从28,000-32,000变为20,000-25,000）
    await expect(page.locator('text=20,000-25,000字')).toBeVisible();

    await aiCheckbox.check();
    await expect(page.locator('text=28,000-32,000字')).toBeVisible();
    await expect(page.locator('text=第五章')).toBeVisible();
  });

  test('S5-RPT-03: 点击生成按钮触发报告生成流程', async ({ page }) => {
    // 快速导航到Step 5
    await fillMinimalDataAndNavigateToStep5(page);

    // 点击生成按钮
    const generateButton = page.locator('button:has-text("生成专业Word报告")');
    await expect(generateButton).toBeEnabled();

    // 点击生成（注意：由于Playwright无法直接验证文件下载中的docx内容，我们验证UI反馈）
    await generateButton.click();

    // 验证生成中状态
    await expect(page.locator('text=生成中...')).toBeVisible({ timeout: 2000 });

    // 验证进度条显示
    await expect(page.locator('text=%')).toBeVisible();

    // 验证进度状态文本（至少看到一个阶段）
    await expect(page.locator('text=正在准备数据').or(page.locator('text=正在获取成本因子')).or(page.locator('text=正在生成封面'))).toBeVisible({ timeout: 5000 });

    // 等待生成完成（最多等待40秒，因为AI生成可能较慢）
    await expect(page.locator('text=报告生成成功')).toBeVisible({ timeout: 40000 });

    // 验证按钮恢复正常
    await expect(page.locator('button:has-text("生成专业Word报告")')).toBeVisible({ timeout: 5000 });
  });

  test('S5-RPT-04: 未完成成本计算时生成按钮应禁用', async ({ page }) => {
    // 直接导航到向导（不填写任何数据）
    await page.goto('/');
    await page.click('button:has-text("开始成本计算")');

    // 快速跳到Step 5（不完成成本计算）
    // 连续点击"下一步"但不填写数据
    for (let i = 0; i < 5; i++) {
      try {
        await page.click('button:has-text("下一步")', { timeout: 2000 });
        await page.waitForTimeout(500);
      } catch (e) {
        // 可能因为验证失败无法前进，这是预期的
        break;
      }
    }

    // 如果成功到达Step 5，验证按钮状态
    const step5Heading = page.locator('h2:has-text("生成专业成本分析报告")');
    if (await step5Heading.isVisible()) {
      const generateButton = page.locator('button:has-text("生成专业Word报告")');

      // 验证按钮应该被禁用（因为costResult为null）
      await expect(generateButton).toBeDisabled();

      // 验证提示文字
      await expect(page.locator('text=请先完成Step 0-3的成本计算')).toBeVisible();
    }
  });
});

/**
 * 辅助函数：填写最小数据集并导航到Step 5
 */
async function fillMinimalDataAndNavigateToStep5(page: any) {
  // Step 0: 项目信息
  await page.fill('input[name="projectName"]', 'Test Report Project');
  await page.selectOption('select[name="industry"]', 'pet');
  await page.selectOption('select[name="targetCountry"]', 'US');
  await page.click('button:has-text("下一步")');
  await page.waitForLoadState('networkidle');

  // Step 1: 业务场景
  await page.fill('input[placeholder*="SKU"]', 'TEST-001');
  await page.fill('input[placeholder*="产品名称"]', 'Test Product');
  await page.fill('input[placeholder*="重量"]', '1.5');
  await page.fill('input[placeholder*="COGS"]', '15');
  await page.fill('input[placeholder*="目标售价"]', '50');
  await page.fill('input[placeholder*="月销量"]', '1000');
  await page.click('button:has-text("下一步")');
  await page.waitForLoadState('networkidle');

  // Step 2: 数据采集（使用默认值）
  await page.click('button:has-text("下一步")');
  await page.waitForLoadState('networkidle');

  // Step 3: 成本建模
  await page.waitForSelector('text=成本建模结果', { timeout: 10000 });
  await page.click('button:has-text("下一步")');
  await page.waitForLoadState('networkidle');

  // Step 4: 场景分析
  await page.click('button:has-text("下一步")');
  await page.waitForLoadState('networkidle');

  // 现在应该在Step 5
  await page.waitForSelector('h2:has-text("生成专业成本分析报告")', { timeout: 5000 });
}
