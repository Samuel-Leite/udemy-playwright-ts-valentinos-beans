import { expect, test } from '@playwright/test'

test('should get all products', async ({ request }) => {
    // Make HTTP request
    const response = await request.get('/products');

    //   Check status code
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    //   Check headers
    expect(response.headers()['content-type']).toBe('application/json');

    //   Parse JSON response
    const responseBody = await response.json();

    //   Response structure validation
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody).toHaveProperty('data');
    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBeGreaterThan(0);

    //   Log response body
    console.log(responseBody);
})