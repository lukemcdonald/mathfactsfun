import type { Operation } from '#app/features/sessions/sessions.types'
import type { UserRole } from '#app/features/users/users.types'

export const getRoute = {
  auth: {
    login: () => '/login',
    logout: () => '/logout',
    signup: () => '/signup',
  },
  dashboard: {
    byRole: (role: UserRole) => `/dashboard/${role}`,
    root: () => '/dashboard',
  },
  home: () => '/',
  practice: {
    byOperation: (operation: Operation) => `/practice/${operation}`,
    root: () => '/practice',
  },
  resources: {
    groupMembers: {
      add: () => '/resources/group-members/add',
      remove: () => '/resources/group-members/remove',
    },
    groups: {
      remove: () => '/resources/groups/remove',
    },
  },
} as const
