// import { PORT } from './environment/env';
import { UserStorage } from './data/dataStorage';
import { PORT } from './environment/env';
import http from 'http';
import { processRequest } from './utils/request-utils';
import { apiHandler } from './utils/api-handler';
import type { CustomRequest } from './types/requests';
import { isKnownError } from './utils/typeguards';

const userStorage = new UserStorage();

const server = http.createServer(async (request, response) => {
  const processedRequest: CustomRequest = await processRequest(request);

  try {
    const { body, code } = apiHandler(processedRequest, userStorage);
    response.writeHead(code, { 'Content-Type': 'application/json' });
    response.end(body);
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
