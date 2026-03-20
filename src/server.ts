import fastify from 'fastify';
import { ProductService } from './services/productService';
import { createProductSchema } from './schemas/product';

export async function createServer(port: number, multiplex = false) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const server = fastify({
    logger: !multiplex,
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

    if (!uuidRegex.test(id)) {
      return reply.code(400).send({ message: 'Invalid product ID format' });
    }

    if (!product) {
      return reply.code(404).send({ message: "Product doesn't exist" });
    }

    return product;
  });

  server.put('/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const updated = productService.update(id, request.body as any);

    if (!uuidRegex.test(id)) {
      return reply.code(400).send({ message: 'Invalid product ID format' });
    }

    if (!updated) {
      return reply.code(404).send({ message: "Product doesn't exist" });
    }

    return updated;
  });

  server.delete('/products/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = productService.delete(id);

    if (!uuidRegex.test(id)) {
      return reply.code(400).send({ message: 'Invalid product ID format' });
    }

    if (!deleted) {
      return reply.code(404).send({ message: "Product doesn't exist" });
    }

    return reply.code(204).send();
  });

  const start = async () => {
    try {
      await server.listen({ port: 3000 });
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  await start();

  return server;
}
