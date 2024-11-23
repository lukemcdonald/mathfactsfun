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

  dsn: 'https://006e2f63e7d84cbd8d313f40c2d532ca@o4504369029120000.ingest.us.sentry.io/4508314099777536',

  // To capture action formData attributes.
  sendDefaultPii: true,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // Consider adjusting this value in production
  tracesSampleRate: 1.0,
})
