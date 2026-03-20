import { describe, it, test } from 'node:test';
import assert from 'node:assert';
import { createServer } from './server';

describe('tests', async (t) => {
  const app = await createServer(3000);

  it('GET `/products` empty route', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/products',
    });

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    );
    assert.deepStrictEqual(response.json(), []);
  });

  it('POST `/products` empty route', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/products',
      payload: {
        name: 'fish123',
        description: 'tasty fish',
        category: 'Application',
        price: 300,
        inStock: true,
      },
    });

    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    );

    const { name, description, category, price, inStock } = response.json();
    assert.deepStrictEqual(
      { name, description, category, price, inStock },
      {
        name: 'fish123',
        description: 'tasty fish',
        category: 'Application',
        price: 300,
        inStock: true,
      },
    );
  });

  it('GET `/products` created product', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/products',
      payload: {
        name: 'fish123',
        description: 'tasty fish',
        category: 'Application',
        price: 300,
        inStock: true,
      },
    });

    assert.strictEqual(response.statusCode, 201);

    const { id } = response.json();

    const productResponse = await app.inject({
      method: 'GET',
      url: `/products/${id}`,
    });

    const { name, description, category, price, inStock } =
      productResponse.json();

    assert.strictEqual(productResponse.statusCode, 200);
    assert.deepStrictEqual(
      { name, description, category, price, inStock },
      {
        name: 'fish123',
        description: 'tasty fish',
        category: 'Application',
        price: 300,
        inStock: true,
      },
    );
  });
});
