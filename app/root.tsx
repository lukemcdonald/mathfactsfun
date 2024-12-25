import { useEffect } from 'react'

import { LinksFunction } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useMatches,
} from '@remix-run/react'

import { GeneralErrorBoundary } from '#app/components/general-error-boundary'
import { Navbar } from '#app/components/layout/navbar'
import { Toaster } from '#app/components/ui/toaster'
import { getUser } from '#app/features/auth/auth.api.server'
import { addBreadcrumb } from '#app/features/monitoring/monitoring.api'

import styles from './assets/globals.css?url'

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }]

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)
  return { user }
}

export default function App() {
  const { user } = useLoaderData<typeof loader>()
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
        <Outlet />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

// This is a last resort error boundary. There's not much useful information we
// can offer at this level.
export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <title>Error!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <GeneralErrorBoundary />
        <Scripts />
      </body>
    </html>
  )
}
