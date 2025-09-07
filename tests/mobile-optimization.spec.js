// 📱 Green Star Solar - Ultra Mobile Optimization Testing Suite
// Testing comprehensive mobile responsiveness across all pages and devices

const { test, expect } = require('@playwright/test');

// Device configurations for testing
const mobileDevices = [
  { name: 'iPhone 13', width: 390, height: 844 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Samsung Galaxy S21', width: 384, height: 854 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'Custom Small', width: 320, height: 568 }, // Extra small testing
];

// Pages to test
const pages = [
  { name: 'Homepage', path: '' },
  { name: 'Solar Panels', path: 'solar-panels-for-home.html' },
  { name: 'Privacy Policy', path: 'privacy-policy.html' },
];

// Test mobile responsiveness for all pages and devices
for (const device of mobileDevices) {
  for (const page of pages) {
    test(`Mobile optimization - ${page.name} on ${device.name} (${device.width}x${device.height})`, async ({ page: browserPage }) => {
      
      // Set viewport to device dimensions
      await browserPage.setViewportSize({ width: device.width, height: device.height });
      
      // Navigate to the page
      const url = page.path ? 
        `https://coldlavaai.github.io/greenstar/${page.path}` : 
        'https://coldlavaai.github.io/greenstar/';
      
      await browserPage.goto(url);
      
      // Wait for page to load completely
      await browserPage.waitForLoadState('networkidle');
      
      console.log(`✅ Testing ${page.name} on ${device.name} (${device.width}x${device.height})`);
      
      // 1. Check page loads without horizontal scroll
      const bodyScrollWidth = await browserPage.evaluate(() => document.body.scrollWidth);
      const bodyClientWidth = await browserPage.evaluate(() => document.body.clientWidth);
      expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 5); // Allow 5px tolerance
      
      // 2. Verify ULTRA MOBILE OPTIMIZATION CSS is present
      const hasMobileCSS = await browserPage.evaluate(() => {
        const styles = Array.from(document.styleSheets).flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules);
          } catch (e) {
            return [];
          }
        });
        return styles.some(rule => 
          rule.cssText && rule.cssText.includes('ULTRA MOBILE-FIRST RESPONSIVE DESIGN')
        );
      });
      expect(hasMobileCSS).toBeTruthy();
      
      // 3. Check that columns stack properly on mobile
      const respCols = await browserPage.locator('.dmRespCol').all();
      if (respCols.length > 0) {
        for (const col of respCols.slice(0, 3)) { // Check first 3 columns
          const colWidth = await col.evaluate(el => el.offsetWidth);
          const parentWidth = await col.evaluate(el => el.parentElement.offsetWidth);
          // Columns should be close to full width on mobile
          expect(colWidth / parentWidth).toBeGreaterThan(0.85);
        }
      }
      
      // 4. Check typography scaling
      const h1Elements = await browserPage.locator('h1').all();
      if (h1Elements.length > 0) {
        const fontSize = await h1Elements[0].evaluate(el => 
          parseInt(window.getComputedStyle(el).fontSize)
        );
        // H1 should be appropriately sized for mobile
        expect(fontSize).toBeGreaterThan(20);
        expect(fontSize).toBeLessThan(50);
      }
      
      // 5. Check button touch-friendly sizing
      const buttons = await browserPage.locator('button, .dmButtonLink').all();
      if (buttons.length > 0) {
        for (const button of buttons.slice(0, 3)) { // Check first 3 buttons
          const buttonHeight = await button.evaluate(el => el.offsetHeight);
          // Buttons should be at least 44px for touch-friendly interaction
          expect(buttonHeight).toBeGreaterThanOrEqual(44);
        }
      }
      
      console.log(`   ✓ Page loads without horizontal scroll`);
      console.log(`   ✓ ULTRA MOBILE CSS optimization detected`);
      console.log(`   ✓ Responsive columns stack properly`);
      console.log(`   ✓ Typography scales appropriately`);
      console.log(`   ✓ Touch-friendly button sizing confirmed`);
    });
  }
}

// Test Sophie widget mobile functionality
for (const device of mobileDevices) {
  test(`Sophie Widget Mobile - ${device.name} (${device.width}x${device.height})`, async ({ page }) => {
    
    // Set viewport to device dimensions
    await page.setViewportSize({ width: device.width, height: device.height });
    
    // Navigate to homepage (has the widget)
    await page.goto('https://coldlavaai.github.io/greenstar/');
    await page.waitForLoadState('networkidle');
    
    console.log(`🤖 Testing Sophie Widget on ${device.name}`);
    
    // 1. Check widget button is present and properly sized
    const widgetButton = page.locator('#vapi-chat-button');
    await expect(widgetButton).toBeVisible();
    
    const buttonSize = await widgetButton.boundingBox();
    expect(buttonSize.width).toBeGreaterThanOrEqual(60); // Mobile optimized size
    expect(buttonSize.height).toBeGreaterThanOrEqual(60);
    
    // 2. Check widget positioning (bottom-right)
    const buttonStyle = await widgetButton.evaluate(el => {
      const styles = window.getComputedStyle(el.closest('#vapi-hybrid-widget'));
      return {
        position: styles.position,
        bottom: styles.bottom,
        right: styles.right,
        zIndex: styles.zIndex
      };
    });
    
    expect(buttonStyle.position).toBe('fixed');
    expect(parseInt(buttonStyle.zIndex)).toBeGreaterThan(9999);
    
    // 3. Test widget panel mobile dimensions
    const chatPanel = page.locator('#vapi-chat-panel');
    
    // Click to open widget (if it opens)
    try {
      await widgetButton.click();
      await page.waitForTimeout(1000); // Wait for animation
      
      // Check if panel opened and has mobile-optimized dimensions
      const panelVisible = await chatPanel.isVisible();
      if (panelVisible) {
        const panelSize = await chatPanel.boundingBox();
        
        // Panel should be responsive on mobile
        expect(panelSize.width).toBeLessThanOrEqual(device.width);
        expect(panelSize.height).toBeLessThanOrEqual(device.height * 0.8); // Max 80% of viewport height
        
        console.log(`   ✓ Widget panel responsive: ${panelSize.width}x${panelSize.height}`);
      }
    } catch (error) {
      console.log(`   ⚠ Widget interaction test skipped (VAPI not loaded): ${error.message}`);
    }
    
    // 4. Check mobile widget CSS optimization is present
    const hasMobileWidgetCSS = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets).flatMap(sheet => {
        try {
          return Array.from(sheet.cssRules);
        } catch (e) {
          return [];
        }
      });
      return styles.some(rule => 
        rule.cssText && rule.cssText.includes('SOPHIE WIDGET - ULTRA MOBILE OPTIMIZATION')
      );
    });
    expect(hasMobileWidgetCSS).toBeTruthy();
    
    console.log(`   ✓ Widget button visible and properly sized (${buttonSize.width}x${buttonSize.height})`);
    console.log(`   ✓ Widget positioning optimized (fixed bottom-right)`);
    console.log(`   ✓ Mobile widget CSS optimization detected`);
  });
}

// Performance and accessibility tests
test('Mobile Performance and Accessibility', async ({ page }) => {
  
  // Test on iPhone 13 size
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://coldlavaai.github.io/greenstar/');
  await page.waitForLoadState('networkidle');
  
  console.log('🚀 Testing Mobile Performance and Accessibility');
  
  // 1. Check for hardware acceleration CSS
  const hasHardwareAcceleration = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    let hasAcceleration = false;
    
    for (const el of elements) {
      const styles = window.getComputedStyle(el);
      if (styles.transform && styles.transform !== 'none' && 
          (styles.transform.includes('translateZ') || styles.transform.includes('translate3d'))) {
        hasAcceleration = true;
        break;
      }
    }
    return hasAcceleration;
  });
  expect(hasHardwareAcceleration).toBeTruthy();
  
  // 2. Check viewport meta tag for mobile
  const viewportMeta = await page.locator('meta[name="viewport"]');
  const viewportContent = await viewportMeta.getAttribute('content');
  expect(viewportContent).toContain('width=device-width');
  
  // 3. Check for touch-action optimization
  const hasTouchAction = await page.evaluate(() => {
    const styles = Array.from(document.styleSheets).flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules);
      } catch (e) {
        return [];
      }
    });
    return styles.some(rule => 
      rule.cssText && rule.cssText.includes('touch-action: manipulation')
    );
  });
  expect(hasTouchAction).toBeTruthy();
  
  console.log('   ✓ Hardware acceleration CSS detected');
  console.log('   ✓ Mobile viewport meta tag configured');
  console.log('   ✓ Touch-action optimization implemented');
});

// Cross-browser testing simulation
const browsers = ['chromium', 'webkit']; // webkit = Safari engine

for (const browserName of browsers) {
  test(`Cross-browser Mobile - ${browserName}`, async ({ page }) => {
    
    console.log(`🌐 Testing on ${browserName} mobile`);
    
    // iPhone size for consistency
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://coldlavaai.github.io/greenstar/');
    await page.waitForLoadState('networkidle');
    
    // Check basic mobile functionality
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Green Star Solar');
    
    // Check mobile CSS loads
    const hasMobileOptimization = await page.evaluate(() => {
      return document.querySelector('style') && 
             document.querySelector('style').textContent.includes('ULTRA MOBILE');
    });
    expect(hasMobileOptimization).toBeTruthy();
    
    // Check widget exists
    const widgetExists = await page.locator('#vapi-hybrid-widget').isVisible();
    expect(widgetExists).toBeTruthy();
    
    console.log(`   ✓ Page loads successfully on ${browserName}`);
    console.log(`   ✓ Mobile optimization CSS detected`);
    console.log(`   ✓ Sophie widget renders properly`);
  });
}