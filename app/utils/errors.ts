import { IS_DEVELOPMENT } from '#app/constants'

type ErrorWithMessage = {
  message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (typeof maybeError === 'string') {
    return new Error(maybeError)
  }

  if (isErrorWithMessage(maybeError)) {
    return maybeError
  }

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

export function getErrorMessage(error: unknown): string {
  const errorWithMessage = toErrorWithMessage(error)

  if (IS_DEVELOPMENT) {
    console.error('Original error:', error)
  }

  return errorWithMessage.message
}
