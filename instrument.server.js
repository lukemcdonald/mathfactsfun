import * as Sentry from '@sentry/remix'

Sentry.init({
  // To use Sentry OpenTelemetry auto-instrumentation
  autoInstrumentRemix: true,

  // Optionally capture action formData attributes with errors.
  // This requires `sendDefaultPii` set to true as well.
  captureActionFormDataKeys: {
    key_x: true,
    key_y: true,
  },

  dsn: process.env.SENTRY_DSN,

  // To capture action formData attributes.
  sendDefaultPii: true,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // Consider adjusting this value in production
  tracesSampleRate: 1.0,
})
