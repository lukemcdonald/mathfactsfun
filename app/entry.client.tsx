import { RemixBrowser, useLocation, useMatches } from '@remix-run/react'
import { startTransition, StrictMode, useEffect } from 'react'
import { hydrateRoot } from 'react-dom/client'

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
  ],
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust this value in production as needed.
  tracesSampleRate: 1.0,
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  )
})
