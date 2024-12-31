import { useEffect } from 'react'
import { Form, useActionData, useNavigation } from 'react-router'

import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { z } from 'zod'

import { FormErrors } from '#app/components/common/form-errors'
import { InputField } from '#app/components/common/input-field'
import { Button } from '#app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#app/components/ui/dialog'

interface AddStudentDialogProps {
  groupId: string
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  open: boolean
}

// Define the schema for adding a student
const addStudentSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
  studentEmail: z.string().email('Invalid email address'),
})

export function AddStudentDialog({
  groupId,
  onOpenChange,
  onSuccess,
  open,
}: AddStudentDialogProps) {
  const lastResult = useActionData()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  const [form, fields] = useForm({
    constraint: getZodConstraint(addStudentSchema),
    id: 'add-student-form',
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: addStudentSchema })
    },
    shouldRevalidate: 'onBlur',
  })

  useEffect(() => {
    if (navigation.state === 'idle' && lastResult?.message) {
      onSuccess?.()
    }
  }, [navigation.state, lastResult, onSuccess])

  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Student to Group</DialogTitle>
        </DialogHeader>

        <Form
          className="space-y-4"
          id={form.id}
          method="post"
          onSubmit={form.onSubmit}
        >
          <input
            type="hidden"
            name="action"
            value="addStudent"
          />
          <input
            type="hidden"
            name="groupId"
            value={groupId}
          />

          <InputField
            field={fields.studentEmail}
            label="Student Email"
            type="email"
            data-1p-ignore
          />

          <FormErrors errors={form.errors} />

          <DialogFooter>
            <Button
              isLoading={isSubmitting}
              loadingText="Adding student..."
              type="submit"
            >
              Add Student
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
