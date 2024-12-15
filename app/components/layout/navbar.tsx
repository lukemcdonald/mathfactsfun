import { Form, Link } from '@remix-run/react'
import { Calculator as CalculatorIcon } from 'lucide-react'

import { Button } from '#app/components/ui/button'
import { getRoute } from '#app/config/routes'
import { UserRole } from '#app/features/users'

type NavbarProps = {
  userRole?: UserRole
}

export function Navbar({ userRole }: NavbarProps) {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link
          className="flex items-center space-x-2"
          to={getRoute.home()}
        >
          <CalculatorIcon className="h-6 w-6" />
          <span className="font-bold">MathFacts.fun</span>
        </Link>

        <ul className="ml-auto flex items-center space-x-4">
          {userRole ?
            <>
              <li>
                <Link to={getRoute.dashboard.byRole(userRole)}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              </li>
              <li>
                <Form
                  action={getRoute.auth.logout()}
                  method="post"
                >
                  <Button type="submit">Logout</Button>
                </Form>
              </li>
            </>
          : <>
              <li>
                <Link to={getRoute.auth.login()}>
                  <Button variant="ghost">Login</Button>
                </Link>
              </li>
              <li>
                <Link to={getRoute.auth.signup()}>
                  <Button>Sign Up</Button>
                </Link>
              </li>
            </>
          }
        </ul>
      </div>
    </nav>
  )
}
