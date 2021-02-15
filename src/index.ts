import fetch from 'node-fetch';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { FetchError } from 'node-fetch';
import ConnectionError from './errors/connectionError';
import ParseError from './errors/parseError';
import ResponseError from './errors/responseError';
import { flow } from 'fp-ts/lib/function';

export interface TypedResponse<T> extends Response {
  /**
   * this will override `json` method from `Body` that is extended by `Response`
   * interface Body {
   *     json(): Promise<any>;
   * }
   */
  json<P = T>(): Promise<P>;
}

export const request = <T>(task: Promise<TypedResponse<T>>) =>
  TE.tryCatch(
    () => task,
    reason => new ConnectionError(reason as FetchError)
  );

export const checkResponse = <T>(response: TypedResponse<T>) =>
  TE.fromEither(
    E.tryCatch(
      () => {
        if (response.ok) return response;
        throw new ResponseError(response);
      },
      reason => reason as ResponseError
    )
  );

export const toJson = <T>(res: TypedResponse<T>) =>
  TE.tryCatch(
    () => res.json(),
    reason => new ParseError(reason as FetchError)
  );

export const http = flow(request, TE.chainW(checkResponse), TE.chainW(toJson));

const ok = (fetch('https://httpstat.us/200', {
  headers: { Accept: 'application/json' },
}) as unknown) as Promise<TypedResponse<{ type: string }>>;

export const okRequest = http(ok);
