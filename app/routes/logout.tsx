import { redirect } from '@remix-run/node'

import { logout } from '#app/features/auth/auth.api'

export async function action({ request }: { request: Request }) {
  return logout(request)
}

export async function loader() {
  return redirect('/')
}
