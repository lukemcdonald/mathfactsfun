import { Form, Link } from '@remix-run/react'
import { Calculator } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { SelectUser } from '~/db/schemas/users'

type NavbarProps = {
  userRole?: SelectUser['role']
}

export function Navbar({ userRole }: NavbarProps) {
  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Link
          className="flex items-center space-x-2"
          to="/"
        >
          <Calculator className="h-6 w-6" />
          <span className="font-bold">MathFacts.fun</span>
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          {userRole ?
            <>
              <Link to={`/dashboard/${userRole}`}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Form
                action="/logout"
                method="post"
              >
                <Button type="submit">Logout</Button>
              </Form>
            </>
          : <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          }
        </div>
      </div>
    </nav>
  )
}
