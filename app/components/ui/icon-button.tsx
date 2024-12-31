import { cva } from 'class-variance-authority'

import { cn } from '#app/utils/misc'

import { Button, type ButtonProps } from './button'

import type { IconComponent } from '#app/components/icons'

const iconVariants = cva('', {
  defaultVariants: {
    size: 'default',
  },
  variants: {
    size: {
      default: 'h-4 w-4',
      icon: 'h-4 w-4',
      lg: 'h-5 w-5',
      sm: 'h-3.5 w-3.5',
    },
  },
})

interface IconButtonProps extends ButtonProps {
  icon: IconComponent
  label: string
}

export function IconButton({
  className,
  icon: Icon,
  label,
  size = 'default',
  ...delegated
}: IconButtonProps) {
  return (
    <Button
      title={label}
      variant="ghost"
      {...delegated}
      size={size}
      className={cn(
        'inline-flex items-center justify-center',
        {
          'h-9 w-9 p-0': size === 'sm',
          'h-10 w-10 p-0': size === 'default',
          'h-11 w-11 p-0': size === 'lg',
        },
        className,
      )}
    >
      <Icon
        className={iconVariants({ size })}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </Button>
  )
}
