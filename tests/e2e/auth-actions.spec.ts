import { expect, test } from '@playwright/test'

test('test', async ({ page }) => {
    await page.goto('/')
    // check if user is authenticared
    await page.locator('div').filter({ hasText: /^Toggle navigation menu$/ }).locator('div').getByRole('button').click()
    const welcomeMessage = page.getByText('Welcome')
    await expect(welcomeMessage).toBeVisible()
    // page is authenticared
})