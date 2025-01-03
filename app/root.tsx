import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

import { MobileNavbar, PrimaryNavbar } from '#app/components/common/navbar'
import { StackedLayout } from '#app/components/common/stacked-layout'
import { Toaster } from '#app/components/ui/toaster'
import { getUser } from '#app/features/auth/auth.server'

import stylesheet from './assets/globals.css?url'

import type { Route } from './+types/root'

export const links: Route.LinksFunction = () => [
  { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
  {
    crossOrigin: 'anonymous',
    href: 'https://fonts.gstatic.com',
    rel: 'preconnect',
  },
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    rel: 'stylesheet',
  },
  { href: stylesheet, rel: 'stylesheet' },
]

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request)

  // Serialize dates to ISO strings if they exist
  const serializedUser =
    user ?
      {
        ...user,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    : null

  return { user: serializedUser }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData

  return (
    <>
      <StackedLayout
        navbar={<PrimaryNavbar userRole={user?.role} />}
        sidebar={<MobileNavbar />}
      >
        <Outlet />
      </StackedLayout>
    </>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
