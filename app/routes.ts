import { index, route, prefix } from '@react-router/dev/routes'

import { getRoute } from '#app/config/routes'

import type { RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route(getRoute.auth.login(), 'routes/login.tsx'),
  route(getRoute.auth.logout(), 'routes/logout.tsx'),
  route(getRoute.auth.signup(), 'routes/signup.tsx'),

  route(getRoute.dashboard.byRole('student'), 'routes/dashboard/student.tsx'),
  route(getRoute.dashboard.byRole('teacher'), 'routes/dashboard/teacher.tsx'),

  ...prefix(getRoute.practice.root(), [route(':operation', 'routes/practice/operation.tsx')]),
] satisfies RouteConfig
