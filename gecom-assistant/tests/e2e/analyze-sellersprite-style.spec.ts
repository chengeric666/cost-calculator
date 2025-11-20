/**
 * 分析SellerSprite计算器样式
 * 用于Step 3重设计参考
 */

import { test, expect } from '@playwright/test';

test('分析SellerSprite计算器UI样式', async ({ page }) => {
  // 访问SellerSprite计算器
  await page.goto('https://www.sellersprite.com/v3/calculator/index');

  // 等待页面加载完成
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // 等待动态内容加载

  // 截图1: 全页面视图
  await page.screenshot({
    path: 'test-results/sellersprite-analysis/01-full-page.png',
    fullPage: true,
  });

  // 截图2: 主计算器区域
  const calculator = page.locator('.calculator, [class*="calculator"], main, .main-content').first();
  if (await calculator.isVisible()) {
    await calculator.screenshot({
      path: 'test-results/sellersprite-analysis/02-calculator-main.png',
    });
  }

  // 截图3: 成本输入区域
  await page.screenshot({
    path: 'test-results/sellersprite-analysis/03-cost-input-area.png',
    clip: { x: 0, y: 200, width: 1280, height: 600 },
  });

  // 截图4: 结果展示区域
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'test-results/sellersprite-analysis/04-result-display-area.png',
    clip: { x: 0, y: 300, width: 1280, height: 600 },
  });

  // 分析页面结构
  const bodyClasses = await page.locator('body').getAttribute('class');
  const mainClasses = await page.locator('main, [role="main"], .main-content').first().getAttribute('class');

  console.log('=== SellerSprite样式分析 ===');
  console.log('Body Classes:', bodyClasses);
  console.log('Main Classes:', mainClasses);

  // 分析卡片样式
  const cards = await page.locator('[class*="card"], .card, [class*="panel"]').all();
  console.log('Card数量:', cards.length);

  if (cards.length > 0) {
    const firstCard = cards[0];
    const cardClasses = await firstCard.getAttribute('class');
    const cardStyles = await firstCard.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        boxShadow: styles.boxShadow,
        border: styles.border,
      };
    });
    console.log('第一个Card Classes:', cardClasses);
    console.log('Card样式:', JSON.stringify(cardStyles, null, 2));
  }

  // 分析表格样式
  const tables = await page.locator('table, [class*="table"]').all();
  console.log('Table数量:', tables.length);

  if (tables.length > 0) {
    const firstTable = tables[0];
    const tableStyles = await firstTable.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        borderCollapse: styles.borderCollapse,
        borderSpacing: styles.borderSpacing,
        fontSize: styles.fontSize,
        color: styles.color,
      };
    });
    console.log('Table样式:', JSON.stringify(tableStyles, null, 2));

    // 分析表格行样式
    const firstRow = firstTable.locator('tr').first();
    if (await firstRow.isVisible()) {
      const rowStyles = await firstRow.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          borderBottom: styles.borderBottom,
          height: styles.height,
        };
      });
      console.log('Table Row样式:', JSON.stringify(rowStyles, null, 2));
    }
  }

  // 分析输入框样式
  const inputs = await page.locator('input[type="text"], input[type="number"]').all();
  console.log('Input数量:', inputs.length);

  if (inputs.length > 0) {
    const firstInput = inputs[0];
    const inputStyles = await firstInput.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        border: styles.border,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        fontSize: styles.fontSize,
        height: styles.height,
      };
    });
    console.log('Input样式:', JSON.stringify(inputStyles, null, 2));
  }

  // 分析按钮样式
  const buttons = await page.locator('button').all();
  console.log('Button数量:', buttons.length);

  if (buttons.length > 0) {
    const firstButton = buttons[0];
    const buttonStyles = await firstButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        border: styles.border,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
      };
    });
    console.log('Button样式:', JSON.stringify(buttonStyles, null, 2));
  }

  // 分析数值展示样式
  const numbers = await page.locator('[class*="price"], [class*="amount"], [class*="value"]').all();
  console.log('Number元素数量:', numbers.length);

  if (numbers.length > 0) {
    const firstNumber = numbers[0];
    const numberStyles = await firstNumber.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
      };
    });
    console.log('Number样式:', JSON.stringify(numberStyles, null, 2));
  }

  // 分析整体布局
  const layout = await page.evaluate(() => {
    const main = document.querySelector('main, [role="main"], .main-content');
    if (!main) return null;

    const styles = window.getComputedStyle(main);
    return {
      maxWidth: styles.maxWidth,
      padding: styles.padding,
      margin: styles.margin,
      display: styles.display,
      gridTemplateColumns: styles.gridTemplateColumns,
    };
  });
  console.log('Layout样式:', JSON.stringify(layout, null, 2));

  console.log('=== 样式分析完成 ===');
});
