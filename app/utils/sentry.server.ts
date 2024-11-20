import * as Sentry from '@sentry/remix'

type ExtraContext = Record<string, unknown>

/**
 * Captures an exception in Sentry with optional context
 */
export function captureException(error: unknown, context?: ExtraContext) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
      tags: {
        source: 'server',
      },
    })
  }
}

/**
 * Captures a message in Sentry with optional context
 */
export function captureMessage(message: string, context?: ExtraContext) {
  Sentry.captureMessage(message, {
    extra: context,
    tags: {
      source: 'server',
    },
  })
}

/**
 * Sets the user context in Sentry
 */
export function setUser(id: string, data?: Record<string, unknown>) {
  Sentry.setUser({
    id,
    ...data,
  })
}
