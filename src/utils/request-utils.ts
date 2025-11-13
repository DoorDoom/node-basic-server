import { IncomingMessage } from 'http';
import { CustomRequest } from '../types/requests';

const processRequest = (req: IncomingMessage): Promise<CustomRequest> =>
  new Promise((resolve, _) => {
    let body = '';

    req.on('data', (chunk) => (body += chunk.toString()));

    req.on('end', () => {
      resolve({ body, method: req.method ?? '', url: req.url ?? '' });
    });
  });
export { processRequest };
