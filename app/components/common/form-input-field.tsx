import { getInputProps } from '@conform-to/react'

import { Input } from '#app/components/ui/input'

import { FormField } from './form-field'

import type { FieldMetadata } from '@conform-to/react'

interface FormInputFieldProps {
  autoComplete?: string
  className?: string
  field: FieldMetadata
  label: string
  type?: Parameters<typeof getInputProps>[1]['type']
}

export function FormInputField({
  className,
  field,
  label,
  type = 'text',
  ...delegated
}: FormInputFieldProps) {
  return (
    <FormField
      label={label}
      fieldId={field.id}
      errors={field.errors}
      className={className}
    >
      <Input
        {...getInputProps(field, {
          ariaAttributes: false,
          type,
          ...delegated,
        })}
      />
    </FormField>
  )
}
