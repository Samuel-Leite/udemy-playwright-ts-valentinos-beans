import { expect, test } from '@playwright/test'

test('create order', async ({ request }) => {
    const orderPayload = {
        customerDetails: {
            firstName: "Duck",
            lastName: "Tales",
            email: "duck@bank.com",
            address: "Patopolis",
            city: "Sao Paulo",
            zipCode: "12345",
            country: "United States"
        },
        items: [
            {
                productId: "504",
                quantity: 1
            }
        ]
    }

    const orderResponse = await request.post('/orders', {
        data: orderPayload
    });

    //   Check status code
    expect(orderResponse.status()).toBe(201);

    const orderBody = await orderResponse.json();

    // Validate order response
    expect(orderBody).toHaveProperty('success', true);
    expect(orderBody).toHaveProperty('data');

    console.log(orderBody);
})