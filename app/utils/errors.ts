import { json } from '@remix-run/node'
import { ZodError } from 'zod'

import { IS_DEVELOPMENT } from '~/constants'
import { MonitoringContext } from '~/features/monitoring'

type ErrorResponse = {
  error: Record<string, string[]>
  submission?: unknown
}

/**
 * Custom error class for database-related errors.
 * Includes support for cause and context information.
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    public readonly context?: MonitoringContext
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

/**
 * Converts Zod field errors to our error response format,
 * ensuring all values are string arrays
 */
function normalizeZodErrors(fieldErrors: Record<string, string[] | undefined>): Record<string, string[]> {
  const normalized: Record<string, string[]> = {}

  for (const [key, value] of Object.entries(fieldErrors)) {
    normalized[key] = value || []
  }

  return normalized
}

/**
 * Handles errors in route actions and loaders.
 * Returns appropriate JSON responses with status codes.
 * Note: Global server-side error reporting is handled by Sentry's error boundary
 */
export function handleError(error: unknown, context?: MonitoringContext): Response {
  if (IS_DEVELOPMENT) {
    console.error('Error:', error, context)
  }

  const response: ErrorResponse = {
    error: { '': ['An unexpected error occurred. Please try again later.'] }
  }

  if (error instanceof DatabaseError) {
    response.error = { '': ['A database error occurred. Please try again later.'] }
    return json(response, { status: 500 })
  }

  if (error instanceof ZodError) {
    response.error = normalizeZodErrors(error.flatten().fieldErrors)
    return json(response, { status: 400 })
  }

  return json(response, { status: 500 })
}
