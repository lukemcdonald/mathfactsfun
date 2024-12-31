import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Form,
} from 'react-router'

import { Branding } from '#app/components/layout/branding'
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '#app/components/layout/navbar-alt'
import { StackedLayout } from '#app/components/layout/stacked-layout'
import { Toaster } from '#app/components/ui/toaster'
import { getRoute } from '#app/config/routes.js'
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
  const userRole = user?.role
  return (
    <>
      <StackedLayout
        // navbar={<Navbar userRole={user?.role} />}
        navbar={
          <Navbar>
            <Branding className="max-lg:hidden" />
            <NavbarDivider className="max-lg:hidden" />
            <NavbarSection className="max-lg:hidden">
              <NavbarItem to={getRoute.home()}>Home</NavbarItem>
            </NavbarSection>
            <NavbarSpacer />
            <NavbarSection>
              {userRole ?
                <>
                  <NavbarItem to={getRoute.dashboard.byRole(userRole)}>Dashboard</NavbarItem>
                  <Form
                    action={getRoute.auth.logout()}
                    method="post"
                  >
                    <NavbarItem type="submit">Logout</NavbarItem>
                  </Form>
                </>
              : <>
                  <NavbarItem to={getRoute.auth.login()}>Login</NavbarItem>
                  <NavbarItem to={getRoute.auth.signup()}>Sign Up</NavbarItem>
                </>
              }
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Navbar className="flex h-full min-h-0 flex-col">
            <Branding className="max-lg:hidden" />
            <div className="flex w-full flex-1 flex-col overflow-y-auto p-3">
              <div className="flex flex-col gap-0.5">
                <NavbarItem
                  className="justify-start"
                  to={getRoute.home()}
                >
                  Home
                </NavbarItem>
              </div>
            </div>
          </Navbar>
        }
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
