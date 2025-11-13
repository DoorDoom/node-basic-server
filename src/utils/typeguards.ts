import {
  BadRequestError,
  InternalError,
  NotFoundError,
} from '../types/errors.ts';

export function isKnownError(
  error: unknown,
): error is BadRequestError | NotFoundError | InternalError {
  return [BadRequestError, NotFoundError, InternalError].some(
    (e) => error instanceof e,
  );
}
