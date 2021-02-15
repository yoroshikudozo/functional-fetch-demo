import nodeFetch from 'node-fetch';
import * as E from 'fp-ts/lib/Either';
import { flow, identity } from 'fp-ts/function';
import { request, http, okRequest } from '../src';
import ApplicationError from '../src/errors/connectionError';

global.fetch = (nodeFetch as unknown) as typeof fetch;

export interface TypedResponse<T> extends Response {
  /**
   * this will override `json` method from `Body` that is extended by `Response`
   * interface Body {
   *     json(): Promise<any>;
   * }
   */
  json<P = T>(): Promise<P>;
}

declare function fetch<T>(
  url: RequestInfo,
  init?: RequestInit
): Promise<TypedResponse<T>>;

describe('request', () => {
  it('works', async () => {
    const task = fetch('http://localhost:3000/test');
    const result = await request(task)();
    expect(E.isLeft(result)).toBe(true);
  });

  it('200', async () => {
    const result = await request(fetch('https://httpstat.us/200'))();
    expect(E.isRight(result)).toBe(true);
  });

  it('400', async () => {
    const result = await request(fetch('https://httpstat.us/400'))();
    expect(E.isRight(result)).toBe(true);
  });
});

describe('http', () => {
  it('works', async () => {
    const task = fetch('http://localhost:3000/test');
    const result = await http<{}>(task)();
    const onLeft = (err: ApplicationError) => {
      console.log(err);
      console.log(err.name);
      console.log(err.message);
      console.log(err.code);
      console.log(err.stack);
    };
    const fold = flow(E.fold(onLeft, identity));
    fold(result);
    // expect(result).toEqual(E.left(Error()));
    expect(E.isLeft(result)).toBe(true);
  });

  it('200', async () => {
    const request = fetch('https://httpstat.us/200', {
      headers: { Accept: 'application/json' },
    });
    const result = await http(request)();
    const onLeft = (err: ApplicationError) => {
      console.log(err);
      console.log(err.name);
      console.log(err.message);
      console.log(err.code);
      console.log(err.stack);
    };
    const fold = flow(E.fold(onLeft, identity));
    fold(result);
    console.log(result);
    expect(E.isRight(result)).toBe(true);
  });

  it('ParseError', async () => {
    const request = fetch('https://httpstat.us/200');
    const result = await http(request)();
    const onLeft = (err: ApplicationError) => {
      console.log(err);
      console.log(err.name);
      console.log(err.message);
      console.log(err.code);
      console.log(err.stack);
    };
    const fold = flow(E.fold(onLeft, identity));
    fold(result);
    expect(E.isLeft(result)).toBe(true);
  });

  it('400', async () => {
    const result = await http(fetch('https://httpstat.us/400'))();
    const onLeft = (err: ApplicationError) => {
      console.log(err);
      console.log(err.name);
      console.log(err.message);
      console.log(err.code);
      console.log(err.stack);
    };
    const fold = flow(E.fold(onLeft, identity));
    fold(result);
    expect(E.isLeft(result)).toBe(true);
  });
});

describe('okRequest', () => {
  it('works', async () => {
    const result = await okRequest();
    const onLeft = (err: ApplicationError) => {
      console.log(err);
      console.log(err.name);
      console.log(err.message);
      console.log(err.code);
      console.log(err.stack);
    };
    const fold = flow(E.fold(onLeft, identity));
    fold(result);
    // expect(result).toEqual(E.left(Error()));
    expect(E.isRight(result)).toBe(true);
  });
});
