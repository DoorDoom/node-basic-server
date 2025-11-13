// import { PORT } from './environment/env';
import { UserStorage } from './data/dataStorage.ts';
import { PORT } from './environment/env.ts';
import http from 'http';
import { processRequest } from './utils/request-utils.ts';
import { apiHandler } from './utils/api-handler.ts';
import type { CustomRequest } from './types/requests.ts';
import { isKnownError } from './utils/typeguards.ts';

const server = http.createServer(async (request, response) => {
  const userStorage = new UserStorage();
  const processedRequest: CustomRequest = await processRequest(request);

  try {
    const { id } = apiHandler(processedRequest, userStorage);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(id);
  } catch (error) {
    if (isKnownError(error))
      response.writeHead(error.statusCode, {
        'Content-Type': 'application/json',
      });

    response.end((error as Error).message);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
