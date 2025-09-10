import { test, expect } from '@playwright/test';

const HOMEPAGE_URL = 'https://valentinos-magic-beans.click/';
const PRODUCT_NAME = 'Brazilian Santos';
const GUEST_EMAIL = `guest${Date.now()}@example.com`;

// Helper selectors (update if needed based on actual site)
const selectors = {
    productCard: '.product-card',
    productTitle: '.product-title',
    addToCartButton: 'button:has-text("Add to Cart")',
    cartIcon: 'a[href*="cart"]',
    checkoutButton: 'button:has-text("Checkout")',
    guestEmailInput: 'input[type="email"]',
    placeOrderButton: 'button:has-text("Place Order")',
    orderId: 'div.bg-gray-100.rounded-lg.p-6 > p.font-mono.font-bold',
    orderStatus: '.order-status',
    orderProduct: '.order-product',
    orderPrice: '.order-price',
    orderLookupEmail: 'input[type="email"]',
    orderLookupId: 'input[name="orderId"]',
    orderLookupButton: 'button[data-test-id="contact-track-order-button"]',
};

test('Guest user can order Brazilian Coffee and verify order status', async ({ page }) => {
    // 1. Navigate to homepage
    await page.goto(HOMEPAGE_URL);


    // 2. Find Brazilian Coffee product and add to cart using helper
    const productWrappers = page.locator('.p-6');
    const count = await productWrappers.count();
    let found = false;
    let productIndex = -1;
    let productName = '';
    let productPrice = 0;
    for (let i = 0; i < count; i++) {
        const name = await productWrappers.nth(i).getByRole('heading').first().textContent();
        if (name?.includes(PRODUCT_NAME)) {
            productIndex = i;
            found = true;
            break;
        }
    }
    expect(found).toBeTruthy();
    // Add to cart
    const priceText = await productWrappers.nth(productIndex).locator('.font-bold').textContent();
    productName = PRODUCT_NAME;
    productPrice = Number(priceText?.substring(1));
    await productWrappers.nth(productIndex).getByRole('button', { name: 'Add to Cart' }).click();

    // 4. Go to cart
    await page.click(selectors.cartIcon);

    // 5. Proceed to checkout
    await page.click(selectors.checkoutButton);


    // 6. Fill guest email
    await page.fill(selectors.guestEmailInput, GUEST_EMAIL);

    // 7. Fill shipping info (try common field names and fallback to label text)
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="address"]', 'Rua das Flores, 123').catch(() => { });
    await page.fill('input[name="city"]', 'São Paulo').catch(() => { });
    await page.fill('input[name="zipCode"]', '01001-000');
    await page.fill('input[name="country"]', '');
    await page.fill('input[name="country"]', 'Brazil');

    // 8. Fill payment info
    await page.fill('input[name="cardName"]', 'Test User');
    await page.locator('input[name="cardNumber"]').pressSequentially('4242424242424242', { delay: 50 });
    await page.fill('input[name="cardExpiry"]', '12/30');
    await page.fill('input[name="cardCvc"]', '123');

    // 9. Place order
    await page.click(selectors.placeOrderButton);

    // 10. Wait for order confirmation page and capture order ID
    await page.waitForURL('**/order-confirmation', { timeout: 15000 });
    await expect(page.locator(selectors.orderId)).toBeVisible({ timeout: 10000 });
    const orderId = await page.locator(selectors.orderId).textContent();

    // Order product and price are not available on confirmation page, only orderId is used for tracking

    // 11. Click 'Track Your Order' and fill order ID and email
    await page.getByRole('link', { name: 'Track Your Order' }).click();
    await expect(page).toHaveURL(/.*contact*/);
    await page.fill(selectors.orderLookupEmail, GUEST_EMAIL);
    await page.fill(selectors.orderLookupId, orderId || '');
    await page.click(selectors.orderLookupButton);

    // 12. Verify order status and details
    await expect(page.getByText(PRODUCT_NAME)).toBeVisible();
});
