import * as Sentry from '@sentry/remix'

import {
  BreadcrumbOptions,
  ExceptionOptions,
  MessageOptions,
  MonitoringUser,
} from '#app/features/monitoring/monitoring.types'

/**
 * Captures an exception in Sentry with optional context
 */
export function captureException(error: unknown, options: ExceptionOptions = {}) {
  const { context, user } = options

  if (context) {
    Sentry.setContext('Error Context', context)
  }

  if (user) {
    Sentry.setUser(user)
  }

  Sentry.captureException(error)
}

/**
 * Captures a message in Sentry. Use this for important application events
 * that aren't errors but that you want to track.
 *
 * Good use cases:
 * - Important business events ("Premium subscription purchased")
 * - Security events ("Failed login attempt from suspicious IP")
 * - Performance warnings ("Database query took >5s")
 * - Feature usage ("User exported 1000+ records")
 *
 * Don't use for:
 * - Regular application flow (use breadcrumbs instead)
 * - Debug logging (use console.debug/info instead)
 * - Actual errors (use captureException instead)
 *
 * @example
 * ```ts
 * captureMessage('Large export requested', {
 *   context: { records: 1500, format: 'csv' },
 *   user
 * })
 * ```
 */
export function captureMessage(message: string, options: MessageOptions = {}) {
  const { context, severity = 'info', user } = options

  if (context) {
    Sentry.setContext('Message Context', context)
  }

  if (user) {
    Sentry.setUser(user)
  }

  Sentry.captureMessage(message, severity)
}

/**
 * Sets the user context in Sentry
 */
export function setUser(id: string, data?: MonitoringUser) {
  Sentry.setUser({ id, ...data })
}

/**
 * Adds a breadcrumb to the current scope
 *
 * @example
 * ```ts
 * addBreadcrumb({
 *   message: 'User logged in',
 *   category: 'auth',
 *   level: 'info',
 *   data: { userId: '123' }
 * })
 * ```
 */
export function addBreadcrumb({ category, data, level, message }: BreadcrumbOptions) {
  Sentry.addBreadcrumb({
    category,
    data,
    level,
    message,
    timestamp: Date.now() / 1000, // Sentry expects seconds
  })
}
