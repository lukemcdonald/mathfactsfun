import { Label } from '#app/components/ui/label'

import { ErrorMessage } from './error-message'

interface FormFieldProps {
  children: React.ReactNode
  className?: string
  errors?: string | string[] | null
  fieldId: string
  label: string
}

export function FormField({ children, className, errors, fieldId, label }: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={fieldId}>{label}</Label>
      {children}
      <ErrorMessage error={errors} />
    </div>
  )
}
