# Functional fetch demo

Fetch implementation by fp-ts and io-ts

## Usage

```typescript
// src/requests/index.ts
import * as t from 'io-ts';

import http from '..';

// Define Response type
const ok = t.type({
  code: t.number,
  description: t.string,
});

// { code: number; description: string; }
export type Ok = t.TypeOf<typeof ok>;

// Request
const okRequest = fetch('https://httpstat.us/200', {
  headers: { Accept: 'application/json' },
});

// Request
// TaskEither<ResponseError | ParseError | ConnenctionError | t.Errors, Ok>
export const fetchOk = http(okRequest, ok);
```

## Side effects

```typescript
// src/actions/index.ts
export const fetchOkThunk = pipe(
  fetchOk,
  TE.fold(
    err => T.fromIO(dispatch('failed', err)),
    res => T.fromIO(dispatch('success', res))
  )
);
```
