import { vitePlugin as remix } from '@remix-run/dev'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { glob } from 'glob'
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from 'vite'
import { envOnlyMacros } from 'vite-env-only'

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true
  }
}

const MODE = process.env.NODE_ENV

export default defineConfig({
  build: {
    cssMinify: process.env.NODE_ENV === "production",
    sourcemap: true,
  },
  plugins: [
    envOnlyMacros(),
    remix({
      future: {
        unstable_optimizeDeps: true,
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_singleFetch: true,
        v3_throwAbortReason: true
      },
      ignoredRouteFiles: ['**/.*'],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: ["**/*.test.{js,jsx,ts,tsx}"],
        });
      },
      serverModuleFormat: 'esm',
    }),
    process.env.SENTRY_AUTH_TOKEN
      ? sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        // disable: MODE !== 'production',
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        sourcemaps: {
          filesToDeleteAfterUpload: await glob([
            './build/**/*.map',
            '.server-build/**/*.map',
          ]),
        },
        telemetry: false,
      })
      : null,
  ],
})
