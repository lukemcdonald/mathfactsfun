import { redirect } from '@remix-run/node'

import { logout } from '~/utils/auth.server'

export async function loader() {
  return redirect('/')
}

export async function action({ request }: { request: Request }) {
  return logout(request)
}
