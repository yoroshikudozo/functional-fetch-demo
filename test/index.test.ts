import fetch, { FetchError, Response as nfResponse } from 'node-fetch';
import * as t from 'io-ts';
import * as E from 'fp-ts/lib/Either';

import http, { connect } from '../src';
import ConnenctionError from '../src/errors/connectionError';
import ResponseError from '../src/errors/responseError';

describe('connect', () => {
  it('works', async () => {
    const task = (fetch('http://localhost:3000/test') as unknown) as Promise<
      Response
    >;
    const result = await connect(task)();
    expect(E.isLeft(result)).toBe(true);
  });

  it('200', async () => {
    const task = (fetch('https://httpstat.us/200') as unknown) as Promise<
      Response
    >;
    const result = await connect(task)();
    expect(E.isRight(result)).toBe(true);
  });

  it('400', async () => {
    const task = (fetch('https://httpstat.us/400') as unknown) as Promise<
      Response
    >;
    const result = await connect(task)();
    expect(E.isRight(result)).toBe(true);
  });
});

describe('http', () => {
  it('works', async () => {
    const task = (fetch('http://localhost:3000/test') as unknown) as Promise<
      Response
    >;
    const result = await http(
      task,
      t.type({ code: t.number, description: t.string })
    )();
    const error = new ConnenctionError(
      new FetchError(
        'request to http://localhost:3000/test failed, reason: connect ECONNREFUSED 127.0.0.1:3000',
        'system'
      )
    );
    expect(E.isLeft(result)).toBe(true);
    expect(result).toEqual(E.left(error));
  });

  it('200', async () => {
    const task = (fetch('https://httpstat.us/200', {
      headers: { Accept: 'application/json' },
    }) as unknown) as Promise<Response>;
    const result = await http(
      task,
      t.type({ code: t.number, description: t.string })
    )();
    expect(E.isRight(result)).toBe(true);
  });

  it('ParseError', async () => {
    const task = (fetch('https://httpstat.us/200') as unknown) as Promise<
      Response
    >;
    const result = await http(
      task,
      t.type({ code: t.number, description: t.string })
    )();
    const error = new ConnenctionError(
      new FetchError(
        'invalid json response body at https://httpstat.us/200 reason: Unexpected token O in JSON at position 4',
        'system'
      )
    );
    expect(E.isLeft(result)).toBe(true);
    expect(result).toEqual(E.left(error));
  });

  it('400', async () => {
    const task = (fetch('https://httpstat.us/400') as unknown) as Promise<
      Response
    >;
    const result = await http(
      task,
      t.type({ code: t.number, description: t.string })
    )();
    const error = new ResponseError(
      (new nfResponse('asdf') as unknown) as Response
    );
    expect(E.isLeft(result)).toBe(true);
    expect(result).toEqual(E.left(error));
  });
});
