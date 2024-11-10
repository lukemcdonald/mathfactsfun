import { Link } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Calculator } from 'lucide-react'

import { SelectUser } from '~/db/schema'

type NavbarProps = {
  userRole?: SelectUser['role']
}

export function Navbar({ userRole }: NavbarProps) {
  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Link
          to="/"
          className="flex items-center space-x-2"
        >
          <Calculator className="h-6 w-6" />
          <span className="font-bold">MathFacts.fun</span>
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          {userRole ?
            <Link to={`/dashboard/${userRole}`}>
              <Button variant="ghost">Dashboard</Button>
            </Link>
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
