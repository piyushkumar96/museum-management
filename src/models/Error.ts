// eslint-disable-next-line max-classes-per-file
import { Logger } from '@piyushkumar96-common-libraries/app-logger';
import {
  blue, bold, red, underline, yellow,
} from 'colors/safe';
import { AxiosError } from 'axios';

/**
 * Error with a basic message.
 */
export class BasicError extends Error {
  name = 'BasicError';
}

/**
 * Error that happened due to an invariant being broken.
 */
export class BugError extends Error {
  name = 'BugError';

  constructor(
    message: string,
    public readonly extraData: Record<string, any>,
    public readonly source?: Error,
  ) {
    super(message);
  }
}

/**
 * The functionality is still not implemented.
 */
export class Unimplemented extends BugError {
  constructor(message?: string) {
    let msg: string;
    if (message) {
      msg = `${message}: Unimplemented`;
    } else {
      msg = 'Unimplemented';
    }
    super(msg, {
      expected: 'The functionality should be implemented.',
    });
    this.name = 'Unimplemented';
  }
}

export function isAxiosError(e: unknown): e is AxiosError {
  return e instanceof Error && (e as any).isAxiosError;
}

/**
 * Checks if the error thrown is due to a connectivity issue.
 */
export function isNetworkError(e: unknown): boolean {
  return (
    isAxiosError(e) && (e.response === undefined || e.response.status >= 500)
  );
}

/**
 * Checks if the error thrown means that the action can be retried and possibly succeed.
 */
export function isRetriableError(e: unknown): boolean {
  return isNetworkError(e);
}

const ErrorKind = {
  /**
   * An invalid error was thrown (not an instance of Error).
   */
  Invalid: 0,
  /**
   * An error caused by a bug was thrown.
   */
  Bug: 1,
  /**
   * An error caused by the user (e.g. invalid data, etc.).
   */
  User: 2,
  /**
   * An uncaught error was thrown.
   *
   * Possible sources:
   *  * Calls to Cosmos
   *  * TypeErrors (e.g. invalid casts, wrong configuration, etc.)
   */
  Unknown: 3,
} as const;

function printError(e: Error) {
  if (isAxiosError(e)) {
    // If the error was caused by a call to axios, try to print the url,
    // and the payload.
    Logger.error(`${e.config.url}: ${e.stack ?? e.message}`);
    if (e.response?.data?.error) {
      Logger.error(JSON.stringify(e.response.data.error, null, 2));
    } else if (e.response?.data) {
      Logger.error(JSON.stringify(e.response.data, null, 2));
    }
  } else if (e.stack) {
    // Otherwise just try to print the stack trace (it also prints the message).
    Logger.error(e.stack);
  } else {
    // If there is no stack trace, just print the message.
    Logger.error(e.message);
  }
}

/**
 * Centralized error logging.
 */
export function logError(message: string, e: unknown) {
  if (!(e instanceof Error)) {
    const errorKindInvalid = blue(`${ErrorKind.Invalid}`);
    if (typeof e === 'object' && e !== null) {
      Logger.error(
        `${errorKindInvalid} | ${blue(
          'INVALID',
        )} | ${message} | ${JSON.stringify(e, null, 2)}`,
      );
    } else {
      Logger.error(
        `${errorKindInvalid} | ${blue('INVALID')} | ${message} | ${e}`,
      );
    }
  } else if (e instanceof BugError) {
    const errorKind = bold(underline(red(`${ErrorKind.Bug}`)));
    Logger.error(`${errorKind} | ${bold(underline(red('BUG')))} | ${message}`);
    printError(e);
    Logger.error(
      `${bold(underline(red('Extra error data')))}: ${JSON.stringify(
        e.extraData,
        null,
        2,
      )}`,
    );
  } else if (e instanceof BasicError) {
    const errorKindUser = yellow(`${ErrorKind.User}`);

    Logger.warn(
      `${errorKindUser} | ${yellow('USER')} | ${message} | ${e.message}`,
    );

    if (e.stack) {
      Logger.debug(e.stack);
    }
  } else {
    const unknownError = red(`${ErrorKind.Unknown}`);
    Logger.error(`${unknownError} | ${red('UNKNOWN')} | ${message}`);
    printError(e);
  }
}
