import { getSelectProps } from '@conform-to/react'

import { FormField } from '#app/components/common/form-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#app/components/ui/select'

import type { FieldMetadata } from '@conform-to/react'

interface FormSelectFieldProps {
  className?: string
  field: FieldMetadata
  label: string
  options: Array<{ label: string; value: string }>
  placeholder?: string
}

export function FormSelectField({
  className,
  field,
  label,
  options,
  placeholder = 'Select an option',
  ...delegated
}: FormSelectFieldProps) {
  return (
    <FormField
      label={label}
      fieldId={field.id}
      errors={field.errors}
      className={className}
    >
      <Select
        {...getSelectProps(field, delegated)}
        defaultValue=""
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ label, value }) => (
            <SelectItem
              key={value}
              value={value}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}
