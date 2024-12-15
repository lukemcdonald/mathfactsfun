import { useEffect } from 'react'

import { json, LinksFunction } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  useLocation,
  useMatches,
} from '@remix-run/react'
import { captureRemixErrorBoundaryError } from '@sentry/remix'

import { Navbar } from '#app/components/layout/navbar'
import { Toaster } from '#app/components/ui/toaster'
import { getUser } from '#app/features/auth/auth.api'
import { addBreadcrumb } from '#app/features/monitoring/monitoring.api'

import styles from './assets/globals.css?url'

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }]

export default function App() {
  const matches = useMatches()
  const location = useLocation()

  useEffect(() => {
    addBreadcrumb({
      category: 'navigation',
      data: {
        handle: matches.map((match) => match.handle),
        pathname: location.pathname,
        search: location.search,
      },
      level: 'info',
      message: 'Route changed',
    })
  }, [location.pathname, location.search, matches])

  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()
  captureRemixErrorBoundaryError(error)

  return (
    <html lang="en">
      <head>
        <title>Error!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <h1 className="mb-4 text-2xl font-bold text-red-600">Oops!</h1>
            <p className="text-gray-600">Something went wrong.</p>
            {import.meta.env.DEV && (
              <pre className="mt-4 max-w-lg overflow-auto rounded bg-gray-100 p-4 text-left text-sm">
                {error instanceof Error ? error.message : 'Unknown error'}
              </pre>
            )}
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>() ?? {}

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          content="width=device-width, initial-scale=1"
          name="viewport"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar userRole={user?.role} />
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)
  return json({ user })
}
