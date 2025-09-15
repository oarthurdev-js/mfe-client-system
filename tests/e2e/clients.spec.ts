import { test, expect } from '@playwright/test';

// Test data
const TEST_CLIENT = {
  name: 'João Silva',
  salary: '5000.00',
  companyValuation: '100000.00'
};

const UPDATED_CLIENT = {
  name: 'João Silva Santos',
  salary: '6000.00',
  companyValuation: '150000.00'
};

test.describe('Client Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start from auth page and login
    await page.goto('/auth');
    await page.fill('[placeholder="Digite o seu nome:"]', 'Test User');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to clients page
    await page.waitForURL('/clients');
    await expect(page).toHaveURL('/clients');
  });

  test('should display clients list', async ({ page }) => {
    // Check if the main elements are visible
    await expect(page.locator('h1, .clients-count')).toBeVisible();
    await expect(page.locator('.clients-grid, .client-card')).toBeVisible();
    
    // Check if the create client button is visible
    await expect(page.locator('.create-client-btn')).toBeVisible();
    
    // Check if navigation is working
    await expect(page.locator('.nav-menu a[href="/clients"]')).toHaveClass(/active/);
  });

  test('should create a new client', async ({ page }) => {
    // Click create client button
    await page.click('.create-client-btn');
    
    // Wait for modal to open
    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.locator('.modal h2')).toContainText('Criar cliente');
    
    // Fill out the form
    await page.fill('input[name="name"]', TEST_CLIENT.name);
    await page.fill('input[name="salary"]', TEST_CLIENT.salary);
    await page.fill('input[name="companyValuation"]', TEST_CLIENT.companyValuation);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for modal to close
    await expect(page.locator('.modal')).not.toBeVisible();
    
    // Verify the client appears in the list
    await expect(page.locator('.client-card').filter({ hasText: TEST_CLIENT.name })).toBeVisible();
  });

  test('should edit an existing client', async ({ page }) => {
    // First create a client to edit
    await page.click('.create-client-btn');
    await page.fill('input[name="name"]', TEST_CLIENT.name);
    await page.fill('input[name="salary"]', TEST_CLIENT.salary);
    await page.fill('input[name="companyValuation"]', TEST_CLIENT.companyValuation);
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible();
    
    // Find the client card and click edit
    const clientCard = page.locator('.client-card').filter({ hasText: TEST_CLIENT.name });
    await expect(clientCard).toBeVisible();
    
    // Click the edit button (pencil icon)
    await clientCard.locator('button[title="Editar cliente"]').click();
    
    // Wait for modal to open in edit mode
    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.locator('.modal h2')).toContainText('Editar cliente');
    
    // Update the client information
    await page.fill('input[name="name"]', UPDATED_CLIENT.name);
    await page.fill('input[name="salary"]', UPDATED_CLIENT.salary);
    await page.fill('input[name="companyValuation"]', UPDATED_CLIENT.companyValuation);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for modal to close
    await expect(page.locator('.modal')).not.toBeVisible();
    
    // Verify the client was updated
    await expect(page.locator('.client-card').filter({ hasText: UPDATED_CLIENT.name })).toBeVisible();
    await expect(page.locator('.client-card').filter({ hasText: TEST_CLIENT.name })).not.toBeVisible();
  });

  test('should delete a client', async ({ page }) => {
    // First create a client to delete
    await page.click('.create-client-btn');
    await page.fill('input[name="name"]', TEST_CLIENT.name);
    await page.fill('input[name="salary"]', TEST_CLIENT.salary);
    await page.fill('input[name="companyValuation"]', TEST_CLIENT.companyValuation);
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible();
    
    // Find the client card and click delete
    const clientCard = page.locator('.client-card').filter({ hasText: TEST_CLIENT.name });
    await expect(clientCard).toBeVisible();
    
    // Click the delete button (trash icon)
    await clientCard.locator('button[title="Deletar cliente"]').click();
    
    // Wait for confirmation modal
    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.locator('.modal h2')).toContainText('Excluir cliente');
    
    // Confirm deletion
    await page.click('button.btn-danger, button:has-text("Excluir")');
    
    // Wait for modal to close
    await expect(page.locator('.modal')).not.toBeVisible();
    
    // Verify the client is no longer in the list
    await expect(page.locator('.client-card').filter({ hasText: TEST_CLIENT.name })).not.toBeVisible();
  });

  test('should add client to selected list', async ({ page }) => {
    // First create a client
    await page.click('.create-client-btn');
    await page.fill('input[name="name"]', TEST_CLIENT.name);
    await page.fill('input[name="salary"]', TEST_CLIENT.salary);
    await page.fill('input[name="companyValuation"]', TEST_CLIENT.companyValuation);
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible();
    
    // Find the client card and add to selected
    const clientCard = page.locator('.client-card').filter({ hasText: TEST_CLIENT.name });
    await expect(clientCard).toBeVisible();
    
    // Click the add button (plus icon)
    await clientCard.locator('button[title="Adicionar aos selecionados"]').click();
    
    // Navigate to selected clients
    await page.click('.nav-item:has-text("Clientes selecionados")');
    
    // Verify the client appears in the selected list
    await expect(page.locator('.selected-client-card, .client-card').filter({ hasText: TEST_CLIENT.name })).toBeVisible();
  });

  test('should handle pagination', async ({ page }) => {
    // Wait for the page to load
    await expect(page.locator('.clients-grid')).toBeVisible();
    
    // Check if pagination is visible (if there are multiple pages)
    const pagination = page.locator('.pagination');
    
    if (await pagination.isVisible()) {
      // Click on page 2 if it exists
      const page2Button = pagination.locator('button:has-text("2")');
      if (await page2Button.isVisible()) {
        await page2Button.click();
        
        // Verify URL or page content changed
        await expect(page.locator('.clients-grid')).toBeVisible();
      }
    }
    
    // Test items per page selector
    await page.selectOption('.items-per-page-select', '8');
    await expect(page.locator('.clients-grid')).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Mock a network error by intercepting API calls
    await page.route('**/api/users*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    // Reload the page to trigger the error
    await page.reload();
    
    // Check if error message is displayed
    await expect(page.locator(':has-text("Erro"), :has-text("erro")')).toBeVisible();
    
    // Check if retry button is available
    const retryButton = page.locator('button:has-text("Tentar novamente"), button:has-text("novamente")');
    if (await retryButton.isVisible()) {
      await expect(retryButton).toBeVisible();
    }
  });

  test('should maintain responsive design on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if the layout adapts to mobile
    await expect(page.locator('.clients-grid')).toBeVisible();
    
    // Test menu functionality on mobile
    const menuButton = page.locator('.menu-icon, button:has-text("Menu")');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.locator('.sidebar, .mobile-menu')).toBeVisible();
    }
  });
});