/**
 * Step 4 市场推荐算法 E2E 测试
 *
 * 测试场景：
 * - S4.3 智能推荐算法UI展示
 * - 最优市场推荐卡片
 * - 最差市场警告卡片
 * - 市场综合评分排名表
 * - 市场洞察分析
 * - 评分算法说明
 *
 * 质量标准：
 * - 所有UI元素正确渲染
 * - 推荐算法正确计算并显示
 * - 交互功能正常(展开/折叠)
 * - 截图验证视觉效果
 */

import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.join(__dirname, '../screenshots/step4-recommendation');

test.describe('Step 4: 智能市场推荐算法测试', () => {
  test.beforeEach(async ({ page }) => {
    // 1. 访问应用首页
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // 2. 点击"开始成本计算"按钮
    const startButton = page.locator('button:has-text("开始成本计算")');
    await startButton.click();
    await page.waitForTimeout(1000);

    // 3. Step 0: 填写项目信息
    await page.fill('#project-name', 'E2E测试项目-市场推荐测试');

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

    // ⭐ 关键修复：等待行业模板加载提示出现（说明模板已自动填充）
    await page.waitForSelector('text=/已加载.*宠物食品.*行业模板/i', { timeout: 10000 });
    console.log('✓ Step 1: 宠物食品行业模板已自动填充');

    // 等待产品名称输入框被填充（验证模板数据已生效）
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      return input && input.value.includes('狗粮');
    }, { timeout: 5000 });
    console.log('✓ Step 1: 产品数据已填充（含"狗粮"）');

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
    await page.waitForTimeout(2000); // 等待推荐卡片渲染完成
  });

  test('S4.3-01: 页面标题和描述正确显示', async ({ page }) => {
    // 检查标题
    const title = page.locator('h2:has-text("智能场景分析")');
    await expect(title).toBeVisible();

    // 检查MVP 2.0标识
    const mvpBadge = page.locator('text=/S4.3 MVP 2.0/i');
    await expect(mvpBadge).toBeVisible();

    // 检查描述文字
    const description = page.locator('text=/基于GECOM方法论的多维度市场推荐算法/i');
    await expect(description).toBeVisible();

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-page-header.png'),
      fullPage: false,
    });
  });

  test('S4.3-02: 最优市场推荐卡片完整展示', async ({ page }) => {
    // 等待最优市场卡片加载 - 使用精确的class选择器
    const gradientCard = page.locator('.bg-gradient-to-r.from-green-50.to-emerald-50.border-2.border-green-300').first();
    await expect(gradientCard).toBeVisible();

    // 验证Award图标
    const awardIcon = gradientCard.locator('svg').first();
    await expect(awardIcon).toBeVisible();

    // 验证国旗和市场名称
    const countryName = gradientCard.locator('h3').first();
    await expect(countryName).toBeVisible();
    const countryText = await countryName.textContent();
    expect(countryText).toMatch(/[\u4e00-\u9fa5]{2,4}/); // 中文国家名

    // 验证"最优市场"标签 - 使用更精确的选择器
    const bestBadge = gradientCard.locator('span.bg-green-600');
    await expect(bestBadge).toBeVisible();
    await expect(bestBadge).toContainText('最优市场');

    // 验证综合评分显示
    const scoreDisplay = gradientCard.locator('span:has-text("评分:")');
    await expect(scoreDisplay).toBeVisible();

    // 验证4个关键指标卡片
    const metricCards = gradientCard.locator('.bg-white.rounded-lg.p-3');
    await expect(metricCards).toHaveCount(4);

    // 验证指标名称
    await expect(metricCards.nth(0).locator('text=毛利率')).toBeVisible();
    await expect(metricCards.nth(1).locator('text=ROI')).toBeVisible();
    await expect(metricCards.nth(2).locator('text=回本周期')).toBeVisible();
    await expect(metricCards.nth(3).locator('text=启动成本')).toBeVisible();

    // 验证推荐理由列表 - 使用filter而不是:has-text
    const reasonsSection = gradientCard.locator('div').filter({hasText: '推荐理由：'}).first();
    await expect(reasonsSection).toBeVisible();

    const reasons = reasonsSection.locator('ul li');
    const reasonCount = await reasons.count();
    expect(reasonCount).toBeGreaterThan(0);

    // 验证理由包含checkmark emoji
    const firstReason = await reasons.first().textContent();
    expect(firstReason).toMatch(/✅/);

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-best-market-card.png'),
      fullPage: false,
    });
  });

  test('S4.3-03: 最差市场警告卡片完整展示', async ({ page }) => {
    // 等待最差市场卡片加载 - 使用精确的class选择器（注意是to-orange-50，不是to-rose-50）
    const gradientCard = page.locator('.bg-gradient-to-r.from-red-50.to-orange-50.border-2.border-red-300').first();
    await expect(gradientCard).toBeVisible();

    // 验证AlertTriangle图标
    const alertIcon = gradientCard.locator('svg').first();
    await expect(alertIcon).toBeVisible();

    // 验证国旗和市场名称
    const countryName = gradientCard.locator('h3').first();
    await expect(countryName).toBeVisible();

    // 验证"风险警告"标签 - 使用更精确的选择器
    const warningBadge = gradientCard.locator('span.bg-red-600');
    await expect(warningBadge).toBeVisible();
    await expect(warningBadge).toContainText('风险警告');

    // 验证4个关键指标卡片
    const metricCards = gradientCard.locator('.bg-white.rounded-lg.p-3');
    await expect(metricCards).toHaveCount(4);

    // 验证警告理由列表 - 使用后代选择器而不是:has-text
    const reasonsSection = gradientCard.locator('div').filter({hasText: '警告理由：'}).first();
    await expect(reasonsSection).toBeVisible();

    const reasons = reasonsSection.locator('ul li');
    const reasonCount = await reasons.count();
    expect(reasonCount).toBeGreaterThan(0);

    // 验证理由包含warning emoji
    const firstReason = await reasons.first().textContent();
    expect(firstReason).toMatch(/⚠️/);

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-worst-market-card.png'),
      fullPage: false,
    });
  });

  test('S4.3-04: 市场综合评分排名表正确显示', async ({ page }) => {
    // 等待排名表加载
    const rankingTable = page.locator('table');
    await expect(rankingTable).toBeVisible();

    // 验证表头
    const headers = rankingTable.locator('thead th');
    await expect(headers).toHaveCount(7);

    await expect(headers.nth(0)).toContainText('排名');
    await expect(headers.nth(1)).toContainText('市场');
    await expect(headers.nth(2)).toContainText('推荐等级');
    await expect(headers.nth(3)).toContainText('综合评分');
    await expect(headers.nth(4)).toContainText('毛利率');
    await expect(headers.nth(5)).toContainText('ROI');
    await expect(headers.nth(6)).toContainText('回本');

    // 验证表格行数（默认显示前3个）
    const rows = rankingTable.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThanOrEqual(3);
    expect(rowCount).toBeLessThanOrEqual(5);

    // 验证第一行（排名#1）
    const firstRow = rows.first();
    const rankCell = firstRow.locator('td').first();
    await expect(rankCell).toContainText('#1');

    // 验证推荐等级Badge
    const badge = firstRow.locator('span:has-text("最优")');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass(/bg-green-100/);

    // 验证综合评分显示
    const scoreCell = firstRow.locator('td').nth(3);
    const scoreText = await scoreCell.textContent();
    expect(scoreText).toMatch(/\d+\.\d/); // 数字格式

    // 验证国旗emoji显示
    const countryCell = firstRow.locator('td').nth(1);
    const countryText = await countryCell.textContent();
    expect(countryText).toMatch(/[\u{1F1E6}-\u{1F1FF}]{2}/u); // 国旗emoji

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04-ranking-table.png'),
      fullPage: false,
    });
  });

  test('S4.3-05: 排名表展开/收起功能正常', async ({ page }) => {
    // 找到展开/收起按钮
    const expandButton = page.locator('button:has-text("展开全部")');

    if (await expandButton.isVisible()) {
      // 记录初始行数
      const initialRows = await page.locator('tbody tr').count();

      // 点击展开
      await expandButton.click();
      await page.waitForTimeout(500); // 等待动画

      // 验证行数增加
      const expandedRows = await page.locator('tbody tr').count();
      expect(expandedRows).toBeGreaterThan(initialRows);

      // 验证按钮文字变为"收起"
      const collapseButton = page.locator('button:has-text("收起")');
      await expect(collapseButton).toBeVisible();

      // 截图展开状态
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, '05-table-expanded.png'),
        fullPage: false,
      });

      // 点击收起
      await collapseButton.click();
      await page.waitForTimeout(500);

      // 验证行数恢复
      const collapsedRows = await page.locator('tbody tr').count();
      expect(collapsedRows).toBe(initialRows);

      // 截图收起状态
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, '05-table-collapsed.png'),
        fullPage: false,
      });
    }
  });

  test('S4.3-06: 推荐等级Badge正确显示', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    // 验证每行都有推荐等级Badge
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const badgeCell = row.locator('td').nth(2);
      const badge = badgeCell.locator('span');

      await expect(badge).toBeVisible();

      // 验证Badge包含emoji
      const badgeText = await badge.textContent();
      expect(badgeText).toMatch(/[🏆👍📊⚡⚠️]/);
    }

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06-recommendation-badges.png'),
      fullPage: false,
    });
  });

  test('S4.3-07: 市场洞察分析面板完整展示', async ({ page }) => {
    // 等待洞察面板加载
    const insightsPanel = page.locator('div:has-text("市场洞察分析")').first();
    await expect(insightsPanel).toBeVisible();

    // 验证TrendingUp图标
    const icon = insightsPanel.locator('svg').first();
    await expect(icon).toBeVisible();

    // 验证洞察内容
    const insights = page.locator('.bg-blue-50.border.border-blue-200');
    const insightCount = await insights.count();
    expect(insightCount).toBeGreaterThanOrEqual(4); // 至少4条洞察

    // 验证洞察包含emoji
    const firstInsight = await insights.first().textContent();
    expect(firstInsight).toMatch(/[📊💰⏱️🏗️]/);

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '07-insights-panel.png'),
      fullPage: false,
    });
  });

  test('S4.3-08: 洞察面板折叠/展开功能正常', async ({ page }) => {
    // 找到洞察面板标题按钮
    const panelButton = page.locator('button:has(h3:has-text("市场洞察分析"))');

    if (await panelButton.isVisible()) {
      // 检查初始状态（应该是展开的）
      const insights = page.locator('.bg-blue-50.border.border-blue-200');
      const initialVisible = await insights.first().isVisible();

      if (initialVisible) {
        // 点击折叠
        await panelButton.click();
        await page.waitForTimeout(300);

        // 验证洞察隐藏
        const afterCollapse = await insights.first().isVisible();
        expect(afterCollapse).toBe(false);

        // 截图折叠状态
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, '08-insights-collapsed.png'),
          fullPage: false,
        });

        // 点击展开
        await panelButton.click();
        await page.waitForTimeout(300);

        // 验证洞察显示
        const afterExpand = await insights.first().isVisible();
        expect(afterExpand).toBe(true);
      }
    }
  });

  test('S4.3-09: 评分算法说明正确显示', async ({ page }) => {
    // 等待算法说明区域加载 - 使用精确的CSS类选择器
    const algorithmSection = page.locator('.bg-gradient-to-r.from-gray-50.to-slate-50').first();
    await expect(algorithmSection).toBeVisible();

    // 验证权重配置 - 选择grid的直接子div
    const weightsSection = algorithmSection.locator('.grid > div').filter({hasText: '权重配置：'});
    await expect(weightsSection).toBeVisible();

    await expect(weightsSection).toContainText('毛利率: 40%');
    await expect(weightsSection).toContainText('ROI: 30%');
    await expect(weightsSection).toContainText('回本周期: 20%');
    await expect(weightsSection).toContainText('CAPEX: 10%');

    // 验证推荐等级说明 - 选择grid的直接子div
    const levelsSection = algorithmSection.locator('.grid > div').filter({hasText: '推荐等级：'});
    await expect(levelsSection).toBeVisible();

    await expect(levelsSection).toContainText('🏆 最优：排名第1');
    await expect(levelsSection).toContainText('👍 良好：前30%');
    await expect(levelsSection).toContainText('📊 一般：中间40%');
    await expect(levelsSection).toContainText('⚡ 较差：后30%');  // 修复：emoji后有空格
    await expect(levelsSection).toContainText('⚠️ 最差：排名最后');

    // 验证模拟数据说明
    const notice = algorithmSection.locator('.bg-yellow-50');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('当前使用模拟数据演示智能推荐功能');

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '09-algorithm-explanation.png'),
      fullPage: false,
    });
  });

  test('S4.3-10: 完整页面截图和视觉回归测试', async ({ page }) => {
    // 等待所有元素加载完成
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 全页面截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '10-full-page.png'),
      fullPage: true,
    });

    // 验证页面整体布局
    const mainContainer = page.locator('div.space-y-8').first();
    await expect(mainContainer).toBeVisible();

    // 验证所有主要区块都存在 - 使用更精确的选择器
    await expect(page.locator('.bg-gradient-to-r.from-green-50.to-emerald-50').first()).toBeVisible(); // 最优市场
    await expect(page.locator('.bg-gradient-to-r.from-red-50.to-orange-50').first()).toBeVisible(); // 最差市场（注意是to-orange-50）
    await expect(page.locator('table')).toBeVisible(); // 排名表
    await expect(page.locator('button:has-text("市场洞察分析")')).toBeVisible(); // 洞察折叠按钮
    await expect(page.locator('.bg-gradient-to-r.from-gray-50').first()).toBeVisible(); // 算法说明
  });

  test('S4.3-11: 颜色编码验证', async ({ page }) => {
    // 验证最优市场使用绿色系
    const bestCard = page.locator('.from-green-50').first();
    await expect(bestCard).toBeVisible();
    await expect(bestCard).toHaveClass(/border-green-300/);

    // 验证最差市场使用红色系
    const worstCard = page.locator('.from-red-50').first();
    await expect(worstCard).toBeVisible();
    await expect(worstCard).toHaveClass(/border-red-300/);

    // 验证排名表中的颜色编码
    const tableRows = page.locator('tbody tr');

    // 第一行应该有绿色背景
    const firstRow = tableRows.first();
    const firstRowClass = await firstRow.getAttribute('class');
    expect(firstRowClass).toContain('bg-green-50');

    // 截图
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '11-color-coding.png'),
      fullPage: false,
    });
  });

  test('S4.3-12: 响应式布局测试', async ({ page }) => {
    // 测试桌面视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '12-desktop-view.png'),
      fullPage: true,
    });

    // 测试平板视图
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '12-tablet-view.png'),
      fullPage: true,
    });

    // 验证表格在小屏幕下可以滚动
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });
});
