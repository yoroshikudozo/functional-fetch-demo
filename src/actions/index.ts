import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import { fetchOk } from '../requests';
import { dispatch } from '../utils';

export const createOkThunk = pipe(
  fetchOk,
  TE.fold(
    err => T.fromIO(dispatch('failed', err)),
    res => T.fromIO(dispatch('success', res))
  )
);
