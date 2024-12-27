import { IS_DEVELOPMENT } from '#app/constants'

/**
 * Custom error class for database-related errors.
 * Includes support for cause and context information.
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    public readonly context?: unknown,
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

/**
 * Extracts an error message from an unknown error type.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  if (IS_DEVELOPMENT) {
    console.error('Unable to get error message for error', error)
  }

  return 'Unknown Error'
}
