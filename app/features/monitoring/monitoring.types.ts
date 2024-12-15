type BreadcrumbCategory = 'auth' | 'error' | 'navigation' | 'practice'
type BreadcrumbLevel = 'error' | 'info' | 'warning'

export type BreadcrumbOptions = {
  category: BreadcrumbCategory
  data?: Record<string, unknown>
  level: BreadcrumbLevel
  message: string
}

export type MessageOptions = {
  context?: MonitoringContext
  severity?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug'
  user?: MonitoringUser
}

export type ExceptionOptions = {
  context?: MonitoringContext
  user?: MonitoringUser
}

export type MonitoringContext = {
  [key: string]: unknown
}

/**
 * Matches Sentry's User interface
 * @see https://docs.sentry.io/platforms/javascript/enriching-events/identify-user/
 */
export type MonitoringUser = {
  id?: string
  email?: string
  username?: string
  ip_address?: string
  [key: string]: unknown
}
