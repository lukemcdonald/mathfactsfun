/**
 * Function to extract an error message from an unknown error type.
 *
 * @param error - The error object which can be of any type.
 * @returns A string representing the error message.
 */
export function getErrorMessage(error: unknown) {
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

  console.error('Unable to get error message for error', error)

  return 'Unknown Error'
}
