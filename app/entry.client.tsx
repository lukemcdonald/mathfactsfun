import { startTransition, StrictMode, useEffect } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { RemixBrowser, useLocation, useMatches } from '@remix-run/react'
import * as Sentry from '@sentry/remix'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
    // Add session replay if you want to capture user interactions
    // new Sentry.Replay(),
  ],
  // Capture 100% of transactions in development, 10% in production
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,

  // Optional: Configure Session Replay
  // replaysSessionSampleRate: 0.1, // Sample 10% of sessions
  // replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  )
})
