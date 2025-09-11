import { test, expect } from '@playwright/test';

test('browse products and create order', async ({ request }) => {
  // Step 1: Get all products
  const productsResponse = await request.get('/products');
  expect(productsResponse.status()).toBe(200);
  
  const productsBody = await productsResponse.json();
  expect(productsBody.success).toBe(true);
  expect(Array.isArray(productsBody.data)).toBe(true);
  
  // Step 2: Find first product with stock > 0
  const products = productsBody.data;
  const availableProduct = products.find(product => product.stock > 0);
  
  expect(availableProduct).toBeDefined();
  expect(availableProduct.stock).toBeGreaterThan(0);
  
  // Step 3: Create order with the selected product
  const orderPayload = {
    customerDetails: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      address: "1234 Main St.",
      city: "Rhyolite",
      zipCode: "89003",
      country: "United States"
    },
    items: [
      {
        productId: availableProduct.id,
        quantity: 1
      }
    ]
  };
  
  const orderResponse = await request.post('/orders', {
    data: orderPayload
  });
    
  // Validate order creation response
  expect(orderResponse.status()).toBe(201);
  expect(orderResponse.headers()['content-type']).toBe('application/json');
  
  const orderBody = await orderResponse.json();

  console.log('Order created:', orderBody);
  
  // Validate order response
  expect(orderBody).toHaveProperty('success', true);
  expect(orderBody).toHaveProperty('data');
  
  // Validate order data structure
  const orderData = orderBody.data;
  expect(orderData).toHaveProperty('orderId');
  expect(orderData).toHaveProperty('message', 'Order created successfully');
  
  // Validate orderId format (appears to be uppercase alphanumeric)
  expect(typeof orderData.orderId).toBe('string');
  expect(orderData.orderId.length).toBeGreaterThan(0);
  expect(orderData.orderId).toMatch(/^[A-Z0-9]+$/);
});
  