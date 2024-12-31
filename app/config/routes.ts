import type { Operation } from '#app/features/sessions/sessions.types'
import type { UserRole } from '#app/features/users/users.types'

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
  RESOURCES: {
    GROUP_MEMBERS: {
      ADD: '/resources/group-members/add',
      REMOVE: '/resources/group-members/remove',
    },
    GROUPS: {
      REMOVE: '/resources/groups/remove',
    },
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
  resources: {
    groupMembers: {
      add: () => ROUTES.RESOURCES.GROUP_MEMBERS.ADD,
      remove: () => ROUTES.RESOURCES.GROUP_MEMBERS.REMOVE,
    },
    groups: {
      remove: () => ROUTES.RESOURCES.GROUPS.REMOVE,
    },
  },
}
