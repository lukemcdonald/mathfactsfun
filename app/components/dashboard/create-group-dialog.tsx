import { Form } from '@remix-run/react'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface CreateGroupDialogProps {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function CreateGroupDialog({
  onOpenChange,
  open,
}: CreateGroupDialogProps) {
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
          <div>
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              name="groupName"
              placeholder="Enter group name"
              required
            />
          </div>
          <Button type="submit">Create Group</Button>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
