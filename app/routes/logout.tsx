import { redirect } from 'react-router'

import { getRoute } from '#app/config/routes'
import { logout } from '#app/features/auth/auth.api.server'

export async function action({ request }: { request: Request }) {
  return logout(request)
}

export async function loader() {
  return redirect(getRoute.home())
}
