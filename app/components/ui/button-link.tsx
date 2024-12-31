import { Link } from 'react-router'

import { buttonVariants } from '#app/components/ui/button'
import { cn } from '#app/utils/misc'

import type { AnchorHTMLAttributes, ReactNode } from 'react'

type ButtonLinkProps = {
  children: ReactNode
  href?: string
  to?: string
} & AnchorHTMLAttributes<HTMLAnchorElement>

export function ButtonLink({ children, className, href, to, ...delegated }: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant: 'ghost' }), className)

  if (to) {
    return (
      <Link
        className={classes}
        to={to}
        {...delegated}
      >
        {children}
      </Link>
    )
  }

  return (
    <a
      className={classes}
      href={href}
      {...delegated}
    >
      {children}
    </a>
  )
}
