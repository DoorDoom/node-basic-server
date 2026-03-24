import dotenv from 'dotenv';
import fastify from 'fastify';
import cluster from 'cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';
import http from 'http';
import { createServer } from './server';

const numCPUs = availableParallelism();

dotenv.config({
  path: './environments/.env',
});
const port = process.env.PORT ? Number(process.env.PORT) : 8080;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    const workerPort = port + i + 1;
    cluster.fork({ PORT: workerPort });
    console.log(`Started worker ${i} on port ${workerPort}`);
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  // Add a load balancer
  // let current = 0;

  // const server = fastify({
  //   logger: true,
  // });

  // server.all('*', (request, reply) => {
  //   const targetPort = port + (current % numCPUs) + 1;
  //   current = (current + 1) % numCPUs;
  //   const { method, url, headers } = request;

  //   const options = {
  //     hostname: 'localhost',
  //     port: targetPort,
  //     path: request.url,
  //     method: request.method,
  //     headers: request.headers,
  //   };

  //   const proxyReq = http.request(options, (proxyRes) => {
  //     console.log(`Proxying request to worker on port ${targetPort}`);
  //     reply.code(proxyRes.statusCode || 500);

  //     for (const [key, value] of Object.entries(proxyRes.headers)) {
  //       reply.header(key, value);
  //     }

  //     proxyRes.pipe(reply.raw);
  //   });

  //   proxyReq.on('error', (err) => {
  //     console.error(err);
  //     reply.code(500).send({ error: 'Multi server error' });
  //   });
  // });

  // server.listen({ port }, (err, address) => {
  //   if (err) {
  //     console.error(err);
  //     process.exit(1);
  //   }
  //   console.log(`Load balancer listening at ${address}`);
  // });
} else {
  const appPort = process.env.PORT;
  createServer(Number(appPort) || 3000, true);

  console.log(`Worker ${process.pid} started on port ${appPort}`);
}
