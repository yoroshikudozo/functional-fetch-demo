export default class ApplicationError extends Error {
  stack?: string;

  constructor(error: Error) {
    super();

    this.name = 'ApplicationError';
    this.message = error.message;
    this.stack = new Error().stack;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError);
    }
  }
}
