import { redirect } from 'react-router'

import { getRoute } from '#app/config/routes'
import { logout } from '#app/features/auth/auth.server'

import type { Route } from './+types/logout'

export async function action({ request }: Route.ActionArgs) {
  return logout(request)
}

export async function loader() {
  return redirect(getRoute.home())
}
