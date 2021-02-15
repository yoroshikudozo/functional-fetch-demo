import { FetchError } from 'node-fetch';
import ApplicationError from './applicationError';

export default class ParseError extends ApplicationError {
  type?: string;

  constructor(error: FetchError) {
    super(error);

    this.name = `${error.name}[ParseError]`;
    this.message = error.message;
    this.type = error.type;
    this.stack = new Error().stack;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseError);
    }
  }
}
