import * as IO from 'fp-ts/lib/IO';

const log = (...args: unknown[]): IO.IO<void> => () => console.log(args);
export const dispatch = <T>(type: string, data: T) => log(type, data);
