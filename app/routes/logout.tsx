import { redirect } from '@remix-run/node'

import { logout } from '~/features/auth/auth.api'

export async function loader() {
  return redirect('/')
}

export async function action({ request }: { request: Request }) {
  return logout(request)
}
