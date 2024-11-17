import { useLocation, useMatches } from '@remix-run/react'
import {
  browserProfilingIntegration,
  browserTracingIntegration,
  replayIntegration,
  init as sentryInit,
} from '@sentry/remix'
import { useEffect } from 'react'

export function init() {
  sentryInit({
    beforeSend(event) {
      if (event.request?.url) {
        const url = new URL(event.request.url)
        if (
          url.protocol === 'chrome-extension:' ||
          url.protocol === 'moz-extension:'
        ) {
          // This error is from a browser extension, ignore it
          return null
        }
      }
      return event
    },

    dsn: ENV.SENTRY_DSN,
    environment: ENV.MODE,
    integrations: [
      browserTracingIntegration({
        useEffect,
        useLocation,
        useMatches,
      }),
      replayIntegration(),
      browserProfilingIntegration(),
    ],

    replaysOnErrorSampleRate: 1.0,
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}
