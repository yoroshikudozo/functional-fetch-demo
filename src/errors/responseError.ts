import { TypedResponse } from '..';

export default class ResponseError extends Error {
  statusText: string;
  status: number;
  url: string | undefined;
  stack: any;
  response: any;

  constructor(res: TypedResponse<unknown>) {
    super();

    this.name = 'ResponseError';
    this.url = res.url;
    this.statusText = res.statusText;
    this.status = res.status;
    this.response = res;
    this.stack = new Error().stack;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError);
    }
  }
}
