import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should redirect to auth when not logged in', async ({ page }) => {
    await page.goto('/clients');
    
    // Should redirect to auth page
    await expect(page).toHaveURL('/auth');
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/auth');
    
    // Check if auth form elements are visible
    await expect(page.locator('h1')).toContainText('Olá, seja bem-vindo!');
    await expect(page.locator('[placeholder="Digite o seu nome:"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Entrar');
  });

  test('should not allow login with empty name', async ({ page }) => {
    await page.goto('/auth');
    
    // Try to submit with empty name
    await page.click('button[type="submit"]');
    
    // Should still be on auth page
    await expect(page).toHaveURL('/auth');
    await expect(page.locator('h1')).toContainText('Olá, seja bem-vindo!');
  });

  test('should login successfully with valid name', async ({ page }) => {
    await page.goto('/auth');
    
    // Enter a name and submit
    await page.fill('[placeholder="Digite o seu nome:"]', 'João Silva');
    await page.click('button[type="submit"]');
    
    // Should navigate to clients page
    await page.waitForURL('/clients');
    await expect(page).toHaveURL('/clients');
    
    // Check if user name is displayed in the header
    await expect(page.locator('.user-info')).toContainText('João Silva');
  });

  test('should persist login state on page refresh', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('[placeholder="Digite o seu nome:"]', 'Maria Santos');
    await page.click('button[type="submit"]');
    await page.waitForURL('/clients');
    
    // Refresh the page
    await page.reload();
    
    // Should still be on clients page with user info visible
    await expect(page).toHaveURL('/clients');
    await expect(page.locator('.user-info')).toContainText('Maria Santos');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('[placeholder="Digite o seu nome:"]', 'Pedro Costa');
    await page.click('button[type="submit"]');
    await page.waitForURL('/clients');
    
    // Click logout
    await page.click('.nav-item:has-text("Sair")');
    
    // Should redirect to auth page
    await expect(page).toHaveURL('/auth');
    
    // Try to navigate back to clients
    await page.goto('/clients');
    
    // Should redirect to auth again
    await expect(page).toHaveURL('/auth');
  });

  test('should handle navigation between auth and clients', async ({ page }) => {
    // Start at auth
    await page.goto('/auth');
    await expect(page.locator('h1')).toContainText('Olá, seja bem-vindo!');
    
    // Login
    await page.fill('[placeholder="Digite o seu nome:"]', 'Ana Silva');
    await page.click('button[type="submit"]');
    await page.waitForURL('/clients');
    
    // Check navigation menu
    await expect(page.locator('.nav-menu a[href="/clients"]')).toBeVisible();
    await expect(page.locator('.nav-item:has-text("Sair")')).toBeVisible();
    
    // Navigate to selected clients
    await page.click('.nav-item:has-text("Clientes selecionados")');
    await expect(page.locator('h1, .selected-clients-title')).toBeVisible();
    
    // Navigate back to clients
    await page.click('.nav-item:has-text("Clientes"):not(:has-text("selecionados"))');
    await expect(page.locator('.clients-grid')).toBeVisible();
  });

  test('should validate form input constraints', async ({ page }) => {
    await page.goto('/auth');
    
    // Test with whitespace only
    await page.fill('[placeholder="Digite o seu nome:"]', '   ');
    await page.click('button[type="submit"]');
    
    // Should not proceed (implementation may vary)
    await expect(page).toHaveURL('/auth');
    
    // Test with valid input after invalid
    await page.fill('[placeholder="Digite o seu nome:"]', 'Valid User');
    await page.click('button[type="submit"]');
    
    // Should proceed to clients
    await page.waitForURL('/clients');
    await expect(page).toHaveURL('/clients');
  });

  test('should handle special characters in name', async ({ page }) => {
    await page.goto('/auth');
    
    const specialName = 'José María Ñoño-Silva';
    await page.fill('[placeholder="Digite o seu nome:"]', specialName);
    await page.click('button[type="submit"]');
    
    // Should login successfully
    await page.waitForURL('/clients');
    await expect(page.locator('.user-info')).toContainText(specialName);
  });

  test('should work with long names', async ({ page }) => {
    await page.goto('/auth');
    
    const longName = 'João Pedro Silva Santos Costa Oliveira Ferreira';
    await page.fill('[placeholder="Digite o seu nome:"]', longName);
    await page.click('button[type="submit"]');
    
    // Should login successfully
    await page.waitForURL('/clients');
    await expect(page.locator('.user-info')).toContainText('João Pedro');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/auth');
    
    // Focus on input field
    await page.focus('[placeholder="Digite o seu nome:"]');
    
    // Type name
    await page.keyboard.type('Keyboard User');
    
    // Press Enter to submit
    await page.keyboard.press('Enter');
    
    // Should login successfully
    await page.waitForURL('/clients');
    await expect(page.locator('.user-info')).toContainText('Keyboard User');
  });

  test('should maintain accessibility standards', async ({ page }) => {
    await page.goto('/auth');
    
    // Check for proper form labels and structure
    const nameInput = page.locator('[placeholder="Digite o seu nome:"]');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('type', 'text');
    await expect(nameInput).toHaveAttribute('required');
    
    // Check button accessibility
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });
});