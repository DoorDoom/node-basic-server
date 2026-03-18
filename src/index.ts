import fastify from 'fastify';
import { ProductService } from './services/productService.ts';
import { createProductSchema } from './schemas/product.ts';

const server = fastify({
  logger: true,
});
const productService = new ProductService();

server.post(
  '/products',
  { schema: { body: createProductSchema } },
  async (request, reply) => {
    const product = productService.create(request.body as any);
    return reply.code(201).send(product);
  },
);

server.get('/products', async () => {
  return productService.findAll();
});

server.get('/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const product = productService.findById(id);

  if (!product) {
    return reply.code(404).send({ message: 'Product not found' });
  }

  return product;
});

server.put('/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const updated = productService.update(id, request.body as any);

  if (!updated) {
    return reply.code(404).send({ message: 'Product not found' });
  }

  return updated;
});

server.delete('/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const deleted = productService.delete(id);

  if (!deleted) {
    return reply.code(404).send({ message: 'Product not found' });
  }

  return reply.code(204).send();
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
