import { Form, useActionData, useNavigation } from 'react-router'

import { Button } from '#app/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '#app/components/ui/dialog'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'

interface CreateGroupDialogProps {
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  open: boolean
}

export function CreateGroupDialog({ onOpenChange, onSuccess, open }: CreateGroupDialogProps) {
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
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <Form
          className="space-y-4"
          method="post"
        >
          <input
            name="action"
            type="hidden"
            value="createGroup"
          />
          <div>
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              name="groupName"
              placeholder="Enter group name"
              required
            />
            {actionData?.error && <p className="mt-1 text-sm text-red-600">{actionData.error}</p>}
          </div>
          <Button
            disabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText="Creating..."
            type="submit"
          >
            Create Group
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
