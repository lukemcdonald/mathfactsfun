import { getInputProps } from '@conform-to/react'

import { FormField } from '#app/components/common/form-field'
import { Input } from '#app/components/ui/input'

import type { FieldMetadata } from '@conform-to/react'

type InputProps = Parameters<typeof getInputProps>[1]

interface InputFieldProps {
  autoComplete?: string
  className?: string
  field: FieldMetadata
  label: string
  type?: InputProps['type']
}

export function InputField({
  className,
  field,
  label,
  type = 'text',
  ...delegated
}: InputFieldProps) {
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
        })}
        {...delegated}
      />
    </FormField>
  )
}
