import { UserStorage } from './data/dataStorage';
import cluster from 'node:cluster';
import { PORT } from './environment/env';
import http from 'http';
import { availableParallelism } from 'node:os';
import process from 'node:process';
import { processRequest } from './utils/request-utils';
import { apiHandler } from './utils/api-handler';
import type { CustomRequest } from './types/requests';
import { isKnownError } from './utils/typeguards';
import { User } from './types/user';

const userStorage = new UserStorage();
let reqs = 0;
const numCPUs = availableParallelism();
const serverWork = (port: number, distributionFunc?: Function) => {
  const server = http.createServer(async (request, response) => {
    const processedRequest: CustomRequest = await processRequest(request);

    try {
      if (distributionFunc) {
        const worker = 3000 + distributionFunc(reqs, numCPUs) + 1;
        reqs++;
        let options: {
          method: string;
          headers: Record<string, string>;
          body?: string;
        } = {
          method: processedRequest.method,
          headers: { 'Content-Type': 'application/json' },
        };
        if (
          processedRequest.method === 'PUT' ||
          processedRequest.method === 'POST'
        )
          options = { ...options, body: processedRequest.body };
        const workerResponse = await fetch(
          `http://localhost:${worker}${processedRequest.url}`,
          options,
        );
        const result = await workerResponse.json();
        response.writeHead(workerResponse.status, {
          'Content-Type': 'application/json',
        });
        response.end(JSON.stringify(result));
      } else {
        const { body, code } = apiHandler(processedRequest, userStorage);
        console.log('request');
        console.log(userStorage.getUsers());
        if (process.send)
          process.send({ cmd: 'update', value: userStorage.getUsers() });
        response.writeHead(code, { 'Content-Type': 'application/json' });
        response.end(body);
      }
    } catch (error) {
      if (isKnownError(error))
        response.writeHead(error.statusCode, {
          'Content-Type': 'text/plain',
        });

      response.end((error as Error).message);
    }
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
};
const roundRobin = (nums: number, maxProc: number) => {
  return nums % maxProc;
};

if (cluster.isPrimary) {
  serverWork(Number(PORT) ?? 3000, roundRobin);

  function messageHandler(msg: { cmd: string; value: User[] }) {
    if (msg.cmd === 'update') {
      userStorage.updateUsers(msg.value);
      for (const id in cluster.workers) {
        if (cluster.workers[id]) cluster.workers[id].send(msg);
      }
    }
    if (msg.cmd === 'get') {
      for (const id in cluster.workers) {
        if (cluster.workers[id])
          cluster.workers[id].send({
            cmd: 'update',
            value: userStorage.getUsers(),
          });
      }
    }
  }

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      WORKER_PORT: (Number(PORT) ?? 3000) + i + 1,
    });
  }

  for (const id in cluster.workers) {
    cluster.workers[id]!.on('message', messageHandler);
  }

  //   cluster.on('message', (msg: { cmd: string; value: User[] }) => {
  //     console.log('msg.cmd');
  //     console.log(msg.cmd);
  //   if (msg.cmd === 'update') {
  //     userStorage.users=msg.value);
  //     console.log(msg);
  //     for (const id in cluster.workers) cluster.workers[id]!.send(msg);
  //   }
  //   });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  process.send!({ cmd: 'get' });

  serverWork(Number(process.env.WORKER_PORT));

  process.on('message', (msg: { cmd: string; value: User[] }) => {
    if (!msg || typeof msg !== 'object') return;

    if (msg.cmd === 'update') {
      userStorage.updateUsers(msg.value);
    }
  });
}
