import { index, route, prefix } from '@react-router/dev/routes'

import { getRoute } from '#app/config/routes'

import type { RouteConfig } from '@react-router/dev/routes'

const { auth: AUTH, dashboard: DASHBOARD, practice: PRACTICE, resources: RESOURCES } = getRoute

export default [
  index('routes/home.tsx'),
  route(AUTH.login(), 'routes/login.tsx'),
  route(AUTH.logout(), 'routes/logout.tsx'),
  route(AUTH.signup(), 'routes/signup.tsx'),

  route(DASHBOARD.byRole('student'), 'routes/dashboard/student.tsx'),
  route(DASHBOARD.byRole('teacher'), 'routes/dashboard/teacher.tsx'),

  ...prefix(PRACTICE.root(), [route(':operation', 'routes/practice/operation.tsx')]),

  route(RESOURCES.groupMembers.add(), 'routes/resources/group-members/add.tsx'),
  route(RESOURCES.groupMembers.remove(), 'routes/resources/group-members/remove.tsx'),
] satisfies RouteConfig
