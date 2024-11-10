import { redirect } from '@remix-run/node'

import { logout } from '~/services/auth.server'

export async function loader() {
  return redirect('/')
}

export async function action({ request }: { request: Request }) {
  return logout(request)
}
