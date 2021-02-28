import { FetchError } from 'node-fetch';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';

import ConnectionError from './errors/connectionError';
import ParseError from './errors/parseError';
import ResponseError from './errors/responseError';

export const connect = (task: Promise<Response>) =>
  TE.tryCatch(
    () => task,
    reason => new ConnectionError(reason as FetchError)
  );

export const checkResponse = (response: Response) =>
  E.tryCatch(
    () => {
      if (response.ok) return response;
      throw new ResponseError(response);
    },
    reason => reason as ResponseError
  );

export const toJson = (res: Response) =>
  TE.tryCatch(
    () => res.json(),
    reason => new ParseError(reason as FetchError)
  );

const http = <T extends t.Props>(
  request: Promise<Response>,
  type: t.TypeC<T>
) =>
  pipe(
    request,
    connect,
    TE.chainW(pipe(checkResponse, TE.fromEitherK)),
    TE.chainW(toJson),
    TE.chainW(pipe(type.decode, TE.fromEitherK))
  );

export default http;
