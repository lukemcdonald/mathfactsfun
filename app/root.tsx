import { json, LinksFunction } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import { captureRemixErrorBoundaryError } from '@sentry/remix'

import { Navbar } from '~/components/layout/navbar'
import { getUser } from '~/utils/auth.server'
import { useNonce } from '~/utils/nonce-provider'

import styles from './assets/globals.css?url'

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }]

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)
  return json({ user })
}

function Document({
  children,
  env = {},
  nonce,
}: {
  children: React.ReactNode
  env?: Record<string, string>
  nonce: string
}) {
  const { user } = useLoaderData<typeof loader>() ?? {}
  const allowIndexing = ENV.ALLOW_INDEXING !== 'false'
  return (
    <html
      className={`h-full overflow-x-hidden`}
      lang="en"
    >
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta
          content="width=device-width, initial-scale=1"
          name="viewport"
        />
        {allowIndexing ? null : (
          <meta
            content="noindex, nofollow"
            name="robots"
          />
        )}
        <Links />
      </head>
      <body>
        <Navbar userRole={user?.role} />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
          nonce={nonce}
        />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  // if there was an error running the loader, data could be missing
  const data = useLoaderData<null | typeof loader>()
  const nonce = useNonce()
  return (
    <Document
      env={data?.ENV}
      nonce={nonce}
    >
      {children}
    </Document>
  )
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

export default function App() {
  return <Outlet />
}
