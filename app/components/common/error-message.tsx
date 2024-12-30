import { cn } from '#app/utils/misc'

interface ErrorMessageProps {
  className?: string
  error?: string | string[] | null
}

export function ErrorMessage({ className, error }: ErrorMessageProps) {
  if (!error) {
    return null
  }

  const errors = Array.isArray(error) ? error : [error]

  return (
    <div className={cn('flex flex-col gap-1 text-sm', className)}>
      {errors.map((err, index) => (
        <p
          className="text-red-600"
          key={index}
        >
          {err}
        </p>
      ))}
    </div>
  )
}
