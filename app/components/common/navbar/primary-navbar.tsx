import { Form } from 'react-router'

import { Branding } from '#app/components/common/branding'
import { Navbar } from '#app/components/common/navbar'
import { getRoute } from '#app/config/routes'

import type { UserRole } from '#app/features/users/users.types'

export function PrimaryNavbar({ userRole }: { userRole?: UserRole }) {
  return (
    <Navbar>
      <Branding className="max-lg:hidden" />
      <Navbar.Divider className="max-lg:hidden" />
      <Navbar.Section className="max-lg:hidden">
        <Navbar.Item to={getRoute.home()}>Home</Navbar.Item>
      </Navbar.Section>
      <Navbar.Spacer />
      <Navbar.Section>
        {userRole ?
          <>
            <Navbar.Item to={getRoute.dashboard.byRole(userRole)}>Dashboard</Navbar.Item>
            <Form
              action={getRoute.auth.logout()}
              method="post"
            >
              <Navbar.Item type="submit">Logout</Navbar.Item>
            </Form>
          </>
        : <>
            <Navbar.Item to={getRoute.auth.login()}>Login</Navbar.Item>
            <Navbar.Item to={getRoute.auth.signup()}>Sign Up</Navbar.Item>
          </>
        }
      </Navbar.Section>
    </Navbar>
  )
}
