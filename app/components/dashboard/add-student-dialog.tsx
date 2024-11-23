import { Form, useActionData, useNavigation } from '@remix-run/react'

import { Button } from '#app/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '#app/components/ui/dialog'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'

interface AddStudentDialogProps {
  groupId: string
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  open: boolean
}

export function AddStudentDialog({
  groupId,
  onOpenChange,
  onSuccess,
  open,
}: AddStudentDialogProps) {
  const navigation = useNavigation()
  const actionData = useActionData<{ error?: string; message?: string }>()
  const isSubmitting = navigation.state === 'submitting'

  // Handle successful submission
  if (actionData?.message && !isSubmitting && onSuccess) {
    onSuccess()
  }

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
          method="post"
        >
          <input
            name="action"
            type="hidden"
            value="addStudent"
          />
          <input
            name="groupId"
            type="hidden"
            value={groupId}
          />
          <div>
            <Label htmlFor="studentEmail">Student Email</Label>
            <Input
              id="studentEmail"
              name="studentEmail"
              placeholder="Enter student email"
              required
              type="email"
            />
            {actionData?.error && <p className="mt-1 text-sm text-red-600">{actionData.error}</p>}
          </div>
          <Button
            disabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText="Adding..."
            type="submit"
          >
            Add Student
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
