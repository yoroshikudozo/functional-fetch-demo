import { FetchError } from 'node-fetch';
import ApplicationError from './applicationError';

export default class ConnenctionError extends ApplicationError {
  code?: string;
  type?: string;

  constructor(error: FetchError) {
    super(error);

    this.name = `${error.name}[ConnectionError]`;
    this.message = error.message;
    this.type = error.type;
    this.code = error.code;
    this.stack = new Error().stack;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConnenctionError);
    }
  }
}
