// import { BadRequestError, InternalError, NotFoundError } from 'types/errors';

import { BadRequestError } from '../types/errors.ts';
import { UserStorage } from '../data/dataStorage';
import type { CustomRequest } from '../types/requests';

const pathExtraction = (path: string) => {
  if (!path.match(/^api\/users/)) throw new BadRequestError();
};
const routeHandler = (path: string) => {
  pathExtraction(path);
};

export const apiHandler = (request: CustomRequest, storage: UserStorage) => {
  routeHandler(request.url);
  return { id: '123', request, storage };
  //   try {
  //     switch (error) {
  //       case 'not found':
  //         throw new NotFoundError();
  //       case 'bad request':
  //         throw new BadRequestError();
  //       default:
  //         throw new InternalError();
  //     }
  //   } catch (error) {
  //     switch (error) {
  //       case 'not found':
  //         throw new NotFoundError();
  //       case 'bad request':
  //         throw new BadRequestError();
  //       default:
  //         throw new InternalError();
  //     }
  //   }
};
