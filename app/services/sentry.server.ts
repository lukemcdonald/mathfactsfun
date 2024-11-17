import * as Sentry from '@sentry/remix'

type ExtraContext = Record<string, unknown>

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

export function captureMessage(message: string, context?: ExtraContext) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, {
      extra: context,
      tags: {
        source: 'server',
      },
    })
  }
}

export function setUser(id: string, data?: Record<string, unknown>) {
  if (process.env.SENTRY_DSN) {
    Sentry.setUser({
      id,
      ...data,
    })
  }
}
