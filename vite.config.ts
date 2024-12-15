import { vitePlugin as remix } from '@remix-run/dev'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true
  }
}

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      rollupOptions: {
        external: [/node:.*/, 'fsevents'],
      },
      sourcemap: mode === 'development',
    },
    plugins: [
      remix({
        future: {
          unstable_optimizeDeps: true,
          v3_fetcherPersist: true,
          v3_lazyRouteDiscovery: true,
          v3_relativeSplatPath: true,
          v3_singleFetch: true,
          v3_throwAbortReason: true,
        },
        ignoredRouteFiles: ['**/.*'],
        serverModuleFormat: 'esm',
      }),
      tsconfigPaths(),
      sentryVitePlugin({
        authToken: env.SENTRY_AUTH_TOKEN,
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        telemetry: false,
      }),
    ],
    resolve: {
      alias: {
        '#app': '/app',
      },
    },
  }
})
