import { ErrorMessage } from '#app/components/common/error-message'
import { cn } from '#app/utils/misc'

interface FormErrorsProps {
  className?: string
  errors?: string | string[] | null
}

export function FormErrors({ className, errors }: FormErrorsProps) {
  return (
    <ErrorMessage
      className={cn('rounded-md bg-red-50 p-4', className)}
      error={errors}
    />
  )
}
