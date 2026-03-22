import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createServer } from './server';
import { FastifyInstance } from 'fastify';

describe('tests', async (t) => {
  let app: FastifyInstance;

  before(async () => {
    app = await createServer(3000);
  });

  after(async () => {
    await app.close();
  });

  await it('GET `/products` empty route', async () => {
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

  await it('POST `/products` empty route', async () => {
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

  await it('GET `/products` created product', async () => {
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

    const { id } = await response.json();

    const productResponse = await app.inject({
      method: 'GET',
      url: `/products/${id}`,
    });

    const { name, description, category, price, inStock } =
      await productResponse.json();

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
