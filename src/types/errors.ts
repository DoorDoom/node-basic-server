class NotFoundError extends Error {
  statusCode: number;

  constructor() {
    super('Not found');
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  statusCode: number;

  constructor() {
    super('Bad request');
    this.statusCode = 400;
  }
}

class InternalError extends Error {
  statusCode: number;

  constructor() {
    super('Internal server error');
    this.statusCode = 500;
  }
}
export { NotFoundError, BadRequestError, InternalError };
