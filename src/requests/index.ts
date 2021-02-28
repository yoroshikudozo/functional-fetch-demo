import * as t from 'io-ts';

import http from '..';

export const ok = t.type({ code: t.number, description: t.string });

export type Ok = t.TypeOf<typeof ok>;

const okRequest = fetch('https://httpstat.us/200', {
  headers: { Accept: 'application/json' },
});

export const fetchOk = http(okRequest, ok);
