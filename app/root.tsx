import { json, LinksFunction } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'

import { Navbar } from '~/components/layout/navbar'
import { getUser } from '~/utils/auth.server'

import styles from './assets/globals.css?url'

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }]

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request)
  return json({ user })
}
export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>()
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
