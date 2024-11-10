import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'

import { LinksFunction, json } from '@remix-run/node'
import { Navbar } from '~/components/layout/navbar'

import styles from './assets/globals.css?url'
import { getUser } from '~/utils/auth.server'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

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
          name="viewport"
          content="width=device-width, initial-scale=1"
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
