import { Button } from '#app/components/ui/button'
import { ButtonLink } from '#app/components/ui/button-link'
import { cn } from '#app/utils/misc'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export default function Navbar({ className, ...delegated }: ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav
      className={cn('flex flex-1 items-center gap-4 py-2.5', className)}
      {...delegated}
    />
  )
}

export function NavbarDivider({ className, ...delegated }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-hidden="true"
      className={cn('h-6 w-px bg-zinc-950/10', className)}
      {...delegated}
    />
  )
}

export function NavbarSection({ className, ...delegated }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('flex items-center gap-3', className)}
      {...delegated}
    />
  )
}

export function NavbarSpacer({ className, ...delegated }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-hidden="true"
      className={cn('-ml-4 flex-1', className)}
      {...delegated}
    />
  )
}

export function NavbarItem({
  children,
  ...delegated
}: { children: ReactNode } & (
  | ComponentPropsWithoutRef<typeof Button>
  | ComponentPropsWithoutRef<typeof ButtonLink>
)) {
  const classes = cn(
    'relative flex w-full min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base font-medium sm:text-sm',
  )

  if ('href' in delegated || 'to' in delegated) {
    return (
      <span className="relative">
        <ButtonLink
          className={classes}
          {...(delegated as ComponentPropsWithoutRef<typeof ButtonLink>)}
        >
          {children}
        </ButtonLink>
      </span>
    )
  }

  return (
    <span className="relative">
      <Button
        className={cn('cursor-default', classes)}
        variant="ghost"
        {...(delegated as ComponentPropsWithoutRef<typeof Button>)}
      >
        {children}
      </Button>
    </span>
  )
}

export function NavbarLabel({ className, ...delegated }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={cn('truncate', className)}
      {...delegated}
    />
  )
}

Navbar.Divider = NavbarDivider
Navbar.Item = NavbarItem
Navbar.Label = NavbarLabel
Navbar.Section = NavbarSection
Navbar.Spacer = NavbarSpacer
