/**
 * 实际查看当前UI状态脚本
 *
 * 用途：用Playwright打开页面，截图并分析Step 3和Step 4的真实状态
 */

import { chromium } from '@playwright/test';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

async function checkUIState() {
  console.log('🔍 启动Playwright检查当前UI状态...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 创建截图目录
  const screenshotDir = join(process.cwd(), 'ui-state-screenshots');
  if (!existsSync(screenshotDir)) {
    mkdirSync(screenshotDir, { recursive: true });
  }

  try {
    // 访问首页
    console.log('📍 Step 1: 访问首页 http://localhost:3000');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 填写Step 0
    console.log('📍 Step 2: 填写Step 0（项目基本信息）');
    await page.fill('input[placeholder*="输入项目名称"]', 'UI状态检查项目');
    await page.selectOption('select', { label: '宠物食品' }); // 选择行业
    await page.click('button:has-text("下一步")');
    await page.waitForTimeout(1000);

    // 填写Step 1
    console.log('📍 Step 3: 填写Step 1（业务场景定义）');
    await page.fill('input[placeholder*="产品名称"]', '测试产品');
    await page.fill('input[placeholder*="售价"]', '15.99');
    await page.fill('input[placeholder*="月销量"]', '500');
    await page.selectOption('select[id*="target-country"]', 'US');
    await page.click('button:has-text("下一步")');
    await page.waitForTimeout(1500);

    // Step 2自动填充，直接下一步
    console.log('📍 Step 4: Step 2（成本参数配置）- 保持默认值');
    await page.click('button:has-text("下一步")');
    await page.waitForTimeout(2000);

    // 到达Step 3（成本建模结果）
    console.log('📍 Step 5: 到达Step 3（成本建模结果）');
    await page.waitForTimeout(1000);

    // 截图Step 3完整页面
    console.log('📸 截图Step 3完整页面...');
    await page.screenshot({
      path: join(screenshotDir, '01-step3-full-page.png'),
      fullPage: true
    });

    // 截图Step 3顶部区域
    console.log('📸 截图Step 3顶部区域（KPI卡片）...');
    const step3Top = page.locator('.space-y-8').first();
    if (await step3Top.isVisible()) {
      await step3Top.screenshot({
        path: join(screenshotDir, '02-step3-top-kpi-cards.png')
      });
    }

    // 滚动查看成本分解区域
    console.log('📸 滚动查看成本分解区域...');
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(screenshotDir, '03-step3-cost-breakdown.png'),
      fullPage: false
    });

    // 检查是否有详细的成本明细表
    console.log('🔍 检查Step 3是否有详细的M1-M8成本明细表...');
    const hasDetailedTable = await page.locator('table').count();
    console.log(`   找到 ${hasDetailedTable} 个表格`);

    const hasM1Section = await page.locator('text=/M1.*市场准入/i').count();
    const hasM4Section = await page.locator('text=/M4.*货物税费/i').count();
    console.log(`   M1章节: ${hasM1Section > 0 ? '✅存在' : '❌不存在'}`);
    console.log(`   M4章节: ${hasM4Section > 0 ? '✅存在' : '❌不存在'}`);

    // 进入Step 4
    console.log('\n📍 Step 6: 进入Step 4（场景对比分析）');
    await page.click('button:has-text("下一步")');
    await page.waitForTimeout(2000);

    // 截图Step 4完整页面
    console.log('📸 截图Step 4完整页面...');
    await page.screenshot({
      path: join(screenshotDir, '04-step4-full-page.png'),
      fullPage: true
    });

    // 检查Mock数据警告
    console.log('🔍 检查Step 4是否有"模拟数据"警告...');
    const mockWarning = await page.locator('text=/模拟数据|mock data/i');
    const hasMockWarning = await mockWarning.count() > 0;

    if (hasMockWarning) {
      console.log('   ⚠️ 发现"模拟数据"警告文字');
      await mockWarning.first().screenshot({
        path: join(screenshotDir, '05-step4-mock-warning.png')
      });
    } else {
      console.log('   ✅ 未发现"模拟数据"警告');
    }

    // 检查推荐卡片
    console.log('🔍 检查Step 4推荐卡片...');
    const recommendationCards = await page.locator('[class*="gradient"]').count();
    console.log(`   找到 ${recommendationCards} 个推荐卡片`);

    // 检查19国排名表格
    console.log('🔍 检查Step 4是否有19国排名表格...');
    const rankingTable = await page.locator('table').count();
    console.log(`   找到 ${rankingTable} 个表格`);

    console.log('\n✅ UI状态检查完成！');
    console.log(`📂 截图保存在: ${screenshotDir}`);
    console.log('\n请查看截图文件进行分析：');
    console.log('   01-step3-full-page.png - Step 3完整页面');
    console.log('   02-step3-top-kpi-cards.png - Step 3 KPI卡片');
    console.log('   03-step3-cost-breakdown.png - Step 3成本分解区域');
    console.log('   04-step4-full-page.png - Step 4完整页面');
    if (hasMockWarning) {
      console.log('   05-step4-mock-warning.png - Step 4 Mock警告截图');
    }

    // 暂停30秒让用户查看浏览器
    console.log('\n⏸️  浏览器将保持打开30秒，请手动查看页面...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    await browser.close();
  }
}

checkUIState();
