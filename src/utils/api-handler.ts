import { InternalError, NotFoundError } from '../types/errors.ts';
import { UserStorage } from '../data/dataStorage';
import type { CustomRequest } from '../types/requests';
import { isKnownError } from './typeguards.ts';

const processMap: Map<string, Map<string, string>> = new Map([
  [
    '/api/users',
    new Map([
      ['GET', 'get users'],
      ['POST', 'create user'],
      ['PUT', 'update user'],
      ['DELETE', 'delete user'],
    ]),
  ],
]);

const pathExtraction = (path: string) => {
  const match = path.match(/^\/api\/users/);
  if (!match) throw new NotFoundError();
  return { url: match[0], userId: path.slice(match[0].length + 1) };
};

const routeHandler = (path: string, method: string) => {
  const { url, userId } = pathExtraction(path);

  return { command: processMap.get(url)?.get(method), arg: userId };
};

export const apiHandler = (request: CustomRequest, storage: UserStorage) => {
  const { command, arg } = routeHandler(request.url, request.method);

  let result = { body: '', code: 200 };
  try {
    switch (command) {
      case 'get users':
        result.body = JSON.stringify(storage.getUsers(arg ?? null));
        break;
      case 'create user':
        result.body = JSON.stringify(storage.createUser(request.body));
        result.code = 201;
        break;
      case 'update user':
        result.body = JSON.stringify(storage.updateUser(arg, request.body));
        break;
      case 'delete user':
        storage.deleteUser(arg);
        result.body = 'The user have been deleted';
        result.code = 204;
        break;
      default:
        throw new NotFoundError();
    }
  } catch (error) {
    if (isKnownError(error)) throw error;
    throw new InternalError();
  }
  return result;
};
