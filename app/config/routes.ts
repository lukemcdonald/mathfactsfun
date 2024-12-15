import { Operation } from '#app/features/sessions/sessions.types'
import { UserRole } from '#app/features/users/users.types'

export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    SIGNUP: '/signup',
  },
  DASHBOARD: {
    byRole: (role: UserRole) => `/dashboard/${role}`,
    ROOT: '/dashboard',
  },
  HOME: '/',
  PRACTICE: {
    byOperation: (operation: Operation) => `/practice/${operation}`,
    ROOT: '/practice',
  },
} as const

// Type-safe route generator
export const getRoute = {
  auth: {
    login: () => ROUTES.AUTH.LOGIN,
    logout: () => ROUTES.AUTH.LOGOUT,
    signup: () => ROUTES.AUTH.SIGNUP,
  },
  dashboard: {
    byRole: (role: UserRole) => ROUTES.DASHBOARD.byRole(role),
    root: () => ROUTES.DASHBOARD.ROOT,
  },
  home: () => ROUTES.HOME,
  practice: {
    byOperation: (operation: Operation) => ROUTES.PRACTICE.byOperation(operation),
    root: () => ROUTES.PRACTICE.ROOT,
  },
}
