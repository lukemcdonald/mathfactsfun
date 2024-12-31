import { Link } from 'react-router'

import { Icons } from '#app/components/icons'
import { getRoute } from '#app/config/routes'
import { cn } from '#app/utils/misc'

export function Branding({ className }: { className: string }) {
  return (
    <Link
      className={cn('flex items-center space-x-2', className)}
      to={getRoute.home()}
    >
      <Icons.Calculator className="h-6 w-6" />
      <span className="font-bold">MathFacts.Fun</span>
    </Link>
  )
}
