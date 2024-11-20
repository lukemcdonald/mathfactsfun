import * as Sentry from '@sentry/remix'

import { MonitoringContext, MonitoringUser } from '~/features/monitoring/monitoring.types'

/**
 * Captures an exception in Sentry with optional context
 */
export function captureException(error: unknown, context?: MonitoringContext) {
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
export function captureMessage(message: string, context?: MonitoringContext) {
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
export function setUser(id: string, data?: MonitoringUser) {
  Sentry.setUser({
    id,
    ...data,
  })
}
