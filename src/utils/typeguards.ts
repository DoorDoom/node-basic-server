import { User } from '../types/user';
import { BadRequestError, InternalError, NotFoundError } from '../types/errors';

export function isKnownError(
  error: unknown,
): error is BadRequestError | NotFoundError | InternalError {
  return [BadRequestError, NotFoundError, InternalError].some(
    (e) => error instanceof e,
  );
}

export function isUser(object: any): object is User {
  return (
    ['age', 'hobbies', 'username', 'id'].filter(
      (key) => !Object.hasOwn(object, key),
    ).length === 0
  );
}
